"use strict";
// Define the GraphQL schema
Object.defineProperty(exports, "__esModule", { value: true });
const user_js_1 = require("./user.js");
const conversation_js_1 = require("./conversation.js");
const typeDefs = [user_js_1.userTypeDefs, conversation_js_1.conversationTypeDefs];
exports.default = typeDefs;
