// No hard-coded domain anywhere. Env var wins; Vercel URL second;
// plain localhost fallback keeps `next build` and previews working.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
);
