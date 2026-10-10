import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Sections are separated by a single hairline inside the container, so the
// page reads as one continuous column rather than floating blocks.
export function Section({
  id,
  className,
  children,
  first,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-4"
    >
      <div
        className={cn(
          "py-20 md:py-28",
          !first && "border-line border-t",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  accent,
  body,
}: {
  title: string;
  accent?: string;
  body?: string;
}) {
  return (
    <div>
      <h2 className="text-strong max-w-[20ch] text-3xl leading-[1.08] font-semibold tracking-tight text-balance md:text-5xl">
        {title}
        {accent ? <span className="text-accent"> {accent}</span> : null}
      </h2>
      {body ? (
        <p className="text-muted mt-4 max-w-[56ch] text-base leading-relaxed">
          {body}
        </p>
      ) : null}
    </div>
  );
}
