"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationResolvers = void 0;
// conversationResolvers.ts
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("@/db/schema");
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
// Helper function to convert database status to GraphQL enum format
function mapStatusToEnum(status) {
    return status.toUpperCase();
}
exports.conversationResolvers = {
    Query: {
        conversation: async (_, args, context) => {
            const { db, session } = context;
            const user = session?.user;
            // Check if user is a participant
            const participation = await db.query.conversationParticipants.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, user?.id || ""), (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, args.id), (0, drizzle_orm_1.isNull)(schema_1.conversationParticipants.leftAt)),
            });
            if (!participation) {
                throw new Error("Conversation not found or user is not a participant");
            }
            const conversation = await db.query.conversations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.conversations.id, args.id),
                with: {
                    messages: {
                        orderBy: (messages) => [(0, drizzle_orm_1.asc)(messages.createdAt)],
                        with: {
                            sender: {
                                columns: {
                                    id: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },
                    },
                    participants: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!conversation) {
                throw new graphql_1.GraphQLError("Conversation not found", {
                    extensions: { code: "NOT_FOUND" },
                });
            }
            // Map message status to uppercase for GraphQL enum
            const messagesWithMappedStatus = conversation.messages.map((message) => ({
                ...message,
                status: mapStatusToEnum(message.status),
            }));
            // Return conversation with mapped message statuses
            return {
                ...conversation,
                messages: messagesWithMappedStatus,
            };
        },
    },
    Mutation: {
        markMessageAsDelivered: async (_, args, context) => {
            try {
                const { db, session, pubsub } = context;
                const user = session?.user;
                if (!user?.id) {
                    throw new graphql_1.GraphQLError("Unauthorized", {
                        extensions: { code: "UNAUTHENTICATED" },
                    });
                }
                const message = await db.query.messages.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.messages.id, args.messageId),
                });
                if (!message) {
                    throw new graphql_1.GraphQLError("Message not found", {
                        extensions: { code: "NOT_FOUND" },
                    });
                }
                // Update message status to delivered if it's not the sender
                if (message.senderId !== user.id && message.status === "sent") {
                    await db
                        .update(schema_1.messages)
                        .set({ status: "delivered" })
                        .where((0, drizzle_orm_1.eq)(schema_1.messages.id, args.messageId));
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
            }
            catch (error) {
                console.error("Error marking message as delivered:", error);
                return false;
            }
        },
        markMessagesAsRead: async (_, args, context) => {
            try {
                const { db, session, pubsub } = context;
                const user = session?.user;
                if (!user?.id) {
                    throw new graphql_1.GraphQLError("Unauthorized", {
                        extensions: { code: "UNAUTHENTICATED" },
                    });
                }
                // Update each message
                for (const messageId of args.messageIds) {
                    // First, get the message with its sender information
                    const message = (await db.query.messages.findFirst({
                        where: (0, drizzle_orm_1.eq)(schema_1.messages.id, messageId),
                        with: {
                            sender: true,
                        },
                    }));
                    if (!message)
                        continue;
                    // Update message status to read if it's not the sender
                    if (message.senderId !== user.id) {
                        await db
                            .update(schema_1.messages)
                            .set({ status: "read" })
                            .where((0, drizzle_orm_1.eq)(schema_1.messages.id, messageId));
                        // Get the sender's participant record for this conversation
                        const senderParticipant = await db.query.conversationParticipants.findFirst({
                            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, message.conversationId), (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, message.senderId)),
                            with: {
                                user: true,
                            },
                        });
                        if (!senderParticipant)
                            continue;
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
                            .update(schema_1.conversationParticipants)
                            .set({ hasSeenLatestMessage: true })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, message.conversationId), (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, user.id)));
                    }
                }
                return true;
            }
            catch (error) {
                console.error("Error marking messages as read:", error);
                return false;
            }
        },
        sendMessage: async (_, args, context) => {
            try {
                const { db, session, pubsub } = context;
                const user = session?.user;
                if (!user?.id) {
                    throw new graphql_1.GraphQLError("Yo, login before you can slide into DMs! 🔒", {
                        extensions: { code: "UNAUTHENTICATED" },
                    });
                }
                const { participantIds, content: msgTxt } = args;
                // Step 2: Input validation
                if (!msgTxt?.trim()) {
                    throw new graphql_1.GraphQLError("C'mon, don't leave me hanging. Say something! 🗣️", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                if (!participantIds || participantIds.length < 2) {
                    throw new graphql_1.GraphQLError("Gotta have at least two peeps in the squad! 👯‍♀️", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                // Step 3: Generate vibe ID from squad
                const sortedIds = [...participantIds].sort();
                const vibeId = sortedIds.join("-");
                // Step 4: Query the users table to get the user details for each participantId
                let participants;
                try {
                    participants = await db.query.users.findMany({
                        where: (users) => (0, drizzle_orm_1.sql) `${users.participantId} IN ${sortedIds}`,
                    });
                }
                catch (dbError) {
                    console.error("Database error querying participants:", dbError);
                    throw new graphql_1.GraphQLError("Whoops, couldn't find your squad! 🧐", {
                        extensions: { code: "DATABASE_ERROR" },
                    });
                }
                // Validate all participants exist
                if (participants.length !== sortedIds.length) {
                    const missingCount = sortedIds.length - participants.length;
                    throw new graphql_1.GraphQLError(`Oops, ${missingCount} homie(s) not found in the system. 😅`, {
                        extensions: { code: "NOT_FOUND" },
                    });
                }
                // Find the current user's record based on their user.id
                const currentUserRecord = participants.find((p) => p.id === user.id);
                if (!currentUserRecord) {
                    throw new graphql_1.GraphQLError("You ain't part of this squad, fam! 🤔", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                // Step 5: Check if conversation exists
                let convo;
                try {
                    convo = await db.query.conversations.findFirst({
                        where: (0, drizzle_orm_1.eq)(schema_1.conversations.id, vibeId),
                    });
                }
                catch (dbError) {
                    console.error("Database error querying conversation:", dbError);
                    throw new graphql_1.GraphQLError("Yo, we couldn't pull up the convo! Something's off. 🤷‍♂️", {
                        extensions: { code: "DATABASE_ERROR" },
                    });
                }
                const isGroupChat = sortedIds.length > 2;
                // Step 6: Create or update conversation
                if (!convo) {
                    try {
                        const [newConvo] = await db
                            .insert(schema_1.conversations)
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
                        await db.insert(schema_1.conversationParticipants).values(squad);
                    }
                    catch (dbError) {
                        console.error("Database error creating conversation:", dbError);
                        throw new graphql_1.GraphQLError("Something went wrong starting the convo. Lemme try again. 🤦‍♂️", {
                            extensions: { code: "DATABASE_ERROR" },
                        });
                    }
                }
                else {
                    // If conversation exists
                    const existingParticipants = await db.query.conversationParticipants.findMany({
                        where: (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, vibeId),
                    });
                    const existingParticipantIds = new Set(existingParticipants.map((p) => p.userId));
                    const missingParticipants = participants.filter((p) => !existingParticipantIds.has(p.id));
                    // Add any missing participants
                    if (missingParticipants.length > 0) {
                        const newEntries = missingParticipants.map((p) => ({
                            userId: p.id,
                            conversationId: vibeId,
                        }));
                        await db.insert(schema_1.conversationParticipants).values(newEntries);
                    }
                }
                // Step 7: Insert the message
                let freshMsg;
                try {
                    [freshMsg] = await db
                        .insert(schema_1.messages)
                        .values({
                        content: msgTxt,
                        senderId: user.id,
                        conversationId: vibeId,
                        isEdited: false,
                        isDeleted: false,
                        status: "sent",
                    })
                        .returning();
                }
                catch (dbError) {
                    console.error("Database error inserting message:", dbError);
                    throw new graphql_1.GraphQLError("Bruh, something went wrong while sending your message. 😤", {
                        extensions: { code: "DATABASE_ERROR" },
                    });
                }
                // Step 8: Update conversation's last message time
                try {
                    await db
                        .update(schema_1.conversations)
                        .set({
                        lastMessageAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, vibeId));
                }
                catch (dbError) {
                    console.error("Database error updating conversation timestamp:", dbError);
                    // Non-fatal error, log but continue
                }
                // Step 9: Mark others as not having seen the message
                try {
                    await db
                        .update(schema_1.conversationParticipants)
                        .set({ hasSeenLatestMessage: false })
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, vibeId), (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, user.id)));
                }
                catch (dbError) {
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
                    const otherParticipantIds = participantIds.filter((id) => id !== user.id);
                    for (const participantId of otherParticipantIds) {
                        // Find the participant's user record
                        const participantUser = participants.find((p) => p.participantId === participantId);
                        if (participantUser) {
                            console.log("Publishing participant update for:", participantUser.id);
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
                            status: freshMsg.status,
                        }
                        : undefined,
                };
            }
            catch (error) {
                // Global error handler for unexpected errors
                if (error instanceof graphql_1.GraphQLError) {
                    // Rethrow GraphQL errors we've already formatted
                    throw error;
                }
                console.error("Unexpected error in sendMessage resolver:", error);
                throw new graphql_1.GraphQLError("Bruh, something went wrong while sending your message. 😵‍💫", {
                    extensions: { code: "INTERNAL_SERVER_ERROR" },
                });
            }
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                if (!context || !context.pubsub) {
                    throw new Error("PubSub not available");
                }
                return context.pubsub.asyncIterableIterator(["MESSAGE_ADDED"]);
            }, (payload, variables) => {
                return payload.conversationId === variables.conversationId;
            }),
        },
        messageStatusUpdated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                if (!context || !context.pubsub) {
                    throw new Error("PubSub not available");
                }
                return context.pubsub.asyncIterableIterator([
                    "MESSAGE_STATUS_UPDATED",
                ]);
            }, (payload, variables) => {
                // If conversationId is empty or not provided, listen to all status updates
                if (!variables.conversationId) {
                    return true;
                }
                // Otherwise, filter by the specific conversation
                return payload.conversationId === variables.conversationId;
            }),
        },
    },
};
