import { profile } from "@/content/profile";
import type { ContributionDay } from "@/lib/github-contributions";

// LeetCode sits behind a Cloudflare challenge for serverless and datacenter
// IPs, so its own endpoints are unreliable from a build or edge server. This
// goes through the community API that proxies leetcode.com instead, whose
// submissionCalendar covers the last year keyed by unix seconds (UTC midnights,
// nonzero days only). Ranges are rebuilt as a consecutive year starting from
// the Sunday window fill, since the graph renderer needs contiguous days.
// Cached one day; any mismatch returns null and the panel degrades to a
// plain profile link, exactly like the GitHub panel.

const ENDPOINT = "https://leetcode-api-faisalshohag.vercel.app";
const DAY_MS = 86_400_000;
const YEAR_DAYS = 365; // consecutive window ending today (UTC)
const REVALIDATE_SECONDS = 86_400; // one day

export function leetcodeUser(): string {
  return profile.socials.leetcode.split("/").filter(Boolean).pop() ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Levels are relative to the user's own distribution (quartiles of nonzero
// days), matching the feel of GitHub's less-to-more scale. Floors keep the
// buckets distinguishable on sparse calendars.
function toLevels(counts: number[]): number[] {
  const sorted = [...counts].filter((c) => c > 0).sort((a, b) => a - b);
  const at = (p: number) =>
    sorted.length > 0 ? sorted[Math.floor(p * (sorted.length - 1))] : 1;
  const thresholds = [
    Math.max(1, at(0.25)),
    Math.max(2, at(0.5)),
    Math.max(3, at(0.75)),
  ];
  return counts.map((count) =>
    count <= 0
      ? 0
      : count <= thresholds[0]
        ? 1
        : count <= thresholds[1]
          ? 2
          : count <= thresholds[2]
            ? 3
            : 4
  );
}

export async function getLeetCodeActivity(): Promise<{
  user: string;
  total: number;
  days: ContributionDay[];
} | null> {
  const user = leetcodeUser();
  if (!user) return null;
  try {
    const res = await fetch(`${ENDPOINT}/${user}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isRecord(data) || !isRecord(data.submissionCalendar)) return null;

    const calendar = data.submissionCalendar;
    const byDate = new Map<string, number>();
    let total = 0;
    for (const [seconds, count] of Object.entries(calendar)) {
      const ms = Number(seconds) * 1000;
      const value = Number(count);
      if (!Number.isFinite(ms) || !Number.isFinite(value) || value < 0)
        return null;
      const date = new Date(ms).toISOString().slice(0, 10);
      byDate.set(date, value);
      total += value;
    }
    if (byDate.size === 0) return null;

    // One contiguous year ending today (UTC), zero-filled so the graph's
    // Sunday-start week chunking stays correct.
    const now = new Date();
    const todayUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    const days: ContributionDay[] = [];
    const counts: number[] = [];
    for (let i = 0; i < YEAR_DAYS; i++) {
      const date = new Date(todayUtc - (YEAR_DAYS - 1 - i) * DAY_MS)
        .toISOString()
        .slice(0, 10);
      const count = byDate.get(date) ?? 0;
      days.push({ date, count, level: 0 });
      counts.push(count);
    }
    const levels = toLevels(counts);
    days.forEach((day, i) => (day.level = levels[i]));

    return { user, total, days };
  } catch {
    return null;
  }
}
