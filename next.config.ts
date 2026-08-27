import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-lib", "qrcode", "@vercel/blob"],
};

export default nextConfig;
