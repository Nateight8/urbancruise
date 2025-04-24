"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.userTypeDefs = (0, graphql_tag_1.gql) `
  type UpdateUserResponse {
    success: Boolean!
    message: String
    user: User
  }

  """
  User type with minimal fields needed for conversation creation
  """
  type User {
    id: ID!
    name: String
    email: String
    emailVerified: String
    image: String
    location: String
    address: String
    phoneVerified: Boolean
    onboardingCompleted: Boolean
    banner: String
    username: String
    createdAt: String
    updatedAt: String
    participantId: String
  }

  type GetLoggedInUserReturn {
    status: Int
    user: User
  }

  type GetAllUsersResponse {
    status: Int
    users: [User!]!
  }

  type LoggedInUserResponse {
    user: User
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
