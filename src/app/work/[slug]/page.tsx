import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/site/section";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  const links = [
    p.demo && { label: "Live demo", href: p.demo },
    p.site && { label: "Project website", href: p.site },
    p.github && { label: "Source on GitHub", href: p.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Section first className="pt-28 md:pt-36">
      <Link
        href="/work"
        className="text-muted hover:text-strong inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft size={14} /> All projects
      </Link>
      <h1 className="text-strong mt-6 max-w-[18ch] text-5xl leading-[1.04] font-semibold tracking-tighter text-balance md:text-7xl">
        {p.title}
      </h1>
      <p className="text-body mt-6 max-w-[58ch] text-lg leading-relaxed">
        {p.summary}
      </p>

      <dl className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-3">
        {p.metrics.map((m) => (
          <div key={m.label} className="border-line border-t pt-4">
            <dd className="text-strong text-4xl font-semibold tracking-tighter break-words md:text-5xl">
              {m.value}
            </dd>
            <dt className="text-muted mt-2 font-mono text-xs">{m.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="text-strong text-sm font-semibold">Highlights</h2>
          <ul className="divide-line mt-4 divide-y">
            {p.highlights.map((h) => (
              <li
                key={h}
                className="text-body py-4 text-lg leading-snug first:pt-0"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <h2 className="text-strong text-sm font-semibold">Built with</h2>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <li
                key={t}
                className="bg-surface-2 text-muted rounded-md px-2.5 py-1 font-mono text-xs"
              >
                {t}
              </li>
            ))}
          </ul>
          {links.length > 0 ? (
            <ul className="mt-10 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body hover:text-accent group border-line flex items-center justify-between border-b py-3 text-[15px] transition-colors"
                  >
                    {l.label}
                    <ArrowUpRight
                      aria-hidden
                      size={16}
                      className="text-muted transition-transform duration-(--dur-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
