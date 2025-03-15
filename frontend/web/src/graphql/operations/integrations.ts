import { gql } from "@apollo/client";

const integrationOperations = {
  Mutations: {
    RedirectToInstagramOAuth: gql`
      mutation RedirectToInstagramOAuth {
        redirectToInstagramOAuth {
          redirectUrl
        }
      }
    `,

    integrateWithInstagram: gql`
      mutation Mutation($code: String!) {
        integrateWithInstagram(code: $code) {
          expiresAt
          name
        }
      }
    `,
  },
};

interface InstagramAuthResponse {
  redirectToInstagramOAuth: {
    redirectUrl: string;
  };
}

export default integrationOperations;
export type { InstagramAuthResponse };
