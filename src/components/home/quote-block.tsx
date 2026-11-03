import { quotes } from "@/content/quote";

// Two quotes, stacked (each in its own frame). Every quote carries its own
// print pin: on phones the wrappers are screen-height blocks so each athlete
// print rises and falls with its own quote; at lg the wrappers stay plain
// blocks and the two viewport pins in page.tsx drive both half-prints with
// the section's dissolve timing. The calibrated margin/width put each
// quote's ink center on the page seam between the two athlete prints
// (measured at lg, 1168px content row). Recalibrate if display sizes or
// fonts change.
export function QuoteBlock() {
  return (
    <div className="lg:ml-[29%] lg:w-[46%] lg:space-y-28">
      {quotes.map((q) => (
        <div
          key={q.author}
          data-backdrop={q.art}
          className="relative flex min-h-svh flex-col justify-center lg:min-h-0"
        >
          <figure>
            <span
              aria-hidden
              className="accent-serif text-accent/40 block text-[7rem] leading-[0.6] select-none md:text-[9rem]"
            >
              &ldquo;
            </span>
            <blockquote>
              <p className="accent-serif text-strong text-4xl leading-[1.05] text-balance md:text-6xl">
                {q.text}
              </p>
            </blockquote>
            <figcaption className="text-muted mt-8 flex items-center gap-3 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
              <span aria-hidden className="bg-accent h-px w-10" />
              {q.author}
            </figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}
