import { gql } from "graphql-tag";

export const conversationTypeDefs = gql`
  """
  Conversation type with essential fields
  """
  type Conversation {
    id: ID!
    title: String
    isGroup: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    lastMessageAt: DateTime
    isDraft: Boolean!
    messages: [Message!]!
    participants: [ConversationParticipant!]!
  }

  """
  Message status enum
  """
  enum MessageStatus {
    SENT
    DELIVERED
    READ
    FAILED
  }

  """
  Message type for conversations
  """
  type Message {
    id: ID!
    content: String
    senderId: ID
    conversationId: ID
    createdAt: DateTime
    updatedAt: DateTime
    isEdited: Boolean
    isDeleted: Boolean
    status: MessageStatus
    sender: User
  }

  """
  Conversation participant type
  """
  type ConversationParticipant {
    conversationId: ID!
    hasSeenLatestMessage: Boolean!
    user: User!
    lastMessage: Message
    lastMessageStatus: MessageStatus
  }

  """
  User type with minimal fields
  """
  type User {
    id: ID!
    username: String
    image: String
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
    message: String!
    success: Boolean!
    conversationUpdated: Boolean!
    conversation: Conversation
    sentMessage: Message
  }

  """
  Input type for message pagination
  """
  input MessagePaginationInput {
    limit: Int
    before: ID
    after: ID
  }

  type Query {
    """
    Get a conversation by ID
    """
    conversation(id: ID!): Conversation

    """
    Get all conversations for the current user
    """
    conversations(limit: Int, offset: Int): [Conversation!]!

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

    """
    Create a new conversation (especially for group conversations)
    """
    createConversation(
      participantIds: [ID!]!
      isGroup: Boolean!
      name: String
    ): ConversationResponse!

    """
    Mark messages as read
    """
    markMessagesAsRead(messageIds: [ID!]!): Boolean!

    """
    Mark message as delivered
    """
    markMessageAsDelivered(messageId: ID!): Boolean!

    """
    Delete a message
    """
    deleteMessage(messageId: ID!): Boolean!

    """
    Leave a conversation
    """
    leaveConversation(conversationId: ID!): Boolean!
  }

  type Subscription {
    """
    Subscribe to conversation updates
    """
    conversationUpdated(id: ID!): Conversation!

    """
    Subscribe to new messages in a conversation
    """
    messageAdded(conversationId: ID!): Message!

    """
    Subscribe to message status updates (read receipts)
    """
    messageStatusUpdated(conversationId: ID!): Message!

    """
    Subscribe to user presence updates for participants in a conversation
    """
    userPresenceUpdated(conversationId: ID!): User!

    """
    Subscribe to chat list updates when a new message is received
    """
    conversationParticipantsUpdated: ConversationParticipant!
  }
`;
