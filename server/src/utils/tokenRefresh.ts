import axios from "axios";
import { InstagramTokenResponse } from "../types/types.utils.js";

export const refreshToken = async (
  token: string
): Promise<InstagramTokenResponse> => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );

  return refresh_token.data;
};
