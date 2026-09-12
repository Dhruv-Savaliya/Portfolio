'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 55%',
      onEnter: () => setCoreMorphTarget('about'),
      onLeaveBack: () => setCoreMorphTarget('smartreceipt'),
    });

    if (prefersReducedMotion) {
      [leftColRef.current, rightColRef.current].forEach((el) => {
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
      return () => morphTrigger.kill();
    }

    gsap.set([leftColRef.current, rightColRef.current], { opacity: 0, y: 40 });
    gsap.set(titleRef.current, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });

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
      id="about"
      className="relative px-[5vw] py-[18vh] border-t border-white/10 overflow-hidden bg-[#0A0C10]"
      aria-label="About Dhruv Savaliya"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          04 / 06 - ABOUT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        {/* Left Column: Typography */}
        <div ref={leftColRef} className="flex flex-col gap-6 max-w-xl">
          <h2
            ref={titleRef}
            className="font-display font-medium text-white tracking-tight leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            I'm Dhruv,
            <br />
            Full-Stack Developer
            <br />
            interested in AI &amp;
            <br />
            Interactive Web.
          </h2>

          <p className="font-body text-white/60 text-sm leading-relaxed max-w-md mt-4">
            I love turning ideas into real products. I enjoy working with modern technologies, exploring 3D, and building seamless user experiences.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 bg-transparent text-xs tracking-widest text-white transition-colors cursor-none">
              LET'S CONNECT ↗
            </a>
          </div>
        </div>

        {/* Right Column: Empty space for 3D Neural Node */}
        <div ref={rightColRef} className="hidden md:block w-full h-[500px]" aria-hidden="true" />
      </div>
    </section>
  );
}
