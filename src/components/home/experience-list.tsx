"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { useState } from "react";
import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// A scorecard: index, team, innings. The row header toggles the bullets;
// the first row is open by default. Rows with more than 2 bullets show 2
// and a "+N more" control.
export function ExperienceList() {
  const [open, setOpen] = useState<string[]>([
    `${experience[0].org}-${experience[0].role}`,
  ]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const flip = (list: string[], key: string) =>
    list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

  return (
    <div>
      <div
        aria-hidden
        className="border-strong text-muted hidden grid-cols-[3rem_1fr_14rem_2rem] gap-x-6 border-b-2 px-3 pb-3 font-mono text-[11px] tracking-(--tracking-eyebrow) uppercase md:grid"
      >
        <span>#</span>
        <span>Team</span>
        <span>Innings</span>
        <span />
      </div>
      <ul className="divide-line divide-y">
        {experience.map((e, i) => {
          const key = `${e.org}-${e.role}`;
          const isOpen = open.includes(key);
          const showAll = expanded.includes(key);
          const visible = showAll ? e.bullets : e.bullets.slice(0, 2);
          const hidden = e.bullets.length - visible.length;
          const current = /present/i.test(e.period);
          return (
            <li
              key={key}
              className={cn(
                "group/row relative transition-colors duration-(--dur-base)",
                isOpen && "bg-surface/60"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "bg-accent absolute top-0 bottom-0 left-0 w-0.5 origin-top scale-y-0 transition-transform duration-(--dur-base)",
                  (isOpen || current) && "scale-y-100"
                )}
              />
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`exp-${key}`}
                onClick={() => setOpen((p) => flip(p, key))}
                className="grid w-full grid-cols-[2.5rem_1fr_2rem] items-start gap-x-4 px-3 py-6 text-left md:grid-cols-[3rem_1fr_14rem_2rem] md:gap-x-6"
              >
                <span className="text-muted pt-2 font-mono text-xs tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-strong group-hover/row:text-accent block text-2xl font-semibold tracking-tight transition-colors md:text-4xl">
                    {e.org}
                  </span>
                  <span className="text-muted mt-1 flex flex-wrap items-center gap-2 text-sm">
                    {e.role}
                    {current ? (
                      <span className="bg-accent-wash text-accent rounded-full px-2 py-0.5 font-mono text-[10px] uppercase">
                        Now batting
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted mt-3 block font-mono text-xs tabular-nums md:hidden">
                    {e.period}
                  </span>
                </span>
                <span className="text-muted hidden pt-2 font-mono text-xs tabular-nums md:block">
                  <span className="block">{e.period}</span>
                  <span className="mt-1 block">{e.location}</span>
                </span>
                <CaretDown
                  aria-hidden
                  size={18}
                  className={cn(
                    "text-muted mt-2 shrink-0 transition-transform duration-(--dur-base)",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div id={`exp-${key}`} data-open={isOpen} className="disclosure">
                <div>
                  <div className="px-3 pb-8 md:grid md:grid-cols-[3rem_1fr] md:gap-x-6">
                    <span aria-hidden className="hidden md:block" />
                    <div>
                      <ul className="text-body space-y-2 text-[15px] leading-relaxed">
                        {visible.map((b) => (
                          <li
                            key={b}
                            className="before:bg-accent relative max-w-[68ch] pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                      {e.bullets.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => setExpanded((p) => flip(p, key))}
                          className="text-accent mt-3 font-mono text-xs hover:underline"
                        >
                          {showAll ? "Show less" : `+${hidden} more`}
                        </button>
                      ) : null}
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {e.tags.map((t) => (
                          <li
                            key={t}
                            className="border-line text-muted rounded-full border px-3 py-1 font-mono text-[11px]"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
