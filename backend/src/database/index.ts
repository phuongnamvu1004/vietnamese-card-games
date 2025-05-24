import { createClient } from "@supabase/supabase-js";
import { log } from "../lib/utils.js";

import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase configuration in environment variables.");
}

// Extracted constant for table name
const USERS_TABLE = "users";
const QUERY_LIMIT = 1;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to test database connection
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.from(USERS_TABLE).select("*").limit(QUERY_LIMIT);

    if (error) {
      log("Supabase query error:", error.message, "error");
      return;
    }

    log("Supabase connection test data:", data, "info");
  } catch (err) {
    log("Unexpected error during Supabase connection test:", err, "error");
  }
};