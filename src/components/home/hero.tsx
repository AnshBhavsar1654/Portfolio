"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { animate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { AsciiDesk } from "@/components/home/ascii-desk";
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

// Entrance: six items (location, name, positioning, bio, actions, signal)
// rise into place 40 ms apart, 220 ms each, so the last one lands at 420 ms.
// Reduced motion shows the final state immediately.
export function Hero() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const run = animate(
      ".hero-fade",
      { opacity: [0, 1], y: [ENTER_RISE_PX, 0] },
      {
        duration: ENTER_SECONDS,
        delay: (i) => i * ENTER_STAGGER_SECONDS,
        ease: EASE_BASE,
      }
    );
    return () => run.stop();
  }, [reduce]);

  const hidden = reduce ? undefined : { opacity: 0 };

  return (
    <BackdropSection id="top" backdrop="none" className="pt-32 md:pt-44">
      <noscript>
        <style>{`.hero-fade{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1
            className="hero-fade text-strong text-6xl leading-(--leading-display) font-semibold tracking-(--tracking-display) text-balance sm:text-7xl lg:text-8xl xl:text-9xl"
            style={hidden}
          >
            <span className="heading-fade">{firstName}</span> <br />
            <span className="accent-serif accent-shine">{surname}</span>
          </h1>
          <p
            className="hero-fade text-muted mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-(--tracking-eyebrow) uppercase"
            style={hidden}
          >
            <MapPinIcon
              aria-hidden
              size={16}
              weight="fill"
              className="text-accent"
            />
            {profile.location}
          </p>
          <p
            className="hero-fade text-strong mt-6 text-2xl leading-(--leading-tight) font-semibold tracking-(--tracking-tight) sm:text-3xl xl:text-4xl"
            style={hidden}
          >
            <span className="text-muted">I&rsquo;m an </span>
            <span className="accent-serif accent-shine text-[1.12em]">
              {profile.positioning}
            </span>
          </p>
          <p
            className="hero-fade text-body mt-5 max-w-(--measure-body) text-lg leading-(--leading-body) text-pretty sm:text-xl"
            style={hidden}
          >
            {profile.heroBio}
          </p>
          <div
            className="hero-fade mt-12 flex flex-wrap items-center gap-3"
            style={hidden}
          >
            <Link
              href="#work"
              className="bg-accent text-on-accent hover:bg-accent-hover group inline-flex items-center gap-2 rounded-full py-3.5 pr-5 pl-6 text-sm font-medium whitespace-nowrap transition-[background-color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-(--press-scale)"
            >
              See my projects
              <ArrowRight
                aria-hidden
                size={16}
                weight="bold"
                className="transition-transform duration-(--dur-fast) ease-(--ease-out) group-hover:translate-x-0.5"
              />
            </Link>
            <ResumeTrigger className="btn-fill border-line text-strong inline-flex items-center gap-2.5 rounded-full border py-3.5 pr-6 pl-5 font-mono text-xs whitespace-nowrap uppercase transition-transform duration-(--dur-instant) ease-(--ease-out) active:scale-(--press-scale)">
              <span
                aria-hidden
                className="btn-fill-dot bg-accent size-1.5 rounded-full"
              />
              [ Resume ]
            </ResumeTrigger>
          </div>
        </div>
        <div className="hero-fade lg:col-span-5" style={hidden}>
          <div className="relative mx-auto max-w-xl">
            <AsciiDesk />
          </div>
        </div>
      </div>
    </BackdropSection>
  );
}
