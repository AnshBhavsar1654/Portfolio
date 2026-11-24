"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { interests } from "@/content/interests";

const MAX_COLUMNS = 120;
const MIN_COLUMNS = 64;
const ROW_ASPECT = 2.5;
const MIN_CELL_WIDTH = 3;
const BLACK_POINT = 0.1;
const DETAIL_WEIGHT = 1.25;
const CHARACTER_RAMP = " .,:;irsXA253hMHGS#9B&@";
const VISIBLE_CARDS = 4;
const THROW_DISTANCE = 0.28;
const THROW_VELOCITY = 0.55;
const THROW_MIN_DISTANCE = 24;

function brightness(pixels: Uint8ClampedArray, index: number) {
  return (
    (pixels[index] * 0.2126 +
      pixels[index + 1] * 0.7152 +
      pixels[index + 2] * 0.0722) /
    255
  );
}

function AsciiImage({
  src,
  description,
  active,
  crop,
}: {
  src: string;
  description: string;
  active: boolean;
  crop?: "center" | "top";
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
      const columns = Math.min(
        MAX_COLUMNS,
        Math.max(MIN_COLUMNS, Math.floor(width / MIN_CELL_WIDTH))
      );
      const rows = Math.round(columns / ROW_ASPECT);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const sample = document.createElement("canvas");
      sample.width = columns;
      sample.height = rows;
      const source = sample.getContext("2d", { willReadFrequently: true });
      if (!source) return;
      const scale = Math.max(
        columns / image.naturalWidth,
        rows / image.naturalHeight
      );
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      source.drawImage(
        image,
        (columns - drawWidth) / 2,
        crop === "top" ? 0 : (rows - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      const pixels = source.getImageData(0, 0, columns, rows).data;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const styles = getComputedStyle(canvas);
      const cellWidth = width / columns;
      const cellHeight = height / rows;
      ctx.fillStyle = styles.getPropertyValue("--desk-bg").trim();
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = styles.getPropertyValue("--desk-dot").trim();
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++)
          ctx.fillRect(
            column * cellWidth + cellWidth * 0.44,
            row * cellHeight + cellHeight * 0.48,
            cellWidth * 0.16,
            cellWidth * 0.16
          );
      ctx.font = `${Math.min(cellHeight, cellWidth / 0.6)}px ${styles.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const index = (row * columns + column) * 4;
          const level = Math.max(
            0,
            (brightness(pixels, index) - BLACK_POINT) / (1 - BLACK_POINT)
          );
          const previous = brightness(
            pixels,
            (row * columns + Math.max(0, column - 1)) * 4
          );
          const detail = Math.min(
            1,
            level + Math.abs(level - previous) * DETAIL_WEIGHT
          );
          const glyph = Math.floor(detail * (CHARACTER_RAMP.length - 1));
          if (glyph === 0) continue;
          ctx.fillStyle = `rgb(${pixels[index]} ${pixels[index + 1]} ${pixels[index + 2]})`;
          ctx.globalAlpha = 0.42 + detail * 0.58;
          ctx.fillText(
            CHARACTER_RAMP[glyph],
            (column + 0.5) * cellWidth,
            (row + 0.5) * cellHeight
          );
        }
      }
      ctx.globalAlpha = 1;
    };
    image.onload = draw;
    image.src = src;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      image.onload = null;
      disposed = true;
    };
  }, [crop, src]);
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={description}
      aria-hidden={!active}
      data-active={active}
      className="about-ascii-image"
    />
  );
}

export function AboutInterests() {
  const [active, setActive] = useState(0);
  const [showArtwork, setShowArtwork] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [throwDirection, setThrowDirection] = useState<-1 | 1 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    x: number;
    y: number;
    lastX: number;
    lastTime: number;
    velocityX: number;
  } | null>(null);
  const artworkId = useId();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShowArtwork(true);
      observer.disconnect();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const moveTo = useCallback((next: number) => {
    setDragOffset({ x: 0, y: 0 });
    setThrowDirection(null);
    setActive((next + interests.length) % interests.length);
  }, []);

  const throwTop = useCallback(
    (direction: -1 | 1) => {
      if (throwDirection !== null || interests.length < 2) return;
      setDragOffset({ x: 0, y: 0 });
      setThrowDirection(direction);
    },
    [throwDirection]
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      throwDirection !== null ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = {
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: 0,
    };
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = draggingRef.current;
    if (!drag) return;
    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    drag.velocityX =
      ((event.clientX - drag.lastX) / elapsed) * 0.8 + drag.velocityX * 0.2;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    setDragOffset({ x: event.clientX - drag.x, y: event.clientY - drag.y });
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = draggingRef.current;
    draggingRef.current = null;
    setIsDragging(false);
    if (!drag) return;
    const distance = event.clientX - drag.x;
    const deckWidth = deckRef.current?.clientWidth ?? 1;
    if (
      Math.abs(distance) > deckWidth * THROW_DISTANCE ||
      (Math.abs(drag.velocityX) > THROW_VELOCITY &&
        Math.abs(distance) > THROW_MIN_DISTANCE)
    ) {
      throwTop(distance >= 0 ? 1 : -1);
      return;
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const onPointerCancel = () => {
    draggingRef.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      aria-label="Interests"
      className="about-interests"
    >
      <div
        ref={deckRef}
        id={artworkId}
        className="about-interest-deck"
        role="region"
        aria-roledescription="carousel"
        aria-label="Things I enjoy"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") throwTop(1);
          else if (event.key === "ArrowLeft") moveTo(active - 1);
          else return;
          event.preventDefault();
        }}
      >
        {showArtwork &&
          interests.map((interest, index) => (
            <div
              key={interest.label}
              className="about-interest-card"
              data-top={index === active}
              data-dragging={index === active && isDragging}
              data-throwing={index === active && throwDirection !== null}
              aria-hidden={index !== active}
              onPointerDown={index === active ? onPointerDown : undefined}
              onPointerMove={index === active ? onPointerMove : undefined}
              onPointerUp={index === active ? onPointerUp : undefined}
              onPointerCancel={index === active ? onPointerCancel : undefined}
              onTransitionEnd={(event) => {
                if (
                  event.propertyName === "transform" &&
                  index === active &&
                  throwDirection !== null
                )
                  moveTo(active + 1);
              }}
              style={deckCardStyle({
                active,
                index,
                dragOffset,
                throwDirection,
              })}
            >
              <div className="about-interest-media">
                <AsciiImage
                  src={interest.image}
                  description={interest.description}
                  active={index === active}
                  crop={interest.crop}
                />
              </div>
              <div className="about-interest-caption">
                <span>{interest.label}</span>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(interests.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="about-deck-controls">
        <button
          type="button"
          className="about-deck-button"
          aria-label="Previous interest"
          aria-controls={artworkId}
          onClick={() => moveTo(active - 1)}
        >
          <ArrowLeft aria-hidden="true" weight="bold" className="size-4" />
        </button>
        <button
          type="button"
          className="about-deck-button"
          aria-label="Next interest"
          aria-controls={artworkId}
          onClick={() => throwTop(1)}
        >
          <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {interests[active].label}, card {active + 1} of {interests.length}
      </p>
    </section>
  );
}

function deckCardStyle({
  active,
  index,
  dragOffset,
  throwDirection,
}: {
  active: number;
  index: number;
  dragOffset: { x: number; y: number };
  throwDirection: -1 | 1 | null;
}): CSSProperties {
  const depth = (index - active + interests.length) % interests.length;
  const tilt = ((index * 17) % 9) - 4;
  const visible = depth < VISIBLE_CARDS;
  const isTop = depth === 0;
  const transform =
    throwDirection && isTop
      ? `translate(${throwDirection * 130}%, -10%) rotate(${throwDirection * 12}deg)`
      : isTop
        ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.045}deg)`
        : `translateY(${-depth}rem) scale(${1 - depth * 0.045}) rotate(${tilt}deg)`;

  return {
    transform,
    zIndex: interests.length - depth,
    opacity: visible ? 1 : 0,
    filter: isTop ? "none" : `brightness(${1 - depth * 0.07})`,
  };
}
