<<<<<<< HEAD
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema/index.js";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
=======
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client);
>>>>>>> origin/main
