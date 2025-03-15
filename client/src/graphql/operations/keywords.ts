import { gql } from "@apollo/client";

const keywordsOperations = {
  Mutations: {
    createKeywords: gql`
      mutation Mutation($keywords: [String!]!, $automationId: String!) {
        createKeywords(keywords: $keywords, automationId: $automationId) {
          message
          success
        }
      }
    `,
  },
};

interface keyword {
  id: string;
  word: string;
}

export default keywordsOperations;
export type { keyword };
