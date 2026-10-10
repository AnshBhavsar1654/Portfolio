"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { useState } from "react";
import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// Period on the left, role on the right. The row header toggles the bullets;
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
    <ul className="divide-line divide-y">
      {experience.map((e) => {
        const key = `${e.org}-${e.role}`;
        const isOpen = open.includes(key);
        const showAll = expanded.includes(key);
        const visible = showAll ? e.bullets : e.bullets.slice(0, 2);
        const hidden = e.bullets.length - visible.length;
        return (
          <li
            key={key}
            className="grid gap-x-10 gap-y-2 py-7 first:pt-0 md:grid-cols-[200px_1fr]"
          >
            <div className="text-muted font-mono text-xs tabular-nums md:pt-1.5">
              <p>{e.period}</p>
              <p className="mt-1">{e.location}</p>
            </div>
            <div>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`exp-${key}`}
                onClick={() => setOpen((p) => flip(p, key))}
                className="group flex w-full items-start justify-between gap-4 text-left"
              >
                <span>
                  <span className="text-strong group-hover:text-accent block text-xl font-semibold tracking-tight transition-colors">
                    {e.org}
                  </span>
                  <span className="text-muted mt-0.5 block text-sm">
                    {e.role}
                  </span>
                </span>
                <CaretDown
                  aria-hidden
                  size={18}
                  className={cn(
                    "text-muted mt-1.5 shrink-0 transition-transform duration-(--dur-base)",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div id={`exp-${key}`} data-open={isOpen} className="disclosure">
                <div>
                  <ul className="text-body space-y-2 pt-4 text-[15px] leading-relaxed">
                    {visible.map((b) => (
                      <li
                        key={b}
                        className="before:bg-muted relative max-w-[68ch] pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2"
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
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <li
                        key={t}
                        className="bg-surface-2 text-muted rounded-md px-2.5 py-1 font-mono text-[11px]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
