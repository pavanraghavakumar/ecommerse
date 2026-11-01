import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Prisma client and its query engine must stay outside the bundler.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
