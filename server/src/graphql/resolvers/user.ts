import { User, users } from "@/db/schema.js";
import GraphqlContext, { UserInput } from "@/types/types.utils.js";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";

const userResolvers = {
  Query: {
    // Get logged in user
    getLoggedInUser: async (_: any, __: any, context: GraphqlContext) => {
      console.log("SERVER SAYS HI");
      const { db, session } = context;
      const { user: loggedInUser } = session;

      if (!loggedInUser?.id) {
        console.error("User not authenticated, session data:", session);
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      try {
        //will be using this when creating onboarding
        const sessionId = loggedInUser?.id;
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.id, sessionId));

        const user = userRecord[0];

        return { status: 200, user };
      } catch (error) {
        console.error("Error fetching user:", error);
        // Throw an error with appropriate details
        throw new GraphQLError("Failed to fetch user", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    // List all users
    listUsers: async (
      _: any,
      __: any,
      context: GraphqlContext
    ): Promise<User[]> => {
      const { db } = context;

      const users = await db.query.users.findMany();
      console.log(context);

      return users;
    },
  },

  Mutation: {
    // Update an existing user
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
