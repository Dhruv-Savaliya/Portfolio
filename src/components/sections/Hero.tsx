import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { store } from '../../lib/store';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    store.setSection('hero');
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('bizdhan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh]">
        {/* Left Column: Typography & Action (Matches Mockup) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 z-20">
          {/* Role Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill w-fit text-xs font-mono text-[var(--color-text)]">
            <span className="w-2 h-2 rounded-full bg-[#356DFF] shadow-[0_0_8px_#356DFF]" />
            <span className="tracking-widest uppercase text-[11px] font-semibold">
              FULL-STACK DEVELOPER
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display font-bold text-6xl sm:text-7xl md:text-8xl tracking-tight text-[var(--color-text)] leading-[0.92]">
            DHRUV<br />
            <span className="text-[var(--color-accent)] drop-shadow-[0_0_25px_rgba(53,109,255,0.4)]">
              SAVALIYA
            </span>
          </h1>

          {/* Manifesto Subtitle */}
          <p className="font-mono text-sm sm:text-base text-[var(--color-text-muted)] tracking-wider uppercase max-w-lg leading-relaxed">
            BUILDING DIGITAL EXPERIENCES WITH CODE, AI &amp; INTERACTION.
          </p>

          {/* Call to Action Button */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToWork}
              className="px-6 py-3 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] hover:bg-[#356DFF] hover:text-white text-xs font-mono text-[var(--color-text)] transition-all flex items-center gap-2.5 shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
            >
              <span className="tracking-widest uppercase">SCROLL TO EXPLORE</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Center-Right Column: Atmospheric Framing for the 3D Digital Core */}
        {/* The 3D Three.js canvas renders behind in this coordinate space, with pointer interactions enabled */}
        <div className="lg:col-span-4 h-72 sm:h-96 lg:h-full relative flex items-center justify-center pointer-events-none">
          {/* Subtle focal radial aura behind the 3D core */}
          <div 
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #356DFF 0%, #00F0FF 50%, transparent 70%)' }}
          />
        </div>

        {/* Far Right: Vertical Step Indicator (Desktop) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-end justify-center space-y-6 text-right z-20 font-mono text-xs">
          {[
            { num: '01', label: 'HERO', target: 'hero', active: true },
            { num: '02', label: 'WORK', target: 'bizdhan', active: false },
            { num: '03', label: 'ABOUT', target: 'about', active: false },
            { num: '04', label: 'CONTACT', target: 'contact', active: false },
          ].map((item) => (
            <button
              key={item.num}
              type="button"
              onClick={() => navTo(item.target)}
              className={`flex flex-col items-end group cursor-pointer text-left transition-colors ${
                item.active 
                  ? 'text-[#356DFF]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <span className="text-[10px] opacity-70 font-semibold">{item.num}</span>
              <span className="tracking-wider uppercase font-medium group-hover:underline">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="w-full flex items-center justify-between pt-8 border-t border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#356DFF] animate-ping" />
          <span>PORTFOLIO // 2026 EDITION</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SCROLL TO DISCOVER</span>
          <span className="animate-bounce text-[#356DFF]">↓</span>
        </div>
      </div>
    </section>
  );
}
