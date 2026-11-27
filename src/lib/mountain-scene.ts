export const SCENE_WIDTH = 1440;
export const SCENE_HEIGHT = 800;
export const CLOUD_WIDTH = 480;
export const CLOUD_HEIGHT = 267;
export const READING_WIDTH = 180;
export const READING_HEIGHT = 100;

type Point = [number, number];
type Color = [number, number, number];

const W = SCENE_WIDTH;
const H = SCENE_HEIGHT;

// These colors belong to the illustration. Each stop holds the sky, horizon,
// ridge tints and highlights for that time of day.
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const stopColors: readonly [number, readonly string[]][] = [
  [0, ["111321", "27223e", "474166", "4c4966", "272840", "141827", "696587"]],
  [320, ["151929", "332748", "70617e", "595773", "383953", "20243a", "827593"]],
  [390, ["414260", "9b6688", "f2ae87", "86758f", "55536a", "383549", "c2a2a8"]],
  [500, ["4c789a", "9aaeb8", "edd9b9", "9096a7", "626e80", "354954", "ded9ca"]],
  [750, ["3e739e", "91bad1", "dbd9bf", "7d9db0", "526d7f", "334b57", "e2e9e4"]],
  [
    1000,
    ["4f6583", "b6948b", "ffd19e", "937d89", "655c70", "403e50", "e5c1b1"],
  ],
  [
    1115,
    ["494162", "a05e7b", "ffab76", "875971", "4f3d55", "2c293e", "e8a5a2"],
  ],
  [
    1190,
    ["292643", "754562", "d77e74", "664b68", "40354f", "1d2034", "aa7a96"],
  ],
  [
    1350,
    ["111321", "27223e", "474166", "4c4966", "272840", "141827", "696587"],
  ],
  [
    1440,
    ["111321", "27223e", "474166", "4c4966", "272840", "141827", "696587"],
  ],
];
function rgb(hex: string): Color {
  const value = Number.parseInt(hex, 16);
  return [value >> 16, (value >> 8) & 255, value & 255];
}

