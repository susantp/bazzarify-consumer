import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.0.2.2"],
    typedRoutes: true,
};

export default nextConfig;
