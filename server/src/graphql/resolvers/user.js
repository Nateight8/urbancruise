"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@/db/schema/auth");
const drizzle_orm_1 = require("drizzle-orm");
const graphql_1 = require("graphql");
const snowflake_1 = require("@theinternetfolks/snowflake");
const userResolvers = {
    Query: {
        // Get logged in user
        getLoggedInUser: async (_, __, context) => {
            const { db, session } = context;
            const { user: loggedInUser } = session;
            if (!loggedInUser?.id) {
                console.error("User not authenticated, session data:", session);
                throw new graphql_1.GraphQLError("Not authenticated", {
                    extensions: {
                        code: "UNAUTHORIZED",
                    },
                });
            }
            try {
                const userRecord = await db
                    .select()
                    .from(auth_1.users)
                    .where((0, drizzle_orm_1.eq)(auth_1.users.id, loggedInUser.id));
                const user = userRecord[0];
                return { status: 200, user };
            }
            catch (error) {
                console.error("Error fetching user:", error);
                throw new graphql_1.GraphQLError("Failed to fetch user", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                    },
                });
            }
        },
        getAllUsers: async (_, __, { session, db }) => {
            try {
                // Create a query that conditionally excludes the logged-in user if a session exists
                const allUsers = await db.query.users.findMany({
                    where: session?.user?.id ? (0, drizzle_orm_1.ne)(auth_1.users.id, session.user.id) : undefined,
                });
                return {
                    status: 200,
                    users: allUsers,
                };
            }
            catch (error) {
                console.error("Error in getAllUsers resolver:", error);
                throw new graphql_1.GraphQLError("Failed to fetch users", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        originalError: error instanceof Error ? error.message : "Unknown error",
                    },
                });
            }
        },
        checkUsernameAvailability: async (_, { username }, context) => {
            const { db } = context;
            const lowercaseUsername = username.toLowerCase();
            const existingUser = await db.query.users.findFirst({
                where: (users) => (0, drizzle_orm_1.sql) `LOWER(${users.username}) = ${lowercaseUsername}`,
            });
            return !existingUser;
        },
    },
    Mutation: {
        updateUser: async (_, userInput, context) => {
            const { db, session } = context;
            // 1. Ensure the user is authenticated
            if (!session || !session.user?.id) {
                throw new graphql_1.GraphQLError("Not authenticated", {
                    extensions: {
                        code: "UNAUTHENTICATED",
                        http: { status: 401 },
                    },
                });
            }
            const userId = session.user.id;
            try {
                // 2. Check if the user exists
                const existingUser = await db
                    .select()
                    .from(auth_1.users)
                    .where((0, drizzle_orm_1.eq)(auth_1.users.id, userId))
                    .limit(1);
                if (existingUser.length === 0) {
                    throw new graphql_1.GraphQLError("User not found", {
                        extensions: {
                            code: "NOT_FOUND",
                            http: { status: 404 },
                        },
                    });
                }
                if (userInput.username &&
                    userInput.username.toLowerCase() ===
                        existingUser[0].username?.toLowerCase()) {
                    return {
                        success: false,
                        message: "Your username is already set as " + userInput.username,
                        user: existingUser[0],
                    };
                }
                // 3. Update user with only the provided fields
                const filteredInput = Object.fromEntries(Object.entries(userInput).filter(([_, v]) => v !== null));
                await db.update(auth_1.users).set(filteredInput).where((0, drizzle_orm_1.eq)(auth_1.users.id, userId));
                // 4. Fetch updated user
                const updatedUser = await db
                    .select()
                    .from(auth_1.users)
                    .where((0, drizzle_orm_1.eq)(auth_1.users.id, userId))
                    .limit(1);
                return {
                    success: true,
                    message: "User updated successfully",
                    user: updatedUser[0],
                };
            }
            catch (error) {
                console.error("Update User Error:", error);
                throw new graphql_1.GraphQLError("Failed to update user", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: { status: 500 },
                        originalError: error instanceof Error ? error.message : String(error),
                    },
                });
            }
        },
        //update username
        updateUsername: async (_, { username }, context) => {
            const { session, db } = context;
            const lowercaseUsername = username.toLowerCase();
            if (!session || !session.user) {
                return {
                    success: false,
                    message: "Not authenticated",
                    user: null,
                };
            }
            try {
                // Check if username is already taken using case-insensitive comparison
                const existingUser = await db.query.users.findFirst({
                    where: (u) => (0, drizzle_orm_1.sql) `LOWER(${u.username}) = ${lowercaseUsername}`,
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
                    where: (u) => (0, drizzle_orm_1.eq)(u.email, session.user.email),
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
                    .update(auth_1.users)
                    .set({
                    username: lowercaseUsername,
                    onboardingCompleted: true,
                    participantId: snowflake_1.Snowflake.generate(),
                })
                    .where((0, drizzle_orm_1.eq)(auth_1.users.email, session.user.email))
                    .returning();
                return {
                    success: true,
                    message: "Username updated successfully",
                    user: updatedUser,
                };
            }
            catch (error) {
                console.error("Update username error:", error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "An error occurred",
                    user: null,
                };
            }
        },
        // Delete a user
        deleteUser: async (_, { id }) => {
            // Implement logic to delete a user from the database
            return true;
        },
    },
};
exports.default = userResolvers;
