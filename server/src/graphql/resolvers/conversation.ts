// conversationResolvers.ts
import { eq, and, sql } from "drizzle-orm";
import {
  conversations,
  conversationParticipants,
  messages,
  users,
} from "@/db/schema";
import * as schema from "@/db/schema";
import GraphqlContext from "@/types/types.utils";
import { GraphQLError } from "graphql";

interface SendMessageArgs {
  participantIds: string[];
  content: string;
}

interface SendMessageResponse {
  message: string;
  success: boolean;
  conversationUpdated: boolean;
  conversation: typeof schema.conversations.$inferSelect | null;
  sentMessage?: typeof schema.messages.$inferSelect;
}

export const conversationResolvers = {
  Query: {},
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphqlContext
    ): Promise<SendMessageResponse> => {
      try {
        const { db, session } = context;
        const user = session?.user;

        // Step 1: Auth check
        if (!user?.id) {
          throw new GraphQLError(
            "Yo, login before you can slide into DMs! 🔒",
            {
              extensions: { code: "UNAUTHENTICATED" },
            }
          );
        }

        const { participantIds, content: msgTxt } = args;

        // Step 2: Input validation
        if (!msgTxt?.trim()) {
          throw new GraphQLError(
            "C'mon, don't leave me hanging. Say something! 🗣️",
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }

        if (!participantIds || participantIds.length < 2) {
          throw new GraphQLError(
            "Gotta have at least two peeps in the squad! 👯‍♀️",
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }

        // Step 3: Generate vibe ID from squad
        const sortedIds = [...participantIds].sort();
        const vibeId = sortedIds.join("-");

        // Step 4: Query the users table to get the user details for each participantId
        let participants;
        try {
          participants = await db.query.users.findMany({
            where: (users: typeof schema.users) =>
              sql`${users.participantId} IN ${sortedIds}`,
          });
        } catch (dbError) {
          console.error("Database error querying participants:", dbError);
          throw new GraphQLError("Whoops, couldn't find your squad! 🧐", {
            extensions: { code: "DATABASE_ERROR" },
          });
        }

        // Validate all participants exist
        if (participants.length !== sortedIds.length) {
          const missingCount = sortedIds.length - participants.length;
          throw new GraphQLError(
            `Oops, ${missingCount} homie(s) not found in the system. 😅`,
            {
              extensions: { code: "NOT_FOUND" },
            }
          );
        }

        // Find the current user's record based on their user.id
        const currentUserRecord = participants.find(
          (p: typeof schema.users.$inferSelect) => p.id === user.id
        );
        if (!currentUserRecord) {
          throw new GraphQLError("You ain't part of this squad, fam! 🤔", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Step 5: Check if conversation exists
        let convo;
        try {
          convo = await db.query.conversations.findFirst({
            where: eq(conversations.id, vibeId),
          });
        } catch (dbError) {
          console.error("Database error querying conversation:", dbError);
          throw new GraphQLError(
            "Yo, we couldn't pull up the convo! Something's off. 🤷‍♂️",
            {
              extensions: { code: "DATABASE_ERROR" },
            }
          );
        }

        const isGroupChat = sortedIds.length > 2;

        // Step 6: Create or update conversation
        if (!convo) {
          try {
            const [newConvo] = await db
              .insert(conversations)
              .values({
                id: vibeId,
                isGroup: isGroupChat,
                isDraft: false,
              })
              .returning();

            convo = newConvo;

            // Add participants to the convo
            const squad = participants.map(
              (participant: typeof schema.users.$inferSelect) => ({
                userId: participant.id,
                conversationId: vibeId,
              })
            );

            await db.insert(conversationParticipants).values(squad);
          } catch (dbError) {
            console.error("Database error creating conversation:", dbError);
            throw new GraphQLError(
              "Something went wrong starting the convo. Lemme try again. 🤦‍♂️",
              {
                extensions: { code: "DATABASE_ERROR" },
              }
            );
          }
        } else {
          // Check if current user is already a participant
          try {
            const existingParticipant =
              await db.query.conversationParticipants.findFirst({
                where: and(
                  eq(conversationParticipants.conversationId, vibeId),
                  eq(conversationParticipants.userId, user.id)
                ),
              });

            // If not, add them
            if (!existingParticipant) {
              await db.insert(conversationParticipants).values({
                userId: user.id,
                conversationId: vibeId,
              });
            }
          } catch (dbError) {
            console.error(
              "Database error checking/adding participant:",
              dbError
            );
            throw new GraphQLError("Couldn't add you to the convo. Yikes! 😬", {
              extensions: { code: "DATABASE_ERROR" },
            });
          }
        }

        // Step 7: Insert the message
        let freshMsg;
        try {
          [freshMsg] = await db
            .insert(messages)
            .values({
              content: msgTxt,
              senderId: user.id,
              conversationId: vibeId,
              isEdited: false,
              isDeleted: false,
            })
            .returning();
        } catch (dbError) {
          console.error("Database error inserting message:", dbError);
          throw new GraphQLError(
            "Bruh, something went wrong while sending your message. 😤",
            {
              extensions: { code: "DATABASE_ERROR" },
            }
          );
        }

        // Step 8: Update conversation's last message time
        try {
          await db
            .update(conversations)
            .set({
              lastMessageAt: new Date(),
            })
            .where(eq(conversations.id, vibeId));
        } catch (dbError) {
          console.error(
            "Database error updating conversation timestamp:",
            dbError
          );
          // Non-fatal error, log but continue
        }

        // Step 9: Mark others as not having seen the message
        try {
          await db
            .update(conversationParticipants)
            .set({ hasSeenLatestMessage: false })
            .where(
              and(
                eq(conversationParticipants.conversationId, vibeId),
                eq(conversationParticipants.userId, user.id)
              )
            );
        } catch (dbError) {
          console.error("Database error updating seen status:", dbError);
          // Non-fatal error, log but continue
        }

        return {
          message: "Message sent successfully, enjoy the convo! 🔥",
          success: true,
          conversationUpdated: true,
          conversation: convo,
          sentMessage: freshMsg,
        };
      } catch (error) {
        // Global error handler for unexpected errors
        if (error instanceof GraphQLError) {
          // Rethrow GraphQL errors we've already formatted
          throw error;
        }

        console.error("Unexpected error in sendMessage resolver:", error);
        throw new GraphQLError(
          "Bruh, something went wrong while sending your message. 😵‍💫",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          }
        );
      }
    },
  },
};
