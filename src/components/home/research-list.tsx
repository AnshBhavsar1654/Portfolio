import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { publications } from "@/content/research";

// Result first: the headline number sits in its own column so the list
// scans like a results table, not like a bibliography.
export function ResearchList() {
  return (
    <ul className="divide-line divide-y">
      {publications.map((p) => (
        <li
          key={p.title}
          className="grid gap-x-10 gap-y-3 py-8 first:pt-0 md:grid-cols-[200px_1fr_auto] md:items-start"
        >
          <div>
            <p className="text-strong text-5xl font-semibold tracking-tighter tabular-nums">
              {p.metric.value}
            </p>
            <p className="text-muted mt-1 font-mono text-xs">
              {p.metric.label}
            </p>
          </div>
          <div>
            <p className="text-muted font-mono text-xs">{p.venue}</p>
            <h3 className="text-strong mt-1.5 max-w-[60ch] text-xl leading-snug font-semibold tracking-tight text-balance">
              {p.title}
            </h3>
            <p className="text-body mt-3 max-w-[64ch] text-[15px] leading-relaxed">
              {p.detail}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="bg-surface-2 text-muted rounded-md px-2.5 py-1 font-mono text-[11px]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.title} on IEEE Xplore (opens in new tab)`}
            className="text-accent inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:underline"
          >
            IEEE Xplore <ArrowUpRight size={14} weight="bold" />
          </a>
        </li>
      ))}
    </ul>
  );
}
