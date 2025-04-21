// conversationResolvers.ts

import { db } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import {
  conversations,
  conversationParticipants,
  messages,
  users,
} from "@/db/schema";
import * as schema from "@/db/schema";
import GraphqlContext from "@/types/types.utils";

interface SendMessageArgs {
  participantIds: string[];
  content: string;
}

export const conversationResolvers = {
  Query: {},
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphqlContext
    ) => {
      const { db, session } = context;
      const user = session.user;

      const { participantIds, content: msgTxt } = args;

      // Step 1: Auth check
      if (!user?.id) {
        return {
          message: "You gotta be logged in to drop bars 🧢",
          success: false,
          conversationUpdated: false,
          conversation: null,
        };
      }

      // Step 2: Make sure message exists
      if (!msgTxt || participantIds.length < 2) {
        return {
          message: "That message kinda empty or missing squad 🥲",
          success: false,
          conversationUpdated: false,
          conversation: null,
        };
      }

      // Step 3: Generate vibe ID from squad
      const sortedIds = [...participantIds].sort();
      const vibeId = sortedIds.join("-");

      console.log("================");
      console.log("vibeId:", sortedIds);
      console.log("================");

      // Step 4: Query the users table to get the user details for each participantId
      // Step 4: Query the users table to get the user details for each participantId
      const participants = await db.query.users.findMany({
        where: (users: typeof schema.users) =>
          sql`${users.participantId} IN ${sortedIds}`,
      });

      console.log("================");
      console.log("participants:", participants);
      console.log("================");

      // If any participant doesn't exist, return error
      if (participants.length !== sortedIds.length) {
        return {
          message: "Some participants don't exist in the system 😕",
          success: false,
          conversationUpdated: false,
          conversation: null,
        };
      }

      // Step 5: Check if the chat already exists
      let convo = await db.query.conversations.findFirst({
        where: eq(conversations.id, vibeId),
      });

      const isGroupChat = sortedIds.length > 2;

      // Step 6: If convo doesn't exist, we start a new one
      if (!convo) {
        console.log("================");
        console.log("will insert new convo now");
        console.log("================");

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
        const squad = participants.map((users: typeof schema.users) => ({
          userId: user.id, // Now using user.id (from the user table)
          conversationId: vibeId,
        }));

        await db.insert(conversationParticipants).values(squad);

        console.log("================");
        console.log("convo:", convo);
        console.log("================");
      }

      console.log("================");
      console.log("will insert message now");
      console.log("================");

      // Step 7: Drop the actual message
      const [freshMsg] = await db
        .insert(messages)
        .values({
          content: msgTxt,
          senderId: user.id,
          conversationId: vibeId,
          isEdited: false,
          isDeleted: false,
        })
        .returning();

      console.log("================");
      console.log("freshMsg:", freshMsg);
      console.log("================");

      // Step 8: Update convo's last message time
      await db
        .update(conversations)
        .set({
          lastMessageAt: new Date(),
        })
        .where(eq(conversations.id, vibeId));

      // Step 9: Mark others in convo as not seen yet
      await db
        .update(conversationParticipants)
        .set({ hasSeenLatestMessage: false })
        .where(
          and(
            eq(conversationParticipants.conversationId, vibeId),
            // Don't update sender
            eq(conversationParticipants.userId, user.id)
          )
        );

      return {
        message: "Dropped your message in the chat 📩",
        success: true,
        conversationUpdated: true,
        conversation: convo,
        sentMessage: freshMsg,
      };
    },
  },
};
