// next.config.js 또는 next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
