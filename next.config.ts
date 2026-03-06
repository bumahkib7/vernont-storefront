import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
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
