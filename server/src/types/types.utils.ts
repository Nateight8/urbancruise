import { Session } from "@auth/express";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

export default interface GraphqlContext {
  session: Session;
  db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
  };
}

// User type interface

// Input type for createUser and updateUser
export interface UserInput {
  name?: string;
  email: string;
  image?: string;
  location?: string;
  address?: string;
  phoneVerified?: boolean;
  onboardingCompleted?: boolean;
  shopname?: string;
  shoptextfont?: string;
  shoptextcolor?: string;
  banner?: string;
}

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}
