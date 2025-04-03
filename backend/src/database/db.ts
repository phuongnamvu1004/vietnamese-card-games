import { createClient } from '@supabase/supabase-js';
import { log }  from "../lib/utils.js";

import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  try {
    // Example query to test the connection
    const { data, error } = await supabase.from('test_table').select('*').limit(1);

    if (error) {
      throw error;
    }

    log("Supabase connected successfully", "info");
  } catch (error) {
    log("Supabase connection error:", error, "error");
  }
};
