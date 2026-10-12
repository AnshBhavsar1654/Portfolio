import { quote } from "@/content/quote";

// A pause between the work and the ask: one line, set large in the display
// serif, credited in mono like a scorecard footnote.
export function QuoteBlock() {
  return (
    <figure className="relative mx-auto max-w-4xl text-center">
      <span
        aria-hidden
        className="accent-serif text-accent/20 pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 text-[12rem] leading-none select-none md:-top-28 md:text-[16rem]"
      >
        &ldquo;
      </span>
      <blockquote className="relative">
        <p className="accent-serif text-strong text-4xl leading-[1.08] text-balance md:text-7xl">
          {quote.text}
        </p>
      </blockquote>
      <figcaption className="text-muted mt-8 flex items-center justify-center gap-3 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
        <span aria-hidden className="bg-accent h-px w-10" />
        {quote.author}
        <span aria-hidden className="bg-accent h-px w-10" />
      </figcaption>
    </figure>
  );
}
