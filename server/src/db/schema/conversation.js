"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRelations = exports.messages = exports.conversationParticipantsRelations = exports.conversationParticipants = exports.conversationsRelations = exports.conversations = exports.messageStatusEnum = void 0;
// conversationSchema.ts
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("./auth");
// Define message status enum
exports.messageStatusEnum = (0, pg_core_1.pgEnum)("message_status", [
    "sent", // Message has been sent to server
    "delivered", // Message has been delivered to recipient's device
    "read", // Message has been seen by recipient
    "failed", // Message failed to send
]);
// Conversations table with deterministic IDs
exports.conversations = (0, pg_core_1.pgTable)("conversations", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 100 }),
    isGroup: (0, pg_core_1.boolean)("is_group").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    lastMessageAt: (0, pg_core_1.timestamp)("last_message_at"),
    // Whether this conversation exists only as a draft (no messages yet)
    isDraft: (0, pg_core_1.boolean)("is_draft").default(true).notNull(),
});
// Define relations for conversations
exports.conversationsRelations = (0, drizzle_orm_1.relations)(exports.conversations, ({ many }) => ({
    participants: many(exports.conversationParticipants),
    messages: many(exports.messages),
}));
// Conversation participants table
exports.conversationParticipants = (0, pg_core_1.pgTable)("conversation_participants", {
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => auth_1.users.id, { onDelete: "cascade" }),
    conversationId: (0, pg_core_1.text)("conversation_id")
        .notNull()
        .references(() => exports.conversations.id, { onDelete: "cascade" }),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
    leftAt: (0, pg_core_1.timestamp)("left_at"),
    hasSeenLatestMessage: (0, pg_core_1.boolean)("has_seen_latest_message")
        .default(false)
        .notNull(),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.conversationId] }),
}));
// Define relations for conversationParticipants
exports.conversationParticipantsRelations = (0, drizzle_orm_1.relations)(exports.conversationParticipants, ({ one }) => ({
    user: one(auth_1.users, {
        fields: [exports.conversationParticipants.userId],
        references: [auth_1.users.id],
    }),
    conversation: one(exports.conversations, {
        fields: [exports.conversationParticipants.conversationId],
        references: [exports.conversations.id],
    }),
}));
// Messages table
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    content: (0, pg_core_1.text)("content").notNull(),
    senderId: (0, pg_core_1.text)("sender_id")
        .notNull()
        .references(() => auth_1.users.id, { onDelete: "cascade" }),
    conversationId: (0, pg_core_1.text)("conversation_id")
        .notNull()
        .references(() => exports.conversations.id, { onDelete: "cascade" }),
    status: (0, exports.messageStatusEnum)("status").default("sent").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    isEdited: (0, pg_core_1.boolean)("is_edited").default(false).notNull(),
    isDeleted: (0, pg_core_1.boolean)("is_deleted").default(false).notNull(),
});
// Define relations for messages
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one }) => ({
    sender: one(auth_1.users, {
        fields: [exports.messages.senderId],
        references: [auth_1.users.id],
        relationName: "sender",
    }),
    conversation: one(exports.conversations, {
        fields: [exports.messages.conversationId],
        references: [exports.conversations.id],
    }),
}));
