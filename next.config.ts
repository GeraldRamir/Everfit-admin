import type { NextConfig } from "next";
import path from "path";

const reactPath = path.join(__dirname, "node_modules/react");
const reactDomPath = path.join(__dirname, "node_modules/react-dom");

const nextConfig: NextConfig = {
  // Prevent Next from treating the user-home package.json/node_modules as the monorepo root.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "http", hostname: "127.0.0.1", port: "3001" },
    ],
  },
  // Deduplicate React — a stray C:\Users\<you>\node_modules was causing
  // "Cannot read properties of null (reading 'useInsertionEffect')".
  turbopack: {
    resolveAlias: {
      react: reactPath,
      "react-dom": reactDomPath,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: reactPath,
      "react-dom": reactDomPath,
    };
    config.resolve.modules = [
      path.join(__dirname, "node_modules"),
      ...(config.resolve.modules || ["node_modules"]),
    ];
    return config;
  },
};

export default nextConfig;
