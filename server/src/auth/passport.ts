import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import "dotenv/config";

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
        // TODO: Find or create user in your DB here if desired
        // For now, just use the Google profile
        return done(null, profile);
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
