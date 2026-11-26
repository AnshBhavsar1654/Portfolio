import { getBarcelonaMatch } from "@/lib/barcelona-match";

export async function GET() {
  try {
    const match = await getBarcelonaMatch();
    if (!match) return Response.json({ match: null }, { status: 503 });
    return Response.json(
      { match },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return Response.json({ match: null }, { status: 503 });
  }
}
