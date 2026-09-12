'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useExperienceStore } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ============================================
// HERO SECTION COMPONENT
// ============================================
interface HeroProps {
  transitionStarted?: boolean;
}

export default function Hero({ transitionStarted = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLineARef = useRef<HTMLSpanElement>(null);
  const titleLineBRef = useRef<HTMLParagraphElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  // ── GSAP Entry Timeline (fires when preloader starts its exit)
  useEffect(() => {
    if (!transitionStarted || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    setCoreMorphTarget('hero');

    if (prefersReducedMotion) {
      // Simple instant reveal for reduced motion
      [
        titleLineARef.current,
        titleLineBRef.current,
        metaTopRef.current,
        subTitleRef.current,
        scrollCueRef.current,
      ].forEach((el) => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
      return;
    }

    const tl = gsap.timeline({ delay: 0.5 });

    // Initial state — hidden below
    gsap.set(
      [
        titleLineARef.current,
        titleLineBRef.current,
        metaTopRef.current,
        subTitleRef.current,
        scrollCueRef.current,
      ],
      { opacity: 0, y: 48 }
    );

    // ── Staggered cinematic reveal
    tl.to(
      titleLineARef.current,
      { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' },
      0
    )
      .to(
        titleLineBRef.current,
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' },
        0.12
      )
      .to(
        metaTopRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
        0.3
      )
      .to(
        subTitleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
        0.45
      )
      .to(
        scrollCueRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
        0.6
      );
  }, [transitionStarted, setCoreMorphTarget, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden flex flex-col justify-between px-[5vw] pt-[15vh] pb-[6vh]"
      style={{ minHeight: '100svh' }}
      aria-label="Hero — Dhruv Savaliya, Full-Stack Developer"
    >
      {/* Bottom Composition: Glass Panel */}
      <div className="absolute bottom-[5vh] left-[5vw] right-[5vw] z-20">
        <div
          className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl"
          style={{
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <div className="text-center md:text-left">
            <div className="overflow-hidden mb-2">
              <h1
                className="font-display font-bold text-white tracking-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: 0.9,
                }}
              >
                <span
                  ref={titleLineARef}
                  className="block"
                  style={{ opacity: 0, transform: 'translateY(30px)' }}
                >
                  DHRUV SAVALIYA
                </span>
              </h1>
            </div>
            
            <div className="overflow-hidden">
              <p
                ref={titleLineBRef}
                className="font-display font-semibold text-ds-text-muted tracking-wider text-lg md:text-2xl uppercase"
                style={{ opacity: 0, transform: 'translateY(30px)' }}
              >
                FULL-STACK DEVELOPER
              </p>
            </div>
          </div>

          {/* Scroll Callout CTA */}
          <div
            ref={scrollCueRef}
            className="mt-6 md:mt-0 flex items-center justify-center"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            <a
              href="#intro"
              className="group inline-flex items-center gap-3 text-xs tracking-widest text-white/50 hover:text-white transition-colors cursor-none"
              aria-label="Scroll down to explore the experience"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="group-hover:translate-y-1 transition-transform duration-300 font-mono text-sm">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
