// Custom signature easing curves for The Cue Club Coventry
// Unified motion language across GSAP, CSS, and Framer Motion

export const EASINGS = {
  // 1. Coming to rest (text reveals, card entrances, camera dolly)
  settle: "cubic-bezier(0.22, 1, 0.36, 1)",
  settleGsap: "power4.out",

  // 2. High-energy impulse (ball breaks, cue strikes, confirmation triggers)
  strike: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  strikeGsap: "power4.in",

  // 3. Continuous ambient motion (dust motes, floating UI, camera sway)
  drift: "cubic-bezier(0.37, 0, 0.63, 1)",
  driftGsap: "sine.inOut",
};

export const DURATIONS = {
  micro: 0.2,       // Button hovers, focus rings (200ms)
  standard: 0.4,    // Card reveals, modal opens (400ms)
  transition: 0.9,  // Section-to-section scroll triggers (900ms)
  signature: 1.3,   // Hero walk-in, ball break explosion (1300ms)
  ambient: 4.5,     // Continuous background loops (4500ms)
};
