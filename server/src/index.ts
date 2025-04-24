import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { NextFunction } from "express";
import http from "http";
import cors from "cors";
import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs/index.js";
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./config/auth.config.js";
import { currentSession } from "./middleware/auth.middleware.js";
import { db } from "./db/index.js";
import { PubSub } from "graphql-subscriptions";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

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

// Create a PubSub instance
const pubsub = new PubSub();

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Set up ExpressAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
app.use("/api/auth/*", ExpressAuth(authConfig));

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

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({
        req,
        res,
      }: {
        req: express.Request;
        res: express.Response;
      }) => {
        const session = res.locals.session || null;

        console.log("session:", session);
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
