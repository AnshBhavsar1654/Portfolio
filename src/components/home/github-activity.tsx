import { BrandIcon } from "@/components/site/brand-icon";
import { profile } from "@/content/profile";
import {
  getContributions,
  githubUser,
  type ContributionDay,
} from "@/lib/github-contributions";

// GitHub-style contribution graph: month labels on top, Mon/Wed/Fri down
// the side, one cell per day, Less-to-More legend below. Data is fetched and
// cached on the server (see lib/github-contributions); cells are decorative
// (aria-hidden) with the yearly total exposed as the accessible name. Any
// fetch failure renders a plain link to the GitHub profile instead.

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

function monthLabels(weeks: Cell[][]): {
  col: number;
  span: number;
  label: string;
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
  return kept.map((k, i) => ({
    col: k.col,
    span: (i + 1 < kept.length ? kept[i + 1].col : weeks.length) - k.col,
    label: k.date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
  }));
}

function dayTitle(day: ContributionDay): string {
  const when = utcDay(day.date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
}

export async function GitHubActivity() {
  const user = githubUser();
  const data = await getContributions();

  if (!data) {
    return (
      <div className="glass border-line rounded-[var(--radius-panel)] border p-8 md:p-10">
        <h3 className="text-strong text-xl font-semibold tracking-tight">
          GitHub activity
        </h3>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body hover:text-accent mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <BrandIcon name="github" size={16} className="text-brand-github" />
          See my activity on GitHub
        </a>
      </div>
    );
  }

  const weeks = toWeeks(data.days);
  const labels = monthLabels(weeks);

  return (
    <figure className="glass border-line rounded-[var(--radius-panel)] border p-8 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-strong text-xl font-semibold tracking-tight">
          GitHub activity
        </h3>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent font-mono text-xs transition-colors"
        >
          @{user}
        </a>
      </div>
      <div className="mt-6 overflow-x-auto pb-1">
        <div
          role="img"
          aria-label={`${data.total} contributions in the last year`}
          className="grid w-fit gap-1"
          style={{
            gridTemplateColumns: `auto repeat(${weeks.length}, var(--contrib-cell))`,
            gridTemplateRows: `auto repeat(7, var(--contrib-cell))`,
          }}
        >
          {labels.map((l) => (
            <span
              key={`${l.col}-${l.label}`}
              aria-hidden
              className="text-muted font-mono text-xs whitespace-nowrap"
              style={{
                gridColumn: `${l.col + 2} / span ${l.span}`,
                gridRow: 1,
              }}
            >
              {l.label}
            </span>
          ))}
          {["Mon", "Wed", "Fri"].map((d, i) => (
            <span
              key={d}
              aria-hidden
              className="text-muted self-center font-mono text-xs"
              style={{ gridColumn: 1, gridRow: 3 + i * 2 }}
            >
              {d}
            </span>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) =>
              day ? (
                <span
                  key={day.date}
                  aria-hidden
                  title={dayTitle(day)}
                  className={`rounded-xs ${LEVEL_BG[day.level]}`}
                  style={{ gridColumn: wi + 2, gridRow: di + 2 }}
                />
              ) : (
                <span
                  key={`${wi}-${di}`}
                  aria-hidden
                  style={{ gridColumn: wi + 2, gridRow: di + 2 }}
                />
              )
            )
          )}
        </div>
      </div>
      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted text-sm">
          {data.total} contributions in the last year
        </p>
        <p className="text-muted flex items-center gap-1 font-mono text-xs">
          Less
          {LEVEL_BG.map((bg) => (
            <span
              key={bg}
              aria-hidden
              className={`h-2.5 w-2.5 rounded-xs ${bg}`}
            />
          ))}
          More
        </p>
      </figcaption>
    </figure>
  );
}
