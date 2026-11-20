// The dream-desk scene as data: a W x H character grid, no DOM. `buildStatic`
// lays down everything that never moves (window with mountains, shelf, clock, furniture);
// `buildDynamic` returns what changes each tick (screens, stars, clouds, steam, lamp
// and screen glow, the clock hand, the pointer stir). Edit the layout by
// editing coordinates here. Colours are the --desk-* tokens.

// Ticks per second of the canvas loop (keep equal to FPS in ascii-desk.tsx).
export const TICKS_PER_SECOND = 8;

export const W = 144;
export const H = 72;

export const NAMES = [
  "bg",
  "dot",
  "line",
  "dim",
  "glow",
  "green",
  "blue",
  "pink",
  "plant",
  "wood",
  "moon",
] as const;
export type Palette = Record<(typeof NAMES)[number], string>;

export type Grid = { ch: string[][]; col: string[][] };
// [x0, y0, x1, y1] in cells, inclusive: painted with the background first.
export type Wipe = [number, number, number, number];
export type Clock = { h: number; m: number; s: number };
export type Frame = { grid: Grid; wipes: Wipe[] };

export function newGrid(fill: string): Grid {
  return {
    ch: Array.from({ length: H }, () => Array<string>(W).fill(" ")),
    col: Array.from({ length: H }, () => Array<string>(W).fill(fill)),
  };
}

function put(g: Grid, x: number, y: number, s: string, color: string) {
  if (y < 0 || y >= H) return;
  for (let i = 0; i < s.length; i++) {
    const cx = x + i;
    if (cx < 0 || cx >= W || s[i] === " ") continue;
    g.ch[y][cx] = s[i];
    g.col[y][cx] = color;
  }
}

function box(
  g: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: string
) {
  put(g, x0, y0, "+" + "-".repeat(x1 - x0 - 1) + "+", c);
  put(g, x0, y1, "+" + "-".repeat(x1 - x0 - 1) + "+", c);
  for (let y = y0 + 1; y < y1; y++) {
    put(g, x0, y, "|", c);
    put(g, x1, y, "|", c);
  }
}

// A screen: outline, a ring of bezel inside it, and the inner rect to wipe.
function screen(
  g: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  chin: number,
  P: Palette
): Wipe {
  box(g, x0, y0, x1, y1, P.line);
  put(g, x0 + 1, y0 + 1, ":".repeat(x1 - x0 - 1), P.dim);
  for (let y = y0 + 1; y < y1 - chin + 1; y++) {
    put(g, x0 + 1, y, ":", P.dim);
    put(g, x1 - 1, y, ":", P.dim);
  }
  for (let k = 0; k < chin; k++)
    put(g, x0 + 1, y1 - 1 - k, ":".repeat(x1 - x0 - 1), P.dim);
  return [x0 + 2, y0 + 2, x1 - 2, y1 - 1 - chin];
}

