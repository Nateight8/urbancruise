import NextAuth from "next-auth";
// import resend from "next-auth/providers/resend";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
// import passkey from "next-auth/providers/passkey";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/schema";

// import { drizzleAdapter } from "../adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db), //REMINDER: will be using adapter when setting up passkey

  providers: [
    google,
    github,
    // passkey,
  ],

  session: {
    strategy: "database",
  },

  secret: process.env.AUTH_SECRET,

  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
  },

  // experimental: { enableWebAuthn: true },

  // pages: {
  //   error: "/en/auth/error",
  //   signIn: "/en/auth/error",
  //   verifyRequest: "/en/auth/verify",
  // },
});
