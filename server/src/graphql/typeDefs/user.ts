import { gql } from "graphql-tag";

export const userTypeDefs = gql`
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
    shopname: String
    shoptextfont: String
    shoptextcolor: String
    banner: String

  }

  type GetLoggedInUserReturn {
    status: Int
    user: User
  }

  type Query {
    getLoggedInUser: GetLoggedInUserReturn
    listUsers: [User]
  }

  type Mutation {
    updateUser(
      id: ID!
      name: String
      email: String
      image: String
      location: String
      address: String
      phoneVerified: Boolean
      onboardingCompleted: Boolean
      shopname: String
      shoptextfont: String
      shoptextcolor: String
      banner: String
    ): User

    deleteUser(id: ID!): Boolean
  }
`;
