import { football } from "@/content/football";

export type MatchCard = {
  competition: string;
  competitionLogo: string | null;
  home: {
    name: string;
    score: string;
    logo: string | null;
    scorers: string[];
  };
  away: {
    name: string;
    score: string;
    logo: string | null;
    scorers: string[];
  };
  status: string;
  live: boolean;
  date: string;
  incomplete: boolean;
};

type Event = {
  id: string;
  date: string;
  league?: { name?: string; alternateId?: string; slug?: string };
  competitions?: {
    status?: {
      displayClock?: string;
      type?: { state?: string; shortDetail?: string; completed?: boolean };
    };
    competitors?: {
      id: string;
      homeAway: string;
      team?: {
        shortDisplayName?: string;
        abbreviation?: string;
        logos?: { href: string }[];
      };
      score?: { displayValue?: string };
    }[];
  }[];
};

export async function getBarcelonaMatch(): Promise<MatchCard | null> {
  const responses = await Promise.allSettled(
    football.competitions.map(async (league) => {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${football.teamId}/schedule`,
        {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(8000),
        }
      );
      if (!res.ok) throw new Error(`Football feed returned ${res.status}`);
      const data = (await res.json()) as { events?: Event[] };
      if (!Array.isArray(data.events))
        throw new Error("Football feed has no events");
      return data.events;
    })
  );
  const incomplete = responses.some((r) => r.status === "rejected");
  const events = responses.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );
  const eligible = events.filter((event) => {
    const status = event.competitions?.[0]?.status?.type;
    return status?.state === "in" || status?.completed === true;
  });
  eligible.sort((a, b) => {
    const live = (event: Event) =>
      event.competitions?.[0]?.status?.type?.state === "in" ? 1 : 0;
    return live(b) - live(a) || Date.parse(b.date) - Date.parse(a.date);
  });
  const event = eligible[0];
  const game = event?.competitions?.[0];
  const home = game?.competitors?.find((team) => team.homeAway === "home");
  const away = game?.competitors?.find((team) => team.homeAway === "away");
  if (
    !event ||
    !game?.status ||
    !home?.team ||
    !away?.team ||
    home.score?.displayValue == null ||
    away.score?.displayValue == null
  )
    return null;
  let goals: {
    scoringPlay?: boolean;
    shootout?: boolean;
    team?: { id?: string };
    participants?: { athlete?: { id?: string; displayName?: string } }[];
    clock?: { displayValue?: string };
  }[] = [];
  try {
    if (
      event.league?.slug &&
      football.competitions.some(
        (competition) => competition === event.league?.slug
      )
    ) {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${event.league.slug}/summary?event=${encodeURIComponent(event.id)}`,
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const summary = (await res.json()) as { keyEvents?: typeof goals };
        goals = summary.keyEvents ?? [];
      }
    }
  } catch {
    // The score remains useful when event details are unavailable.
  }
  const team = (item: typeof home) => ({
    name: item.team?.abbreviation || item.team?.shortDisplayName || "—",
    score: item.score?.displayValue || "0",
    logo: item.team?.logos?.[0]?.href || null,
    scorers: (() => {
      const grouped = new Map<string, { name: string; minutes: string[] }>();
      for (const goal of goals) {
        if (!goal.scoringPlay || goal.shootout || goal.team?.id !== item.id)
          continue;
        const athlete = goal.participants?.[0]?.athlete;
        if (!athlete?.displayName) continue;
        const key = athlete.id || athlete.displayName;
        const scorer = grouped.get(key) ?? {
          name: athlete.displayName,
          minutes: [],
        };
        if (goal.clock?.displayValue)
          scorer.minutes.push(goal.clock.displayValue);
        grouped.set(key, scorer);
      }
      return Array.from(grouped.values(), ({ name, minutes }) =>
        minutes.length ? `${name} ${minutes.join(", ")}` : name
      );
    })(),
  });
  const live = game.status.type?.state === "in";
  const id = event.league?.alternateId;
  return {
    competition: event.league?.name || "Football",
    competitionLogo:
      id && /^\d+$/.test(id)
        ? `https://a.espncdn.com/i/leaguelogos/soccer/500-dark/${id}.png`
        : null,
    home: team(home),
    away: team(away),
    live,
    status: live
      ? game.status.displayClock || game.status.type?.shortDetail || "LIVE"
      : "FT",
    date: event.date,
    incomplete,
  };
}
