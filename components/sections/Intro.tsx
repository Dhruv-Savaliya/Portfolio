'use client';

import { useEffect, useRef } from 'react';

// ============================================
// EDITORIAL INTRO STATEMENT
// ============================================

const LINES = [
  'I LIKE TURNING',
  'COMPLICATED IDEAS',
  'INTO PRODUCTS',
  'THAT FEEL SIMPLE.',
];

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Intersection-based reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = linesRef.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setTimeout(() => {
                (entry.target as HTMLDivElement).style.opacity = '1';
                (entry.target as HTMLDivElement).style.transform = 'translateY(0)';
              }, idx * 120);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    linesRef.current.forEach((line) => {
      if (line) observer.observe(line);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative bg-ds-bg px-[5vw] py-[15vw] overflow-hidden"
      aria-label="Introduction"
    >
      {/* Top rule with label */}
      <div className="flex items-center gap-6 mb-[8vw]">
        <span className="text-label-mono text-ds-lime">MANIFESTO</span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      {/* Editorial lines */}
      <div className="space-y-1 md:space-y-2">
        {LINES.map((line, i) => (
          <div
            key={i}
            ref={(el) => { if (el) linesRef.current[i] = el; }}
            style={{
              opacity: 0,
              transform: 'translateY(60px)',
              transition: `opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)`,
              willChange: 'opacity, transform',
            }}
          >
            <p
              className="font-display font-bold text-ds-text"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 9rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: i === LINES.length - 1 ? '#C8FF00' : '#F0EDE6',
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom statement */}
      <div className="mt-[8vw] flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <p
          className="font-body text-ds-text-muted max-w-md"
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)', lineHeight: 1.7 }}
        >
          Every line of code serves a purpose. Every interaction is intentional.
          I build for humans, powered by modern technology.
        </p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-ds-border" />
          <span className="text-label-mono text-ds-text-muted">
            EST. 2022
          </span>
        </div>
      </div>
    </section>
  );
}
