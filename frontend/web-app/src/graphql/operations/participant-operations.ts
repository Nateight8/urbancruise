import { gql } from "@apollo/client";

const participantOperations = {
  Querries: {
    myParticipants: gql`
      query ConversationParticipants {
        conversationParticipants {
          conversationId
          user {
            name
            username
            id
            image
          }
          lastMessage {
            content
            id
          }
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
          user {
            name
            username
            id
            image
          }
          lastMessage {
            content
            id
          }
        }
      }
    `,
  },
};

export interface ConversationParticipant {
  conversationId: string;
  userId: string;
  joinedAt: Date;
  leftAt: Date | null;
  hasSeenLatestMessage: boolean;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  lastMessage: {
    content: string;
    id: string;
  } | null;
}

export interface MyParticipantsResponse {
  conversationParticipants: ConversationParticipant[];
}

export interface ParticipantsUpdatedResponse {
  conversationParticipantsUpdated: ConversationParticipant;
}

export default participantOperations;
