import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/work/:slug",
        permanent: true,
      },
      { source: "/resume", destination: "/Ansh_Resume.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
