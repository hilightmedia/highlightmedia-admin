import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
    images: {
    remotePatterns: [{
        protocol: 'https',
        hostname: 'highlightmediadev.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
     ],
  },
};

export default nextConfig;
