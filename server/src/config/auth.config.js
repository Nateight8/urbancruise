"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const google_1 = __importDefault(require("@auth/express/providers/google"));
//authconfig
exports.authConfig = {
    trustHost: true,
    providers: [google_1.default],
};
