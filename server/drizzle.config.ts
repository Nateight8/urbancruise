import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config();

// Parse the DATABASE_URL
const url = new URL(process.env.DATABASE_URL!);

export default defineConfig({
  schema: resolve(__dirname, "./src/db/schema/*.ts"),
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port || "5432"),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    ssl: false,
  },
});
