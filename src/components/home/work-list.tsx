import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import Image from "next/image";
import Link from "next/link";
import { BrowserFrame, siteName } from "@/components/site/browser-frame";
import { projects, type Project } from "@/content/projects";

// The stretched title link opens the project details. Preview and resource
// links sit above it so each still has its own target.

const resourceLink =
  "border-line text-body hover:bg-surface-2 hover:text-strong relative z-10 inline-flex min-h-(--hit-min) items-center gap-2 border px-3 text-sm whitespace-nowrap transition-colors duration-(--dur-fast)";

function ProjectCard({ p }: { p: Project }) {
  const previewHref = p.demo ?? p.site;

  return (
    <article className="bg-surface border-line hover:border-rule relative flex h-full flex-col overflow-hidden border transition-colors duration-(--dur-fast)">
      <div className="aspect-[1203/753]">
        <BrowserFrame url={siteName(previewHref ?? p.github ?? p.title)}>
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
              className="h-full w-full object-cover object-top"
            />
          )}
        </BrowserFrame>
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
        <p className="text-body mt-3 line-clamp-3 text-sm leading-relaxed">
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
              className={resourceLink}
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
              className={resourceLink}
            >
              Live demo
              <ArrowUpRight aria-hidden size={16} />
            </a>
          ) : null}
          {p.site ? (
            <a
              href={p.site}
              target="_blank"
              rel="noopener noreferrer"
              className={resourceLink}
            >
              Website
              <ArrowUpRight aria-hidden size={16} />
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
