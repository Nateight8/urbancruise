"use client";

import { gql, useApolloClient } from "@apollo/client";
export default function ApolloClientTest() {
  const client = useApolloClient();

  console.log(
    client.readQuery({
      query: GET_LOGGEDIN_USER,
    })
  );

  return <div>Test</div>;
}

const GET_LOGGEDIN_USER = gql`
  query GetLoggedInUser {
    getLoggedInUser {
      user {
        id
        username
        email
        image
      }
    }
  }
`;
