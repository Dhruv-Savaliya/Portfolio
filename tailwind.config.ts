import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Porcelain & Ink palette (Master Prompt Section 07)
        'ds-bg': '#080B10',
        'ds-surface': '#10151D',
        'ds-surface-2': '#18202C',
        'ds-border': 'rgba(244, 246, 250, 0.10)',
        'ds-border-light': 'rgba(244, 246, 250, 0.16)',
        // Text
        'ds-text': '#F4F6FA',
        'ds-text-muted': '#9AA4B2',
        'ds-text-dim': '#4A5565',
        // Light / Porcelain theme tokens
        'ds-porcelain': '#F3F5F8',
        'ds-porcelain-surface': '#E8ECF2',
        'ds-ink': '#080B10',
        'ds-ink-muted': '#4A5565',
        'ds-porcelain-border': 'rgba(8, 11, 16, 0.12)',
        // Signature Accents
        'ds-blue': '#356DFF',
        'ds-blue-highlight': '#7EA2FF',
        'ds-blue-deep': '#1D4ED8',
        // Secondary Signal (Restrained)
        'ds-signal': '#B8FF5A',
        'ds-lime': '#B8FF5A',
        'ds-cyan': '#7EA2FF',
      },
      fontFamily: {
        'display': ['var(--font-space-grotesk)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
        'accent': ['var(--font-syne)', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 1vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 1.2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 1.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.25rem, 2vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 3vw, 2rem)',
        'fluid-2xl': 'clamp(2rem, 4vw, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 5vw, 4rem)',
        'fluid-4xl': 'clamp(3rem, 7vw, 6rem)',
        'fluid-5xl': 'clamp(4rem, 10vw, 9rem)',
        'fluid-6xl': 'clamp(5rem, 14vw, 14rem)',
        'fluid-7xl': 'clamp(6rem, 18vw, 20rem)',
      },
      letterSpacing: {
        'widest-2': '0.2em',
        'widest-3': '0.3em',
        'tightest': '-0.05em',
        'tighter-2': '-0.04em',
        'tighter-3': '-0.06em',
      },
      lineHeight: {
        'none': '1',
        'tight-2': '0.9',
        'tight-3': '0.85',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'circ-out': 'cubic-bezier(0, 0.55, 0.45, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '2000': '2000ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'line-grow': {
          '0%': { scaleX: '0', transformOrigin: 'left' },
          '100%': { scaleX: '1', transformOrigin: 'left' },
        },
        'pulse-lime': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(-4%, 1%)' },
          '30%': { transform: 'translate(1%, -2%)' },
          '40%': { transform: 'translate(-1%, 4%)' },
          '50%': { transform: 'translate(-3%, 1%)' },
          '60%': { transform: 'translate(2%, -3%)' },
          '70%': { transform: 'translate(-2%, 2%)' },
          '80%': { transform: 'translate(3%, -1%)' },
          '90%': { transform: 'translate(-1%, 3%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'line-grow': 'line-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-lime': 'pulse-lime 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'grain': 'grain 0.8s steps(1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
