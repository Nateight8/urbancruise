import { gql } from "@apollo/client";

const userOperations = {
  Querries: {
    getLoggedInUser: gql`
      query GetLoggedInUser {
        getLoggedInUser {
          user {
            id
            username
            email
            avatar
            onboardingCompleted
          }
        }
      }
    `,
    checkUsernameAvailability: gql`
      query CheckUsernameAvailability($username: String!) {
        checkUsernameAvailability(username: $username)
      }
    `,
  },

  Mutations: {
    updateUsername: gql`
      mutation UpdateUsername($username: String!) {
        updateUsername(username: $username) {
          success
          message
          user {
            id
            username
          }
        }
      }
    `,
  },
};

interface GetLoggedInUserResponse {
  getLoggedInUser: {
    user: {
      id: string;
      username: string;
      email: string;
      avatar: string;
    };
  };
}

interface UpdateUsernameResponse {
  updateUsername: {
    success: boolean;
    message: string;
    user: {
      id: string;
      username: string;
      onboardingCompleted: boolean;
    } | null;
  };
}

export type { GetLoggedInUserResponse, UpdateUsernameResponse };
export default userOperations;
