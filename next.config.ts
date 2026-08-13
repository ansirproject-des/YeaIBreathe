import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "img.clerk.com",
    },
    {
      protocol: "https",
      hostname: "my-space-post-images.s3.eu-north-1.amazonaws.com",
    },
  ],
},

  allowedDevOrigins: ["192.168.31.222"],

};

export default withNextIntl(nextConfig);