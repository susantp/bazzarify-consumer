import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.0.2.2", "consumer.bazzarify.local", "consumer.bazzarify.com", "bazzarify.local", "www.bazzarify.local"],
    typedRoutes: true,
};

export default nextConfig;
