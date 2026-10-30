import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import Link from "next/link";
import { Spotlight } from "@/components/site/spotlight";
import { projects, type Project } from "@/content/projects";

// Text-forward showcase: type and proof instead of screenshot chrome. Each
// row keeps the scorecard treatment — a mono proof line with metric values
// picked out, a serif index in the corner, an inline mono tech cloud (the
// pill chips are retired), and a slim action row. Previews live one click
// deeper on the detail page, which also keeps lazy iframes off the home
// page. Rows read top-down like a story: proof, title, summary, actions.

function Proof({ values }: { values: Project["metrics"] }) {
  return (
    <p className="flex flex-wrap gap-y-1 font-mono text-[12px]">
      {values.map((m, i) => (
        <span
          key={m.label}
          className={
            i < values.length - 1
              ? "after:mx-2.5 after:content-['·']"
              : undefined
          }
        >
          <span className="text-strong font-semibold tabular-nums">
            {m.value}
          </span>{" "}
          <span className="text-muted">{m.label}</span>
        </span>
      ))}
    </p>
  );
}

export function WorkList({
  limit,
  items,
}: {
  limit?: number;
  items?: Project[];
}) {
  const list =
    items ??
    (limit ? projects.filter((p) => p.featured).slice(0, limit) : projects);

  return (
    <ul className="grid gap-4">
      {list.map((p, i) => (
        <li key={p.slug}>
          <Spotlight className="rounded-[var(--radius-panel)]">
            <article className="glass group border-line hover:border-accent/50 relative flex h-full flex-col rounded-[var(--radius-panel)] border p-6 transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99] md:p-8">
              <div className="flex items-start justify-between gap-4">
                <Proof values={p.metrics} />
                <span
                  aria-hidden
                  className="accent-serif text-muted text-2xl leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-strong mt-5 text-2xl font-semibold tracking-tight transition-colors duration-(--dur-base) md:text-3xl">
                <Link
                  href={`/work/${p.slug}`}
                  className="hover:text-accent inline-flex flex-wrap items-baseline gap-x-2"
                >
                  {p.title}
                  <ArrowUpRight
                    aria-hidden
                    size={18}
                    weight="bold"
                    className="relative transition-transform duration-(--dur-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </h3>
              <p className="text-body mt-3 max-w-[58ch] text-sm leading-relaxed md:text-[15px]">
                {p.summary}
              </p>
              <ul className="text-muted mt-5 flex flex-wrap gap-y-2 font-mono text-[11px]">
                {p.tags.map((t, ti) => (
                  <li
                    key={t}
                    className={
                      ti < p.tags.length - 1
                        ? "after:mx-2.5 after:content-['·']"
                        : undefined
                    }
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-7">
                {p.demo ? (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-strong hover:text-accent relative z-10 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    Live demo
                    <ArrowUpRight aria-hidden size={14} weight="bold" />
                  </a>
                ) : null}
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-strong hover:text-accent relative z-10 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    Code
                    <ArrowUpRight aria-hidden size={14} weight="bold" />
                  </a>
                ) : null}
                <Link
                  href={`/work/${p.slug}`}
                  className="text-strong hover:text-accent relative z-10 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  Details
                  <ArrowRight aria-hidden size={14} weight="bold" />
                </Link>
              </div>
            </article>
          </Spotlight>
        </li>
      ))}
    </ul>
  );
}
