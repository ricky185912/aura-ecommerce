import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all domains for prototyping purposes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optional: Disable image optimization for faster prototyping
  // unoptimized: true,
};

export default nextConfig;