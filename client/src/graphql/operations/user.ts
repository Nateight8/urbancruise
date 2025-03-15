import { gql } from "@apollo/client";

const userOperations = {
  Querries: {
    createPost: gql`
      query GetLoggedInUser {
        getLoggedInUser {
          status
          user {
            id
            name
            email
            integrations {
              name
              createdAt
            }
            subscriptions {
              plan
            }
          }
        }
      }
    `,
  },
};

interface Integrations {
  name: string;
  createdAt: Date;
}

interface GetLoggedInUser {
  getLoggedInUser: {
    status: number;
    user: {
      id: string;
      name: string;
      email: string;
      integrations: Integrations[];
      subscriptions: {
        plan: string;
      };
    };
  };
}

export type { GetLoggedInUser };
export default userOperations;
