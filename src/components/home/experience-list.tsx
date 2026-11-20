"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { useRef, useState, type KeyboardEvent } from "react";
import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// Master / detail: a role index on the left, the selected role's detail on
// the right, so one role reads at a time instead of three stacked cards.
// The index is a vertical tablist on wide screens and a horizontal strip
// below lg. Every panel sits in the same grid cell, so the frame is as tall
// as the tallest role and switching roles never shifts the page; inactive
// panels are inert and fade out. Arrow keys / Home / End move between roles.
// The org sits in the accent serif and links to its LinkedIn (url comes from
// content); bullets keep dash markers and number emphasis; tags read as a
// mono footnote line (chips are the Projects treatment).

const NUMBER = /((?<![A-Za-z])\d+(?:[.,]\d+)*\+?%?(?![A-Za-z]))/g;

function withNumbers(text: string) {
  return text.split(NUMBER).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-strong font-semibold tabular-nums">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function Org({ org, url }: { org: string; url?: string }) {
  if (!url) return org;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/lnk hover:text-accent-hover inline-flex items-baseline gap-1 underline-offset-4 transition-colors duration-(--dur-base) hover:underline"
    >
      {org}
      <ArrowUpRight
        aria-hidden
        size={16}
        weight="bold"
        className="transition-transform duration-(--dur-base) group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5"
      />
    </a>
  );
}

const isCurrent = (period: string) => /present/i.test(period);

export function ExperienceList() {
  const firstCurrent = experience.findIndex((e) => isCurrent(e.period));
  const [active, setActive] = useState(Math.max(firstCurrent, 0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(ev: KeyboardEvent) {
    const last = experience.length - 1;
    let next = active;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") {
      next = active === last ? 0 : active + 1;
    } else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") {
      next = active === 0 ? last : active - 1;
    } else if (ev.key === "Home") {
      next = 0;
    } else if (ev.key === "End") {
      next = last;
    } else {
      return;
    }
    ev.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
      <div
        role="tablist"
        aria-label="Roles"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:content-start lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {experience.map((e, i) => {
          const selected = i === active;
          const current = isCurrent(e.period);
          return (
            <button
              key={`${e.org}-${e.role}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`exp-tab-${i}`}
              aria-selected={selected}
              aria-controls={`exp-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "glass shrink-0 rounded-[var(--radius-card)] border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-(--dur-base) ease-(--ease-out-soft) active:scale-[0.98] max-lg:min-w-44 lg:px-5 lg:py-4",
                selected
                  ? "border-accent/50 bg-accent-wash"
                  : "border-line hover:border-accent/40"
              )}
            >
              <span
                className={cn(
                  "flex items-center gap-2 text-base font-semibold tracking-tight transition-colors duration-(--dur-base)",
                  selected ? "text-strong" : "text-body"
                )}
              >
                {e.org}
                {current ? (
                  <span
                    aria-label="current role"
                    className="bg-accent ring-accent-wash h-1.5 w-1.5 rounded-full ring-4"
                  />
                ) : null}
              </span>
              <span className="text-muted mt-1 block font-mono text-xs tabular-nums">
                {e.period}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid">
        {experience.map((e, i) => {
          const selected = i === active;
          return (
            <div
              key={`${e.org}-${e.role}`}
              role="tabpanel"
              id={`exp-panel-${i}`}
              aria-labelledby={`exp-tab-${i}`}
              inert={!selected}
              className={cn(
                "glass border-line col-start-1 row-start-1 rounded-[var(--radius-panel)] border p-6 transition-[opacity,translate,visibility] duration-(--dur-base) ease-(--ease-out-soft) md:p-10",
                selected
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                <h3 className="text-strong text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
                  {e.role}
                  <span className="accent-serif text-accent mt-1.5 block text-[1.05em]">
                    <Org org={e.org} url={e.url} />
                  </span>
                </h3>
                <p className="text-muted font-mono text-xs tabular-nums md:text-right">
                  <span className={isCurrent(e.period) ? "text-accent" : ""}>
                    {e.period}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 md:justify-end">
                    <MapPin aria-hidden size={12} weight="fill" />
                    {e.location}
                  </span>
                </p>
              </div>
              <ul className="text-body mt-8 grid max-w-[72ch] gap-3 text-[15px] leading-relaxed">
                {e.bullets.map((b) => (
                  <li
                    key={b}
                    className="before:bg-accent relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                  >
                    {withNumbers(b)}
                  </li>
                ))}
              </ul>
              <ul className="text-muted mt-8 flex flex-wrap gap-y-2 font-mono text-[11px]">
                {e.tags.map((t, ti) => (
                  <li
                    key={t}
                    className={cn(
                      ti < e.tags.length - 1 &&
                        "after:mx-2.5 after:content-['·']"
                    )}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
