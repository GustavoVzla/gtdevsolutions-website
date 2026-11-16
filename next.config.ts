import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger Node.js web apps force `output: "standalone"` before building
  // (docs.hostinger.com/node.js/overview-1/next); we set it explicitly so local builds match.
  // scripts/postbuild.mjs copies public/ and .next/static into .next/standalone/.
  output: "standalone",
  images: {
    // Hostinger's docs say image optimization "works out of the box" but do not mention
    // `sharp`, and the native binary may not install on shared hosting. Serve images as-is
    // (public/ assets are already web-sized). `remotePatterns` still applies: it is kept as the
    // allowlist of remote hosts and is used again if this flag is removed.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // catalogo.gtdevsolutions.com (old Vercel project "prototipos") is redirected in hPanel to
        // /catalogo. If that redirect keeps the path, old deep links arrive as
        // /catalogo/01_web/x.html: send them to the same prototype under /prototipos.
        source: "/catalogo/:path+",
        destination: "/prototipos/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
