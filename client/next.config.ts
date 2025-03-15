import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "scontent.cdninstagram.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
