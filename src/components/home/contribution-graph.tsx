import type { CSSProperties } from "react";
import { ActivityViews } from "@/components/home/activity-views";
import type { ContributionDay } from "@/lib/github-contributions";

// One shared contribution-graph panel for any daily-count source (GitHub
// calendar, LeetCode submission calendar). Month labels on top, one cell
// per day (Sunday at the top), Less-to-More legend below. Cells are
// decorative (aria-hidden); the yearly total is exposed as the accessible
// name. Style tokens match lib/github-contributions levels. The panel offers
// a second, orbitable 3D view of the same year (see ActivityViews).

const LEVEL_BG = [
  "bg-contrib-0",
  "bg-contrib-1",
  "bg-contrib-2",
  "bg-contrib-3",
  "bg-contrib-4",
];

// Minimum week-columns between two month labels so they never collide.
const MONTH_GAP = 3;

type Cell = ContributionDay | null;

// Track size that respects the 0.625rem token when there is room, then
// yields to the panel's container-query width so a full year always fits.
// One extra gap of slack absorbs the label-column gap and sub-pixel
// rounding, keeping the horizontal scrollbar away.
function cellSize(weeks: number): string {
  return `min(
    var(--contrib-cell),
    calc(
      (100cqw - ${weeks + 1} * var(--contrib-gap)) / ${weeks}
    )
  )`;
}

function utcDay(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

// Consecutive days chunked into Sunday-to-Saturday columns, padded with
// nulls so every column has seven rows.
function toWeeks(days: ContributionDay[]): Cell[][] {
  const weeks: Cell[][] = [];
  let week: Cell[] = new Array<Cell>(utcDay(days[0].date).getUTCDay()).fill(
    null
  );
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

// The trailing month usually has only a week or two of columns left, too
// narrow for its name; it is right-aligned to the grid edge so the text
// spills left into free space instead of past the panel.
function monthLabels(weeks: Cell[][]): {
  col: number;
  span: number;
  label: string;
  alignEnd: boolean;
}[] {
  const firsts: { col: number; date: Date }[] = [];
  weeks.forEach((week, col) => {
    const first = week.find(
      (c): c is ContributionDay =>
        c !== null && utcDay(c.date).getUTCDate() === 1
    );
    if (first) firsts.push({ col, date: utcDay(first.date) });
  });
  const kept = firsts.filter(
    (f, i) => i === 0 || f.col - firsts[i - 1].col >= MONTH_GAP
  );
  return kept.map((k, i) => {
    const last = i === kept.length - 1;
    const span = (last ? weeks.length : kept[i + 1].col) - k.col;
    return {
      col: k.col,
      span,
      label: k.date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      alignEnd: last && span < MONTH_GAP,
    };
  });
}

// Headline numbers shown above both views: busiest day, longest run of active
// days, and how many days had any activity at all.
function yearStats(days: ContributionDay[]) {
  let best = days[0];
  let streak = 0;
  let run = 0;
  let active = 0;
  for (const d of days) {
    if (d.count > best.count) best = d;
    if (d.count > 0) {
      active += 1;
      run += 1;
      streak = Math.max(streak, run);
    } else run = 0;
  }
  const on = utcDay(best.date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return [
    { value: best.count, label: `busiest day (${on})` },
    { value: streak, label: "day best streak" },
    { value: active, label: "active days" },
  ];
}

export function ContributionGraph({
  title,
  handle,
  href,
  unit,
  dayUnit,
  total,
  days,
}: {
  title: string;
  handle?: string;
  href: string;
  unit: string; // plural noun for sums, e.g. "contributions" or "submissions"
  dayUnit: string; // singular for per-day titles, e.g. "contribution" or "submission"
  total: number;
  days: ContributionDay[];
}) {
  const weeks = toWeeks(days);
  const labels = monthLabels(weeks);

  const header = (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h3 className="text-strong text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-accent font-mono text-xs transition-colors"
      >
        {handle ? `@${handle}` : "Open profile"}
      </a>
    </div>
  );

  const grid = (
    <div
      className="overflow-x-auto pb-1"
      // Container-query width is measured here, so the graph below can
      // shrink its cells to fit the full year without scrolling.
      style={{ containerType: "inline-size" }}
    >
      <div
        role="img"
        aria-label={`${total} ${unit} in the last year`}
        className="grid w-full gap-(--contrib-gap)"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, ${cellSize(weeks.length)})`,
          gridTemplateRows: `auto repeat(7, ${cellSize(weeks.length)})`,
        }}
      >
        {labels.map((l, i) => (
          <span
            key={`${l.col}-${l.label}`}
            aria-hidden
            // In a narrow panel twelve names cannot fit: keep every other
            // month, counting back from the newest so it always shows.
            className={`text-muted font-mono text-xs whitespace-nowrap ${
              (labels.length - 1 - i) % 2 ? "@max-sm:invisible" : ""
            }`}
            style={{
              gridColumn: `${l.col + 1} / span ${l.span}`,
              gridRow: 1,
              justifySelf: l.alignEnd ? "unsafe end" : undefined,
            }}
          >
            {l.label}
          </span>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) =>
            day ? (
              <span
                key={day.date}
                aria-hidden
                title={`${day.count} ${
                  day.count === 1 ? dayUnit : unit
                } on ${utcDay(day.date).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}`}
                className={`contrib-cell ${LEVEL_BG[day.level]}`}
                style={
                  {
                    gridColumn: wi + 1,
                    gridRow: di + 2,
                    "--w": wi,
                    "--d": di,
                  } as CSSProperties
                }
              />
            ) : (
              <span
                key={`${wi}-${di}`}
                aria-hidden
                style={{ gridColumn: wi + 1, gridRow: di + 2 }}
              />
            )
          )
        )}
      </div>
    </div>
  );

  const caption = (
    <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-muted text-sm">
        {total} {unit} in the last year
      </p>
      <p className="text-muted flex items-center gap-1 font-mono text-xs">
        Less
        {LEVEL_BG.map((bg) => (
          <span key={bg} aria-hidden className={`h-2.5 w-2.5 ${bg}`} />
        ))}
        More
      </p>
    </figcaption>
  );

  return (
    <figure className="glass border-line border p-8 md:p-10">
      <ActivityViews
        header={header}
        grid={grid}
        caption={caption}
        stats={yearStats(days)}
        days={days}
        unit={unit}
        dayUnit={dayUnit}
        label={`${total} ${unit} in the last year`}
      />
    </figure>
  );
}
