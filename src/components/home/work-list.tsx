import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

// Asymmetric bento: rows alternate wide/narrow and narrow/wide, so no two
// rows share a composition. A lone last tile spans the full width. Tiles
// lead with their strongest metric instead of stock imagery.
const SPAN = {
  2: "md:col-span-2",
  4: "md:col-span-4",
  6: "md:col-span-6",
} as const;
const ROWS: [2 | 4, 2 | 4][] = [
  [4, 2],
  [2, 4],
];

function tone(span: 2 | 4 | 6, row: number) {
  if (span === 6) return "bg-surface-2";
  if (span === 2) return "border border-line";
  return row % 2 === 0 ? "bg-surface-2" : "bg-accent-wash";
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

  const tiles = list.map((p, i) => {
    const row = Math.floor(i / 2);
    const isLoneLast = i === list.length - 1 && list.length % 2 === 1;
    const span: 2 | 4 | 6 = isLoneLast ? 6 : ROWS[row % 2][i % 2];
    return { p, span, row };
  });

  return (
    <ul className="grid gap-4 md:grid-cols-6">
      {tiles.map(({ p, span, row }) => {
        const [lead, ...rest] = p.metrics;
        return (
          <li key={p.slug} className={cn("col-span-6", SPAN[span])}>
            <Link
              href={`/work/${p.slug}`}
              className={cn(
                "group flex h-full min-h-72 flex-col justify-between rounded-2xl p-6 transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99] md:p-8",
                tone(span, row),
                span === 2 && "hover:border-accent/50"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-strong text-4xl font-semibold tracking-tighter break-words tabular-nums md:text-5xl">
                    {lead.value}
                  </p>
                  <p className="text-muted mt-1.5 font-mono text-xs">
                    {lead.label}
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  size={22}
                  className="text-muted group-hover:text-accent shrink-0 transition-[transform,color] duration-(--dur-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <div className="mt-12">
                <h3 className="text-strong text-xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="text-body mt-2 max-w-[52ch] text-sm leading-relaxed">
                  {p.summary}
                </p>
                {rest.length > 0 ? (
                  <p className="text-muted mt-3 font-mono text-xs">
                    {rest.map((m) => `${m.value} ${m.label}`).join(", ")}
                  </p>
                ) : null}
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {p.tags.map((t) => (
                    <li key={t} className="text-muted font-mono text-[11px]">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
