import type { NextConfig } from "next";

// A plain static site: `next build` writes finished HTML, CSS and JS to ./out,
// which Cloudflare serves as static files. Live availability comes from BedSync.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
