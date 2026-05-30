import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jbqdqlmjaxoutuetzgmn.supabase.co";
const supabaseAnonKey = "sb_publishable_e1z3nySc44nQtQaOxSVbAA_LN7dt12h";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching platform_settings...");
  const { data: settings, error: settingsError } = await supabase
    .from("platform_settings")
    .select("*");
  console.log("Settings:", settings, "Error:", settingsError);

  console.log("Fetching users count...");
  const { count, error: countError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  console.log("Count:", count, "Error:", countError);
}

run();
