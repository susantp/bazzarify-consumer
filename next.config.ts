import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	cacheComponents: true,
	allowedDevOrigins: ["*.bazzarify.local", "*.bazzarify.com", "*.larashops.local"],
	typedRoutes: true,
};

export default nextConfig;
