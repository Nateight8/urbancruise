import { gql } from "@apollo/client";

const participantOperations = {
  Querries: {
    myParticipants: gql`
      query ConversationParticipants {
        conversationParticipants {
          conversationId
          user {
            id
            name
            username
            image
          }
          lastMessage {
            content
          }
          lastMessageAt
        }
      }
    `,
  },

  Mutations: {},
};

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

export interface MyParticipantsResponse {
  conversationParticipants: ConversationParticipant[];
}

export default participantOperations;
