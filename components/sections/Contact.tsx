'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const morphTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 55%',
      onEnter: () => setCoreMorphTarget('contact'),
      onLeaveBack: () => setCoreMorphTarget('technology'),
    });

    if (prefersReducedMotion) {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.transform = 'none';
      }
      return () => morphTrigger.kill();
    }

    gsap.set(containerRef.current, { opacity: 0, y: 40 });

    const anim = gsap.to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
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
      id="contact"
      className="relative px-[5vw] py-[15vh] border-t border-white/10 overflow-hidden bg-[#0A0C10] flex flex-col justify-between"
      style={{ minHeight: '80svh' }}
    >
      <div className="flex items-center gap-4 mb-16">
        <span className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
          07 / 07
        </span>
      </div>

      <div ref={containerRef} className="flex flex-col gap-6 max-w-xl">
        <h2 className="font-display font-medium text-white uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
          HAVE AN IDEA<br />
          WORTH BUILDING?
        </h2>
        
        <a href="mailto:dhruvsavaliya075@gmail.com" className="inline-flex items-center gap-2 mt-4 text-ds-blue hover:text-ds-blue-highlight transition-colors font-mono tracking-widest text-sm w-fit cursor-none">
          LET&apos;S TALK ↗
        </a>

        <div className="flex items-center gap-6 mt-8">
          <a href="https://github.com/Dhruv-Savaliya" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors cursor-none" aria-label="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          </a>
          <a href="https://linkedin.com/in/dhruvsavaliya" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors cursor-none" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
          <a href="mailto:dhruvsavaliya075@gmail.com" className="text-white/50 hover:text-white transition-colors cursor-none" aria-label="Email">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" /></svg>
          </a>
        </div>
      </div>

      <div className="w-full flex items-center justify-between border-t border-white/10 pt-6 mt-24">
        <p className="text-[10px] text-white/40 font-mono">© 2026 Dhruv Savaliya</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] text-white/40 hover:text-white transition-colors font-mono cursor-none">
          BACK TO TOP ↗
        </button>
      </div>
    </section>
  );
}
