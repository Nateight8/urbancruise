"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const user_js_1 = __importDefault(require("./user.js"));
const conversation_js_1 = require("./conversation.js");
const participants_js_1 = require("./participants.js");
// import listenersResolvers from "./listeners.js";
const resolvers = (0, lodash_merge_1.default)({}, user_js_1.default, conversation_js_1.conversationResolvers, participants_js_1.participantsResolvers);
exports.default = resolvers;
