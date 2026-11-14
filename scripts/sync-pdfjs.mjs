// Copies the PDF.js runtime the resume dialog loads on demand into public/.
// Serving it as a static asset keeps the bundler out of it entirely: no worker
// plumbing, no SSR guards, and the worker can never drift out of step with the
// API because both come from the same installed package.
//
// Runs from postinstall, predev and prebuild. The output is gitignored.
import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const pkgPath = require.resolve("pdfjs-dist/package.json");
const pkgDir = path.dirname(pkgPath);
const { version } = JSON.parse(readFileSync(pkgPath, "utf8"));

const outDir = path.join(process.cwd(), "public", "pdfjs");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Legacy build: same renderer, polyfilled for older browsers.
const singleFiles = [
  ["legacy/build/pdf.min.mjs", "pdf.min.mjs"],
  ["legacy/build/pdf.worker.min.mjs", "pdf.worker.min.mjs"],
];

for (const [from, to] of singleFiles) {
  cpSync(path.join(pkgDir, from), path.join(outDir, to));
}

// Fetched by the worker only when a document needs them (fonts, CJK maps,
// image codecs), so they cost nothing until they are actually used.
const assetDirs = ["cmaps", "standard_fonts", "wasm", "iccs"];

for (const dir of assetDirs) {
  cpSync(path.join(pkgDir, dir), path.join(outDir, dir), {
    recursive: true,
    filter: (src) => !src.endsWith(".map"),
  });
}

console.log(`pdfjs ${version} copied to public/pdfjs`);
