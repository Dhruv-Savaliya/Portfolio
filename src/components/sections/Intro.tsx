import React, { useEffect, useRef } from 'react';
import { Layers, Sparkles, Box, Workflow, ArrowRight } from 'lucide-react';
import { store } from '../../lib/store';

export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('intro');
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('bizdhan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      id="intro"
      aria-label="Editorial Manifesto"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline & Manifesto */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
              01 / 04 — INTRO
            </span>
            <span className="w-8 h-[1px] bg-[#356DFF]/40" />
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight text-[var(--color-text)] leading-[1.05]">
            I LIKE TURNING <br />
            <span className="text-[#356DFF]">COMPLEX IDEAS</span> INTO{' '}
            <span className="text-[var(--color-text)]">SIMPLE PRODUCTS</span>.
          </h2>

          <p className="font-body text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            I'm Dhruv Savaliya — a Full-Stack Developer passionate about building scalable web applications, 
            AI solutions, and interactive 3D experiences that elevate user engagement.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToWork}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] hover:bg-[#356DFF] hover:text-white text-xs font-mono text-[var(--color-text)] transition-all cursor-pointer shadow-md group"
            >
              <span>VIEW MY WORK</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: 4 Interactive Pillar Badges (Matches Mockup) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {[
            { label: 'FULL STACK', icon: Layers, desc: 'Next.js 15 • React 19 • Node.js • Distributed DBs' },
            { label: 'AI & ML', icon: Sparkles, desc: 'Generative Models • OCR • Context Extraction' },
            { label: '3D WEB', icon: Box, desc: 'Three.js • GLSL Shaders • Procedural WebGL' },
            { label: 'INTERACTION', icon: Workflow, desc: 'Lenis Physics • GSAP Timelines • Fluid UX' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-4 rounded-2xl glass-panel flex items-center gap-4 hover:border-[#356DFF]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#356DFF]/15 text-[#356DFF] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-semibold tracking-wider text-[var(--color-text)] block">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)] block">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
