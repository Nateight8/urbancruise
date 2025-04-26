const isProd = process.env.NODE_ENV === "production";

//authconfig
export const authConfig = {
  trustHost: true,
  providers: [],
  session: {
    strategy: "database" as const,
    cookies: {
      sessionToken: {
        name: `__Secure-authjs.session-token`,
        options: {
          httpOnly: true,
          sameSite: isProd ? "none" : "lax",
          path: "/",
          secure: isProd,
          domain: undefined, // set your domain for production if needed
        },
      },
    },
  },
};
