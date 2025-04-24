import * as schema from "@/db/schema";
import { conversationParticipants } from "@/db/schema/conversation";
import GraphqlContext from "@/types/types.utils";
import { GraphQLError } from "graphql";
import { eq, ne, desc } from "drizzle-orm";
import { withFilter } from "graphql-subscriptions";

// Helper function to convert database status to GraphQL enum format
function mapStatusToEnum(status: string): string {
  return status.toUpperCase();
}

export const participantsResolvers = {
  Query: {
    conversationParticipants: async (
      _: any,
      __: any,
      context: GraphqlContext
    ) => {
      const { db, session } = context;
      const user = session?.user;

      if (!user?.id) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // First, find all conversations the current user is in
      const userConversations =
        await db.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.userId, user.id),
          with: {
            conversation: {
              with: {
                messages: {
                  orderBy: (messages) => [desc(messages.createdAt)],
                  limit: 1,
                },
                participants: {
                  where: ne(conversationParticipants.userId, user.id),
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
      subscribe: function (_: any, __: any, context?: GraphqlContext) {
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
