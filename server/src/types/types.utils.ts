import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema/index.js";
import { PubSub } from "graphql-subscriptions";

export default interface GraphqlContext {
  session: Session;
  db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
  };
  pubsub: PubSub;
}

// User type interface

// Input type for createUser and updateUser

// If you need a Session type, define it here for Passport.js:
export interface Session {
  id: string;
  email: string;
  name?: string;
  image?: string;
  // Add any other fields you expect from the user object
}
