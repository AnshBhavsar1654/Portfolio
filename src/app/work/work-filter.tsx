"use client";

import { useState } from "react";
import { WorkList } from "@/components/home/work-list";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

const TAGS = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

export function WorkFilter() {
  const [tag, setTag] = useState<string | null>(null);
  const filtered = tag ? projects.filter((p) => p.tags.includes(tag)) : null;

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by tag"
      >
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => setTag(null)}
          aria-pressed={tag === null}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            tag === null
              ? "border-accent bg-accent-wash text-accent"
              : "border-line text-muted hover:text-strong"
          )}
        >
          All
        </button>
        {TAGS.map((t) => (
          <button
            suppressHydrationWarning
            key={t}
            type="button"
            onClick={() => setTag(tag === t ? null : t)}
            aria-pressed={tag === t}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              tag === t
                ? "border-accent bg-accent-wash text-accent"
                : "border-line text-muted hover:text-strong"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <WorkList items={filtered ?? projects} />
      </div>
    </div>
  );
}
