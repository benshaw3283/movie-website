/** @type {import('next').NextConfig} */
import MillionLint from "@million/lint";
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default MillionLint.next({ rsc: true })(nextConfig);
