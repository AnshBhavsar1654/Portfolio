import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import { PlayCircle } from "@phosphor-icons/react/dist/ssr/PlayCircle";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";

// Editorial project card: large screenshot on top (~45% of the card), serif
// title, uppercase letter-spaced meta line (from the project's metrics — there
// are no project dates in the content), short summary, subtle tech line and
// pill links that only render when the URL exists. The whole card opens the
// detail page through a stretched title link; the pills sit above it.

const pill =
  "border-rule text-strong hover:bg-accent hover:text-on-accent hover:border-accent relative z-10 inline-flex min-h-(--hit-min) items-center gap-1.5 border-[1.5px] px-4 font-mono text-xs whitespace-nowrap transition-[transform,background-color,border-color,color] duration-(--dur-fast) ease-(--ease-out) active:scale-(--press-scale) md:min-h-0 md:py-1.5";

function ProjectCard({ p }: { p: Project }) {
  const previewHref = p.demo ?? p.site;
  const meta = p.metrics.map((m) => `${m.value} ${m.label}`).join(" · ");

  return (
    <article className="group bg-surface border-rule relative flex h-full flex-col overflow-hidden border-(length:--rule-w) transition-[transform,box-shadow] duration-(--dur-base) ease-(--ease-out) hover:-translate-y-1 hover:shadow-(--shadow-lift) active:scale-(--press-scale-card)">
      <div className="bg-surface-2 @container relative aspect-[16/10] overflow-hidden">
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.title} live preview (opens in new tab)`}
            className="relative z-10 block h-full w-full"
          >
            {/* Rendered at a desktop viewport, scaled into the pane. */}
            <iframe
              src={p.embedSrc ?? previewHref}
              title={`${p.title} live preview`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              scrolling="no"
              className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
              style={{
                width: "1440px",
                height: "900px",
                transform: "scale(calc(100cqw / 1440px))",
              }}
            />
          </a>
        ) : (
          <Image
            src={p.image}
            alt={`${p.title} screenshot`}
            width={1200}
            height={750}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="h-full w-full object-cover object-top transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-strong text-2xl leading-tight tracking-tight md:text-3xl">
          <Link
            href={`/work/${p.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {p.title}
          </Link>
        </h3>
        <p className="text-muted mt-2 font-mono text-[11px] tracking-(--tracking-eyebrow) uppercase tabular-nums">
          {meta}
        </p>
        <p className="text-body mt-4 line-clamp-3 text-sm leading-relaxed">
          {p.summary}
        </p>
        <p className="text-muted mt-4 font-mono text-[11px]">
          {p.tags.join(" · ")}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {p.github ? (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <GithubLogo aria-hidden size={16} />
              GitHub
            </a>
          ) : null}
          {p.demo ? (
            <a
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <PlayCircle aria-hidden size={16} />
              Live demo
              <ArrowUpRight aria-hidden size={12} weight="bold" />
            </a>
          ) : null}
          {p.site ? (
            <a
              href={p.site}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <Globe aria-hidden size={16} />
              Website
              <ArrowUpRight aria-hidden size={12} weight="bold" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
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
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {list.map((p) => (
        <li key={p.slug} className="min-w-0">
          <ProjectCard p={p} />
        </li>
      ))}
    </ul>
  );
}
