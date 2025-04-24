import { gql } from "@apollo/client";
import { MessageStatus } from "./conversation-operations";

const participantOperations = {
  Querries: {
    myParticipants: gql`
      query ConversationParticipants {
        conversationParticipants {
          conversationId
          hasSeenLatestMessage
          user {
            username
            id
            image
          }
          lastMessage {
            content
            id
            senderId
            status
          }
          lastMessageStatus
        }
      }
    `,
  },

  Mutations: {},

  Subscriptions: {
    conversationParticipantsUpdated: gql`
      subscription ConversationParticipantsUpdated {
        conversationParticipantsUpdated {
          conversationId
          hasSeenLatestMessage
          user {
            username
            id
            image
          }
          lastMessage {
            content
            id
            senderId
            status
          }
          lastMessageStatus
        }
      }
    `,
  },
};

export interface ConversationParticipant {
  conversationId: string;
  hasSeenLatestMessage: boolean;
  user: {
    id: string;
    username: string | null;
    image: string | null;
  };
  lastMessage?: {
    content: string;
    id: string;
    senderId?: string;
    status?: MessageStatus;
  } | null;
  lastMessageStatus?: MessageStatus;
}

export interface MyParticipantsResponse {
  conversationParticipants: ConversationParticipant[];
}

export interface ParticipantsUpdatedResponse {
  conversationParticipantsUpdated: ConversationParticipant;
}

export default participantOperations;
