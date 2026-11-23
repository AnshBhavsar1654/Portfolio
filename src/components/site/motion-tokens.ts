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

// Smooth scroll (components/site/smooth-scroll.tsx): the page eases toward the
// wheel target the way the cursor follows the pointer.
export const SCROLL_LERP = 0.09; // share of the remaining distance per frame
export const SCROLL_WHEEL_MULTIPLIER = 0.9;

// Card nav (components/site/site-nav.tsx): the menu panel drops in under the
// bar, then its cards rise one after another.
export const NAV_PANEL_SECONDS = 0.24; // mirrors --dur-base
export const NAV_CARD_STAGGER_SECONDS = 0.12;
export const NAV_CARD_RISE_PX = 16;
// Cards land on a light bounce (--spring-bouncy-*, softened).
export const NAV_CARD_SPRING = {
  stiffness: 380,
  damping: 22,
  mass: 1,
} as const;
// One-shot intro: the bar drops in on first load.
export const NAV_INTRO_SECONDS = 0.4;
export const NAV_INTRO_DROP_PX = 12;

// Time each interest artwork remains visible before the next transition.
export const INTEREST_HOLD_SECONDS = 9;
