// conversationSchema.ts
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex,
  boolean,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createHash } from "crypto";
import { users } from "./auth.js";

// Define message status enum
export const messageStatusEnum = pgEnum("message_status", [
  "sent", // Message has been sent to server
  "delivered", // Message has been delivered to recipient's device
  "read", // Message has been seen by recipient
  "failed", // Message failed to send
]);

// Conversations table with deterministic IDs
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 100 }),
  isGroup: boolean("is_group").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at"),
  // Whether this conversation exists only as a draft (no messages yet)
  isDraft: boolean("is_draft").default(true).notNull(),
});

// Define relations for conversations
export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));

// Conversation participants table
export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    hasSeenLatestMessage: boolean("has_seen_latest_message")
      .default(false)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.conversationId] }),
  })
);

// Define relations for conversationParticipants
export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
  })
);

// Messages table
export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  status: messageStatusEnum("status").default("sent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isEdited: boolean("is_edited").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// Define relations for messages
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
