import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
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
        destination: "/face-shape-guide",
        permanent: true,
      },
      {
        source: "/quiz",
        destination: "/face-shape-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
