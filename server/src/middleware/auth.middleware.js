"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedUser = authenticatedUser;
exports.currentSession = currentSession;
// @ts-nocheck
const express_1 = require("@auth/express");
const auth_config_js_1 = require("@/config/auth.config.js");
const drizzle_adapter_1 = require("@auth/drizzle-adapter");
const index_js_1 = require("@/db/index.js");
//here for authentication
async function authenticatedUser(req, res, next) {
    const session = res.locals.session ?? (await (0, express_1.getSession)(req, auth_config_js_1.authConfig)) ?? undefined;
    res.locals.session = session;
    if (session) {
        return next();
    }
    res.status(401).json({ message: "Not Authenticated" });
}
//current session middleware
async function currentSession(req, res, next) {
    const session = (await (0, express_1.getSession)(req, {
        ...auth_config_js_1.authConfig, //spread the config so i can configure session strategy to database
        session: { strategy: "database" }, //session strategy = database requires the adapter
        adapter: (0, drizzle_adapter_1.DrizzleAdapter)(index_js_1.db),
        //callbacks
        callbacks: {
            session({ session, user }) {
                session.user.id = user.id;
                return session;
            },
        },
    })) ?? undefined;
    res.locals.session = session; //sets session to res.locals.session, this is how we get the session
    return next();
}
