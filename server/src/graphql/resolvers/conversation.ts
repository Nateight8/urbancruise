// conversationResolvers.ts
import { eq, and, sql, isNull, asc } from "drizzle-orm";
import {
  conversations,
  conversationParticipants,
  messages,
  users,
} from "../../db/schema";
import * as schema from "../../db/schema";
import GraphqlContext from "../../types/types.utils";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";

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

// Helper function to convert database status to GraphQL enum format
function mapStatusToEnum(status: string): string {
  return status.toUpperCase();
}

export const conversationResolvers = {
  Query: {
    conversation: async (
      _: any,
      args: { id: string },
      context: GraphqlContext
    ) => {
      const { db, session } = context;
      const user = session?.user;

      // Check if user is a participant
      const participation = await db
        .select()
        .from(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.userId, user?.id || ""),
            eq(conversationParticipants.conversationId, args.id),
            isNull(conversationParticipants.leftAt)
          )
        )
        .limit(1);

      if (participation.length === 0) {
        throw new Error("Conversation not found or user is not a participant");
      }

      // Get conversation with messages and participants
      const results = await db
        .select({
          id: conversations.id,
          isGroup: conversations.isGroup,
          isDraft: conversations.isDraft,
          lastMessageAt: conversations.lastMessageAt,
          messages: messages,
          participants: {
            id: users.id,
            username: users.username,
            image: users.image,
          },
        })
        .from(conversations)
        .where(eq(conversations.id, args.id))
        .leftJoin(messages, eq(messages.conversationId, conversations.id))
        .leftJoin(
          conversationParticipants,
          eq(conversationParticipants.conversationId, conversations.id)
        )
        .leftJoin(users, eq(users.id, conversationParticipants.userId))
        .orderBy(asc(messages.createdAt));

      if (results.length === 0) {
        throw new GraphQLError("Conversation not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const conversation = results[0];

      // Map message status to uppercase for GraphQL enum
      const messagesWithMappedStatus = conversation.messages
        ? [conversation.messages].map((message) => ({
            ...message,
            status: mapStatusToEnum(message.status),
          }))
        : [];

      // Return conversation with mapped message statuses
      return {
        ...conversation,
        messages: messagesWithMappedStatus,
      };
    },
  },
  Mutation: {
    markMessageAsDelivered: async (
      _: any,
      args: { messageId: string },
      context: GraphqlContext
    ): Promise<boolean> => {
      try {
        const { db, session, pubsub } = context;
        const user = session?.user;

        if (!user?.id) {
          throw new GraphQLError("Unauthorized", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        const message = await db.query.messages.findFirst({
          where: eq(messages.id, args.messageId),
        });

        if (!message) {
          throw new GraphQLError("Message not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Update message status to delivered if it's not the sender
        if (message.senderId !== user.id && message.status === "sent") {
          await db
            .update(messages)
            .set({ status: "delivered" })
            .where(eq(messages.id, args.messageId));

          // Publish message status update
          await pubsub.publish("MESSAGE_STATUS_UPDATED", {
            messageStatusUpdated: {
              ...message,
              status: "DELIVERED",
              id: message.id,
              senderId: message.senderId,
              conversationId: message.conversationId,
            },
            conversationId: message.conversationId,
          });

          return true;
        }

        return false;
      } catch (error) {
        console.error("Error marking message as delivered:", error);
        return false;
      }
    },
    markMessagesAsRead: async (
      _: any,
      args: { messageIds: string[] },
      context: GraphqlContext
    ): Promise<boolean> => {
      try {
        const { db, session, pubsub } = context;
        const user = session?.user;

        if (!user?.id) {
          throw new GraphQLError("Unauthorized", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        // Update each message
        for (const messageId of args.messageIds) {
          type MessageWithRelations = typeof schema.messages.$inferSelect & {
            sender: typeof schema.users.$inferSelect;
            conversation?: {
              participants: Array<{
                user: typeof schema.users.$inferSelect;
              }>;
            };
          };

          // First, get the message with its sender information
          const message = (await db.query.messages.findFirst({
            where: eq(messages.id, messageId),
            with: {
              sender: true,
            },
          })) as MessageWithRelations | null;

          if (!message) continue;

          // Update message status to read if it's not the sender
          if (message.senderId !== user.id) {
            await db
              .update(messages)
              .set({ status: "read" })
              .where(eq(messages.id, messageId));

            // Get the sender's participant record for this conversation
            const senderParticipant =
              await db.query.conversationParticipants.findFirst({
                where: and(
                  eq(
                    conversationParticipants.conversationId,
                    message.conversationId
                  ),
                  eq(conversationParticipants.userId, message.senderId)
                ),
                with: {
                  user: true,
                },
              });

            if (!senderParticipant) continue;

            // Publish message status update
            await pubsub.publish("MESSAGE_STATUS_UPDATED", {
              messageStatusUpdated: {
                ...message,
                status: "READ",
                id: message.id,
                senderId: message.senderId,
                conversationId: message.conversationId,
              },
              conversationId: message.conversationId,
            });

            // Also publish a conversation participant update for the sender
            const participantUpdate = {
              conversationId: message.conversationId,
              user: senderParticipant.user,
              lastMessage: {
                content: message.content,
                id: message.id,
                status: "READ",
                senderId: message.senderId,
              },
              lastMessageAt: new Date(),
              lastMessageStatus: "READ",
              hasSeenLatestMessage: true,
            };

            await pubsub.publish("CONVERSATION_PARTICIPANT_UPDATED", {
              conversationParticipantsUpdated: participantUpdate,
            });

            // Update the hasSeenLatestMessage flag for the current user
            await db
              .update(conversationParticipants)
              .set({ hasSeenLatestMessage: true })
              .where(
                and(
                  eq(
                    conversationParticipants.conversationId,
                    message.conversationId
                  ),
                  eq(conversationParticipants.userId, user.id)
                )
              );
          }
        }

        return true;
      } catch (error) {
        console.error("Error marking messages as read:", error);
        return false;
      }
    },
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphqlContext
    ): Promise<SendMessageResponse> => {
      try {
        const { db, session, pubsub } = context;
        const user = session?.user;

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
          participants = await db
            .select()
            .from(users)
            .where(sql`${users.participantId} IN ${sortedIds}`);
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
        const currentUserRecord = participants.find((p) => p.id === user.id);
        if (!currentUserRecord) {
          throw new GraphQLError("You ain't part of this squad, fam! 🤔", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Step 5: Check if conversation exists
        let convo;
        try {
          const results = await db
            .select()
            .from(conversations)
            .where(eq(conversations.id, vibeId))
            .limit(1);
          convo = results[0];
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
            const squad = participants.map((participant) => ({
              userId: participant.id,
              conversationId: vibeId,
            }));

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
          // If conversation exists
          const existingParticipants = await db
            .select()
            .from(conversationParticipants)
            .where(eq(conversationParticipants.conversationId, vibeId));

          const existingParticipantIds = new Set(
            existingParticipants.map((p) => p.userId)
          );

          const missingParticipants = participants.filter(
            (p) => !existingParticipantIds.has(p.id)
          );

          // Add any missing participants
          if (missingParticipants.length > 0) {
            const newEntries = missingParticipants.map((p) => ({
              userId: p.id,
              conversationId: vibeId,
            }));
            await db.insert(conversationParticipants).values(newEntries);
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
              status: "sent",
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

        // After successfully creating the message, publish it
        if (freshMsg) {
          await pubsub.publish("MESSAGE_ADDED", {
            messageAdded: {
              ...freshMsg,
              status: mapStatusToEnum(freshMsg.status),
            },
            conversationId: vibeId,
          });

          // Get the updated participant information for other participants
          const otherParticipantIds = participantIds.filter(
            (id) => id !== user.id
          );

          for (const participantId of otherParticipantIds) {
            // Find the participant's user record
            const participantUser = participants.find(
              (p) => p.participantId === participantId
            );

            if (participantUser) {
              console.log(
                "Publishing participant update for:",
                participantUser.id
              );

              // Create the participant update payload
              const participantUpdate = {
                conversationId: vibeId,
                user: currentUserRecord,
                lastMessage: {
                  content: freshMsg.content,
                  id: freshMsg.id,
                  status: mapStatusToEnum(freshMsg.status),
                  senderId: freshMsg.senderId,
                },
                lastMessageAt: new Date(),
                lastMessageStatus: mapStatusToEnum(freshMsg.status),
                hasSeenLatestMessage: false,
              };

              // Publish the update for this participant
              await pubsub.publish("CONVERSATION_PARTICIPANT_UPDATED", {
                conversationParticipantsUpdated: participantUpdate,
              });
            }
          }
        }

        return {
          message: "Message sent successfully, enjoy the convo! 🔥",
          success: true,
          conversationUpdated: true,
          conversation: convo,
          sentMessage: freshMsg
            ? {
                ...freshMsg,
                status: freshMsg.status as
                  | "sent"
                  | "delivered"
                  | "read"
                  | "failed",
              }
            : undefined,
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
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_: any, __: any, context?: GraphqlContext) => {
          if (!context || !context.pubsub) {
            throw new Error("PubSub not available");
          }
          return context.pubsub.asyncIterableIterator(["MESSAGE_ADDED"]);
        },
        (payload, variables) => {
          return payload.conversationId === variables.conversationId;
        }
      ),
    },
    messageStatusUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context?: GraphqlContext) => {
          if (!context || !context.pubsub) {
            throw new Error("PubSub not available");
          }
          return context.pubsub.asyncIterableIterator([
            "MESSAGE_STATUS_UPDATED",
          ]);
        },
        (payload, variables) => {
          // If conversationId is empty or not provided, listen to all status updates
          if (!variables.conversationId) {
            return true;
          }
          // Otherwise, filter by the specific conversation
          return payload.conversationId === variables.conversationId;
        }
      ),
    },
  },
};
