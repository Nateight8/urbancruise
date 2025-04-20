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
            conversationParticipationId
          }
        }
      }
    `,

    getAllUsers: gql`
      query Users {
        getAllUsers {
          users {
            id
            name
            username
            conversationParticipationId
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
      conversationParticipationId: string;
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

export interface GetAllUsersResponse {
  getAllUsers: {
    users: User[];
  };
}

export interface User {
  id: string;
  name: string | null;
  username: string | null;
  conversationParticipationId: string;
}

export type { GetLoggedInUserResponse, UpdateUsernameResponse };
export default userOperations;
