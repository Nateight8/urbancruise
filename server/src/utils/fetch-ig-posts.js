"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchInstagramPosts = void 0;
const graphql_1 = require("graphql");
const fetchInstagramPosts = async (token) => {
    try {
        const response = await fetch(`${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${token}`);
        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching Instagram posts:", error);
        throw new graphql_1.GraphQLError("Failed to fetch Instagram posts", {
            extensions: {
                code: "EXTERNAL_API_ERROR",
                errorDetails: error,
            },
        });
    }
};
exports.fetchInstagramPosts = fetchInstagramPosts;
