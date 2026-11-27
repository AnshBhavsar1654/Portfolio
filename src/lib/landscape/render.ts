import {
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { cycleMinutes, dusk as config, duskTime, lakeLevel } from "./config";
import {
  compositeFragment,
  landFragment,
  landVertex,
  skyFragment,
  skyVertex,
  waterVertex,
  waterMaskFragment,
} from "./shaders";
import { makeTerrain, sunDirection } from "./terrain";

const blend = (a: number, b: number, amount: number) => a + (b - a) * amount;
function smooth(amount: number) {
  const t = Math.max(0, Math.min(1, amount));
  return t * t * (3 - 2 * t);
}

type ViewerSettings = { time: number; distance: number; paused: boolean };

export function mountLandscape(
  canvas: HTMLCanvasElement,
  getSettings: () => ViewerSettings,
  isReading: () => boolean,
  onLoss: () => void
) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
  });
  const scene = new Scene();
  const terrainScene = new Scene();
  const skyScene = new Scene();
  const target = new WebGLRenderTarget(1, 1);
  const reflection = new WebGLRenderTarget(1, 1);
  const skyTarget = new WebGLRenderTarget(1, 1);
  const camera = new PerspectiveCamera(config.fov, 1, 0.3, 120);
  const uniforms = {
    ...Object.fromEntries(
      Object.entries(config).map(([name, value]) => [name, { value }])
    ),
    sun: { value: sunDirection(config) },
    aspect: { value: 1 },
    clock: { value: 0 },
    daylight: { value: 0 },
    night: { value: 0 },
    warmth: { value: config.warmth },
    sunlight: { value: config.sunlight },
    ambient: { value: config.ambient },
    shadows: { value: config.shadows },
    terrainLayer: { value: target.texture },
    skyLayer: { value: skyTarget.texture },
    reflectionLayer: { value: reflection.texture },
    reflecting: { value: 0 },
    horizonLine: { value: 0.5 },
    lakeLevel: { value: lakeLevel },
    glowCenter: { value: new Vector2() },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: landVertex,
    fragmentShader: landFragment,
    side: DoubleSide,
  });
  const skyMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    depthWrite: false,
    depthTest: false,
  });
  const composite = new ShaderMaterial({
    uniforms,
    vertexShader: skyVertex,
    fragmentShader: compositeFragment,
    depthWrite: false,
    depthTest: false,
  });
  const sky = new Mesh(new PlaneGeometry(2, 2), skyMaterial);
  const screen = new Mesh(sky.geometry, composite);
  screen.frustumCulled = false;
  skyScene.add(sky);
  sky.frustumCulled = false;
  sky.renderOrder = -1;
  const compact = canvas.clientWidth < 800;
  const land = new Mesh(makeTerrain(config, compact), material);
  scene.add(screen);
  terrainScene.add(land);
  const waterMaterial = new ShaderMaterial({
    vertexShader: waterVertex,
    fragmentShader: waterMaskFragment,
  });
  const water = new Mesh(new PlaneGeometry(70, 36), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, lakeLevel, 10);
  water.renderOrder = 1;
  terrainScene.add(water);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0,
    previous = 0,
    elapsed = 0,
    reportAt = 0,
    mean = 0,
    samples = 0;
  let scale = config.resolution,
    dirty = true,
    terrainDirty = true,
    lost = false;

  let renderedTime = -1;
  let renderedDistance = getSettings().distance;

  function positionCamera(aspect: number, distance: number) {
    const portrait = aspect < 1;
    camera.aspect = aspect;
    camera.fov = portrait ? config.fov + 4 : config.fov;
    const shift = portrait ? config.summit - 0.8 : 0;
    camera.position.set(
      shift,
      config.cameraHeight,
      distance + (portrait ? 3 : 0)
    );
    const lookHeight = portrait ? 2.65 : 2.25;
    camera.lookAt(shift, lookHeight, -10);
    const pitch = Math.atan2(
      config.cameraHeight - lookHeight,
      camera.position.z + 10
    );
    uniforms.horizonLine.value =
      0.5 + Math.tan(pitch) / (2 * Math.tan((camera.fov * Math.PI) / 360));
    camera.updateProjectionMatrix();
  }

  function updateTime(time: number) {
    const afterMidnight = time > cycleMinutes / 2;
    const fromNoon = Math.min(time, cycleMinutes - time);
    const daylight = smooth(1 - fromNoon / duskTime);
    const night = smooth((fromNoon - duskTime) / 100);
    const elevation = blend(config.elevation, 62, daylight);
    const azimuth =
      blend(0, config.azimuth, 1 - daylight) * (afterMidnight ? -1 : 1);
    uniforms.sun.value.copy(sunDirection({ ...config, elevation, azimuth }));
    uniforms.daylight.value = daylight;
    uniforms.night.value = night;
    uniforms.glowCenter.value.set(
      blend(afterMidnight ? -0.74 : 0.74, 0, daylight),
      blend(0.6, 0.92, daylight)
    );
    uniforms.warmth.value = blend(config.warmth, 0.07, daylight);
    uniforms.sunlight.value =
      blend(config.sunlight, 1.7, daylight) * (1 - night);
    uniforms.ambient.value = blend(
      blend(config.ambient, 1.35, daylight),
      0.26,
      night
    );
    // The slope lighting moves with the sun. Fade the baked sunset
    // occlusion as the sun climbs or moves to the dawn side of the valley.
    const sunsetShadow = afterMidnight ? 0 : (1 - daylight) * (1 - night);
    uniforms.shadows.value = config.shadows * sunsetShadow;
  }

  function resize() {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    const aspect = width / height;
    positionCamera(aspect, renderedDistance);
    uniforms.aspect.value = aspect;
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, compact ? 1 : 1.25) * scale
    );
    renderer.setSize(width, height, false);
    target.setSize(canvas.width, canvas.height);
    reflection.setSize(
      Math.max(1, Math.round(canvas.width * 0.74)),
      Math.max(1, Math.round(canvas.height * 0.74))
    );
    const skyWidth = Math.min(canvas.width, 780);
    skyTarget.setSize(
      skyWidth,
      Math.max(1, Math.min(620, Math.round(skyWidth / aspect)))
    );
    terrainDirty = true;
    dirty = true;
  }

  function draw() {
    if (terrainDirty) {
      renderer.setClearColor(0, 0);
      renderer.setRenderTarget(reflection);
      water.visible = false;
      uniforms.reflecting.value = 1;
      renderer.render(terrainScene, camera);
      uniforms.reflecting.value = 0;
      water.visible = true;
      renderer.setRenderTarget(target);
      const drift = uniforms.clock.value;
      uniforms.clock.value = 0;
      renderer.render(terrainScene, camera);
      renderer.setRenderTarget(skyTarget);
      renderer.render(skyScene, camera);
      uniforms.clock.value = drift;
      renderer.setRenderTarget(null);
      terrainDirty = false;
    }
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    const initial = previous === 0;
    const delta = now - previous;
    const settings = getSettings();
    if (settings.time !== renderedTime) {
      renderedTime = settings.time;
      updateTime(renderedTime);
      terrainDirty = dirty = true;
    }
    if (settings.distance !== renderedDistance) {
      renderedDistance = settings.distance;
      positionCamera(camera.aspect, renderedDistance);
      terrainDirty = dirty = true;
    }
    const reading = isReading();
    const cadence = reading ? 65 : compact ? 30 : 15;
    const active = !settings.paused && !reduced.matches && !document.hidden;
    if (active && (initial || delta >= cadence)) {
      previous = now;
      elapsed += initial ? 0 : Math.min(delta, reading ? 100 : 55) / 1000;
      uniforms.clock.value = elapsed * config.cloudSpeed * 0.16;
      dirty = true;
      if (!reading && !initial && delta < 500) {
        mean += delta;
        samples++;
      }
    } else if (!active) {
      previous = 0;
    }
    if (dirty && !document.hidden) {
      draw();
      dirty = false;
    }
    if (now - reportAt > 1500 && samples > 0) {
      const ms = mean / samples;
      if (
        samples > 5 &&
        ms > (compact ? 40 : 23) &&
        scale > config.resolution * 0.58
      ) {
        scale *= 0.85;
        resize();
      }
      reportAt = now;
      mean = 0;
      samples = 0;
    }
    frame = requestAnimationFrame(tick);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  renderedTime = getSettings().time;
  updateTime(renderedTime);
  draw();
  const onContextLoss = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    onLoss();
  };
  const onContextRestore = () => {
    if (!lost) return;
    lost = false;
    dirty = true;
    terrainDirty = true;
    frame = requestAnimationFrame(tick);
  };
  canvas.addEventListener("webglcontextlost", onContextLoss);
  canvas.addEventListener("webglcontextrestored", onContextRestore);
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener("webglcontextlost", onContextLoss);
    canvas.removeEventListener("webglcontextrestored", onContextRestore);
    land.geometry.dispose();
    sky.geometry.dispose();
    water.geometry.dispose();
    waterMaterial.dispose();
    reflection.dispose();
    material.dispose();
    skyMaterial.dispose();
    composite.dispose();
    skyTarget.dispose();
    target.dispose();
    renderer.dispose();
  };
}
