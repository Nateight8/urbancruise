import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { NextFunction } from "express";
import http from "http";
import cors from "cors";
import resolvers from "@/graphql/resolvers/index.js";
import typeDefs from "@/graphql/typeDefs/index.js";
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "@/config/auth.config.js";
import { currentSession } from "@/middleware/auth.middleware.js";
import { db } from "@/db/index.js";
import instagramRouter from "@/webhooks/instagram.js";

interface MyContext {
  token?: String;
}

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
};

const app = express();
const httpServer = http.createServer(app);

// Set session in res.locals
app.use(currentSession);

// Set up ExpressAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
app.use("/api/auth/*", ExpressAuth(authConfig));

// Add webhook endpoint
// app.post("/webhooks/instagram", instagramWebhookRouter);
app.use("/webhooks/instagram", instagramRouter);

console.log("Instagram Webhook Route Not Mounted");

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(corsOptions),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const session = res.locals.session || null; // Ensure fallback

      console.log("Session:", session);

      return { db, session };
    },
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
