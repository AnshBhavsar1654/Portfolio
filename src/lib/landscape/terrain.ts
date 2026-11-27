import { BufferAttribute, PlaneGeometry, Vector3 } from "three";
import { lakeLevel, type LandscapeConfig } from "./config";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const saturate = (n: number) => Math.max(0, Math.min(1, n));

function noise(x: number, z: number, seed: number) {
  const i = Math.floor(x);
  const j = Math.floor(z);
  const hash = (a: number, b: number) => {
    let h =
      Math.imul(a, 374761393) ^
      Math.imul(b, 668265263) ^
      Math.imul(seed, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const fade = (t: number) => t * t * (3 - 2 * t);
  return mix(
    mix(hash(i, j), hash(i + 1, j), fade(x - i)),
    mix(hash(i, j + 1), hash(i + 1, j + 1), fade(x - i)),
    fade(z - j)
  );
}

export function sunDirection(config: LandscapeConfig) {
  const elevation = (config.elevation * Math.PI) / 180;
  const azimuth = (config.azimuth * Math.PI) / 180;
  return new Vector3(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimuth) * Math.cos(elevation)
  );
}

// Heights along the watershed and its major tributaries. Each segment
// falls away at a different rate on its windward and leeward sides.
type Crest = readonly [number, number, number];
const watershed: Crest[] = [
  [-28, -26, 0.19],
  [-20, -22, 0.34],
  [-16, -22, 0.29],
  [-13, -19, 0.49],
  [-11, -18, 0.53],
  [-8.6, -15, 0.68],
  [-7.9, -15, 0.61],
  [-6.8, -15.8, 0.65],
  [-5, -14.7, 0.57],
  [-3.7, -15, 0.65],
  [-2.3, -13, 0.7],
  [-1.2, -10.7, 0.83],
  [-0.55, -10.2, 0.79],
  [0, -9.4, 1],
  [0.6, -9.7, 0.91],
  [1.5, -10.4, 0.69],
  [3, -11.5, 0.59],
  [4.8, -13, 0.7],
  [6.7, -13.9, 0.56],
  [8.4, -15.6, 0.58],
  [10, -17, 0.47],
  [14, -18, 0.43],
  [19, -20, 0.35],
  [28, -25, 0.19],
];
const spurs: Crest[][] = [
  [watershed[13], [-1.65, -6.3, 0.74], [-3.45, -3.6, 0.54], [-5.8, 1, 0.19]],
  [watershed[14], [2.8, -6.3, 0.53], [3.8, -4, 0.32], [5.9, 0.3, 0.14]],
  [watershed[10], [-4.6, -9.3, 0.51], [-5.7, -6.1, 0.43], [-8.1, -3.9, 0.19]],
  [watershed[5], [-9.4, -12.4, 0.56], [-11.3, -8.2, 0.42], [-14.2, -6.2, 0.21]],
  [watershed[17], [5.8, -9.8, 0.55], [7.2, -6.9, 0.35], [10.2, -4, 0.13]],
];
const ridgeSegments = [watershed, ...spurs].flatMap((crest, index) =>
  crest.slice(1).map((end, i) => ({ start: crest[i], end, spine: index === 0 }))
);

function terrainHeight(x: number, z: number, c: LandscapeConfig) {
  const n = (a: number, b: number) => noise(a, b, c.seed);
  const wx = x + (n(x * 0.28, z * 0.24) - 0.5) * c.warp * 2.7;
  const wz = z + (n(x * 0.25 + 31, z * 0.24) - 0.5) * c.warp * 2.1;
  const rx = (wx - c.summit) / c.width;
  let main = 0;
  for (const {
    start: [ax, az, ah],
    end: [bx, bz, bh],
    spine,
  } of ridgeSegments) {
    const dx = bx - ax,
      dz = bz - az;
    const t = saturate(((rx - ax) * dx + (wz - az) * dz) / (dx * dx + dz * dz));
    const vx = rx - mix(ax, bx, t),
      vz = wz - mix(az, bz, t);
    const side = vx * dz - vz * dx;
    const falloff = side < 0 ? (spine ? 1.06 : 1.24) : spine ? 1.28 : 1.55;
    const distance = Math.hypot(vx, vz);
    const relief = c.height * mix(ah, bh, t);
    main = Math.max(main, relief - Math.pow(distance, 0.89) * falloff);
  }
  const spine = 0.68 * Math.exp(-((wz + 13) ** 2) / 63);
  const distanceFromValley = Math.abs(wx - (1.8 + Math.sin(z * 0.22) * 2.1));
  const valley = 1 - Math.exp(-(distanceFromValley ** 2) / (12 * c.valley));
  const foothills =
    (0.72 + n(wx * 0.19, wz * 0.26) * 1.45 + n(wx * 0.54, wz * 0.57) * 0.51) *
    valley *
    (0.62 + 0.38 * Math.sin(wz * 0.72 + wx * 0.18));
  const gullies = Math.abs(n(wx * 1.18 + wz * 0.47, wz * 0.52) * 2 - 1);
  const ribs = 1 - Math.abs(n(wx * 1.93 - wz * 0.79, wz * 0.84) * 2 - 1);
  const eroded =
    (-(gullies ** 2) * 0.77 + ribs ** 3 * 0.32) *
    c.erosion *
    saturate(main / 2.1);
  const rough =
    (n(wx * 1.8, wz * 2.1) - 0.5) * 0.53 + (n(wx * 4, wz * 4.25) - 0.5) * 0.19;
  const alpine = -0.85 + spine + main + foothills + eroded + rough * c.detail;

  // Cut a broad lake into the near valley. Seeded shelves and headlands
  // leave an irregular shoreline where the heightfield meets the water.
  const coast = -1.8 + 0.8 * Math.sin(x * 0.39) + n(x * 0.52, 7) * 1.3;
  const shore = (coast - z) * 0.24;
  const islands = n(x * 0.37, z * 0.88) * 0.25;
  const basin = lakeLevel + Math.max(-0.65, shore) + islands - 0.12;
  const shoreSpan = saturate((z - coast + 2.8) / 4.1);
  const lakeBed = mix(
    alpine,
    basin,
    shoreSpan * shoreSpan * (3 - 2 * shoreSpan)
  );
  const rightBank =
    2.35 *
    Math.exp(-((x - 13.2 + 0.36 * (z + 0.8)) ** 2) / 8 - (z + 2.3) ** 2 / 26);
  const leftBank =
    0.96 * Math.exp(-((x + 11.8 - 0.22 * z) ** 2) / 12 - (z + 2.1) ** 2 / 16);
  return lakeBed + rightBank + leftBank;
}

export function makeTerrain(config: LandscapeConfig, compact: boolean) {
  const width = 70,
    depth = 61,
    centerZ = -12;
  const columns = Math.round((compact ? 295 : 415) * config.quality);
  const rows = Math.round((compact ? 235 : 320) * config.quality);
  const mesh = new PlaneGeometry(width, depth, columns, rows);
  mesh.rotateX(-Math.PI / 2);
  mesh.translate(0, 0, centerZ);
  const positions = mesh.attributes.position;
  const heights = new Float32Array(positions.count);
  for (let i = 0; i < positions.count; i++) {
    const height = terrainHeight(positions.getX(i), positions.getZ(i), config);
    positions.setY(i, height);
    heights[i] = height;
  }
  mesh.computeVertexNormals();

  const sunlight = sunDirection(config);
  const shadows = heights.map((height, i) => {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    let occlusion = 0;
    for (let step = 0.36; step < 26; step *= 1.32) {
      const col = ((x + step * sunlight.x + width / 2) / width) * columns;
      const row =
        ((z + step * sunlight.z - centerZ + depth / 2) / depth) * rows;
      if (col < 0 || col >= columns || row < 0 || row >= rows) break;
      const a = Math.floor(col),
        b = Math.floor(row),
        at = b * (columns + 1) + a;
      const below = mix(
        mix(heights[at], heights[at + 1], col - a),
        mix(heights[at + columns + 1], heights[at + columns + 2], col - a),
        row - b
      );
      occlusion = Math.max(
        occlusion,
        saturate(
          (below - height - step * sunlight.y - 0.045) / (0.11 + step * 0.033)
        )
      );
    }
    return 1 - occlusion;
  });
  mesh.setAttribute("sunVisibility", new BufferAttribute(shadows, 1));
  return mesh;
}
