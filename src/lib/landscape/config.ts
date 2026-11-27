export const dusk = {
  seed: 43,
  height: 7.4,
  summit: 4.2,
  width: 0.9,
  valley: 1.4,
  erosion: 0.78,
  warp: 0.72,
  detail: 0.85,
  snowline: 3.15,
  snowSlope: 0.62,
  elevation: 6,
  azimuth: 55,
  sunlight: 2.25,
  warmth: 0.9,
  ambient: 0.83,
  shadows: 0.88,
  exposure: 1.08,
  fog: 0.029,
  mist: 0.16,
  cloudDensity: 0.58,
  cloudSpeed: 0.12,
  fov: 38,
  cameraHeight: 3.15,
  distance: 23,
  resolution: 0.94,
  quality: 1,
};

export type LandscapeConfig = typeof dusk;
// The slider runs from noon to the following noon, with midnight at its center.
export const duskTime = 390;
export const cycleMinutes = 1440;
export const cameraRange = { wide: 27, close: 13 };

export const lakeLevel = 0.18;
