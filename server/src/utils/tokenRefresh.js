"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const axios_1 = __importDefault(require("axios"));
const refreshToken = async (token) => {
    const refresh_token = await axios_1.default.get(`${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
    return refresh_token.data;
};
exports.refreshToken = refreshToken;