function mix(a: Color, b: Color, t: number): Color {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function paint(color: Color, alpha = 1) {
  return `rgba(${color.map(Math.round).join(",")},${alpha})`;
}
const ink = rgb("0e111b");

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const random = seeded(4141);
const stars = Array.from({ length: 172 }, () => [
  random() * W,
  random() * H * 0.53,
  random() * 0.95 + 0.24,
  random() * 0.8 + 0.2,
]);

function lattice(x: number, y: number) {
  const hash = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
  return ((Math.imul(hash ^ (hash >>> 13), 1274126177) >>> 0) % 65536) / 65536;
}

function noiseAt(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const u = smooth(x - i);
  const v = smooth(y - j);
  return lerp(
    lerp(lattice(i, j), lattice(i + 1, j), u),
    lerp(lattice(i, j + 1), lattice(i + 1, j + 1), u),
    v
  );
}

// Sample once. Long horizontal cells and shorter detail cells form cloud
// bands with soft edges, which are then lit by the selected time of day.
function sampleClouds() {
  const density = new Float32Array(CLOUD_WIDTH * CLOUD_HEIGHT);
  for (let y = 0; y < CLOUD_HEIGHT; y += 1) {
    const height = y / CLOUD_HEIGHT;
    const falloff = 1 - smooth(clamp((height - 0.34) / 0.18));
    if (falloff === 0) break;
    for (let x = 0; x < CLOUD_WIDTH; x += 1) {
      const u = x / CLOUD_WIDTH;
      const warp = (noiseAt(u * 7 + 12, height * 8 + 3) - 0.5) * 3;
      const wide = noiseAt(u * 12 + 7, height * 27 + warp);
      const detail = noiseAt(u * 37 - 5, height * 75 + warp * 2);
      const grain = noiseAt(u * 91, height * 168);
      const shape = wide * 0.62 + detail * 0.27 + grain * 0.11;
      density[y * CLOUD_WIDTH + x] =
        smooth(clamp((shape - 0.42) / 0.28)) * falloff;
    }
  }
  return density;
}

function profile(anchors: Point[], detail: number, seed: number) {
  const noise = seeded(seed);
  const ridge: Point[] = [];
  let segment = 0;
  for (let x = 0; x <= W; x += 3) {
    while (segment < anchors.length - 2 && x > anchors[segment + 1][0])
      segment++;
    const [x0, y0] = anchors[segment];
    const [x1, y1] = anchors[segment + 1];
    const t = (x - x0) / (x1 - x0);
    const jagged =
      (Math.sin(x * 0.064) + 0.52 * Math.sin(x * 0.195)) * 0.45 +
      (noise() - 0.5) * 0.95;
    ridge.push([x, lerp(y0, y1, t) + jagged * detail]);
  }
  return ridge;
}

const far = profile(
  [
    [0, 450],
    [130, 399],
    [201, 411],
    [294, 352],
    [335, 369],
    [398, 384],
    [496, 348],
    [556, 370],
    [617, 350],
    [667, 378],
    [742, 357],
    [810, 377],
    [895, 351],
    [972, 378],
    [1068, 343],
    [1138, 353],
    [1203, 319],
    [1300, 348],
    [1440, 319],
  ],
  12,
  8
);
const massif = profile(
  [
    [0, 528],
    [111, 503],
    [185, 514],
    [265, 479],
    [340, 451],
    [410, 483],
    [487, 426],
    [558, 449],
    [629, 410],
    [674, 415],
    [724, 371],
    [756, 344],
    [784, 316],
    [806, 321],
    [836, 286],
    [864, 289],
    [899, 250],
    [920, 253],
    [956, 300],
    [984, 310],
    [1014, 343],
    [1051, 353],
    [1084, 320],
    [1109, 310],
    [1138, 285],
    [1170, 303],
    [1212, 350],
    [1259, 352],
    [1291, 373],
    [1348, 360],
    [1380, 391],
    [1440, 373],
  ],
  8,
  29
);
const lower = profile(
  [
    [0, 591],
    [141, 557],
    [226, 584],
    [298, 528],
    [342, 551],
    [435, 581],
    [494, 554],
    [592, 588],
    [660, 562],
    [740, 563],
    [850, 527],
    [945, 561],
    [1025, 524],
    [1083, 537],
    [1160, 498],
    [1253, 517],
    [1352, 460],
    [1440, 427],
  ],
  16,
  51
);
const front = profile(
  [
    [0, 653],
    [85, 642],
    [172, 616],
    [259, 662],
    [335, 638],
    [427, 678],
    [518, 674],
    [671, 718],
    [768, 714],
    [849, 685],
    [928, 708],
    [1046, 675],
    [1113, 653],
    [1201, 670],
    [1301, 610],
    [1440, 587],
  ],
  13,
  95
);

const faces = Array.from({ length: 73 }, (_, i) => {
  const seed = seeded(1205 + i * 113);
  const x = 630 + i * 10 + seed() * 8;
  const y = massif[Math.min(massif.length - 1, Math.round(x / 3))][1] + 2;
  const run = seed() * 128 + 16;
  const leg = seed() * 155 + 45;
  return {
    x,
    y,
    run,
    leg,
    shadow: seed() > 0.49,
    width: seed() * 11 + 3,
    split: seed(),
  };
});
export function createMountainScene(
  canvas: HTMLCanvasElement,
  clouds: HTMLCanvasElement,
  reading: HTMLCanvasElement
) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;
  const ctx = context;
  const cloudContext = clouds.getContext("2d");
  const readingContext = reading.getContext("2d");
  const cloudPixels = cloudContext?.createImageData(CLOUD_WIDTH, CLOUD_HEIGHT);
  const density = sampleClouds();

  function vertical(y0: number, y1: number, stops: [number, string][]) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach(([n, c]) => g.addColorStop(n, c));
    return g;
  }
  function polygon(points: Point[]) {
    ctx.beginPath();
    const [first, ...rest] = points;
    ctx.moveTo(...first);
    for (const point of rest) ctx.lineTo(...point);
    ctx.closePath();
  }
  function fillRidge(ridge: Point[], top: Color, bottom: Color, peak: number) {
    polygon([...ridge, [W, H], [0, H]]);
    ctx.fillStyle = vertical(peak, H, [
      [0, paint(top)],
      [1, paint(bottom)],
    ]);
    ctx.fill();
  }
  function glow(x: number, y: number, r: number, color: Color, alpha: number) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, paint(color, alpha));
    g.addColorStop(0.38, paint(color, alpha * 0.48));
    g.addColorStop(1, paint(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function disc(x: number, y: number, r: number, style: string) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = style;
    ctx.fill();
  }
  function palette(minute: number) {
    const index = stopColors.findIndex(([at]) => at > minute);
    const [a, c0] = stopColors[Math.max(0, index - 1)];
    const [b, c1] = stopColors[Math.max(1, index)];
    const t = smooth(clamp((minute - a) / (b - a)));
    return c0.map((hex, i) => mix(rgb(hex), rgb(c1[i]), t));
  }

  const grain = document.createElement("canvas");
  grain.width = 384;
  grain.height = 224;
  const gx = grain.getContext("2d");
  if (!gx) return;
  const grainData = gx.createImageData(grain.width, grain.height);
  const noise = seeded(812);
  for (let i = 0; i < grainData.data.length; i += 4) {
    const v = noise() > 0.5 ? 255 : 0;
    grainData.data[i] = grainData.data[i + 1] = grainData.data[i + 2] = v;
    grainData.data[i + 3] = Math.floor(noise() * 33);
  }
  gx.putImageData(grainData, 0, 0);
  return function renderScene(minute: number) {
    const [sky, mid, horizon, farColor, rock, near, snow] = palette(minute);
    const night =
      1 -
      smooth(clamp((minute - 310) / 208)) +
      smooth(clamp((minute - 1150) / 130));
    const daylight = 1 - clamp(night);
    ctx.fillStyle = vertical(0, 568, [
      [0, paint(sky)],
      [0.5, paint(mid)],
      [0.83, paint(horizon)],
      [1, paint(horizon)],
    ]);
    ctx.fillRect(0, 0, W, H);

    if (night > 0.02) {
      ctx.fillStyle = paint(rgb("f1e9dd"));
      stars.forEach(([x, y, r, a]) => {
        ctx.globalAlpha = a * night * 0.87;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 7);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    const sunPhase = clamp((minute - 335) / 855);
    const sunX = 291 + sunPhase * 795;
    // Keep the top of the arc in the visible sky beneath the floating nav.
    const sunY = 342 - Math.pow(Math.sin(sunPhase * Math.PI), 0.85) * 128;
    if (minute > 315 && minute < 1210) {
      const a = clamp((minute - 315) / 35) * clamp((1210 - minute) / 48);
      glow(sunX, sunY, 226, mix(horizon, rgb("ffd2a0"), 0.65), a * 0.51);
      glow(sunX, sunY, 82, rgb("ffcca0"), a * 0.53);
      disc(
        sunX,
        sunY,
        25,
        paint(rgb(daylight > 0.85 ? "fff0d7" : "ffe3bc"), a * 0.98)
      );
    }
    if (night > 0.04) {
      const hoursFromMidnight = (minute > 720 ? minute - 1440 : minute) / 60;
      const x = 1000 + hoursFromMidnight * 7;
      const y = 220 - Math.cos(hoursFromMidnight / 3) * 16;
      glow(x, y, 86, rgb("c0c3ee"), night * 0.29);
      disc(x, y, 17.5, paint(rgb("dce0f5"), night * 0.93));
      disc(x + 7, y - 5, 16.5, paint(mix(sky, mid, 0.18), night));
    }
    fillRidge(far, farColor, mix(farColor, sky, 0.4), 300);
    glow(720, 490, 526, horizon, 0.12 + daylight * 0.12);
    fillRidge(massif, mix(rock, snow, 0.23), mix(rock, ink, 0.47), 235);

    ctx.save();
    polygon([...massif, [W, H], [0, H]]);
    ctx.clip();
    faces.forEach(({ x, y, run, leg, shadow, width, split }) => {
      const faceColor = shadow ? mix(rock, ink, 0.5) : mix(rock, snow, 0.62);
      polygon([
        [x, y],
        [x + width, y + 12],
        [x + run * 0.43 + width, y + leg * 0.53],
        [x + run + width * 2, y + leg],
        [x + run * 0.69, y + leg * 0.89],
        [x + run * 0.24, y + leg * 0.5],
      ]);
      ctx.fillStyle = vertical(y, y + leg, [
        [0, paint(faceColor, shadow ? 0.75 : 0.77)],
        [0.42, paint(faceColor, 0.36 + split * 0.19)],
        [1, paint(faceColor, 0)],
      ]);
      ctx.fill();
    });
    ctx.restore();
    glow(596, 538, 372, horizon, 0.15 + daylight * 0.06);
    fillRidge(lower, mix(near, farColor, 0.35), mix(near, ink, 0.37), 414);
    glow(1208, 561, 395, horizon, 0.17);
    fillRidge(front, mix(near, ink, 0.32), mix(near, ink, 0.65), 585);
    ctx.globalAlpha = 0.28;
    ctx.drawImage(grain, 0, 0, W, H);
    ctx.globalAlpha = 1;
    if (cloudPixels && cloudContext) {
      const evening = Math.sin(Math.PI * clamp((minute - 940) / 360));
      const shadow = mix(sky, mix(mid, ink, 0.42), 0.65);
      const lit = mix(snow, horizon, 0.36 + evening * 0.48);
      for (let i = 0; i < density.length; i += 1) {
        const tone = density[i];
        const above = density[i - CLOUD_WIDTH * 2] ?? 0;
        const rim = clamp((above - tone) * 3 + (1 - tone) * 0.16);
        const highlight = rim * (0.24 + daylight * 0.26 + evening * 0.5);
        const offset = i * 4;
        cloudPixels.data[offset] = lerp(shadow[0], lit[0], highlight);
        cloudPixels.data[offset + 1] = lerp(shadow[1], lit[1], highlight);
        cloudPixels.data[offset + 2] = lerp(shadow[2], lit[2], highlight);
        cloudPixels.data[offset + 3] =
          tone * (90 + daylight * 80 + evening * 35);
      }
      cloudContext.putImageData(cloudPixels, 0, 0);
    }

    if (readingContext) {
      // Cache a blurred version when the clock changes. Scrolling only
      // blends two layers, even while the clouds keep drifting.
      readingContext.filter = "blur(3px)";
      readingContext.drawImage(
        canvas,
        -7,
        -7,
        READING_WIDTH + 14,
        READING_HEIGHT + 14
      );
      if (cloudContext) {
        readingContext.drawImage(
          clouds,
          -7,
          -7,
          READING_WIDTH + 14,
          READING_HEIGHT + 14
        );
      }
    }
  };
}
