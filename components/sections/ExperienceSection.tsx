'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EXPERIENCE_DATA = [
  { year: '2024', title: 'SDJ College', role: 'BCA (Computer Applications)' },
  { year: '2024', title: 'Zenvara', role: 'Web Development Intern' },
  { year: '2024', title: 'CodeAlpha', role: 'Frontend Developer Intern' },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 55%',
      onEnter: () => setCoreMorphTarget('experience'),
      onLeaveBack: () => setCoreMorphTarget('about'),
    });

    if (prefersReducedMotion) {
      if (contentRef.current) {
        contentRef.current.style.opacity = '1';
        contentRef.current.style.transform = 'none';
      }
      return () => morphTrigger.kill();
    }

    gsap.set(contentRef.current, { opacity: 0, y: 40 });

    const anim = gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 80%',
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
      id="experience"
      className="relative px-[5vw] py-[18vh] border-t border-white/10 overflow-hidden bg-[#0A0C10]"
    >
      <div className="flex items-center gap-4 mb-16">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          05 / 06 - EXPERIENCE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        <div ref={contentRef} className="flex flex-col gap-12 max-w-xl w-full">
          {EXPERIENCE_DATA.map((item, i) => (
            <div key={i} className="flex items-start gap-8">
              <span className="font-mono text-white/40 text-sm mt-1">{item.year}</span>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-ds-blue mt-2" />
                <div>
                  <h3 className="text-white font-medium text-lg">{item.title}</h3>
                  <p className="text-white/60 text-sm mt-1">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block w-full h-full" aria-hidden="true" />
      </div>
    </section>
  );
}
