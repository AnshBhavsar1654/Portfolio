# Agents guide

- Next.js here is NOT the one in your training data. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`.
- Plan and decisions: `plans/portfolio-redesign-plan.md`. Feature specs live in `plans/`.
- Facts about Ansh live ONLY in `src/content/*`. Never hard-code a number, date, employer, link or domain in a component. Never add a phone number.
- Design tokens live in `src/styles/folio/*.css`. No raw hex/px/ms in components. Every colour must exist in both themes.
- Finish every change with `npm run ci`. Add a note to `documentation/` per phase.
- Skills to use: plan §12.
