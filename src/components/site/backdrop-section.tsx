import type { ReactNode } from "react";
import { art, type Art, type ArtKey } from "@/content/art";
import { cn } from "@/lib/cn";

// A full-height section that sits in front of the BackdropStage. It only
// marks which print the stage should show (data-backdrop) and carries that
// print's caption and licence credit; the stage does the drawing and the
// crossfades between sections. Text directly on the print gets a
// page-coloured halo (see .halo) so it reads in either theme.
export function BackdropSection({
  id,
  backdrop,
  className,
  children,
}: {
  id?: string;
  backdrop: ArtKey;
  className?: string;
  children: ReactNode;
}) {
  const { caption, credit }: Art = art[backdrop];
  return (
    <section id={id} data-backdrop={backdrop} className="relative scroll-mt-16">
      <div
        className={cn(
          "halo relative z-10 mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-center px-4 py-24 md:py-32",
          className
        )}
      >
        {children}
      </div>
      {caption || credit ? (
        <p className="glass text-muted border-line absolute bottom-4 left-4 z-10 rounded-full border px-3 py-1 font-mono text-[11px]">
          {caption}
          {caption && credit ? " · " : null}
          {credit ? (
            <a
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-strong underline-offset-4 hover:underline"
            >
              {credit.text}
            </a>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
