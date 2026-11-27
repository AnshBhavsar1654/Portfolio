"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { animate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BackdropSection } from "@/components/site/backdrop-section";
import {
  EASE_BASE,
  ENTER_RISE_PX,
  ENTER_SECONDS,
  ENTER_STAGGER_SECONDS,
} from "@/components/site/motion-tokens";
import { ResumeTrigger } from "@/components/site/resume-dialog";
import { profile } from "@/content/profile";

const [firstName, ...surnameParts] = profile.name.split(" ");
const surname = surnameParts.join(" ");

export function Hero() {
  const reduce = useReducedMotion();
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = content.current?.querySelectorAll(".hero-fade");
    if (reduce || !items?.length) return;
    const run = animate(
      items,
      { opacity: [0, 1], y: [ENTER_RISE_PX, 0] },
      {
        duration: ENTER_SECONDS,
        delay: (i) => i * ENTER_STAGGER_SECONDS,
        ease: EASE_BASE,
      }
    );
    return () => run.stop();
  }, [reduce]);

  return (
    <BackdropSection id="top" className="pt-28 pb-28 md:pt-32 md:pb-28">
      <div ref={content} className="max-w-2xl">
        <h1 className="hero-fade text-strong text-6xl leading-(--leading-display) font-semibold tracking-(--tracking-display) text-balance sm:text-7xl lg:text-8xl xl:text-9xl">
          {firstName} <br />
          <span className="accent-serif accent-shine">{surname}</span>
        </h1>
        <p className="hero-fade text-strong mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
          <MapPinIcon
            aria-hidden
            size={16}
            weight="fill"
            className="text-accent"
          />
          {profile.location}
        </p>
        <p className="hero-fade text-strong mt-6 font-serif text-2xl leading-(--leading-tight) font-normal tracking-(--tracking-tight) sm:text-3xl xl:text-4xl">
          <span className="text-body">I&rsquo;m an </span>
          <span className="accent-serif accent-shine">
            {profile.positioning}
          </span>
        </p>
        <p className="hero-fade text-body mt-5 max-w-lg text-lg leading-(--leading-body) text-pretty sm:text-xl">
          {profile.heroBio}
        </p>
        <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#work"
            className="bg-accent text-on-accent hover:bg-accent-hover group inline-flex items-center gap-2 py-3.5 pr-5 pl-6 text-sm font-medium whitespace-nowrap transition-[background-color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-(--press-scale)"
          >
            See my projects
            <ArrowRight
              aria-hidden
              size={16}
              weight="bold"
              className="transition-transform duration-(--dur-fast) ease-(--ease-out) group-hover:translate-x-0.5"
            />
          </Link>
          <ResumeTrigger className="btn-fill border-rule text-strong inline-flex items-center gap-2.5 border-2 py-3.5 pr-6 pl-5 font-mono text-xs whitespace-nowrap uppercase transition-transform duration-(--dur-instant) ease-(--ease-out) active:scale-(--press-scale)">
            <span aria-hidden className="btn-fill-dot bg-accent size-1.5" />[
            Resume ]
          </ResumeTrigger>
        </div>
      </div>
    </BackdropSection>
  );
}
