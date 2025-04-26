import session from "express-session";

export function sessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET || "supersecret", // Change in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  });
}
