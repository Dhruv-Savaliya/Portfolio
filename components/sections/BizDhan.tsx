'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const BIZDHAN_STACK = [
  'Next.js 15', 'React 19', 'TypeScript', 'MongoDB',
  'Tailwind CSS', 'Groq AI', 'JWT', 'Cloudinary', 'Recharts',
];

export default function BizDhan() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    // Trigger Digital Core morph
    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 55%',
      onEnter: () => setCoreMorphTarget('bizdhan'),
      onLeaveBack: () => setCoreMorphTarget('intro'),
    });

    if (prefersReducedMotion) {
      [leftColRef.current, rightColRef.current].forEach((el) => {
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
      return () => morphTrigger.kill();
    }

    // Set initial hidden state
    gsap.set([leftColRef.current, rightColRef.current], { opacity: 0, y: 40 });
    gsap.set(titleRef.current, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });

    // Title clip-path reveal
    const titleAnim = gsap.to(titleRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
      },
    });

    // Left column slides up
    const leftAnim = gsap.to(leftColRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: leftColRef.current,
        start: 'top 78%',
      },
    });

    // Right column slides up with slight delay
    const rightAnim = gsap.to(rightColRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      delay: 0.15,
      scrollTrigger: {
        trigger: rightColRef.current,
        start: 'top 78%',
      },
    });

    return () => {
      morphTrigger.kill();
      titleAnim.scrollTrigger?.kill();
      leftAnim.scrollTrigger?.kill();
      rightAnim.scrollTrigger?.kill();
    };
  }, [setCoreMorphTarget, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="bizdhan"
      className="relative px-[5vw] py-[18vh] border-t border-ds-border overflow-hidden"
      aria-label="BizDhan — Personal & SME Finance SaaS"
    >
      {/* Top Telemetry Header */}
      <div ref={metaRef} className="flex items-center gap-4 mb-8">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          01 / 03
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        {/* Left Column: Typography & Panels */}
        <div ref={leftColRef} className="flex flex-col gap-6 max-w-xl">
          <div>
            <h2
              ref={titleRef}
              className="font-display font-bold text-white tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1 }}
            >
              BIZDHAN
            </h2>
            <p className="font-display text-xl md:text-2xl text-white/80 mt-1">
              Finance Platform
            </p>
          </div>

          <p className="font-body text-white/60 text-sm leading-relaxed max-w-md">
            A modern financial platform to manage income, expenses, reports and get AI-powered insights.
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {BIZDHAN_STACK.slice(0, 4).map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-[10px] font-mono border border-white/20 bg-white/5 text-white/60">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ds-blue hover:bg-ds-blue/80 text-xs tracking-widest text-white transition-colors cursor-none">
              LIVE DEMO ↗
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 bg-transparent text-xs tracking-widest text-white transition-colors cursor-none">
              GITHUB ↗
            </a>
          </div>
        </div>

        {/* Right Column: Empty space for 3D model */}
        <div ref={rightColRef} className="hidden md:block w-full h-[500px]" aria-hidden="true" />
      </div>
    </section>
  );
}
