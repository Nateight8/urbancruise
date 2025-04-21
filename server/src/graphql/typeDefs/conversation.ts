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
    sender: User!
    conversation: Conversation!
    createdAt: DateTime!
    updatedAt: DateTime!
    isEdited: Boolean!
    isDeleted: Boolean!
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
    conversationUpdated: Boolean!
    conversation: Conversation
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
    Send a message to another user.
    If the conversation doesn't exist yet, it will be created automatically.
    The conversation ID is derived from the sorted conversationParticipationIds.
    """
    sendMessage(
      conversationParticipationIds: [ID!]!
      content: String!
    ): MessageResponse!
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
