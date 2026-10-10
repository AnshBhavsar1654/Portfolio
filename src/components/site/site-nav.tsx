"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useActiveSection } from "@/components/site/use-active-section";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/#experience", id: "experience", label: "Experience" },
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#research", id: "research", label: "Research" },
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
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-(--dur-base)",
        scrolled
          ? "border-line bg-bg/80 backdrop-blur"
          : "border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4"
      >
        <Link
          href="/#top"
          className="text-strong text-sm font-medium tracking-tight"
        >
          Ansh Bhavsar
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={active === l.id ? "true" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-sm transition-colors",
                active === l.id ? "text-strong" : "text-muted hover:text-strong"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/resume"
            className="text-muted hover:text-strong px-3 py-2 text-sm transition-colors"
          >
            Resume
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
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
          className="bg-bg fixed inset-x-0 top-16 bottom-0 px-4 pt-4 lg:hidden"
        >
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-strong block rounded-xl px-4 py-4 text-lg"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            className="text-muted block rounded-xl px-4 py-4 text-lg"
          >
            Resume
          </Link>
          <p className="text-muted px-4 pt-6 text-sm">{profile.email}</p>
        </div>
      ) : null}
    </header>
  );
}
