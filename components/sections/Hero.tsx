'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

// ============================================
// HERO SECTION COMPONENT
// ============================================
export default function Hero() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    // Reveal animation
    const timer = setTimeout(() => {
      setVisible(true);
      setCoreMorphTarget('hero');
    }, 150);
    return () => clearTimeout(timer);
  }, [setCoreMorphTarget]);

  const enterStyle = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden flex flex-col justify-between px-[5vw] pt-[15vh] pb-[6vh]"
      style={{ minHeight: '100svh' }}
      aria-label="Hero — Dhruv Savaliya, Full-Stack Developer"
    >
      {/* Top Metadata Row */}
      <div className="flex items-start justify-between z-20">
        {/* Location Telemetry */}
        <div style={enterStyle(0.3)}>
          <p className="text-label-mono text-ds-text-dim text-[11px] mb-1 tracking-widest">
            LOCATION
          </p>
          <p className="text-label-mono text-ds-text tracking-widest">
            SURAT / INDIA
          </p>
        </div>

        {/* Discipline Telemetry */}
        <div className="text-right" style={enterStyle(0.4)}>
          <p className="text-label-mono text-ds-text-dim text-[11px] mb-1 tracking-widest">
            CORE DISCIPLINE
          </p>
          <p className="text-label-mono text-ds-blue-highlight tracking-widest">
            FULL-STACK / AI / 3D
          </p>
        </div>
      </div>

      {/* Center / Bottom Composition: Massive Editorial Typography */}
      <div className="my-auto py-10 z-20">
        <div className="overflow-hidden">
          <h1
            className="font-display font-bold text-ds-text select-none"
            style={{
              fontSize: 'clamp(4.2rem, 15vw, 17.5rem)',
              lineHeight: 0.86,
              letterSpacing: '-0.05em',
              ...enterStyle(0.2),
            }}
          >
            <span>DHRUV</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-text via-ds-blue-highlight to-ds-blue">
              SAVALIYA
            </span>
          </h1>
        </div>

        {/* Secondary Title + Supporting Manifesto */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8 pt-8 border-t border-ds-border">
          <div style={enterStyle(0.5)} className="max-w-xl">
            <p className="text-label-mono text-ds-blue-highlight text-xs mb-2 tracking-widest uppercase font-semibold">
              FULL-STACK DEVELOPER
            </p>
            <p className="font-display text-lg md:text-2xl text-ds-text font-normal tracking-tight leading-snug">
              I BUILD DIGITAL PRODUCTS WITH CODE, AI & INTERACTION.
            </p>
          </div>

          {/* Scroll Callout CTA */}
          <div style={enterStyle(0.7)} className="flex items-center gap-3">
            <a
              href="#intro"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-ds-border hover:border-ds-blue-highlight/50 bg-ds-surface/60 backdrop-blur-md transition-all duration-300 cursor-none"
              aria-label="Scroll down to explore the experience"
            >
              <span className="text-label-mono text-ds-text-muted group-hover:text-ds-text text-xs tracking-widest transition-colors">
                SCROLL TO EXPLORE
              </span>
              <span className="text-ds-blue-highlight group-hover:translate-y-1 transition-transform duration-300 font-mono text-sm">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
