// import { drizzle } from "drizzle-orm/neon-http";
// import postgres from "postgres";

// const connectionString = process.env.DATABASE_URL!;
// const client = postgres(connectionString, { max: 1 });
// export const db = drizzle(client);
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
