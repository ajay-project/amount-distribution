/**
 * Role and permission helper utilities
 */

/**
 * Checks if a user has the admin role.
 * @param {object} profile - The user profile object
 * @returns {boolean}
 */
export const isAdmin = (profile) => {
  return profile?.role === "admin";
};

/**
 * Checks if a user is approved.
 * @param {object} profile - The user profile object
 * @returns {boolean}
 */
export const isApproved = (profile) => {
  return profile?.approved === true;
};
