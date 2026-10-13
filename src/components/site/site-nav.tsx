"use client";

import { List, X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useActiveSection } from "@/components/site/use-active-section";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/#experience", id: "experience", label: "Experience" },
  { href: "/#education", id: "education", label: "Education" },
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#contact", id: "contact", label: "Contact" },
];

const IDS = LINKS.map((l) => l.id);

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const active = useActiveSection(IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus trap + Esc for the mobile sheet.
  useEffect(() => {
    // Return focus to the menu button only after the sheet was actually open.
    if (!open) {
      if (wasOpenRef.current) buttonRef.current?.focus({ preventScroll: true });
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    focusables?.[0]?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-(--nav-offset) z-40 px-4">
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto relative z-10 mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between rounded-full border pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-(--dur-base)",
          scrolled
            ? "border-line bg-bg/75 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          href="/#top"
          className="text-strong flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span aria-hidden className="bg-accent h-2.5 w-2.5 rounded-full" />
          {profile.name}
        </Link>
        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={active === l.id ? "true" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                active === l.id ? "text-strong" : "text-muted hover:text-strong"
              )}
            >
              {active === l.id ? (
                <motion.span
                  layoutId="nav-pill"
                  aria-hidden
                  className="bg-surface-2 absolute inset-0 -z-10 rounded-full"
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                />
              ) : null}
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/resume"
            className="bg-strong text-bg hidden rounded-full px-4 py-2 font-mono text-xs uppercase transition-opacity hover:opacity-85 sm:inline-block"
          >
            Resume
          </Link>
          <ThemeToggle />
          <button
            suppressHydrationWarning
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-strong flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-bg pointer-events-auto fixed inset-0 px-4 pt-24 lg:hidden"
        >
          {LINKS.map((l, i) => (
            <Link
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-strong border-line flex items-baseline gap-4 border-b px-2 py-5 text-3xl tracking-tight"
            >
              <span className="text-accent font-mono text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </Link>
          ))}
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            className="text-muted block px-2 py-5 text-lg"
          >
            Resume
          </Link>
          <p className="text-muted px-2 pt-6 font-mono text-sm">
            {profile.email}
          </p>
        </div>
      ) : null}
    </header>
  );
}
