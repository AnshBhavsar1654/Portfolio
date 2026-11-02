import { quotes } from "@/content/quote";

// Both quotes stack in one column that rides the seam between the two
// athlete prints (Dhoni left, Messi right). Slightly smaller type than a
// single-quote layout so the stack still fits a viewport; the empty pin
// with data-backdrop="quoteMessi" that lights the right print lives in the
// section (page.tsx), not here.
// Column width and margin are calibrated, not arbitrary: the quotes render
// left-aligned, so the visible ink leans left inside a plain centered half
// column. 46% width with a 29% margin puts each quote's ink center on the
// page seam between the two athlete prints (measured at lg, 1168px content
// row). Recalibrate if the display sizes or fonts change.
export function QuoteBlock() {
  return (
    <div className="space-y-24 lg:ml-[29%] lg:w-[46%] lg:space-y-28">
      {quotes.map((q) => (
        <figure key={q.author}>
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
      ))}
    </div>
  );
}
