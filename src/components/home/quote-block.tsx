import { quotes } from "@/content/quote";

export function QuoteBlock() {
  return (
    <div className="mx-auto grid w-2/3 max-w-xl gap-8 text-center md:gap-12">
      {quotes.map((quote) => (
        <figure key={quote.art} className="grid gap-3 md:gap-4">
          <blockquote>
            <p className="accent-serif text-strong text-2xl leading-[1.1] text-balance sm:text-4xl md:text-5xl">
              &ldquo;{quote.text}&rdquo;
            </p>
          </blockquote>
          <figcaption className="text-body flex items-center justify-center gap-2 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
            <span aria-hidden className="h-px w-4 bg-current" />
            {quote.author}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
