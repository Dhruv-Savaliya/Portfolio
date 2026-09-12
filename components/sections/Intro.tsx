'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MANIFESTO_LINES = [
  'I LIKE TURNING',
  'COMPLICATED IDEAS',
  'INTO PRODUCTS',
  'THAT FEEL SIMPLE.',
];

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    // Trigger core morph on entry
    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => setCoreMorphTarget('intro'),
      onLeaveBack: () => setCoreMorphTarget('hero'),
    });

    if (prefersReducedMotion) {
      // Instant reveal — no animation
      linesRef.current.forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      if (footerRef.current) footerRef.current.style.opacity = '1';
      return () => morphTrigger.kill();
    }

    // ── GSAP Scroll-scrubbed mask reveal for each manifesto line
    const lineAnimations = linesRef.current.map((lineEl, idx) => {
      if (!lineEl) return null;
      const isLast = idx === MANIFESTO_LINES.length - 1;

      // Start each line clipped from right, reveal on scroll
      gsap.set(lineEl, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
      });

      return gsap.to(lineEl, {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: lineEl,
          start: 'top 85%',
          end: 'top 55%',
          scrub: isLast ? 1.2 : 0.8,
        },
      });
    });

    // Footer footnote fade-up
    const footerAnim = gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
        },
      }
    );

    return () => {
      morphTrigger.kill();
      lineAnimations.forEach((a) => a?.scrollTrigger?.kill());
      footerAnim.scrollTrigger?.kill();
    };
  }, [setCoreMorphTarget, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative px-[5vw] py-[22vh] overflow-hidden flex flex-col justify-center"
      style={{ minHeight: '90svh' }}
      aria-label="Manifesto"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center gap-4 mb-10 md:mb-16">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          01 / 04 - INTRO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Left Column: Typography */}
        <div className="flex flex-col gap-8 max-w-xl">
          <h2
            ref={(el) => { linesRef.current[0] = el; }}
            className="font-display font-medium text-white tracking-tight uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
            }}
          >
            I LIKE TURNING<br />
            COMPLEX IDEAS<br />
            INTO SIMPLE PRODUCTS.
          </h2>
          
          <div ref={footerRef} className="space-y-6" style={{ opacity: 0 }}>
            <p className="font-body text-white/60 text-sm md:text-base leading-relaxed max-w-md">
              I'm Dhruv Savaliya — a Full-Stack Developer passionate about building scalable web applications, AI solutions and interactive 3D experiences.
            </p>
            
            <a
              href="#work"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:border-ds-blue bg-white/5 hover:bg-ds-blue/10 text-xs tracking-widest text-white transition-all duration-300 cursor-none"
            >
              VIEW MY WORK <span className="font-mono text-ds-blue">+</span>
            </a>
          </div>
        </div>

        {/* Right Column: Glass panel feature list */}
        <div
          ref={(el) => { linesRef.current[1] = el; }}
          className="flex flex-col gap-4 p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl w-full max-w-sm ml-auto"
          style={{ opacity: 0 }}
        >
          {[
            { id: 1, label: 'FULL STACK', icon: '⚡' },
            { id: 2, label: 'AI & ML', icon: '🧠' },
            { id: 3, label: '3D WEB', icon: '🌐' },
            { id: 4, label: 'INTERACTION', icon: '✨' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70">
                {item.icon}
              </div>
              <span className="font-mono text-xs tracking-widest text-white/80">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
