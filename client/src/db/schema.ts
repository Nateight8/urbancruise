import { genId } from "@/lib/utils";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL!;
const pool = postgres(connectionString, { max: 1 });
export const db = drizzle(pool);

export const users = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  location: text("location"),
  adress: text("adress"),
  phoneVerified: boolean("phoneVerified").default(false),
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  shopname: text("shopname"),
  shoptextfont: text("shoptextfont"),
  shoptextcolor: text("shoptextcolor"),
  banner: text("banner"),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: uuid("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationNumberSessions = pgTable(
  "verificationNumberSessions",
  {
    verificationNumber: text("verificationNumber").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.createdAt] }),
    };
  }
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const Authenticator = pgTable(
  "authenticator",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => genId("ath"))
      .unique(),
    credentialID: text("credentialId").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    userIdIdx: uniqueIndex("Authenticator_credentialID_key").on(
      authenticator.credentialID
    ),
  })
);

/*
Der Käufer klickt den 'Kaufen'-Button, es wird ein Eintrag gemacht und der Verkäufer erhält in seinem Posteingang eine Nachricht dafür...
Es gibt eine Seite für Konversation, auf button click eröffnet man eine Konversation die hat erstmal diese Felder: Käufer, Verkäufer, Produkt, Status
*/

export type UserType = typeof users.$inferSelect;
