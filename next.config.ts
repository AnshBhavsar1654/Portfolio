import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { NextConfig } from "next";

// The resume dialog loads PDF.js from public/pdfjs, copied there by
// scripts/sync-pdfjs.mjs. The version goes into the URL so an upgrade can
// never pair a cached module with a newer worker.
const requireFromRoot = createRequire(path.join(process.cwd(), "package.json"));
const pdfjsPackage = JSON.parse(
  readFileSync(requireFromRoot.resolve("pdfjs-dist/package.json"), "utf8")
) as { version: string };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PDFJS_VERSION: pdfjsPackage.version,
  },
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
