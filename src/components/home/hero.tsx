"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { animate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhotoStack } from "@/components/home/photo-stack";
import { BackdropSection } from "@/components/site/backdrop-section";
import { EASE_BASE } from "@/components/site/motion-tokens";
import { LocalTime } from "@/components/site/local-time";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

// Entrance under 700 ms: words rise with a 60 ms stagger, the rest fades.
// The portrait sits in front of the section's halftone print.
// Interruptible (scroll/click jumps to the final state); reduced motion
// shows the final state immediately.
const WORDS: { text: string; accent?: boolean }[] = [
  { text: "Building" },
  { text: "Products" },
  { text: "at" },
  { text: "scale.", accent: true },
];

// Typewriter: English first, then five languages, then English to stay.
const TYPE_SEQUENCE = [
  "Engineer",
  "Ingeniero",
  "Ingénieur",
  "Engenheiro",
  "Ingegnere",
  "エンジニア",
  "Engineer",
];
const ENGINEER_FINAL = "Engineer";
const TYPE_STEP = 60;
const DELETE_STEP = 32;
const HOLD_STEP = 950;

export function Hero() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(ENGINEER_FINAL);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const ease = EASE_BASE;
    const words = animate(
      ".hero-word",
      { opacity: [0, 1], y: [18, 0] },
      { duration: 0.7, delay: (i) => 0.05 + i * 0.06, ease }
    );
    const rest = animate(
      ".hero-fade",
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.7, delay: (i) => 0.3 + i * 0.08, ease }
    );
    const finish = () => {
      words.stop();
      rest.stop();
      document.querySelectorAll(".hero-word, .hero-fade").forEach((el) => {
        (el as HTMLElement).style.opacity = "";
        (el as HTMLElement).style.transform = "";
      });
    };
    window.addEventListener("wheel", finish, { once: true, passive: true });
    window.addEventListener("click", finish, { once: true });
    return () => {
      window.removeEventListener("wheel", finish);
      window.removeEventListener("click", finish);
      words.stop();
      rest.stop();
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const finish = () => {
      alive = false;
      window.clearTimeout(timer);
      setTyped(ENGINEER_FINAL);
      setDone(true);
    };
    const run = async () => {
      setTyped("");
      for (let i = 0; i < TYPE_SEQUENCE.length && alive; i += 1) {
        const word = TYPE_SEQUENCE[i];
        for (let c = 1; c <= word.length && alive; c += 1) {
          setTyped(word.slice(0, c));
          await wait(TYPE_STEP);
        }
        if (!alive || i === TYPE_SEQUENCE.length - 1) break;
        await wait(HOLD_STEP);
        for (let c = word.length - 1; c >= 0 && alive; c -= 1) {
          setTyped(word.slice(0, c));
          await wait(DELETE_STEP);
        }
      }
      if (alive) setDone(true);
    };
    run();
    window.addEventListener("wheel", finish, { once: true, passive: true });
    window.addEventListener("click", finish, { once: true });
    return () => {
      alive = false;
      window.clearTimeout(timer);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("click", finish);
    };
  }, [reduce]);

  const finished = reduce || done;

  const hidden = reduce ? undefined : { opacity: 0 };
  const current = experience[0];

  return (
    <BackdropSection id="top" backdrop="hero" className="pt-28 md:pt-32">
      <noscript>
        <style>{`.hero-word,.hero-fade{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            className="hero-fade glass border-line text-body inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border px-3 py-1.5 font-mono text-xs tracking-(--tracking-eyebrow) uppercase"
            style={hidden}
          >
            <span className="relative flex h-2 w-2">
              <span className="bg-signal absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-signal relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span>{profile.location}</span>
            <span aria-hidden>/</span>
            <LocalTime timeZone={profile.timezone} />
          </p>
          <h1
            className="hero-fade text-strong mt-6 text-5xl leading-[0.98] font-semibold tracking-tighter text-balance sm:text-7xl lg:text-8xl"
            style={hidden}
          >
            <span className="heading-fade">Hi, I&rsquo;m Ansh.</span>
            <br />
            <span className="text-muted">I&rsquo;m an </span>
            <span className="accent-serif accent-shine inline-block text-[1.12em]">
              <span aria-hidden>
                {typed}
                {!finished && (
                  <span aria-hidden className="animate-pulse">
                    |
                  </span>
                )}
              </span>
              <span className="sr-only">Engineer</span>
            </span>
          </h1>
          <p className="text-strong mt-8 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {WORDS.map((w) => (
              <span
                key={w.text}
                className={`hero-word mr-[0.24em] inline-block will-change-transform ${
                  w.accent ? "accent-serif text-accent text-[1.12em]" : ""
                }`}
                style={hidden}
              >
                {w.text}
              </span>
            ))}
          </p>
          <p
            className="hero-fade text-body mt-6 max-w-[46ch] text-lg leading-relaxed"
            style={hidden}
          >
            Full-stack apps, AI agents and eval pipelines that turn ideas into
            dependable products.
          </p>
          <div
            className="hero-fade mt-9 flex flex-wrap items-center gap-3"
            style={hidden}
          >
            <Link
              href="#work"
              className="bg-accent text-on-accent hover:bg-accent-hover group inline-flex items-center gap-2 rounded-full py-3.5 pr-5 pl-6 text-sm font-medium whitespace-nowrap transition-[background-color,transform] active:scale-[0.98]"
            >
              See my projects
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-(--dur-base) group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/resume"
              className="btn-fill border-line text-strong inline-flex items-center gap-2.5 rounded-full border py-3.5 pr-6 pl-5 font-mono text-xs whitespace-nowrap uppercase transition-transform active:scale-[0.98]"
            >
              <span
                aria-hidden
                className="btn-fill-dot bg-accent size-1.5 rounded-full"
              />
              [ Resume ]
            </Link>
          </div>
        </div>
        <div className="hero-fade lg:col-span-5" style={hidden}>
          <div className="relative mx-auto max-w-sm pt-10">
            <div className="relative">
              <div
                aria-hidden
                className="border-accent/40 absolute inset-0 translate-x-4 translate-y-4 rounded-[var(--radius-panel)] border"
              />
              <PhotoStack />
              <p
                aria-hidden
                className="accent-serif text-muted pointer-events-none absolute -top-9 -left-2 z-10 -rotate-6 text-lg"
              >
                drag me &#10022;
              </p>
            </div>
            <div className="glass border-line absolute -bottom-6 -left-4 z-10 rounded-2xl border px-5 py-4 shadow-sm sm:-left-8">
              <p className="text-strong text-xl leading-tight font-semibold tracking-tight">
                {current.org}
              </p>
              <p className="text-muted mt-0.5 text-sm">{current.role}</p>
            </div>
          </div>
        </div>
      </div>
    </BackdropSection>
  );
}
