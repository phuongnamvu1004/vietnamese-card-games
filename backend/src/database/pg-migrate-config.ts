import { config } from "dotenv";

config({ path: ".env.local" });

module.exports = {
  migrationFolder: 'database/migrations', // Path to migrations folder
  databaseUrl: process.env.DATABASE_URL, // Database connection URI
  dbClient: 'pg', // Database client
  migrationsTable: 'migrations', // Table to track migrations
};
