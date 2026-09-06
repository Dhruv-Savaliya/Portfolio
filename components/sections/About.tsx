'use client';

import { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('about');
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
      id="about"
      className="relative px-[5vw] py-[20vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="About Dhruv Savaliya"
    >
      {/* Telemetry Header */}
      <div className="flex items-center gap-6 mb-12">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-mono tracking-widest">
          04 // IDENTITY & PHILOSOPHY
        </span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left Column: Bold Editorial Typography */}
        <div className="lg:col-span-8 space-y-8 select-none">
          <h2
            className="font-display font-bold text-ds-text tracking-tighter leading-none"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 7.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
            }}
          >
            <span>I&apos;M DHRUV.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-blue-highlight to-ds-blue">
              FULL-STACK DEVELOPER
            </span>
            <br />
            <span>INTERESTED IN AI,</span>
            <br />
            <span className="text-ds-text-muted">
              PRODUCTS &amp; INTERACTIVE WEB.
            </span>
          </h2>

          {/* Concise Supporting Copy */}
          <div className="space-y-4 max-w-2xl text-ds-text-muted font-body text-base md:text-lg leading-relaxed pt-4">
            <p>
              Based in Surat, India, I build modern web applications where robust engineering meets
              cinematic craft. My focus centers on full-stack architecture, high-performance interactive 3D,
              and integrating artificial intelligence into functional software systems.
            </p>
            <p>
              Rather than assembling templates, I design from fundamental systems: data isolation, deterministic
              APIs, clean accessibility, and visual pacing that respects the human on the other side of the glass.
            </p>
          </div>
        </div>

        {/* Right Column: High-Level Signals */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-ds-border bg-ds-surface/60 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ds-signal animate-pulse" />
              <span className="text-label-mono text-ds-signal text-xs font-semibold">
                AVAILABLE FOR ROLES &amp; PROJECTS
              </span>
            </div>
            <p className="font-mono text-xs text-ds-text-muted leading-relaxed">
              Open to engineering challenges across Next.js, full-stack web products, and interactive interfaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-ds-border bg-ds-surface/40 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-ds-border/60 pb-2">
              <span className="text-ds-text-dim">LOCATION</span>
              <span className="text-ds-text">Surat, Gujarat, India</span>
            </div>
            <div className="flex justify-between border-b border-ds-border/60 pb-2">
              <span className="text-ds-text-dim">DEGREE</span>
              <span className="text-ds-text">BCA (Graduated 2026)</span>
            </div>
            <div className="flex justify-between border-b border-ds-border/60 pb-2">
              <span className="text-ds-text-dim">LANGUAGES</span>
              <span className="text-ds-text">TypeScript, JavaScript, Python</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ds-text-dim">FOCUS</span>
              <span className="text-ds-blue-highlight">Next.js / AI / WebGL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
