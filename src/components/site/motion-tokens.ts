// JS mirror of the folio motion tokens (src/styles/folio/motion.css) for
// motion/react props, which cannot read CSS variables.
export const EASE_BASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_SECONDS = 0.7;
export const REVEAL_RISE = 32;

// 3D contribution chart (components/home/contribution-3d.tsx).
export const BAR_GROW_SECONDS = 0.75; // one bar rising to full height
export const BAR_STAGGER_SECONDS = 0.012; // delay between neighbouring weeks
export const CAMERA_INTRO_SECONDS = 1.6; // swing-in to the resting angle
export const ORBIT_FRICTION = 0.92; // per-frame decay of drag inertia
export const VIEW_SWAP_SECONDS = 0.35; // grid <-> 3D crossfade
