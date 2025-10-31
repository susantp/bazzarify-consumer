import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.0.2.2", "consumer.bazzarify.local", "consumer.bazzarify.com", "bazzarify.local", "bazzarify.com", "www.bazzarify.local", "www.bazzarify.com"],
    typedRoutes: true,
};

export default nextConfig;
