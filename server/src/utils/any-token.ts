// import axios from "axios";
// //not being used for niow
// interface RefreshTokenParams {
//   platform: "instagram" | "twitter" | "facebook" | "google"; // Expand as needed
//   token: string;
// }

// export const refreshToken = async ({ platform, token }: RefreshTokenParams) => {
//   let refreshUrl = "";
//   const refreshParams: any = { access_token: token };

//   // Define platform-specific URL and parameters
//   switch (platform) {
//     case "instagram":
//       refreshUrl = `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token`;
//       refreshParams.grant_type = "ig_refresh_token";
//       break;

//     case "twitter":
//       refreshUrl = `${process.env.TWITTER_BASE_URL}/oauth2/token`;
//       refreshParams.grant_type = "refresh_token"; // Adjust according to Twitter's OAuth flow
//       break;

//     case "facebook":
//       refreshUrl = `${process.env.FACEBOOK_BASE_URL}/oauth/access_token`;
//       refreshParams.grant_type = "fb_refresh_token";
//       break;

//     case "google":
//       refreshUrl = `${process.env.GOOGLE_BASE_URL}/token`;
//       refreshParams.grant_type = "refresh_token";
//       break;

//     default:
//       throw new Error("Unsupported platform");
//   }

//   try {
//     const response = await axios.get(refreshUrl, { params: refreshParams });
//     return response.data; // Returns the refreshed token
//   } catch (error) {
//     console.error("Error refreshing token for", platform, ":", error);
//     throw new Error("Failed to refresh token");
//   }
// };