function hash(x: number, y: number, e: number) {
  let h =
    Math.imul(x, 374761393) +
    Math.imul(y, 668265263) +
    Math.imul(e, 1103515245);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const BAYER = [
  0.03, 0.53, 0.16, 0.66, 0.78, 0.28, 0.91, 0.41, 0.22, 0.72, 0.09, 0.59, 0.97,
  0.47, 0.84, 0.34,
];
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

// Layout ---------------------------------------------------------------------

// The big window: frame, then the scenic area inside it (x 8..110, y 6..29).
// A clear band of wall (rows 30..34) separates the window from the work setup.
const WIN = { x0: 6, y0: 4, x1: 112, y1: 27 };
const SCENE = { x0: 8, y0: 6, x1: 110, y1: 25 };
const MOON = { x0: 92, y0: 8, x1: 101, y1: 11 };
// Round clock, top right: centre and radii in cells (a cell is twice as tall
// as wide, so rx = 2 * ry makes it look round).
const CLOCK = { cx: 129, cy: 9, rx: 10, ry: 5 };

const LAPTOP = { x0: 14, y0: 35, x1: 70, y1: 50 };
const MONITOR = { x0: 84, y0: 33, x1: 140, y1: 50 };
const DESK_Y = 54;

const bump = (x: number, c: number, w: number, h: number) =>
  h * Math.exp(-(((x - c) / w) ** 2));

// Mountain ridge heights (cell rows) for three layers, far to near.
const RIDGES = [
  (x: number) =>
    17 -
    2 * Math.sin(x * 0.09 + 1) -
    1.2 * Math.sin(x * 0.21 + 2) -
    0.8 * Math.sin(x * 0.5) -
    bump(x, 36, 9, 5) -
    bump(x, 84, 7, 4),
  (x: number) =>
    20.5 -
    1.5 * Math.sin(x * 0.13 + 0.5) -
    Math.sin(x * 0.31 + 3) -
    bump(x, 62, 8, 3) -
    bump(x, 100, 6, 2),
  (x: number) =>
    23.5 -
    Math.sin(x * 0.17) -
    0.8 * Math.sin(x * 0.45 + 1) -
    bump(x, 20, 7, 2),
];

function drawMountains(g: Grid, P: Palette) {
  const colors = [P.dim, P.blue, P.plant];
  for (let L = 0; L < 3; L++) {
    for (let x = SCENE.x0; x <= SCENE.x1; x++) {
      const top = Math.max(SCENE.y0 + 1, Math.round(RIDGES[L](x)));
      const slope = Math.round(RIDGES[L](x + 1) - RIDGES[L](x - 1));
      for (let y = top; y <= SCENE.y1; y++) {
        const d = y - top;
        const v = hash(x, y, L);
        let ch: string;
        let color = colors[L];
        if (d === 0) {
          ch =
            L === 2
              ? v < 0.5
                ? "^"
                : "A"
              : slope < 0
                ? "/"
                : slope > 0
                  ? "\\"
                  : "^";
        } else if (L === 2) ch = v < 0.45 ? "#" : "%";
        else ch = v < 0.5 ? ":" : v < 0.8 ? "." : "=";
        // Snow on the high peaks of the far and middle ranges.
        if (L < 2 && top < 12 && d < 3 && d >= 0) {
          ch = d === 0 ? ch : v < 0.5 ? "*" : "+";
          color = P.moon;
        }
        g.ch[y][x] = ch;
        g.col[y][x] = color;
      }
    }
  }
}

export function buildStatic(P: Palette): Grid {
  const g = newGrid(P.line);
  // Window with mountains outside
  drawMountains(g, P);
  put(g, MOON.x0, 8, "  .oOOo.  ", P.moon);
  put(g, MOON.x0, 9, " oOOOOOOo ", P.moon);
  put(g, MOON.x0, 10, " oOOOOOOo ", P.moon);
  put(g, MOON.x0, 11, "  'oOOo'  ", P.moon);
  box(g, WIN.x0, WIN.y0, WIN.x1, WIN.y1, P.line);
  put(g, WIN.x0 + 1, WIN.y0 + 1, ":".repeat(WIN.x1 - WIN.x0 - 1), P.dim);
  put(g, WIN.x0 + 1, WIN.y1 - 1, ":".repeat(WIN.x1 - WIN.x0 - 1), P.dim);
  for (let y = WIN.y0 + 1; y < WIN.y1; y++) {
    put(g, WIN.x0 + 1, y, ":", P.dim);
    put(g, WIN.x1 - 1, y, ":", P.dim);
  }
  for (let y = SCENE.y0; y <= SCENE.y1; y++) put(g, 58, y, "||", P.line);
  put(g, SCENE.x0, 15, "=".repeat(SCENE.x1 - SCENE.x0 + 1), P.line);
  put(g, 4, WIN.y1 + 1, "=".repeat(WIN.x1 - WIN.x0 + 5), P.wood);
  put(g, 6, WIN.y1 + 2, "'", P.wood);
  put(g, 110, WIN.y1 + 2, "'", P.wood);

  // Round clock face: dotted rim, hour marks, numerals at 12, 3, 6 and 9
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2;
    const x = Math.round(CLOCK.cx + Math.sin(a) * CLOCK.rx);
    const y = Math.round(CLOCK.cy - Math.cos(a) * CLOCK.ry);
    put(g, x, y, k % 5 === 0 ? "O" : ".", k % 5 === 0 ? P.line : P.dim);
  }
  put(g, CLOCK.cx - 1, CLOCK.cy - CLOCK.ry + 1, "12", P.dim);
  put(g, CLOCK.cx - 1, CLOCK.cy + CLOCK.ry - 1, "6", P.dim);
  put(g, CLOCK.cx + CLOCK.rx - 3, CLOCK.cy, "3", P.dim);
  put(g, CLOCK.cx - CLOCK.rx + 3, CLOCK.cy, "9", P.dim);

  // Shelf: plant and books
  put(g, 116, 27, "=".repeat(26), P.wood);
  put(g, 118, 28, "'", P.wood);
  put(g, 139, 28, "'", P.wood);
  put(g, 118, 20, " \\|/ ", P.plant);
  put(g, 118, 21, "-\\|/-", P.plant);
  put(g, 118, 22, " \\|/ ", P.plant);
  put(g, 118, 23, "-\\|/-", P.plant);
  put(g, 118, 24, ".---.", P.pink);
  put(g, 118, 25, "\\   /", P.pink);
  put(g, 118, 26, " \\_/ ", P.pink);
  const heights = [6, 7, 5, 7, 6, 5, 6];
  const tints = [P.pink, P.blue, P.glow, P.green, P.pink, P.blue, P.glow];
  heights.forEach((h, i) => {
    for (let y = 0; y < h; y++) put(g, 126 + i * 2, 26 - y, "||", tints[i]);
  });

  // Lamp
  for (let y = 40; y <= 52; y++) put(g, 4, y, "|", P.line);
  put(g, 0, 53, "/=====\\", P.line);
  put(g, 4, 39, "._,----.", P.line);
  put(g, 5, 40, "/______\\", P.line);
  put(g, 4, 41, "/________\\", P.line);

  // Laptop
  screen(g, LAPTOP.x0, LAPTOP.y0, LAPTOP.x1, LAPTOP.y1, 1, P);
  put(g, 11, 51, "/" + "_".repeat(61) + "\\", P.line);
  put(g, 11, 52, "'" + "=".repeat(61) + "'", P.dim);

  // Monitor
  screen(g, MONITOR.x0, MONITOR.y0, MONITOR.x1, MONITOR.y1, 2, P);
  put(g, 110, 51, "||||", P.line);
  put(g, 103, 52, "_/" + "=".repeat(14) + "\\_", P.line);

  // Desk
  put(g, 0, DESK_Y, "=".repeat(W), P.wood);
  for (let y = DESK_Y + 1; y <= DESK_Y + 2; y++)
    for (let x = 0; x < W; x++) {
      const v = hash(x, y, 7);
      put(
        g,
        x,
        y,
        v < 0.5 ? "-" : v < 0.8 ? "~" : "=",
        v < 0.6 ? P.wood : P.dim
      );
    }
  for (const x of [8, 133])
    for (let y = DESK_Y + 3; y < H - 1; y++) put(g, x, y, "###", P.wood);
  put(g, 4, H - 1, "_".repeat(W - 8), P.dim);

  // Mug, desk plant, book stack
  put(g, 76, 52, " ____ ", P.pink);
  put(g, 76, 53, "|____|)", P.pink);
  put(g, 91, 51, " \\|/ ", P.plant);
  put(g, 91, 52, "-\\|/-", P.plant);
  put(g, 91, 53, "[___]", P.pink);
  put(g, 123, 52, "[#######]", P.blue);
  put(g, 123, 53, "[=======]", P.glow);
  return g;
}

