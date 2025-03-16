import { User, users } from "@/db/schema.js";
import GraphqlContext, { UserInput } from "@/types/types.utils.js";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";

const userResolvers = {
  Query: {
    // Get logged in user
    getLoggedInUser: async (_: any, __: any, context: GraphqlContext) => {
      console.log("SERVER SAYS HI");

      return { status: 200, user: null };
    },
  },

  Mutation: {
    updateUser: async (
      _: any,
      { id, userInput }: { id: string; userInput: UserInput }
    ): Promise<User | null> => {
      // Implement logic to update an existing user in the database
      return null;
    },

    // Delete a user
    deleteUser: async (_: any, { id }: { id: string }): Promise<boolean> => {
      // Implement logic to delete a user from the database
      return true;
    },
  },
};

export default userResolvers;
