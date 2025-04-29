import { User, users } from "../../db/schema/auth.js";
import GraphqlContext from "../../types/types.utils.js";
import { eq, sql, ne } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { UserProfileInput } from "../typeDefs/user.js";

// Helper function for email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const userResolvers = {
  Query: {
    // Get logged in user
    getLoggedInUser: async (_: any, __: any, context: GraphqlContext) => {
      const { db, session } = context;
      console.log("session in resolver:", session);
      if (!session?.id) {
        console.error("User not authenticated, session data:", session);
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      try {
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.id, session.id));

        const user = userRecord[0];

        return { status: 200, user };
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new GraphQLError("Failed to fetch user", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    getAllUsers: async (_: any, __: any, { session, db }: GraphqlContext) => {
      try {
        // Create a query that conditionally excludes the logged-in user if a session exists
        const allUsers = await db.query.users.findMany({
          where: session?.id ? ne(users.id, session.id) : undefined,
        });

        return {
          status: 200,
          users: allUsers,
        };
      } catch (error) {
        console.error("Error in getAllUsers resolver:", error);
        throw new GraphQLError("Failed to fetch users", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            originalError:
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    },

    checkUsernameAvailability: async (
      _: any,
      { username }: { username: string },
      context: GraphqlContext
    ) => {
      const { db } = context;
      const lowercaseUsername = username.toLowerCase();

      const existingUser = await db.query.users.findFirst({
        where: (users) => sql`LOWER(${users.username}) = ${lowercaseUsername}`,
      });

      return !existingUser;
    },
  },

  Mutation: {
    updateUser: async (
      _: any,
      userInput: UserProfileInput,
      context: GraphqlContext
    ): Promise<{ success: boolean; message: string; user: User | null }> => {
      const { db, session } = context;

      // 1. Ensure the user is authenticated
      if (!session?.id) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const userId = session.id;

      try {
        // 2. Filter out null values and only include allowable fields
        const allowedFields = [
          "name",
          "bio",
          "displayName",
          "avatar",
          "email",
          "location",
          "address",
          "banner",
          "username",
          "image",
        ];

        const filteredInput = Object.fromEntries(
          Object.entries(userInput).filter(
            ([key, value]) => value !== null && allowedFields.includes(key)
          )
        );

        // 3. Validate critical fields if present
        if (filteredInput.email && !isValidEmail(filteredInput.email)) {
          throw new GraphQLError("Invalid email format", {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 400 },
            },
          });
        }

        // 4. Update user and return the result
        // Update the user
        await db.update(users).set(filteredInput).where(eq(users.id, userId));

        // Get the updated user
        const updatedUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!updatedUser[0]) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT_FOUND",
              http: { status: 404 },
            },
          });
        }

        return {
          success: true,
          message: "User updated successfully",
          user: updatedUser[0],
        };
      } catch (error) {
        console.error("Update User Error:", error);
        const status =
          error instanceof GraphQLError &&
          "http" in (error.extensions || {}) &&
          typeof error.extensions.http === "object" &&
          error.extensions.http !== null &&
          "status" in error.extensions.http
            ? (error.extensions.http as { status: number }).status
            : 500;

        throw new GraphQLError(
          error instanceof GraphQLError
            ? error.message
            : "Failed to update user",
          {
            extensions: {
              code:
                error instanceof GraphQLError
                  ? error.extensions.code
                  : "INTERNAL_SERVER_ERROR",
              http: { status },
              originalError:
                error instanceof Error ? error.message : String(error),
            },
          }
        );
      }
    },

    //update username
    updateUsername: async (
      _: any,
      { username }: { username: string },
      context: GraphqlContext
    ) => {
      const { session, db } = context;

      const lowercaseUsername = username.toLowerCase();

      if (!session?.id) {
        return {
          success: false,
          message: "Not authenticated",
          user: null,
        };
      }

      try {
        // Check if username is already taken using case-insensitive comparison
        const existingUser = await db.query.users.findFirst({
          where: (u) => sql`LOWER(${u.username}) = ${lowercaseUsername}`,
        });

        if (existingUser) {
          return {
            success: false,
            message: "Username already taken",
            user: null,
          };
        }

        // Get the user's current record
        const currentUser = await db.query.users.findFirst({
          where: (u) => eq(u.email, session.email as string),
        });

        if (!currentUser) {
          return {
            success: false,
            message: "User not found",
            user: null,
          };
        }

        // Use direct update with imported users table and eq from drizzle-orm
        const [updatedUser] = await db
          .update(users)
          .set({
            username: lowercaseUsername,
            onboardingCompleted: true,
          })
          .where(eq(users.email, session.email as string))
          .returning();

        return {
          success: true,
          message: "Username updated successfully",
          user: updatedUser,
        };
      } catch (error) {
        console.error("Update username error:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "An error occurred",
          user: null,
        };
      }
    },

    /**
     * Deletes the currently authenticated user and all their associated data.
     * This operation triggers cascade deletion in the database for:
     * - OAuth accounts
     * - Sessions
     * - Authenticators
     * - Verification sessions
     * - Conversation participants
     * - Messages
     *
     * @returns {Promise<boolean>} True if deletion was successful
     * @throws {GraphQLError} If user is not authenticated or deletion fails
     */
    deleteUser: async (
      _: any,
      __: any,
      context: GraphqlContext
    ): Promise<boolean> => {
      const { db, session } = context;

      // Ensure user is authenticated before proceeding
      if (!session?.id) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      try {
        // Delete user record - cascade deletion will handle related records
        await db.delete(users).where(eq(users.id, session.id));
        return true;
      } catch (error) {
        // Log error for debugging and throw user-friendly error
        console.error("Delete user error:", error);
        throw new GraphQLError("Failed to delete user", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
  },
};
export default userResolvers;
