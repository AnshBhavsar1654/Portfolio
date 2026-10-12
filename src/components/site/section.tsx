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

// Eyebrow reads like a scorecard header: "01 / About". Accent word is set in
// the display serif italic, one per heading.
export function SectionHeading({
  title,
  accent,
  body,
  index,
  label,
}: {
  title: string;
  accent?: string;
  body?: string;
  index?: string;
  label?: string;
}) {
  return (
    <div>
      {index || label ? (
        <p className="text-muted mb-6 flex items-center gap-3 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
          {index ? <span className="text-accent">{index}</span> : null}
          <span aria-hidden className="bg-line h-px w-10" />
          {label ? <span>{label}</span> : null}
        </p>
      ) : null}
      <h2 className="text-strong max-w-[20ch] text-4xl leading-[1.02] font-semibold tracking-tighter text-balance md:text-6xl">
        {title}
        {accent ? (
          <span className="accent-serif text-accent text-[1.12em]">
            {" "}
            {accent}
          </span>
        ) : null}
      </h2>
      {body ? (
        <p className="text-muted mt-5 max-w-[56ch] text-base leading-relaxed">
          {body}
        </p>
      ) : null}
    </div>
  );
}
