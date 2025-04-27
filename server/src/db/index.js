"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" }); // or .env.local
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
exports.db = (0, neon_http_1.drizzle)({ client: sql });
