import type { ReactNode } from "react";

// Safari-style window around a project preview: traffic-light dots, a
// disabled-looking address bar naming the site, and the preview as the page.
// Chrome is real HTML (not SVG) so the site name stays readable at card size.
// The screen is a size container so a child can scale to its width.

export function siteName(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line bg-surface-2 flex h-full w-full flex-col overflow-hidden border">
      <div className="border-line flex h-(--space-6) shrink-0 items-center gap-(--space-3) border-b px-(--space-3)">
        <span aria-hidden className="flex gap-(--space-1)">
          <span className="bg-line size-(--space-2) rounded-full" />
          <span className="bg-line size-(--space-2) rounded-full" />
          <span className="bg-line size-(--space-2) rounded-full" />
        </span>
        <span className="bg-bg text-muted mx-auto flex h-(--space-5) max-w-[70%] min-w-0 flex-1 items-center justify-center truncate px-(--space-3) font-mono text-(length:--text-caption-s)">
          {url}
        </span>
        {/* Mirrors the dots so the address bar stays centred. */}
        <span aria-hidden className="w-(--space-6) shrink-0" />
      </div>
      <div className="@container relative min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
