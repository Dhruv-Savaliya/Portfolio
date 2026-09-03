'use client';

import { useRef, useEffect, useState } from 'react';

const STEPS = [
  { label: 'IDEA',         desc: 'Crystallize the problem worth solving.',       icon: '◈' },
  { label: 'INTERFACE',    desc: 'Design the experience before writing code.',    icon: '◇' },
  { label: 'ARCHITECTURE', desc: 'Plan data flow, API contracts, DB schema.',     icon: '⬡' },
  { label: 'DATA',         desc: 'Model, store and serve information cleanly.',   icon: '◉' },
  { label: 'AI',           desc: 'Integrate intelligence where it adds value.',   icon: '✦' },
  { label: 'DEPLOYMENT',   desc: 'Ship. Monitor. Iterate.',                       icon: '▲' },
];

export default function HowIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-i-build"
      className="relative bg-ds-surface px-[5vw] py-[12vw] overflow-hidden"
      aria-label="How I build"
    >
      {/* Header */}
      <div className="mb-[6vw]">
        <p
          className="text-label-mono text-ds-lime mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          PROCESS
        </p>
        <h2
          className="font-display font-bold text-ds-text"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          I BUILD FROM
          <br />
          <span style={{ color: '#C8FF00' }}>SYSTEMS.</span>
        </h2>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-px md:left-8"
          style={{
            background: 'linear-gradient(to bottom, #C8FF00, #00E5FF, #a29bfe, transparent)',
            opacity: visible ? 0.3 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        />

        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className="relative flex items-start gap-8 md:gap-16 py-8 md:py-10 border-b border-ds-border last:border-0"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-30px)',
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s`,
              }}
            >
              {/* Step number / dot */}
              <div className="relative flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center border bg-ds-bg z-10"
                  style={{ borderColor: '#C8FF0060' }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1.2rem)', color: '#C8FF00' }}
                  >
                    {step.icon}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-label-mono text-ds-text-muted mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3
                    className="font-display font-bold text-ds-text"
                    style={{
                      fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {step.label}
                  </h3>
                </div>
                <p
                  className="font-body text-ds-text-muted md:text-right md:max-w-[280px]"
                  style={{ fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)', lineHeight: 1.6 }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
