import { drizzle } from "drizzle-orm/postgres-core";
import { migrate } from "drizzle-orm/postgres-core/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(connectionString, { max: 1 });
export const db = drizzle(sql);

// Optional: Migration function
export async function runMigrations() {
  await migrate(db, { migrationsFolder: "drizzle" });
}
