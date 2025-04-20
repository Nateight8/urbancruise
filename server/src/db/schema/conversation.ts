// conversationSchema.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createHash } from "crypto";
import { users } from "./auth";

// Conversations table with deterministic IDs
export const conversations = pgTable("conversations", {
  // Unique conversation ID that will be used in the URL
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 100 }),
  isGroup: boolean("is_group").default(false).notNull(),
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
    conversationId: varchar("conversation_id", { length: 64 })
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    hasSeenLatestMessage: boolean("has_seen_latest_message")
      .default(false)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.conversationId] }),
    };
  }
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
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: varchar("conversation_id", { length: 64 })
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
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

// Utility function to generate deterministic conversation IDs
export function generateConversationId(participantIds: number[]): string {
  // Sort IDs to ensure the same conversation ID regardless of order
  const sortedIds = [...participantIds].sort((a, b) => a - b);

  // For groups (more than 2 participants), we include all IDs
  const idString = sortedIds.join("_");

  // Create a hash of the ID string for a fixed-length ID
  const hash = createHash("sha256").update(idString).digest("hex");

  // Return a prefix to indicate if it's a direct message or group
  const prefix = participantIds.length === 2 ? "dm" : "group";
  return `${prefix}_${hash.substring(0, 20)}`;
}
