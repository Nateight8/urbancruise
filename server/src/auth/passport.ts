import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import "dotenv/config";
import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { Snowflake } from "@theinternetfolks/snowflake";

export function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.AUTH_GOOGLE_ID || "",
        clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:4000/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback
      ) => {
        try {
          // Find user by Google profile id
          const googleId = profile.id;
          const existingUser = await db.query.users.findFirst({
            where: (u) => eq(u.id, googleId),
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          // Create new user with required fields
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(new Error("No email found in Google profile"));

          const newUser = {
            id: googleId,
            name: profile.displayName,
            email,
            image: profile.photos?.[0]?.value,
            participantId: Snowflake.generate(),
            // Optional fields are left undefined
          };

          await db.insert(users).values(newUser);

          // Fetch and return the created user
          const createdUser = await db.query.users.findFirst({
            where: (u) => eq(u.id, googleId),
          });

          return done(null, createdUser);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser(
    (user: Express.User, done: (err: any, id?: unknown) => void) => {
      done(null, user);
    }
  );

  passport.deserializeUser(
    (
      obj: Express.User,
      done: (err: any, user?: Express.User | false | null) => void
    ) => {
      done(null, obj);
    }
  );

  return passport;
}
