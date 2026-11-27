"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  EASE_BASE,
  NAV_CARD_RISE_PX,
  NAV_CARD_SPRING,
  NAV_CARD_STAGGER_SECONDS,
  NAV_INTRO_DROP_PX,
  NAV_INTRO_SECONDS,
  NAV_PANEL_SECONDS,
} from "@/components/site/motion-tokens";
import { ResumeTrigger } from "@/components/site/resume-dialog";
import { useActiveSection } from "@/components/site/use-active-section";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

type NavLink = { label: string; href: string; id?: string; external?: boolean };
type NavCard = { label: string; description: string; links: NavLink[] };

// Cards group the page's sections, the featured work and the contact routes.
// Every fact about Ansh comes from src/content.
const CARDS: NavCard[] = [
  {
    label: "About",
    description: "Who I am and the path so far.",
    links: [
      { label: "About", href: "/#about", id: "about" },
      { label: "Experience", href: "/#experience", id: "experience" },
      { label: "Education", href: "/#education", id: "education" },
    ],
  },
  {
    label: "Work",
    description: "Things I have built and shipped.",
    links: [
      { label: "All projects", href: "/#work", id: "work" },
      ...projects
        .filter((p) => p.featured)
        .slice(0, 2)
        .map((p) => ({ label: p.title, href: `/work/${p.slug}` })),
    ],
  },
  {
    label: "Contact",
    description: "Say hello, I read everything.",
    links: [
      { label: "Get in touch", href: "/#contact", id: "contact" },
      { label: "Email", href: `mailto:${profile.email}`, external: true },
      { label: "GitHub", href: profile.socials.github, external: true },
      { label: "LinkedIn", href: profile.socials.linkedin, external: true },
    ],
  },
];

const IDS = CARDS.flatMap((c) => c.links.flatMap((l) => (l.id ? [l.id] : [])));

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const panelId = useId();
  const active = useActiveSection(IDS);
  const reduce = useReducedMotion();

  // Esc and outside press close the menu; focus returns to the button.
  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) buttonRef.current?.focus({ preventScroll: true });
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.target instanceof Node && rootRef.current?.contains(e.target))
        return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-(--space-4) pt-(--space-3)">
      <motion.nav
        ref={rootRef}
        aria-label="Primary"
        initial={{ opacity: 0, y: -NAV_INTRO_DROP_PX }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : NAV_INTRO_SECONDS,
          ease: EASE_BASE,
        }}
        className="pointer-events-auto relative mx-auto w-full max-w-(--nav-max)"
      >
        <div className="bg-surface-glass border-line grid h-(--nav-h) grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center rounded-(--radius-nav) border px-(--space-2) backdrop-blur-md">
          <button
            suppressHydrationWarning
            ref={buttonRef}
            type="button"
            data-resume-return-focus
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className={cn(
              "text-strong hover:bg-surface-2 flex h-(--hit-min) items-center gap-(--space-3) justify-self-start rounded-(--radius-nav-inner) px-(--space-3) text-sm font-semibold transition-[background-color,transform] duration-(--dur-instant) ease-(--ease-out) active:scale-(--press-scale)",
              focusRing
            )}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={cn(
                  "bg-strong absolute inset-x-0 top-0.5 h-0.5 transition-transform duration-(--dur-base) ease-(--ease-out)",
                  open && "translate-y-1.5 rotate-45"
                )}
              />
              <span
                className={cn(
                  "bg-strong absolute inset-x-0 bottom-0.5 h-0.5 transition-transform duration-(--dur-base) ease-(--ease-out)",
                  open && "-translate-y-1.5 -rotate-45"
                )}
              />
            </span>
            <span className="relative inline-grid overflow-hidden">
              <span
                aria-hidden={open}
                className={cn(
                  "col-start-1 row-start-1 transition-transform duration-(--dur-base) ease-(--ease-out)",
                  open && "-translate-y-[110%]"
                )}
              >
                Menu
              </span>
              <span
                aria-hidden={!open}
                className={cn(
                  "col-start-1 row-start-1 translate-y-[110%] transition-transform duration-(--dur-base) ease-(--ease-out)",
                  open && "translate-y-0"
                )}
              >
                Close
              </span>
            </span>
          </button>

          <div id="scenery-nav-slot" className="justify-self-center" />

          <div className="justify-self-end">
            <ResumeTrigger
              className={cn(
                "bg-strong text-bg hidden h-(--hit-min) items-center justify-self-end rounded-(--radius-nav-inner) px-(--space-5) text-sm font-semibold transition-[opacity,transform] duration-(--dur-instant) ease-(--ease-out) hover:opacity-85 active:scale-(--press-scale) sm:inline-flex",
                focusRing
              )}
            >
              Resume
            </ResumeTrigger>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              id={panelId}
              key="panel"
              initial={reduce ? false : { opacity: 0, y: -8, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8, scaleY: 0.96 }}
              transition={{ duration: NAV_PANEL_SECONDS, ease: EASE_BASE }}
              style={{ transformOrigin: "top" }}
              className="bg-surface-glass border-line mt-(--space-2) max-h-[calc(100svh-var(--nav-h)-var(--space-6))] overflow-y-auto overscroll-contain rounded-(--radius-nav) border p-(--space-2) backdrop-blur-md"
            >
              <div className="grid gap-(--space-2) md:grid-cols-3">
                {CARDS.map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={
                      reduce ? false : { opacity: 0, y: NAV_CARD_RISE_PX }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      ...NAV_CARD_SPRING,
                      delay: i * NAV_CARD_STAGGER_SECONDS,
                    }}
                    className="bg-bg border-line flex flex-col gap-(--space-4) rounded-(--radius-nav-inner) border p-(--space-4) md:min-h-(--nav-card-min-h)"
                  >
                    <div>
                      <p className="text-strong font-serif text-xl tracking-tight">
                        {card.label}
                      </p>
                      <p className="text-muted mt-(--space-1) text-sm">
                        {card.description}
                      </p>
                    </div>
                    <ul className="mt-auto flex flex-wrap gap-x-(--space-4) md:flex-col">
                      {card.links.map((l) => {
                        const isActive = l.id !== undefined && active === l.id;
                        const cls = cn(
                          "group flex min-h-(--hit-min) items-center gap-(--space-2) font-mono text-xs tracking-wider uppercase transition-[color,transform] duration-(--dur-instant) ease-(--ease-out) active:scale-(--press-scale) md:min-h-8",
                          isActive
                            ? "text-accent"
                            : "text-body hover:text-strong",
                          focusRing
                        );
                        const inner = (
                          <>
                            <ArrowUpRight
                              aria-hidden
                              size={14}
                              weight="bold"
                              className="shrink-0 transition-transform duration-(--dur-fast) ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                            {l.label}
                          </>
                        );
                        return (
                          <li key={l.label}>
                            {l.external ? (
                              <a
                                href={l.href}
                                onClick={close}
                                className={cls}
                                {...(l.href.startsWith("http")
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                              >
                                {inner}
                              </a>
                            ) : (
                              <Link
                                href={l.href}
                                onClick={close}
                                aria-current={isActive ? "true" : undefined}
                                className={cls}
                              >
                                {inner}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ))}
              </div>
              <ResumeTrigger
                onClick={close}
                className={cn(
                  "bg-strong text-bg mt-(--space-2) flex min-h-(--hit-min) w-full items-center justify-center rounded-(--radius-nav-inner) text-sm font-semibold transition-transform duration-(--dur-instant) ease-(--ease-out) active:scale-(--press-scale) sm:hidden",
                  focusRing
                )}
              >
                Resume
              </ResumeTrigger>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
