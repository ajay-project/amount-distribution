import { supabase } from "../lib/supabase";

/**
 * Authentication and User Management Services
 */

/**
 * Signs up a new user in Supabase Auth.
 * The public.users profile row is created automatically by a database trigger.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 */
export const signUpUser = async (email, password, name) => {
  // 1. Check signup status via RPC function
  try {
    const { data: statusData, error: statusError } = await supabase.rpc(
      "check_signup_status",
      { p_email: email }
    );
    
    if (statusError) {
      console.error("RPC check_signup_status failed:", statusError);
    } else if (statusData && statusData.length > 0) {
      const { user_exists, is_approved } = statusData[0];
      if (user_exists) {
        if (is_approved) {
          throw new Error("This email is already registered. Please login.");
        } else {
          throw new Error("You have already registered. Please wait for admin approval.");
        }
      }
    }
  } catch (rpcErr) {
    // If it's one of our custom error messages, rethrow it.
    if (rpcErr.message && (
      rpcErr.message.includes("already registered") || 
      rpcErr.message.includes("wait for admin approval")
    )) {
      throw rpcErr;
    }
    // Otherwise, log other database errors and proceed gracefully to standard auth.signUp
    console.error("Gracefully proceeding to signup despite RPC check error:", rpcErr);
  }

  // 2. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Signup failed. User not created.");

  // NOTE: The public.users profile row is created automatically by a
  // Supabase database trigger. No manual insert/upsert is needed here.

  return authData;
};

/**
 * Signs in a user and updates their last login timestamp.
 * @param {string} email 
 * @param {string} password 
 */
export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last login in public profile
  if (data.user) {
    await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);
  }

  return data;
};

/**
 * Combined authentication and profile fetch logic.
 */
export async function loginUser(email, password) {
  try {
    // STEP 1 — LOGIN
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const user = data?.user;
    if (!user) {
      throw new Error("User not found");
    }

    // Update last login in public profile
    try {
      await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    } catch (updateError) {
      console.error("Error updating last login timestamp:", updateError);
    }

    // STEP 2 — FETCH PROFILE IMMEDIATELY
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    // STEP 3 — RETURN COMBINED RESULT
    return {
      user,
      profile,
      session: data.session,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Logs out the current user.
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Fetches the public profile of a user.
 * @param {string} userId 
 */
export const fetchUserProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

/**
 * Admin: Lists all users in the system.
 */
export const listAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Admin: Approves a user.
 * @param {string} userId 
 */
export const approveUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      approved: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Admin: Revokes or rejects access for a user.
 * @param {string} userId 
 */
export const rejectUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      approved: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Admin: Deletes a user profile from the database.
 * @param {string} userId 
 */
export const deleteUserProfile = async (userId) => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) throw error;
  return true;
};
