import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolve } from "path";

config({ path: ".env" });

// Parse the DATABASE_URL
const url = new URL(process.env.DATABASE_URL!);

export default defineConfig({
  schema: resolve(__dirname, "./src/db/schema/*.ts"),
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
