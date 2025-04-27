"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantsResolvers = void 0;
const conversation_1 = require("@/db/schema/conversation");
const graphql_1 = require("graphql");
const drizzle_orm_1 = require("drizzle-orm");
// Helper function to convert database status to GraphQL enum format
function mapStatusToEnum(status) {
    return status.toUpperCase();
}
exports.participantsResolvers = {
    Query: {
        conversationParticipants: async (_, __, context) => {
            const { db, session } = context;
            const user = session?.user;
            if (!user?.id) {
                throw new graphql_1.GraphQLError("Unauthorized", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }
            // First, find all conversations the current user is in
            const userConversations = await db.query.conversationParticipants.findMany({
                where: (0, drizzle_orm_1.eq)(conversation_1.conversationParticipants.userId, user.id),
                with: {
                    conversation: {
                        with: {
                            messages: {
                                orderBy: (messages) => [(0, drizzle_orm_1.desc)(messages.createdAt)],
                                limit: 1,
                            },
                            participants: {
                                where: (0, drizzle_orm_1.ne)(conversation_1.conversationParticipants.userId, user.id),
                                with: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
            // Format the response
            const formattedConversations = userConversations
                .filter((convo) => convo && convo.conversation && convo.conversationId)
                .map((convo) => {
                const lastMessage = convo.conversation.messages[0] || null;
                // Convert database status to GraphQL enum format (uppercase)
                let lastMessageStatus = null;
                if (lastMessage?.status) {
                    lastMessageStatus = mapStatusToEnum(lastMessage.status);
                }
                return {
                    user: convo.conversation.participants[0]?.user,
                    lastMessage,
                    lastMessageAt: convo.conversation.lastMessageAt,
                    conversationId: convo.conversationId,
                    hasSeenLatestMessage: !!convo.hasSeenLatestMessage,
                    lastMessageStatus,
                };
            });
            // Ensure we always return an array, even if empty
            return formattedConversations || [];
        },
    },
    Mutation: {},
    Subscription: {
        conversationParticipantsUpdated: {
            subscribe: function (_, __, context) {
                if (!context || !context.pubsub) {
                    throw new Error("PubSub not available");
                }
                return context.pubsub.asyncIterableIterator([
                    "CONVERSATION_PARTICIPANT_UPDATED",
                ]);
            },
        },
    },
};