// Dynamic --------------------------------------------------------------------

const CODE = [
  "import desk",
  "",
  "def build_desk():",
  "    setup = Laptop()",
  "    setup.attach(monitor)",
  "    for idea in backlog:",
  "        ship(idea)",
  "    return setup",
  "",
  "while coffee.is_warm():",
  "    focus(deep=True)",
  "    commit('small, often')",
  "",
  "# one more feature",
  "def iterate(version):",
  "    test(version)",
  "    return version + 1",
];

function codeLine(
  g: Grid,
  x: number,
  y: number,
  line: string,
  max: number,
  P: Palette
) {
  const text = line.slice(0, max);
  const comment = text.trimStart().startsWith("#");
  put(g, x, y, text, comment ? P.dim : P.line);
  if (comment) return;
  const re = /\b(def|for|while|return|in|True|import)\b|'[^']*'|\b\w+(?=\()/g;
  for (const m of text.matchAll(re)) {
    const c = m[1] ? P.pink : m[0].startsWith("'") ? P.green : P.blue;
    put(g, x + (m.index ?? 0), y, m[0], c);
  }
}

function glowChar(i: number) {
  return i > 0.7 ? "+" : i > 0.4 ? ":" : ".";
}

// Ordered-dither halo around a rect, written only into empty cells.
function halo(
  g: Grid,
  stat: Grid,
  r: { x0: number; y0: number; x1: number; y1: number },
  reach: number,
  color: string,
  amount: number,
  clip?: { x0: number; y0: number; x1: number; y1: number }
) {
  const ry = Math.ceil(reach / 2);
  for (let y = r.y0 - ry; y <= r.y1 + ry; y++)
    for (let x = r.x0 - reach; x <= r.x1 + reach; x++) {
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      if (clip && (x < clip.x0 || x > clip.x1 || y < clip.y0 || y > clip.y1))
        continue;
      const dx = Math.max(r.x0 - x, 0, x - r.x1);
      const dy = Math.max(r.y0 - y, 0, y - r.y1) * 2;
      const d = Math.hypot(dx, dy) / reach;
      if (d === 0 || d >= 1) continue;
      const i = (1 - d) ** 1.6 * amount;
      if (i > bayer(x, y) && stat.ch[y][x] === " " && g.ch[y][x] === " ")
        put(g, x, y, glowChar(i), color);
    }
}

