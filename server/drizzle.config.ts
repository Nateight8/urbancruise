import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
<<<<<<< HEAD
import { resolve } from "path";

config({ path: ".env" });
=======
>>>>>>> origin/main

config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
