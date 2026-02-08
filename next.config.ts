import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable the experimental React compiler to avoid requiring
  // `babel-plugin-react-compiler` during development.
  reactCompiler: false,
};

export default nextConfig;
