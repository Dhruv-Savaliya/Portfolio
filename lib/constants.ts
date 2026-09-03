// ============================================
// ANIMATION CONSTANTS & UTILITIES
// ============================================

// Easing presets (matches CSS variables)
export const EASE = {
  expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  expoIn: [0.7, 0, 0.84, 0] as [number, number, number, number],
  expoInOut: [0.87, 0, 0.13, 1] as [number, number, number, number],
  circOut: [0, 0.55, 0.45, 1] as [number, number, number, number],
} as const;

// Duration scale
export const DUR = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  verySlow: 2.0,
} as const;

// Stagger
export const STAGGER = {
  fast: 0.04,
  normal: 0.08,
  slow: 0.12,
  verySlow: 0.16,
} as const;

// ============================================
// DESIGN TOKENS
// ============================================
export const COLORS = {
  bg: '#030303',
  surface: '#0A0A0A',
  border: '#1A1A1A',
  text: '#F0EDE6',
  textMuted: '#555555',
  lime: '#C8FF00',
  cyan: '#00E5FF',
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const BP = {
  mobile: 390,
  mobileLg: 768,
  tablet: 1024,
  desktop: 1280,
  desktopLg: 1440,
} as const;

// ============================================
// GSAP DEFAULTS
// ============================================
export const GSAP_DEFAULTS = {
  ease: 'expo.out',
  duration: DUR.normal,
} as const;
