"use client";

import { useEffect, useRef, useState } from "react";
import { INTEREST_HOLD_SECONDS } from "@/components/site/motion-tokens";
import { interests } from "@/content/interests";

const COLUMNS = 90;
const ROWS = 48;
const CHARACTERS = " .,:;irsXA253hMHGS#9B&@";

function AsciiImage({
  src,
  description,
  active,
}: {
  src: string;
  description: string;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = new Image();
    let disposed = false;
    const draw = () => {
      if (disposed || !image.naturalWidth) return;
      const width = canvas.clientWidth;
      if (!width) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      const ctx = canvas.getContext("2d");
      const sample = document.createElement("canvas");
      sample.width = COLUMNS;
      sample.height = ROWS;
      const source = sample.getContext("2d", { willReadFrequently: true });
      if (!ctx || !source) return;
      const scale = Math.max(
        COLUMNS / image.naturalWidth,
        ROWS / image.naturalHeight
      );
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      source.drawImage(image, (COLUMNS - w) / 2, (ROWS - h) / 2, w, h);
      const pixels = source.getImageData(0, 0, COLUMNS, ROWS).data;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const cellWidth = width / COLUMNS;
      const cellHeight = height / ROWS;
      ctx.font = `${Math.min(cellHeight, cellWidth / 0.6)}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          const i = (row * COLUMNS + col) * 4;
          const brightness =
            (pixels[i] * 0.2126 +
              pixels[i + 1] * 0.7152 +
              pixels[i + 2] * 0.0722) /
            255;
          ctx.fillText(
            CHARACTERS[Math.floor(brightness * (CHARACTERS.length - 1))],
            (col + 0.5) * cellWidth,
            (row + 0.5) * cellHeight
          );
        }
      }
    };
    image.onload = draw;
    image.src = src;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => {
      disposed = true;
      observer.disconnect();
      image.onload = null;
    };
  }, [src]);
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={description}
      aria-hidden={!active}
      data-active={active}
      className="about-ascii-image text-body block h-full w-full font-mono"
    />
  );
}

export function AboutInterests() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(container);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !reduced.matches)
        setActive((current) => (current + 1) % interests.length);
    }, INTEREST_HOLD_SECONDS * 1000);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [paused]);
  return (
    <div
      ref={containerRef}
      className="about-interests flex flex-col justify-center"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-strong text-lg font-semibold">Beyond the bio</p>
        <p className="text-muted text-sm">A few things I enjoy</p>
      </div>
      <div className="about-ascii-frame mt-5 overflow-hidden">
        {interests.map((interest, index) => (
          <AsciiImage
            key={interest.image}
            src={interest.image}
            description={interest.description}
            active={index === active}
          />
        ))}
      </div>
      <div
        className="mt-5 flex flex-wrap gap-2"
        aria-label="Choose an interest"
      >
        {interests.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={index === active}
            onClick={() => {
              setActive(index);
              setPaused(true);
            }}
            className="about-interest-button"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className="about-interest-button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
