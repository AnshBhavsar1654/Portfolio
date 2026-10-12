# Agents guide

- Next.js here is NOT the one in your training data. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`.
- Plan and decisions: `plans/portfolio-redesign-plan.md`. Feature specs live in `plans/`.
- Facts about Ansh live ONLY in `src/content/*`. Never hard-code a number, date, employer, link or domain in a component. Never add a phone number.
- Design tokens live in `src/styles/folio/*.css`. No raw hex/px/ms in components. Every colour must exist in both themes.
- Finish every change with `npm run ci`.
- Skills to use: plan §12.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
