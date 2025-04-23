import * as schema from "@/db/schema";
import { conversationParticipants } from "@/db/schema/conversation";
import GraphqlContext from "@/types/types.utils";
import { GraphQLError } from "graphql";
import { eq, ne, desc } from "drizzle-orm";
import { withFilter } from "graphql-subscriptions";

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
      const formattedConversations = userConversations.map((convo) => ({
        user: convo.conversation.participants[0]?.user,
        lastMessage: convo.conversation.messages[0] || null,
        lastMessageAt: convo.conversation.lastMessageAt,
        conversationId: convo.conversationId,
      }));

      // Ensure we always return an array, even if empty
      return formattedConversations || [];
    },
  },

  Mutation: {},

  Subscription: {
    conversationParticipantsUpdated: {
      subscribe: (_: any, __: any, { pubsub }: GraphqlContext) =>
        pubsub.asyncIterableIterator(["CONVERSATION_PARTICIPANT_UPDATED"]),
    },
  },
};
