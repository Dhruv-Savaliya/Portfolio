import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Zap, RefreshCw } from 'lucide-react';
import { store } from '../../lib/store';

export default function HowIBuild() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('howibuild');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      num: '01',
      title: 'Type-Safe Contracts First',
      desc: 'Shared interfaces and strict TypeScript definitions span from API endpoints to the client. Zero runtime guessing.',
      icon: Terminal,
    },
    {
      num: '02',
      title: 'Deterministic State & Latency',
      desc: 'Optimistic UI updates, local caching, and non-blocking background workers deliver sub-100ms perceived speed.',
      icon: Zap,
    },
    {
      num: '03',
      title: 'Practical AI Grounding',
      desc: 'Generative models bounded by strict JSON schemas, contextual retrieval, and deterministic verification gates.',
      icon: RefreshCw,
    },
    {
      num: '04',
      title: 'Accessible Cinematic Motion',
      desc: 'Animations serve narrative hierarchy and spatial orientation while honoring prefers-reduced-motion unconditionally.',
      icon: Shield,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-i-build"
      aria-label="How I Build — Engineering Philosophy"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
          04 // ARCHITECTURAL DISCIPLINE
        </span>
        <span className="w-8 h-[1px] bg-[#356DFF]/40" />
      </div>

      <h2 className="font-display font-bold text-4xl sm:text-6xl text-[var(--color-text)] tracking-tight mb-14">
        HOW I BUILD DIGITAL PRODUCTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.num}
              className="p-8 rounded-3xl glass-panel space-y-4 hover:border-[#356DFF]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#356DFF] font-semibold">{p.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#356DFF]/15 text-[#356DFF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-[var(--color-text)]">
                  {p.title}
                </h3>

                <p className="font-body text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-muted)] uppercase">
                PRODUCTION STANDARD
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
