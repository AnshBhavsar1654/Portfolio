"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { animate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroSignal } from "@/components/home/hero-signal";
import { BackdropSection } from "@/components/site/backdrop-section";
import { EASE_BASE } from "@/components/site/motion-tokens";
import { LocalTime } from "@/components/site/local-time";
import { ResumeTrigger } from "@/components/site/resume-dialog";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

const [firstName, ...surnameParts] = profile.name.split(" ");
const surname = surnameParts.join(" ");

// Entrance under 700 ms: the stack fades up in sequence. The dot signal on
// the right is the hero's own print. Interruptible (scroll/click jumps to
// the final state); reduced motion shows the final state immediately.
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
    const rest = animate(
      ".hero-fade",
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.7, delay: (i) => 0.3 + i * 0.08, ease }
    );
    const finish = () => {
      rest.stop();
      document.querySelectorAll(".hero-fade").forEach((el) => {
        (el as HTMLElement).style.opacity = "";
        (el as HTMLElement).style.transform = "";
      });
    };
    window.addEventListener("wheel", finish, { once: true, passive: true });
    window.addEventListener("click", finish, { once: true });
    return () => {
      window.removeEventListener("wheel", finish);
      window.removeEventListener("click", finish);
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
    <BackdropSection id="top" backdrop="none" className="pt-28 md:pt-32">
      <noscript>
        <style>{`.hero-fade{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
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
            className="hero-fade text-strong mt-6 text-5xl leading-[0.98] font-semibold tracking-tighter text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
            style={hidden}
          >
            <span className="heading-fade">{firstName}</span> <br />
            <span className="accent-serif accent-shine">{surname}</span>
          </h1>
          <p
            className="hero-fade text-strong mt-8 text-3xl font-semibold tracking-tight text-balance sm:text-4xl xl:text-5xl"
            style={hidden}
          >
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
          </p>
          <p
            className="hero-fade text-body mt-6 max-w-[54ch] text-lg leading-relaxed sm:text-xl"
            style={hidden}
          >
            Building products at scale: full-stack apps,{" "}
            <strong className="text-strong font-semibold">AI agents</strong> and{" "}
            <strong className="text-strong font-semibold">RAG systems</strong>{" "}
            that turn ideas into dependable software.
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
            <ResumeTrigger className="btn-fill border-line text-strong inline-flex items-center gap-2.5 rounded-full border py-3.5 pr-6 pl-5 font-mono text-xs whitespace-nowrap uppercase transition-transform active:scale-[0.98]">
              <span
                aria-hidden
                className="btn-fill-dot bg-accent size-1.5 rounded-full"
              />
              [ Resume ]
            </ResumeTrigger>
          </div>
        </div>
        <div className="hero-fade lg:col-span-5" style={hidden}>
          <div className="relative mx-auto max-w-md pb-8">
            <div className="aspect-[5/4] w-full">
              <HeroSignal />
            </div>
            <div className="glass absolute bottom-0 left-2 z-10 rounded-2xl px-5 py-4 shadow-sm sm:-left-4">
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
