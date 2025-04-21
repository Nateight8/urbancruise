import { gql } from "@apollo/client";

const conversationOperations = {
  Querries: {},

  Mutations: {
    sendMessage: gql`
      mutation SendMessage($participantIds: [ID!]!, $content: String!) {
        sendMessage(participantIds: $participantIds, content: $content) {
          success
        }
      }
    `,
  },
};

export default conversationOperations;
