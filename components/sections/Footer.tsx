'use client';

import { useRef, useEffect } from 'react';
import { useExperienceStore } from '@/lib/store';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger Core collapse into the "D" monogram
          setCoreMorphTarget('footer');
        }
      },
      { threshold: 0.25 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative px-[5vw] pt-[16vh] pb-[8vh] border-t border-ds-border overflow-hidden select-none bg-ds-bg"
      aria-label="Experience Footer"
    >
      {/* Visual Core Collapse Mark: Minimal "D" Monogram Framing */}
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border border-ds-blue/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-ds-blue-highlight/40" />
          <span
            className="font-display font-bold text-ds-blue-highlight text-6xl tracking-tighter"
            aria-hidden="true"
          >
            D
          </span>
        </div>
        <p className="text-label-mono text-ds-text-dim text-[11px] font-mono tracking-widest uppercase">
          CORE COLLAPSED // MONOGRAM RESOLUTION
        </p>
      </div>

      {/* Main Identity Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-ds-border">
        <div>
          <h3 className="font-display font-bold text-3xl md:text-5xl text-ds-text tracking-tighter">
            DHRUV SAVALIYA
          </h3>
          <p className="font-mono text-xs md:text-sm text-ds-blue-highlight mt-2">
            FULL-STACK DEVELOPER · AI / WEB / INTERACTION
          </p>
          <p className="font-mono text-xs text-ds-text-muted mt-1">
            SURAT, GUJARAT, INDIA
          </p>
        </div>

        {/* Essential Navigation Links */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8 font-mono text-xs">
          <a
            href="https://github.com/Dhruv-Savaliya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ds-text-muted hover:text-ds-text transition-colors cursor-none"
          >
            GITHUB ↗
          </a>
          <a
            href="https://linkedin.com/in/dhruvsavaliya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ds-text-muted hover:text-ds-text transition-colors cursor-none"
          >
            LINKEDIN ↗
          </a>
          <a
            href="mailto:dhruvsavaliya075@gmail.com"
            className="text-ds-text-muted hover:text-ds-text transition-colors cursor-none"
          >
            EMAIL ↗
          </a>
          <button
            onClick={scrollToTop}
            className="text-ds-blue-highlight hover:underline cursor-none"
            aria-label="Back to top"
          >
            BACK TO TOP ↑
          </button>
        </div>
      </div>

      {/* Bottom Copyright & Telemetry */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-mono text-ds-text-dim">
        <span>© 2026 DHRUV SAVALIYA. ALL RIGHTS RESERVED.</span>
        <span>ENGINEERED WITH NEXT.JS 15, THREE.JS &amp; GSAP</span>
      </div>
    </footer>
  );
}
