'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

const MANIFESTO_LINES = [
  'I LIKE TURNING',
  'COMPLICATED IDEAS',
  'INTO PRODUCTS',
  'THAT FEEL SIMPLE.',
];

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('intro');
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative px-[5vw] py-[22vh] overflow-hidden flex flex-col justify-center"
      style={{ minHeight: '90svh' }}
      aria-label="Manifesto"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center gap-6 mb-12">
        <span className="text-label-mono text-ds-blue-highlight text-xs tracking-widest font-mono">
          01 // MANIFESTO
        </span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      {/* Editorial Giant Manifesto Lines with Masking Reveal */}
      <div className="space-y-2 md:space-y-3 select-none">
        {MANIFESTO_LINES.map((line, idx) => {
          const isHighlight = idx === MANIFESTO_LINES.length - 1;
          return (
            <div key={line} className="overflow-hidden">
              <p
                className={`font-display font-bold tracking-tighter transition-all duration-1000 ease-expo-out ${
                  isHighlight
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-ds-blue-highlight to-ds-blue'
                    : 'text-ds-text'
                }`}
                style={{
                  fontSize: 'clamp(2.5rem, 7.5vw, 9.5rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  transform: inView ? 'translateY(0)' : 'translateY(110%)',
                  opacity: inView ? 1 : 0,
                  transitionDelay: `${idx * 120}ms`,
                }}
              >
                {line}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Editorial Footnote */}
      <div className="mt-16 pt-8 border-t border-ds-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="font-body text-ds-text-muted text-sm md:text-base max-w-lg leading-relaxed">
          Full-stack systems engineered with intention. From database schema
          to interactive canvas, every layer is designed to solve complex challenges
          elegantly.
        </p>
        <span className="text-label-mono text-ds-text-dim text-xs font-mono">
          SURAT, GUJARAT // INDIA
        </span>
      </div>
    </section>
  );
}
