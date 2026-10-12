"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { animate, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { LocalTime } from "@/components/site/local-time";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

// Entrance under 700 ms: words rise with a 60 ms stagger, portrait fades.
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
    const ease = [0.16, 1, 0.3, 1] as const;
    const words = animate(
      ".hero-word",
      { opacity: [0, 1], y: [18, 0] },
      { duration: 0.45, delay: (i) => 0.05 + i * 0.06, ease }
    );
    const rest = animate(
      ".hero-fade",
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.5, delay: (i) => 0.3 + i * 0.08, ease }
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
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0 -z-10"
      />
      <noscript>
        <style>{`.hero-word,.hero-fade{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <div className="grid items-center gap-14 pb-16 lg:min-h-[36rem] lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-7">
            <p
              className="hero-fade text-muted flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-(--tracking-eyebrow) uppercase"
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
              Hi, I&rsquo;m Ansh.
              <br />
              <span className="text-muted">I&rsquo;m an </span>
              <span className="accent-serif text-accent inline-block text-[1.12em]">
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
                View my work
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform duration-(--dur-base) group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/resume"
                className="border-line text-strong hover:bg-surface-2 inline-flex items-center rounded-full border px-6 py-3.5 font-mono text-xs whitespace-nowrap uppercase transition-[background-color,transform] active:scale-[0.98]"
              >
                [ Resume ]
              </Link>
            </div>
          </div>
          <div className="hero-fade lg:col-span-5" style={hidden}>
            <div className="relative mx-auto max-w-sm">
              <div
                aria-hidden
                className="border-accent/40 absolute inset-0 translate-x-4 translate-y-4 rounded-[var(--radius-panel)] border"
              />
              <div className="border-line bg-surface relative overflow-hidden rounded-[var(--radius-panel)] border">
                <Image
                  src={profile.heroImage}
                  alt="Portrait of Ansh Bhavsar"
                  width={960}
                  height={1200}
                  priority
                  sizes="384px"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <div
                className="float-badge border-line bg-surface/90 absolute -right-4 bottom-10 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur sm:-right-8"
                style={
                  { "--tilt": "3deg", animationDelay: "-3s" } as CSSProperties
                }
              >
                <p className="text-muted font-mono text-[11px] uppercase">
                  {current.role}
                </p>
                <p className="text-strong text-lg leading-tight font-semibold tracking-tight">
                  {current.org}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
