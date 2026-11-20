@AGENTS.md

## UI/UX guardrails (strict)

Applies to every component and style change. Tokens live in `src/styles/folio/*.css`; if a value is missing, add a token there first.

- **No generic AI gradients.** Ban purple/blue/pink mesh or aurora gradients, gradient-filled cards and buttons, and glow blobs. The only gradients allowed are the existing `--heading-from/--heading-to` and `--shine-*` accent-word treatments.
- **No scroll-fade wrappers on static text.** Never wrap paragraphs, headings or lists in repeated fade/slide-on-scroll reveals. `--dur-reveal` is for one-shot section or media entrances only, at most once per section.
- **`tabular-nums` for data.** Dates, years, metrics, counts, stats and anything that can change use `font-variant-numeric: tabular-nums` (or `font-feature-settings: var(--numeric-features)`).
- **Tactile `:active` feedback.** Every interactive element (button, link-as-button, pill, card link, toggle) scales on `:active` to `var(--press-scale)` (`var(--press-scale-card)` for large cards) with `var(--dur-instant)` and `var(--ease-out)`. It is disabled under reduced motion via the tokens.
- **Motion.** UI feedback stays under 300ms (`--dur-instant`, `--dur-fast`, `--dur-base`). Use `--ease-out` for entrances and hovers, `--ease-in-out` for on-screen movement, never `ease-in`. Animate only `transform` and `opacity`; never `transition: all`. Springs come from the `--spring-*` tokens.
- **Contrast.** Text is at least 4.5:1 on whatever it sits on (including `--surface-2`) in both themes. Check any new colour pair before using it.
- **Hover only on hover devices.** Gate hover effects with `@media (hover: hover) and (pointer: fine)`.
- **Targets and focus.** Touch targets are at least `var(--hit-min)`. Keep the global `:focus-visible` ring; never remove an outline without a replacement.
- **Spacing and type.** Use `--space-*` and the `--text-*` scale. No raw hex, px or ms values in components.
