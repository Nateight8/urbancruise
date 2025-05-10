"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = __importDefault(require("@/graphql/resolvers/index.js"));
const index_js_2 = __importDefault(require("@/graphql/typeDefs/index.js"));
const express_2 = require("@auth/express");
const auth_config_js_1 = require("@/config/auth.config.js");
const auth_middleware_js_1 = require("@/middleware/auth.middleware.js");
const index_js_3 = require("@/db/index.js");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
};
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// Set session in res.locals
app.use(auth_middleware_js_1.currentSession);
// Create a PubSub instance
const pubsub = new graphql_subscriptions_1.PubSub();
// Create executable schema
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: index_js_2.default,
    resolvers: index_js_1.default,
});
// Set up ExpressAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
app.use("/api/auth/*", (0, express_2.ExpressAuth)(auth_config_js_1.authConfig));
// Set up WebSocket server for subscriptions
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
// Set up WebSocket server
const serverCleanup = (0, ws_2.useServer)({
    schema,
    context: async (ctx) => {
        // Get session from connection params if available
        const session = ctx.connectionParams?.session || null;
        return { session, db: index_js_3.db, pubsub };
    },
}, wsServer);
// Create Apollo Server
const server = new server_1.ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
    app.use("/graphql", (0, cors_1.default)(corsOptions), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => {
            const session = res.locals.session || null;
            console.log("session:", session);
            return { db: index_js_3.db, session, pubsub };
        },
    }));
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    console.log(`🔌 WebSocket server ready at ws://localhost:4000/graphql/ws`);
}
startServer();
