import { quote } from "@/content/quote";

// The line sits on the right, over the dark half of the page; the speaker's
// mosaic portrait fills the left half behind it (see BackdropSection).
export function QuoteBlock() {
  return (
    <figure className="lg:ml-auto lg:w-1/2">
      <span
        aria-hidden
        className="accent-serif text-accent/40 block text-[9rem] leading-[0.6] select-none md:text-[12rem]"
      >
        &ldquo;
      </span>
      <blockquote>
        <p className="accent-serif text-strong text-5xl leading-[1.05] text-balance md:text-7xl">
          {quote.text}
        </p>
      </blockquote>
      <figcaption className="text-muted mt-8 flex items-center gap-3 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
        <span aria-hidden className="bg-accent h-px w-10" />
        {quote.author}
      </figcaption>
    </figure>
  );
}
