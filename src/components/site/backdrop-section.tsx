import type { ReactNode } from "react";
import type { ArtKey } from "@/content/art";
import { cn } from "@/lib/cn";

// A full-height section on the plain ink ground; whitespace alone separates
// sections. Only the quote section carries halftone prints: it passes `print`,
// which marks the stage's print (data-backdrop) and adds a page-coloured halo
// (see .halo) so text directly on the print still reads.
export function BackdropSection({
  id,
  backdrop,
  print,
  className,
  children,
}: {
  id?: string;
  backdrop?: ArtKey | "none";
  print?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-backdrop={backdrop}
      className="relative scroll-mt-16 px-4"
    >
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-center py-24 md:py-32",
          print && "halo",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
