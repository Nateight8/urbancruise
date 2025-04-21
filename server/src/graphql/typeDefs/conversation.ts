import { gql } from "graphql-tag";

export const conversationTypeDefs = gql`
  """
  Conversation type with essential fields
  """
  type Conversation {
    id: ID!
    participants: [User!]!
    isGroup: Boolean!
    createdAt: DateTime!
    lastMessageAt: DateTime
  }

  """
  Message type for conversations
  """
  type Message {
    id: ID!
    content: String!
    createdAt: DateTime
  }

  """
  Custom scalar for DateTime
  """
  scalar DateTime

  """
  Response for conversation creation
  """
  type ConversationResponse {
    conversation: Conversation!
    success: Boolean!
    message: String
  }

  """
  Response for message creation
  """
  type MessageResponse {
    message: Message
    success: Boolean!
  }

  """
  User with conversation context
  """
  type ConversationParticipant {
    conversationId: ID!
    lastMessageAt: DateTime
    user: User
    lastMessage: Message
  }

  """
  User type with minimal fields
  """
  type User {
    id: ID!
    username: String
  }

  type Query {
    """
    Get all users the current user has conversations with,
    along with conversation metadata
    """
    conversationParticipants: [ConversationParticipant]
  }

  type Mutation {
    """
    Send a message to another user.
    If the conversation doesn't exist yet, it will be created automatically.
    The conversation ID is derived from the sorted conversationParticipationIds.
    """
    sendMessage(participantIds: [ID!]!, content: String!): MessageResponse!
  }

  type Subscription {
    """
    Subscribe to conversation updates
    """
    conversationUpdated(id: ID!): Conversation!

    """
    Subscribe to new messages in a conversation
    """
    newMessage(conversationId: ID!): Message!
  }
`;
