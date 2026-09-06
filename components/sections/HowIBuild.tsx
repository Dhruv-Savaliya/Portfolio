'use client';

import { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

const SYSTEM_STEPS = [
  {
    step: '01',
    label: 'IDEA',
    summary: 'Crystallize real-world domain problems into defined technical product requirements.',
  },
  {
    step: '02',
    label: 'INTERFACE',
    summary: 'Design minimal, accessible, high-performance interactions before committing logic.',
  },
  {
    step: '03',
    label: 'ARCHITECTURE',
    summary: 'Map data flows, RBAC permissions, isolation boundaries, and resilient API contracts.',
  },
  {
    step: '04',
    label: 'DATA',
    summary: 'Model clean schemas, structured document indexes, and deterministic relational states.',
  },
  {
    step: '05',
    label: 'AI',
    summary: 'Integrate LLMs, OCR, and computer vision strictly where they multiply user velocity.',
  },
  {
    step: '06',
    label: 'DEPLOYMENT',
    summary: 'Continuous delivery on edge infrastructure with zero-downtime monitoring and audit telemetry.',
  },
];

export default function HowIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('idle');
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget]);

  return (
    <section
      ref={sectionRef}
      id="how-i-build"
      className="relative px-[5vw] py-[20vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="How I Build — Engineering Philosophy"
    >
      {/* Header */}
      <div className="mb-14">
        <p className="text-label-mono text-ds-blue-highlight text-xs font-mono mb-4 tracking-widest">
          ENGINEERING METHODOLOGY
        </p>
        <h2
          className="font-display font-bold text-ds-text tracking-tighter"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
          }}
        >
          <span>I BUILD FROM</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-text via-ds-blue-highlight to-ds-blue">
            SYSTEMS.
          </span>
        </h2>
      </div>

      {/* 6 Sequential Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYSTEM_STEPS.map((item) => (
          <div
            key={item.label}
            className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/60 backdrop-blur-md space-y-4 hover:border-ds-blue-highlight/40 transition-colors duration-300 group"
          >
            <div className="flex items-center justify-between border-b border-ds-border pb-4">
              <span className="font-mono text-xs text-ds-blue font-bold group-hover:text-ds-signal transition-colors">
                {`${item.step} // SEQUENCE`}
              </span>
              <span className="font-mono text-xs text-ds-text-dim">[READY]</span>
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ds-text tracking-tight">
              {item.label}
            </h3>
            <p className="font-body text-xs md:text-sm text-ds-text-muted leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
