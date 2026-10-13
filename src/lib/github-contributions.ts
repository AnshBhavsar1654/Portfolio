import { profile } from "@/content/profile";

// Daily contribution counts come from a public proxy of the GitHub
// contributions calendar, so no token or setup is needed. Responses are
// cached by Next's fetch cache (see `revalidateDays` below) and anything
// unexpected falls back to a plain link to the GitHub profile.
const ENDPOINT = "https://github-contributions-api.jogruber.de/v4";
const RANGE = "last";
const REVALIDATE_SECONDS = 86400; // one day

export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0..4
};

export function githubUser(): string {
  return profile.socials.github.split("/").filter(Boolean).pop() ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function getContributions(): Promise<{
  user: string;
  total: number;
  days: ContributionDay[];
} | null> {
  const user = githubUser();
  if (!user) return null;
  try {
    const res = await fetch(`${ENDPOINT}/${user}?y=${RANGE}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isRecord(data) || !Array.isArray(data.contributions)) return null;
    const days: ContributionDay[] = [];
    for (const item of data.contributions) {
      if (!isRecord(item)) return null;
      const { date, count, level } = item;
      if (
        typeof date !== "string" ||
        typeof count !== "number" ||
        typeof level !== "number"
      )
        return null;
      days.push({
        date,
        count,
        level: Math.min(4, Math.max(0, Math.round(level))),
      });
    }
    if (days.length === 0) return null;
    const total =
      isRecord(data.total) && typeof data.total.lastYear === "number"
        ? data.total.lastYear
        : days.reduce((sum, d) => sum + d.count, 0);
    return { user, total, days };
  } catch {
    return null;
  }
}
