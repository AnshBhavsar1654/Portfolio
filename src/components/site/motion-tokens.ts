// JS mirror of the folio motion tokens (src/styles/folio/motion.css) for
// motion/react props, which cannot read CSS variables.
export const EASE_BASE = [0.22, 1, 0.36, 1] as const;

// Page-load choreography (--dur-enter, --stagger-enter, --rise-enter).
// Last start + one item = 5 * 0.04 + 0.22 = 0.42 s, inside the 500 ms budget.
export const ENTER_SECONDS = 0.22;
export const ENTER_STAGGER_SECONDS = 0.04;
export const ENTER_RISE_PX = 8;
export const HERO_VISUAL_INDEX = 5; // the signal is the sixth item in the hero

// 3D contribution chart (components/home/contribution-3d.tsx).
export const BAR_GROW_SECONDS = 0.75; // one bar rising to full height
export const BAR_STAGGER_SECONDS = 0.012; // delay between neighbouring weeks
export const CAMERA_INTRO_SECONDS = 1.6; // swing-in to the resting angle
export const ORBIT_FRICTION = 0.92; // per-frame decay of drag inertia
export const VIEW_SWAP_SECONDS = 0.35; // grid <-> 3D crossfade

// Smooth cursor (components/site/smooth-cursor.tsx): follows the pointer on a
// soft spring, tilts toward the direction of travel and presses on click.
export const CURSOR_SPRING = { stiffness: 260, damping: 30, mass: 1 } as const;
export const CURSOR_TURN_SPRING = {
  stiffness: 520,
  damping: 38,
  mass: 1,
} as const;
export const CURSOR_PRESS_SCALE = 0.9; // mirrors --press-scale
export const CURSOR_TURN_MIN_SPEED = 4; // px moved before the arrow re-aims
