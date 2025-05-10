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
            image
            name
            displayName
            bio
            onboardingCompleted
            participantId
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
            displayName
            bio
            participantId
            image
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
    updateUser: gql`
      mutation UpdateUser(
        $name: String
        $email: String
        $displayName: String
        $bio: String
        $image: String
        $location: String
        $address: String
        $phoneVerified: Boolean
        $onboardingCompleted: Boolean
        $banner: String
      ) {
        updateUser(
          name: $name
          email: $email
          displayName: $displayName
          bio: $bio
          image: $image
          location: $location
          address: $address
          phoneVerified: $phoneVerified
          onboardingCompleted: $onboardingCompleted
          banner: $banner
        ) {
          message
          success
        }
      }
    `,

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

    deleteAccount: gql`
      mutation DeletUser {
        deleteUser
      }
    `,
  },
};

interface GetLoggedInUserResponse {
  getLoggedInUser: {
    user: User;
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
  name: string;
  username: string;
  participantId: string;
  image: string;
  onboardingCompleted: boolean;
  displayName: string;
  bio: string;
  email: string;
}

export type { GetLoggedInUserResponse, UpdateUsernameResponse };
export default userOperations;
