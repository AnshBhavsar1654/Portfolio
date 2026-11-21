"use client";

import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { useEffect, useRef, useState } from "react";
import type * as PdfJs from "pdfjs-dist";
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from "pdfjs-dist";
import { PDF_RESOURCES, loadPdfJs } from "@/components/site/pdfjs";
import { profile } from "@/content/profile";

type Status = "loading" | "ready" | "error";

// Rendering cap: a resume page is a document, not a photo. 2x covers every
// retina display without doubling memory again on a 3x phone.
const MAX_DPR = 2;
const MAX_PAGE_WIDTH = 960;
const RESIZE_DELAY = 160;

// Renders the resume with PDF.js instead of trusting each browser's PDF
// plugin: same output in Chrome, Firefox, Safari and every phone, real
// selectable text, and nothing fetched until the dialog actually opens.
export function ResumeViewer() {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const pages = pagesRef.current;
    if (!pages) return;

    let cancelled = false;
    let doc: PDFDocumentProxy | null = null;
    let task: PDFDocumentLoadingTask | null = null;
    let disconnect = () => {};
    let timer = 0;
    // Bumped on every render pass so a slow page from an old pass can't
    // paint over the pages of a newer one after a resize.
    let pass = 0;
    // Width the pages on screen were painted at. The observer compares
    // against this so appending a page (a height change) never triggers a
    // repaint, only an actual width change does.
    let paintedWidth = 0;

    const measure = () => {
      const width = pages.clientWidth;
      return Math.round(Math.max(240, Math.min(width || 320, MAX_PAGE_WIDTH)));
    };

    const paint = async (pdfjs: typeof PdfJs) => {
      const current = doc;
      if (!current) return;
      const run = ++pass;
      const width = measure();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      // Build the whole document off-screen and swap it in once, so pages
      // never blink away and the scroll position stays put.
      const next = document.createDocumentFragment();

      for (let number = 1; number <= current.numPages; number += 1) {
        const page = await current.getPage(number);
        if (cancelled || run !== pass) return;

        const base = page.getViewport({ scale: 1 });
        const scale = width / base.width;
        const viewport = page.getViewport({ scale });
        const pixels = page.getViewport({ scale: scale * dpr });

        const frame = document.createElement("div");
        frame.className = "resume-page";
        frame.style.width = `${viewport.width}px`;
        frame.style.height = `${viewport.height}px`;

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(pixels.width));
        canvas.height = Math.max(1, Math.floor(pixels.height));
        canvas.setAttribute("aria-hidden", "true");
        frame.append(canvas);

        const textLayer = document.createElement("div");
        textLayer.className = "resume-text-layer";
        textLayer.style.setProperty("--total-scale-factor", String(scale));
        frame.append(textLayer);

        await page.render({ canvas, viewport: pixels }).promise;
        if (cancelled || run !== pass) return;

        const layer = new pdfjs.TextLayer({
          textContentSource: page.streamTextContent(),
          container: textLayer,
          viewport,
        });
        await layer.render();
        if (cancelled || run !== pass) return;

        next.append(frame);
      }

      if (cancelled || run !== pass) return;
      pages.replaceChildren(next);
      paintedWidth = width;
      setStatus("ready");
    };

    const boot = async () => {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const loading = pdfjs.getDocument({
          url: profile.resume,
          ...PDF_RESOURCES,
        });
        task = loading;
        doc = await loading.promise;
        if (cancelled) {
          void loading.destroy();
          return;
        }

        await paint(pdfjs);
        if (cancelled) return;

        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => {
          if (cancelled) return;
          if (Math.abs(measure() - paintedWidth) < 2) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => void paint(pdfjs), RESIZE_DELAY);
        });
        observer.observe(pages);
        disconnect = () => observer.disconnect();
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void boot();

    return () => {
      cancelled = true;
      pass += 1;
      window.clearTimeout(timer);
      disconnect();
      void task?.destroy();
    };
  }, []);

  return (
    <div className="bg-surface-2/40 relative h-full">
      <div
        role="region"
        aria-label="Resume pages"
        tabIndex={0}
        className="absolute inset-0 overflow-y-auto overscroll-contain p-3 md:p-5"
      >
        <div
          ref={pagesRef}
          className="mx-auto flex w-full max-w-[960px] flex-col items-center gap-3 md:gap-4"
        />
      </div>

      {status === "loading" ? (
        <div className="bg-surface/70 absolute inset-0 flex items-center justify-center gap-3 backdrop-blur-sm">
          <span
            aria-hidden
            className="border-line border-t-accent size-6 animate-spin rounded-full border-2 motion-reduce:animate-none"
          />
          <p role="status" className="text-muted text-sm">
            Loading resume…
          </p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="bg-surface absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div>
            <p className="text-strong text-lg font-semibold tracking-tight">
              The preview couldn&rsquo;t load here
            </p>
            <p className="text-muted mt-1 max-w-sm text-sm">
              Your browser blocked the PDF renderer. The resume itself is still
              one tap away.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="border-line text-strong hover:bg-surface-2 inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase transition-colors"
            >
              <ArrowSquareOut aria-hidden size={16} />
              Open PDF
            </a>
            <a
              href={profile.resume}
              download
              className="bg-strong text-bg inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase transition-opacity hover:opacity-85"
            >
              <DownloadSimple aria-hidden size={16} />
              Download
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
