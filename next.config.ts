import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "property-information/find": "property-information/lib/find.js",
      "property-information/normalize": "property-information/lib/normalize.js",
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "property-information/find": path.resolve(__dirname, "node_modules/property-information/lib/find.js"),
      "property-information/normalize": path.resolve(__dirname, "node_modules/property-information/lib/normalize.js"),
    };
    return config;
  },
};

export default nextConfig;
