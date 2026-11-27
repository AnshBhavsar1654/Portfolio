"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Art } from "@/content/art";
import styles from "./quote-backdrop.module.css";

export function HalftoneImage({
  src,
  focusX,
  focusY,
}: Pick<Art, "src" | "focusX" | "focusY">) {
  const box = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const screen = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = box.current;
    const photo = image.current;
    const canvas = screen.current;
    const ctx = canvas?.getContext("2d");
    if (!frame || !photo || !canvas || !ctx) return;
    const sampler = document.createElement("canvas");
    const sample = sampler.getContext("2d", { willReadFrequently: true });
    if (!sample) return;
    let tones: Uint8ClampedArray | undefined;

    const paint = () => {
      if (!tones) return;
      const palette = getComputedStyle(frame);
      const ink = palette.getPropertyValue("--ht-ink").trim();
      const printHighlights =
        palette.getPropertyValue("--ht-invert").trim() === "1";
      const pitchX = canvas.width / sampler.width;
      const pitchY = canvas.height / sampler.height;
      const maxRadius = Math.min(pitchX, pitchY) * 0.45;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.beginPath();
      for (let row = 0; row < sampler.height; row += 1) {
        for (let col = 0; col < sampler.width; col += 1) {
          const offset = (row * sampler.width + col) * 4;
          const luma =
            (0.2126 * tones[offset] +
              0.7152 * tones[offset + 1] +
              0.0722 * tones[offset + 2]) /
            255;
          const tone = printHighlights ? luma : 1 - luma;
          const radius = maxRadius * tone ** 0.87;
          if (radius < 0.25) continue;
          const x = (col + 0.5) * pitchX;
          const y = (row + 0.5) * pitchY;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    // Match the photo's object-fit cover crop. The small grayscale sample
    // survives theme changes, so only the dot ink and polarity need repainting.
    const resize = () => {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      if (!photo.complete || !photo.naturalWidth || !width || !height) return;
      const pitch =
        Number.parseFloat(
          getComputedStyle(frame).getPropertyValue("--ht-photo-cell")
        ) || 4;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      sampler.width = Math.ceil(width / pitch);
      sampler.height = Math.ceil(height / pitch);
      const scale = Math.max(
        width / photo.naturalWidth,
        height / photo.naturalHeight
      );
      const cropWidth = width / scale;
      const cropHeight = height / scale;
      sample.drawImage(
        photo,
        (photo.naturalWidth - cropWidth) * focusX,
        (photo.naturalHeight - cropHeight) * focusY,
        cropWidth,
        cropHeight,
        0,
        0,
        sampler.width,
        sampler.height
      );
      tones = sample.getImageData(0, 0, sampler.width, sampler.height).data;
      paint();
    };

    const size = new ResizeObserver(resize);
    size.observe(frame);
    const appearance = frame.closest("[data-folio-appearance]");
    const theme = new MutationObserver(paint);
    if (appearance)
      theme.observe(appearance, {
        attributes: true,
        attributeFilter: ["data-folio-appearance"],
      });
    photo.addEventListener("load", resize);
    resize();
    return () => {
      photo.removeEventListener("load", resize);
      size.disconnect();
      theme.disconnect();
    };
  }, [src, focusX, focusY]);

  return (
    <div ref={box} className={styles.frame}>
      <Image
        ref={image}
        src={src}
        alt=""
        fill
        unoptimized
        loading="eager"
        className={styles.photo}
        style={{ objectPosition: `${focusX * 100}% ${focusY * 100}%` }}
      />
      <canvas ref={screen} className={styles.screen} />
    </div>
  );
}
