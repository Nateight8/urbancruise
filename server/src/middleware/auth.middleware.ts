// @ts-nocheck
<<<<<<< HEAD
// import { getSession } from "@auth/express";
import { authConfig } from "../config/auth.config.js";
import type { NextFunction, Request, Response } from "express";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
=======
import { getSession } from "@auth/express";
import { authConfig } from "../config/auth.config.js";
import type { NextFunction, Request, Response } from "express";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
>>>>>>> origin/main
import { db } from "../db/index.js";

//here for authentication
export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session =
    res.locals.session ?? (await getSession(req, authConfig)) ?? undefined;

  res.locals.session = session;

  if (session) {
    return next();
  }

  res.status(401).json({ message: "Not Authenticated" });
}

//current session middleware
export async function currentSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session =
    (await getSession(req, {
<<<<<<< HEAD
      ...authConfig, //spread the config so i can configure session strategy to database
      session: { strategy: "database" }, //session strategy = database requires the adapter
      // adapter: DrizzleAdapter(db),

      //callbacks
=======
      ...authConfig,
      adapter: DrizzleAdapter(db),
      session: { strategy: "database" },
>>>>>>> origin/main
      callbacks: {
        session({ session, user }) {
          if (session.user) {
            session.user.id = user.id;
          }
          return session;
        },
      },
    })) ?? undefined;

  res.locals.session = session;
  return next();
}
