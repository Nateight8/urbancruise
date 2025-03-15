import { GraphQLError } from "graphql";

export const fetchInstagramPosts = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${token}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw new GraphQLError("Failed to fetch Instagram posts", {
      extensions: {
        code: "EXTERNAL_API_ERROR",
        errorDetails: error,
      },
    });
  }
};
