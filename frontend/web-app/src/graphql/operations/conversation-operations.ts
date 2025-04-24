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
            status
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
    markMessageAsDelivered: gql`
      mutation MarkMessageAsDelivered($messageId: ID!) {
        markMessageAsDelivered(messageId: $messageId)
      }
    `,
    markMessageAsRead: gql`
      mutation MarkMessageAsRead($messageId: ID!) {
        markMessagesAsRead(messageIds: [$messageId])
      }
    `,
  },

  Subscriptions: {
    messageSent: gql`
      subscription Subscription($conversationId: ID!) {
        messageAdded(conversationId: $conversationId) {
          content
          id
          senderId
          conversationId
          isDeleted
          isEdited
          status
          sender {
            id
            username
          }
        }
      }
    `,
    messageStatusChanged: gql`
      subscription MessageStatusChanged($conversationId: ID!) {
        messageStatusUpdated(conversationId: $conversationId) {
          id
          status
        }
      }
    `,
  },
};

export type MessageStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";

export interface Message {
  __typename?: "Message";
  content: string;
  conversationId: string;
  id: string;
  isDeleted: boolean;
  isEdited: boolean;
  status?: MessageStatus;
  sender: {
    __typename?: "User";
    username: string;
    id: string;
  };
  senderId: string;
}
export interface Conversation {
  __typename?: "Conversation";
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
  __typename?: "Query";
  conversation: Conversation;
}

export default conversationOperations;
