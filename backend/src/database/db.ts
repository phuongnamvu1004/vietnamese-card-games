import { createClient } from '@supabase/supabase-js';
import { log } from "../lib/utils.js";

import { config } from "dotenv";

config({path: ".env.local"});

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  try {
    // Example query to test the connection
    const {data, error} = await supabase.from('users').select('*').limit(1);

    log("Supabase connection test data:", data, "info");

    log("Supabase connected successfully", "info");
  } catch (error) {
    log("Supabase connection error:", error, "error");
  }
};
