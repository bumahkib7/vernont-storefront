import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Proxy /api/proxy/* to the backend so auth cookies are same-origin (fixes mobile Safari)
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/files/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "*.runixcloud.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.workers.dev",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/fragrances",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/fragrances/:path*",
        destination: "/eyewear/:path*",
        permanent: true,
      },
      {
        source: "/fragrance-quiz",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/quiz",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/face-shape-guide",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/lens-guide",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/compare",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/discover",
        destination: "/eyewear",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
