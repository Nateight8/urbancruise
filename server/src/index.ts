import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { NextFunction } from "express";
import http from "http";
import cors from "cors";
import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs/index.js";
<<<<<<< HEAD
=======
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./config/auth.config.js";
import { currentSession } from "./middleware/auth.middleware.js";
>>>>>>> origin/main
import { db } from "./db/index.js";
import { PubSub } from "graphql-subscriptions";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
<<<<<<< HEAD
import type { CorsOptions, CorsRequest } from "cors";
// --- Modular auth imports ---
import { setupPassport } from "./auth/passport.js";
import { registerAuthRoutes } from "./auth/routes.js";
import passport from "passport";
import session from "express-session";
import "dotenv/config";
=======
>>>>>>> origin/main

interface MyContext {
  token?: String;
}

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  ...process.env
    .CORS_ORIGINS!.split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean),
  "https://studio.apollographql.com", // Allow Apollo Sandbox
  "http://localhost:4000", // Allow local development
  "http://localhost:3000", // Allow local frontend
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin); // Add logging for debugging
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();

// Trust proxy in production for correct cookie handling
if (isProduction) {
  app.set("trust proxy", 1);
}

const httpServer = http.createServer(app);

// --- Auth setup ---
setupPassport();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // Change in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // true in production (HTTPS)
      sameSite: isProduction ? "none" : "lax", // 'none' for cross-site in prod, 'lax' for dev
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
registerAuthRoutes(app);

// Create a PubSub instance
const pubsub = new PubSub();

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Set up WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Set up WebSocket server
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: { connectionParams?: { session?: any } }) => {
      // Get session from connection params if available
      const session = ctx.connectionParams?.session || null;
      return { session, db, pubsub };
    },
  },
  wsServer
);

// Create Apollo Server
const server = new ApolloServer<MyContext>({
  schema,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Only apply CORS, express.json, etc. to /graphql
async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
<<<<<<< HEAD
      context: async ({ req, res }) => {
        const session = req.user || null;
        console.log("session from index.ts:", session);
=======
      context: async ({
        req,
        res,
      }: {
        req: express.Request;
        res: express.Response;
      }) => {
        const session = res.locals.session || null;

        console.log("session:", session);
>>>>>>> origin/main
        return { db, session, pubsub };
      },
    })
  );

  const port = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`🔌 WebSocket server ready at ws://localhost:${port}/graphql/ws`);
}

startServer();
