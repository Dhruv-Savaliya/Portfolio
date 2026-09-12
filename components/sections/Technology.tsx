'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 55%',
      onEnter: () => setCoreMorphTarget('technology'),
      onLeaveBack: () => setCoreMorphTarget('experience'),
    });

    if (prefersReducedMotion) {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.transform = 'none';
      }
      return () => morphTrigger.kill();
    }

    gsap.set(containerRef.current, { opacity: 0, scale: 0.95 });

    const anim = gsap.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
    });

    return () => {
      morphTrigger.kill();
      anim.scrollTrigger?.kill();
    };
  }, [setCoreMorphTarget, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative px-[5vw] py-[18vh] border-t border-white/10 overflow-hidden bg-[#0A0C10] flex flex-col items-center justify-center min-h-[90vh]"
    >
      <div className="absolute top-[18vh] left-[5vw] flex items-center gap-4">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          06 / 07 - TECHNOLOGY
        </span>
      </div>

      <div ref={containerRef} className="relative w-full max-w-4xl h-[600px] flex items-center justify-center mt-20">
        {/* The 3D globe will be centered here by the fixed canvas */}
        
        {/* Floating Labels */}
        <div className="absolute top-[10%] left-[10%] text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-blue shadow-[0_0_8px_#356DFF]" />
            <span className="font-mono text-sm text-white font-medium">Frontend</span>
          </div>
          <p className="text-[10px] text-white/50 font-mono ml-3.5">React / Next.js</p>
        </div>

        <div className="absolute top-[5%] right-[10%] text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="font-mono text-sm text-white font-medium">Backend</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ds-signal shadow-[0_0_8px_#B8FF5A]" />
          </div>
          <p className="text-[10px] text-white/50 font-mono mr-3.5">Node.js / Express</p>
        </div>

        <div className="absolute top-[40%] right-[0%] text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="font-mono text-sm text-white font-medium">Database</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shadow-[0_0_8px_#FF453A]" />
          </div>
          <p className="text-[10px] text-white/50 font-mono mr-3.5">MongoDB / PostgreSQL</p>
        </div>

        <div className="absolute bottom-[25%] right-[10%] text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="font-mono text-sm text-white font-medium">AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF5AF2] shadow-[0_0_8px_#BF5AF2]" />
          </div>
          <p className="text-[10px] text-white/50 font-mono mr-3.5">OpenAI / Tesseract</p>
        </div>

        <div className="absolute bottom-[5%] left-[40%] text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A] shadow-[0_0_8px_#FF9F0A]" />
            <span className="font-mono text-sm text-white font-medium">WebGL</span>
          </div>
          <p className="text-[10px] text-white/50 font-mono">Three.js / R3F</p>
        </div>
      </div>
    </section>
  );
}
