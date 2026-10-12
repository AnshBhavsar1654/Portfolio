import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import Image from "next/image";
import Link from "next/link";
import { Spotlight } from "@/components/site/spotlight";
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

// Home (`limit`) is an asymmetric bento: wide/narrow pairs that alternate.
// /work (`items`) stays a uniform grid so filtering never reshuffles sizes.
// Cards read top-down like a story: screenshot, title, proof, actions.

const BENTO_SPAN = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-4",
];

export function WorkList({
  limit,
  items,
}: {
  limit?: number;
  items?: Project[];
}) {
  const bento = !items && Boolean(limit);
  const list =
    items ??
    (limit ? projects.filter((p) => p.featured).slice(0, limit) : projects);

  return (
    <ul
      className={cn("grid gap-4", bento ? "md:grid-cols-6" : "sm:grid-cols-2")}
    >
      {list.map((p, i) => (
        <li key={p.slug} className={cn(bento && BENTO_SPAN[i % 4])}>
          <Spotlight className="h-full">
            <article className="group border-line bg-surface hover:border-accent/50 relative flex h-full min-h-72 flex-col overflow-hidden rounded-[var(--radius-panel)] border transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99]">
              {p.demo ? (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} live demo (opens in new tab)`}
                  className="relative block overflow-hidden"
                >
                  <iframe
                    src={p.embedSrc ?? p.demo}
                    title={`${p.title} live preview`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="no"
                    className={cn(
                      "pointer-events-none w-full border-0",
                      bento && i % 4 === 0 ? "aspect-[16/9]" : "aspect-[16/10]"
                    )}
                  />
                </a>
              ) : (
                <Link
                  href={`/work/${p.slug}`}
                  aria-label={`${p.title} details`}
                  className="block overflow-hidden"
                >
                  <Image
                    src={p.image}
                    alt={`${p.title} preview`}
                    width={1200}
                    height={750}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-(--dur-base) ease-(--ease-out-soft) group-hover:scale-[1.03]"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-muted font-mono text-xs">
                    {p.metrics.map((m) => `${m.value} ${m.label}`).join(" · ")}
                  </p>
                  <span
                    aria-hidden
                    className="accent-serif text-muted text-2xl leading-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-strong mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  <Link
                    href={`/work/${p.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="text-body mt-2 max-w-[52ch] text-sm leading-relaxed">
                  {p.summary}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="border-line text-muted rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
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
              </div>
            </article>
          </Spotlight>
        </li>
      ))}
    </ul>
  );
}
