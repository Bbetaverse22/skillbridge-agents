import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "property-information/find": "property-information/lib/find.js",
      "property-information/normalize": "property-information/lib/normalize.js",
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "property-information/find": "property-information/lib/find.js",
      "property-information/normalize": "property-information/lib/normalize.js",
    };
    return config;
  },
};

export default nextConfig;
