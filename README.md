# Ansh Bhavsar — Portfolio

Personal portfolio: calm, editorial, evidence-first. Next.js 16 (App Router),
React 19, TypeScript, Tailwind v4, `motion`.

## Run

```bash
npm install
npm run dev
```

## Checks

```bash
npm run ci   # format:check → lint → typecheck → build
```

## Site URL

Live at https://anshbhavsar.vercel.app. No domain is hard-coded anywhere.
`NEXT_PUBLIC_SITE_URL` wins; otherwise the site falls back to the Vercel
production URL, then `http://localhost:3000`. Documented in `.env`.

```bash
# .env / Vercel env (Production)
NEXT_PUBLIC_SITE_URL=https://anshbhavsar.vercel.app
```

## Structure

- `src/content/*` — the only place facts about Ansh live (profile, projects,
  experience, skills). Never hard-code a number, date, employer,
  link or domain in a component. Never add a phone number.
- `src/styles/folio/*.css` — design tokens (colours, motion, typography,
  spacing, base). No raw hex/px/ms in components.
- `src/components/site/*` — shell: nav, footer, theme toggle, section
  primitives, reveal, count-up.
- `src/components/home/*` — home sections: hero, about, experience list,
  work list, skills, contact form.
- `plans/` — local implementation specs (gitignored, never pushed).

## Routes

`/` (Hero → About → Experience → Work → Skills → Contact),
`/work`, `/work/[slug]`, `/contact`, `/resume` (→ `/Ansh_Resume.pdf`).
`/projects/*` redirects to `/work/*`.
