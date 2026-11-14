import type * as PdfJs from "pdfjs-dist";

// PDF.js is served from public/pdfjs by scripts/sync-pdfjs.mjs and imported at
// runtime, so it never enters the bundle and never runs during SSR. The
// versioned URL keeps the API and worker in lockstep across upgrades: both are
// copied from the same installed package and the version comes from
// next.config.ts.
const BASE = "/pdfjs";
const VERSION = process.env.NEXT_PUBLIC_PDFJS_VERSION ?? "";

const asset = (file: string) =>
  VERSION ? `${BASE}/${file}?v=${VERSION}` : `${BASE}/${file}`;

let pending: Promise<typeof PdfJs> | null = null;

// Text, font and image resources the worker fetches lazily.
export const PDF_RESOURCES = {
  cMapUrl: `${BASE}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `${BASE}/standard_fonts/`,
  wasmUrl: `${BASE}/wasm/`,
  iccUrl: `${BASE}/iccs/`,
} as const;

type PromiseScope = PromiseConstructor & {
  withResolvers?: <T>() => {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  };
};

// PDF.js 6 uses Promise.withResolvers, which Safari only shipped in 17.4.
function polyfillWithResolvers() {
  const scope = Promise as PromiseScope;
  if (typeof scope.withResolvers === "function") return;
  scope.withResolvers = <T>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

export function loadPdfJs(): Promise<typeof PdfJs> {
  pending ??= (async () => {
    polyfillWithResolvers();
    const mod = (await import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ asset("pdf.min.mjs")
    )) as typeof PdfJs;
    mod.GlobalWorkerOptions.workerSrc = asset("pdf.worker.min.mjs");
    return mod;
  })().catch((error: unknown) => {
    // A blocked or failed load must be retryable the next time the dialog opens.
    pending = null;
    throw error;
  });

  return pending;
}
