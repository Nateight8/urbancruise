import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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

// Subscription Plan Enum
export const subscriptionPlanEnum = pgEnum("user_subscription_plan", [
  "FREE",
  "PREMIUM",
  "ENTERPRISE",
]);

// Subscriptions table
export const subscriptions = pgTable("subscription", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  plan: subscriptionPlanEnum("plan").default("FREE"),
  customerId: text("customer_id").unique(),
});

// Integration Types Enum
export const integrationsEnum = pgEnum("integration_types", [
  "INSTAGRAM",
  "TWITTER",
  "FACEBOOK",
]);

// Integrations table
export const integrations = pgTable("integrations", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: integrationsEnum("name").default("INSTAGRAM"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  instagramId: text("instagram_id").unique(),
});

// Automations table
export const automations = pgTable("automation", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text("name").default("Untitled"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  active: boolean("active").default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// DMs table
export const dms = pgTable("dms", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  automationId: uuid("automation_id")
    .notNull()
    .references(() => automations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiver: uuid("receiver")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message"),
});

// Media Types Enum
export const mediaTypeEnum = pgEnum("media_type", [
  "IMAGE",
  "CAROUSEL_ALBUM",
  "TEXT",
]);

// Posts table
export const posts = pgTable("post", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  postid: text("post_id").notNull().unique(),
  caption: text("caption"),
  media: text("media").notNull(),
  mediaType: mediaTypeEnum("media_type").default("IMAGE"),
  automationId: uuid("automation_id")
    .notNull()
    .references(() => automations.id, { onDelete: "cascade" }),
});

// Listeners Enum
export const listenersEnum = pgEnum("listeners", ["SMARTAI", "MESSAGE"]);

// Listeners table
export const listeners = pgTable(
  "listener",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    automationId: uuid("automation_id")
      .notNull()
      .references(() => automations.id, { onDelete: "cascade" }),
    listener: listenersEnum("listener").default("MESSAGE"),
    prompt: text("prompt").notNull(),
    commentReply: text("comment_reply"),
    dmCount: integer("dm_count").default(0),
    commentCount: integer("comment_count").default(0),
  },
  (table) => ({
    uniqueListener: uniqueIndex("unique_listener").on(
      table.automationId,
      table.listener
    ),
  })
);

// Triggers Enum
export const triggersEnum = pgEnum("trigger_types", [
  "DM",
  "COMMENT",
  // LIKE
  // FOLLOW
]);

export const triggers = pgTable(
  "trigger",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: triggersEnum("type").notNull(),
    automationId: uuid("automation_id")
      .notNull()
      .references(() => automations.id, { onDelete: "cascade" }),
  },
  (table) => ({
    automationIdUnique: uniqueIndex("automation_id_unique").on(
      table.automationId,
      table.type
    ),
  })
);

// Keywords table
export const keywords = pgTable(
  "keyword",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    word: text("word").notNull(),
    automationId: uuid("automation_id")
      .notNull()
      .references(() => automations.id, { onDelete: "cascade" }),
  },
  (table) => ({
    automationKeywordUnique: uniqueIndex("automation_keyword_unique").on(
      table.automationId,
      table.word
    ),
  })
);

// Status Enum
export const statusEnum = pgEnum("status", [
  "open",
  "accepted",
  "declined",
  "deal",
  "sold",
]);

export type User = typeof users.$inferSelect;
export type Integrations = typeof integrations.$inferSelect;
export type Subscriptions = typeof subscriptions.$inferSelect;

export type UserIntegrationSubscription = {
  users: User;
  integrations: Integrations | null;
  subscriptions: Subscriptions | null;
};
