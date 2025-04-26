import { Express } from "express";
import passport from "passport";

export function registerAuthRoutes(app: Express) {
  // Google OAuth login
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Google OAuth callback
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      const frontendUrl =
        process.env.NODE_ENV === "production"
          ? "https://urbancruise.vercel.app"
          : "http://localhost:3000";
      res.redirect(frontendUrl);
    }
  );

  // Logout
  app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      const frontendUrl =
        process.env.NODE_ENV === "production"
          ? "https://urbancruise.vercel.app"
          : "http://localhost:3000";
      res.redirect(frontendUrl);
    });
  });

  // Debug endpoint to check session/user
  app.get("/api/me", (req, res) => {
    res.json({ user: req.user, session: req.session });
  });
}
