import { gql } from "graphql-tag";

export const conversationTypeDefs = gql`
  """
  User type with minimal fields needed for conversation creation
  """
  type User {
    id: ID!
    username: String!
    avatarUrl: String
  }

  """
  Conversation type with essential fields
  """
  type Conversation {
    id: ID!
    participants: [User!]!
    isGroup: Boolean!
    isDraft: Boolean!
    createdAt: DateTime!
    lastMessageAt: DateTime
  }

  """
  Message type for conversations
  """
  type Message {
    id: ID!
    content: String!
    sender: User!
    conversation: Conversation!
    createdAt: DateTime!
    isEdited: Boolean!
  }

  """
  Custom scalar for DateTime
  """
  scalar DateTime

  """
  Input type for initiating a conversation
  """
  input InitiateConversationInput {
    participantIds: [ID!]!
  }

  """
  Input type for sending the first message
  """
  input SendFirstMessageInput {
    conversationId: ID!
    content: String!
  }

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
    conversationUpdated: Boolean!
  }

  type Query {
    """
    Get a conversation by ID
    """
    conversation(id: ID!): Conversation

    """
    Get all conversations for the current user
    """
    myConversations: [Conversation!]!
  }

  type Mutation {
    """
    Initiate a conversation without sending a message (creates a draft)
    """
    initiateConversation(
      input: InitiateConversationInput!
    ): ConversationResponse!

    """
    Send first message in a conversation (converts from draft to active)
    """
    sendFirstMessage(input: SendFirstMessageInput!): MessageResponse!
  }

  type Subscription {
    """
    Subscribe to conversation updates
    """
    conversationUpdated(id: ID!): Conversation!
  }
`;
