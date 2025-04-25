"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticators = exports.verificationTokens = exports.verificationNumberSessions = exports.sessions = exports.accounts = exports.users = exports.db = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// import type { AdapterAccount } from "@auth/core/adapters";
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const connectionString = process.env.DATABASE_URL;
const pool = (0, postgres_1.default)(connectionString, { max: 1 });
exports.db = (0, postgres_js_1.drizzle)(pool);
exports.users = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name"),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    emailVerified: (0, pg_core_1.timestamp)("emailVerified", { mode: "date" }),
    image: (0, pg_core_1.text)("image"),
    location: (0, pg_core_1.text)("location"),
    address: (0, pg_core_1.text)("address"),
    phoneVerified: (0, pg_core_1.boolean)("phoneVerified"),
    onboardingCompleted: (0, pg_core_1.boolean)("onboardingCompleted"),
    banner: (0, pg_core_1.text)("banner"),
    username: (0, pg_core_1.text)("username"),
    avatar: (0, pg_core_1.text)("avatar"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    participantId: (0, pg_core_1.varchar)("participant_id", { length: 64 }),
});
exports.accounts = (0, pg_core_1.pgTable)("account", {
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    type: (0, pg_core_1.text)("type").$type().notNull(),
    provider: (0, pg_core_1.text)("provider").notNull(),
    providerAccountId: (0, pg_core_1.text)("providerAccountId").notNull(),
    refresh_token: (0, pg_core_1.text)("refresh_token"),
    access_token: (0, pg_core_1.text)("access_token"),
    expires_at: (0, pg_core_1.integer)("expires_at"),
    token_type: (0, pg_core_1.text)("token_type"),
    scope: (0, pg_core_1.text)("scope"),
    id_token: (0, pg_core_1.text)("id_token"),
    session_state: (0, pg_core_1.text)("session_state"),
}, (account) => ({
    compoundKey: (0, pg_core_1.primaryKey)({
        columns: [account.provider, account.providerAccountId],
    }),
}));
exports.sessions = (0, pg_core_1.pgTable)("session", {
    sessionToken: (0, pg_core_1.text)("sessionToken").notNull().primaryKey(),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    expires: (0, pg_core_1.timestamp)("expires", { mode: "date" }).notNull(),
});
exports.verificationNumberSessions = (0, pg_core_1.pgTable)("verificationNumberSessions", {
    verificationNumber: (0, pg_core_1.text)("verificationNumber").notNull(),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.createdAt] }),
    };
});
exports.verificationTokens = (0, pg_core_1.pgTable)("verificationToken", {
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    token: (0, pg_core_1.text)("token").notNull(),
    expires: (0, pg_core_1.timestamp)("expires", { mode: "date" }).notNull(),
}, (vt) => ({
    compoundKey: (0, pg_core_1.primaryKey)({ columns: [vt.identifier, vt.token] }),
}));
exports.authenticators = (0, pg_core_1.pgTable)("authenticator", {
    credentialID: (0, pg_core_1.text)("credentialID").notNull().unique(),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    providerAccountId: (0, pg_core_1.text)("providerAccountId").notNull(),
    credentialPublicKey: (0, pg_core_1.text)("credentialPublicKey").notNull(),
    counter: (0, pg_core_1.integer)("counter").notNull(),
    credentialDeviceType: (0, pg_core_1.text)("credentialDeviceType").notNull(),
    credentialBackedUp: (0, pg_core_1.boolean)("credentialBackedUp").notNull(),
    transports: (0, pg_core_1.text)("transports"),
}, (authenticator) => ({
    compoundKey: (0, pg_core_1.primaryKey)({
        columns: [authenticator.userId, authenticator.credentialID],
    }),
}));
