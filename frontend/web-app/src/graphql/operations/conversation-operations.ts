import { gql } from "@apollo/client";

const conversationOperations = {
  Querries: {
    getConversation: gql`
      query Conversation($conversationId: ID!) {
        conversation(id: $conversationId) {
          createdAt
          id
          isDraft
          isGroup
          title
          updatedAt
          messages {
            content
            conversationId
            id
            isDeleted
            isEdited
            sender {
              username
              id
            }
            senderId
          }
          participants {
            user {
              image
              username
            }
          }
        }
      }
    `,
  },

  Mutations: {
    sendMessage: gql`
      mutation SendMessage($participantIds: [ID!]!, $content: String!) {
        sendMessage(participantIds: $participantIds, content: $content) {
          success
        }
      }
    `,
  },

  Subscriptions: {
    messageSent: gql`
      subscription Subscription($conversationId: ID!) {
        messageAdded(conversationId: $conversationId) {
          content
        }
      }
    `,
  },
};

export interface Message {
  content: string;
  conversationId: string;
  id: string;
  isDeleted: boolean;
  isEdited: boolean;
  sender: {
    username: string;
    id: string;
  };
  senderId: string;
}
export interface Conversation {
  id: string;
  createdAt: Date;
  isDraft: boolean;
  isGroup: boolean;
  title: string | null;
  updatedAt: Date;
  messages: Message[];
  participants: ConversationParticipant[];
}

export interface ConversationParticipant {
  conversationId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  lastMessage: {
    content: string;
  } | null;
  lastMessageAt: Date | null;
}

export interface GetConversationResponse {
  conversation: Conversation;
}

export default conversationOperations;