export function buildDynamic(
  t: number,
  P: Palette,
  stat: Grid,
  pointer: { x: number; y: number } | null,
  now: { h: number; m: number; s: number }
): Frame {
  const g = newGrid(P.line);
  const wipes: Wipe[] = [];

  // Window: twinkling stars and drifting clouds, only in the open sky
  const sky = (x: number, y: number) => stat.ch[y][x] === " ";
  for (let y = SCENE.y0; y <= 16; y++)
    for (let x = SCENE.x0; x <= SCENE.x1; x++) {
      const v = hash(x, y, 3);
      if (v > 0.012 || !sky(x, y)) continue;
      const k = (Math.floor(t / 3) + Math.floor(v * 4000)) % 4;
      put(g, x, y, [".", "*", "+", "."][k], v < 0.006 ? P.moon : P.blue);
    }
  const span = SCENE.x1 - SCENE.x0 + 24;
  [
    { y: 9, sp: 0.22, seed: 12, art: "~-~~~-~~" },
    { y: 12, sp: 0.15, seed: 55, art: "~~-~~~~-~~~" },
    { y: 8, sp: 0.1, seed: 80, art: "~-~~" },
  ].forEach((c) => {
    const x0 = ((Math.floor(t * c.sp * 4) + c.seed) % span) + SCENE.x0 - 12;
    for (let i = 0; i < c.art.length; i++) {
      const x = x0 + i;
      if (x >= SCENE.x0 && x <= SCENE.x1 && sky(x, c.y) && g.ch[c.y][x] === " ")
        put(g, x, c.y, c.art[i], P.dim);
    }
  });

  // Clock hands from the real time: hour, minute and a thin second hand
  const hand = (angle: number, len: number, color: string, glyph?: string) => {
    const steps = Math.round(CLOCK.rx * len);
    for (let k = 1; k <= steps; k++) {
      const f = (k / steps) * len;
      const x = Math.round(CLOCK.cx + Math.sin(angle) * CLOCK.rx * f);
      const y = Math.round(CLOCK.cy - Math.cos(angle) * CLOCK.ry * f);
      const dx = Math.sin(angle);
      const dy = -Math.cos(angle);
      const ch =
        glyph ??
        (Math.abs(dx) < 0.38
          ? "|"
          : Math.abs(dy) < 0.38
            ? "-"
            : dx * dy > 0
              ? "/"
              : "\\");
      wipes.push([x, y, x, y]);
      put(g, x, y, ch, color);
    }
  };
  const sec = now.s;
  const min = now.m + sec / 60;
  const hr = (now.h % 12) + min / 60;
  hand((hr / 12) * Math.PI * 2, 0.5, P.pink);
  hand((min / 60) * Math.PI * 2, 0.8, P.glow);
  hand((sec / 60) * Math.PI * 2, 0.88, P.green, "'");
  put(g, CLOCK.cx, CLOCK.cy, "@", P.line);

  // Laptop: scrolling code with line numbers, cursor, status bar
  const lw: Wipe = [LAPTOP.x0 + 2, LAPTOP.y0 + 2, LAPTOP.x1 - 2, LAPTOP.y1 - 2];
  wipes.push(lw);
  const rows = lw[3] - lw[1];
  const top = Math.floor(t / 5) % CODE.length;
  for (let r = 0; r < rows; r++) {
    const n = (top + r) % CODE.length;
    put(g, lw[0] + 1, lw[1] + r, String(n + 1).padStart(2, " "), P.dim);
    codeLine(g, lw[0] + 5, lw[1] + r, CODE[n], lw[2] - lw[0] - 6, P);
  }
  const last = CODE[(top + rows - 1) % CODE.length];
  if (Math.floor(t / 4) % 2)
    put(g, lw[0] + 5 + last.length, lw[1] + rows - 1, "_", P.glow);
  put(
    g,
    lw[0] + 1,
    lw[3],
    " main* | python | utf-8 ".padEnd(lw[2] - lw[0] - 1),
    P.blue
  );

  // Monitor: a music player. Track, beat-driven equalizer, progress, controls.
  const mw: Wipe = [
    MONITOR.x0 + 2,
    MONITOR.y0 + 2,
    MONITOR.x1 - 2,
    MONITOR.y1 - 3,
  ];
  wipes.push(mw);
  const [mx0, my0, mx1, my1] = mw;
  put(g, mx0 + 1, my0, "o", P.pink);
  put(g, mx0 + 3, my0, "o", P.glow);
  put(g, mx0 + 5, my0, "o", P.green);
  put(g, mx0 + 10, my0, "music", P.dim);
  put(
    g,
    mx1 - 8,
    my0,
    ["~ )", "~ ))", "~ )))"][Math.floor(t / 3) % 3],
    P.green
  );

  put(g, mx0 + 2, my0 + 2, "NOW PLAYING", P.dim);
  put(g, mx0 + 2, my0 + 3, "late night shipping", P.glow);
  put(g, mx0 + 2, my0 + 4, "lofi beats to build to", P.dim);

  // Equalizer: a kick every 9 ticks swells the low bars, sines move the rest.
  const BARS = 24;
  const base = my1 - 2;
  const pulse = Math.max(0, 1 - ((t % 9) / 9) * 1.6);
  for (let i = 0; i < BARS; i++) {
    const v =
      0.35 +
      0.25 * Math.sin(t * 0.55 + i * 0.8) +
      0.2 * Math.sin(t * 0.31 + i * 1.7) +
      0.45 * pulse * (1 - i / BARS);
    const h = Math.max(1, Math.round(Math.min(1, Math.max(0.08, v)) * 7));
    for (let y = 0; y < h; y++) {
      const color = y >= 5 ? P.glow : y >= 3 ? P.blue : P.green;
      put(g, mx0 + 2 + i * 2, base - y, "#", color);
    }
  }

  // Progress: elapsed time counts up in real seconds (8 ticks per second).
  const TRACK = 225;
  const elapsed = (Math.floor(t / TICKS_PER_SECOND) + 72) % TRACK;
  const clock = (n: number) =>
    `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  const barW = 36;
  const fill = Math.round((elapsed / TRACK) * barW);
  put(g, mx0 + 2, my1 - 1, clock(elapsed).padStart(4, " "), P.dim);
  put(
    g,
    mx0 + 7,
    my1 - 1,
    "[" + "=".repeat(fill) + ">" + "-".repeat(barW - fill) + "]",
    P.line
  );
  put(g, mx0 + 7 + barW + 3, my1 - 1, clock(TRACK), P.dim);

  // Controls
  put(g, mx0 + 2, my1, "<3", P.pink);
  put(g, mx0 + 19, my1, "|<<    ||    >>|", P.line);
  put(g, mx1 - 9, my1, "vol )))", P.dim);

  // Steam
  const s = Math.floor(t / 2);
  for (let k = 0; k < 3; k++) {
    const x = 78 + Math.round(Math.sin(s * 0.7 + k) * 1.2);
    wipes.push([x - 1, 49 + k, x + 1, 49 + k]);
    put(g, x, 49 + k, k === 1 ? "(" : ")", P.dim);
  }

  // Light: lamp cone, laptop and monitor spill, moon halo
  const flick =
    0.88 +
    0.12 * Math.sin(t * 0.7) * (hash(0, 0, Math.floor(t / 3)) > 0.8 ? 1.6 : 1);
  for (let y = 42; y <= DESK_Y + 2; y++) {
    const half = 3 + (y - 42) * 0.85;
    for (let x = 0; x < 24; x++) {
      const dx = Math.abs(x - 8.5);
      if (dx >= half) continue;
      const i = (1 - dx / half) * (1 - (y - 42) / 18) * flick;
      if (i > bayer(x, y) && stat.ch[y][x] === " " && g.ch[y][x] === " ")
        put(g, x, y, glowChar(i), P.glow);
    }
  }
  const breath = 0.85 + 0.15 * Math.sin(t * 0.25);
  halo(g, stat, LAPTOP, 12, P.blue, 0.9 * breath);
  halo(g, stat, MONITOR, 14, P.green, 0.8 * breath);
  halo(g, stat, MOON, 9, P.moon, 0.9, SCENE);

  // Pointer stir: nearby characters flare and shuffle
  if (pointer) {
    const R = 9;
    for (let y = pointer.y - R; y <= pointer.y + R; y++)
      for (let x = pointer.x - R * 2; x <= pointer.x + R * 2; x++) {
        if (x < 0 || x >= W || y < 0 || y >= H) continue;
        const d = Math.hypot((x - pointer.x) / 2, y - pointer.y) / R;
        const c = stat.ch[y][x];
        if (d >= 1 || c === " " || g.ch[y][x] !== " ") continue;
        wipes.push([x, y, x, y]);
        const ramp = " .:-=+*#%@";
        const idx = ramp.indexOf(c);
        const ch =
          idx > 0
            ? ramp[Math.min(9, idx + 1 + Math.floor(hash(x, y, t) * 3))]
            : c;
        g.ch[y][x] = ch;
        g.col[y][x] = P.glow;
      }
  }
  return { grid: g, wipes };
}
