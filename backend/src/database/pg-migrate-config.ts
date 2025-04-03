import { config } from "dotenv";

config({ path: ".env.local" });

module.exports = {
  migrationFolder: 'database/migrations', // Path to migrations folder
  databaseUrl: `${process.env.SUPABASE_URL}?apikey=${process.env.SUPABASE_ANON_KEY}`, 
};
