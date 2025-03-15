import Google from "@auth/express/providers/google";

//authconfig
export const authConfig = {
  trustHost: true,
  providers: [Google],
};
