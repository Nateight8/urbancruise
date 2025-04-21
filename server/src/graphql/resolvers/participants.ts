import * as schema from "@/db/schema";
import { conversationParticipants } from "@/db/schema/conversation";
import GraphqlContext from "@/types/types.utils";
import { GraphQLError } from "graphql";
import { eq, ne, desc } from "drizzle-orm";
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

      console.log("WE HIT THE CONVERSATION PARTICIPANTS QUERY");

      // First, find all conversations the current user is in
      const userConversations =
        await db.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.userId, user.id),
          with: {
            conversation: {
              with: {
                messages: {
                  orderBy: (messages: typeof schema.messages) => [
                    desc(messages.createdAt),
                  ],
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

      console.log("userConversations:", userConversations);

      // Format the response
      const formattedConversations = userConversations.map(
        (
          convo: typeof schema.conversationParticipants.$inferSelect & {
            conversation: typeof schema.conversations.$inferSelect & {
              participants: (typeof schema.conversationParticipants.$inferSelect & {
                user: typeof schema.users.$inferSelect;
              })[];
              messages: (typeof schema.messages.$inferSelect)[];
            };
          }
        ) => ({
          user: convo.conversation.participants[0]?.user,
          lastMessage: convo.conversation.messages[0] || null,
          lastMessageAt: convo.conversation.lastMessageAt,
          conversationId: convo.conversationId,
        })
      );

      console.log("formattedConversations:", formattedConversations);

      // Ensure we always return an array, even if empty
      return formattedConversations || [];
    },
  },

  Mutation: {},
};
