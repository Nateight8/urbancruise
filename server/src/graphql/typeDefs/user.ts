import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type UpdateUserResponse {
    success: Boolean!
    message: String
    user: User
  }

  type User {
    id: ID!
    name: String
    email: String!
    emailVerified: String
    image: String
    location: String
    address: String
    phoneVerified: Boolean
    onboardingCompleted: Boolean
    banner: String
    username: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  type GetLoggedInUserReturn {
    status: Int
    user: User
  }

  type LoggedInUserResponse {
    user: User
  }

  type GetAllUsersResponse {
    users: [UserWithLoggedInId!]!
  }

  type UserWithLoggedInId {
    id: ID!
    name: String
    email: String!
    emailVerified: String
    image: String
    location: String
    address: String
    phoneVerified: Boolean
    onboardingCompleted: Boolean
    banner: String
    username: String
    avatar: String
    createdAt: String
    updatedAt: String
    loggedInUserId: ID!
  }

  type Query {
    getLoggedInUser: GetLoggedInUserReturn
    getAllUsers: GetAllUsersResponse
    checkUsernameAvailability(username: String!): Boolean!
  }

  type Mutation {
    updateUser(
      name: String
      email: String
      image: String
      location: String
      address: String
      phoneVerified: Boolean
      onboardingCompleted: Boolean

      banner: String
    ): UpdateUserResponse

    updateUsername(username: String!): UpdateUserResponse

    deleteUser(id: ID!): Boolean
  }
`;

export interface UserProfileInput {
  name: string | null;
  email: string | null;
  image: string | null;
  location: string | null;
  address: string | null;
  phoneVerified: boolean | null;
  onboardingCompleted: boolean | null;
  shopname: string | null;
  shoptextfont: string | null;
  shoptextcolor: string | null;
  banner: string | null;
  username: string | null;
}
