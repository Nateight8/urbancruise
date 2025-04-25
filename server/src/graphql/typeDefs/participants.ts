import { gql } from "graphql-tag";

export const participantsTypeDefs = gql`
  type ConversationParticipant {
    user: User!
    lastMessage: Message
    lastMessageAt: String
    conversationId: String!
    hasSeenLatestMessage: Boolean!
    lastMessageStatus: MessageStatus
  }

  extend type Query {
    conversationParticipants: [ConversationParticipant!]!
  }

  extend type Subscription {
    conversationParticipantsUpdated: ConversationParticipant!
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
  }
`;
