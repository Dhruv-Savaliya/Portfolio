import React from 'react';
import { ArrowDown, Sparkles, Terminal, ShieldCheck, Cpu } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { sound } from '../../lib/audio';

interface HeroSectionProps {
  onOpenModelSpec: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModelSpec }) => {
  const scrollToWork = () => {
    sound.playClick();
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 sm:px-10 max-w-7xl mx-auto"
    >
      {/* Top Meta Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-mono text-cyan-300 border border-cyan-500/20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SURAT, INDIA • FULL-STACK / AI / 3D</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-slate-500">EXPERIENCE ARCHETYPE:</span>
          <span className="text-cyan-400 font-semibold">DIGITAL CORE v2.6</span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="my-auto py-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-cyan-400 font-bold">
            FULL-STACK DEVELOPER
          </span>
          <div className="h-px w-12 bg-cyan-400/40" />
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-display font-extrabold tracking-tight text-white leading-[0.95] mb-6">
          DHRUV <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300">
            SAVALIYA
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed mb-8">
          Building digital products with{' '}
          <span className="text-cyan-300 font-medium">code</span>,{' '}
          <span className="text-purple-300 font-medium">AI</span> &{' '}
          <span className="text-emerald-300 font-medium">interaction</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <MagneticButton onClick={scrollToWork} variant="primary">
            <span>EXPLORE WORK</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </MagneticButton>

          <MagneticButton onClick={onOpenModelSpec} variant="secondary">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>3D CORE ARCHITECTURE</span>
          </MagneticButton>
        </div>
      </div>

      {/* Bottom Indicators & Drag Hint */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-white/5 pt-8 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-semibold">INTERACTIVE WEBGL CORE</div>
            <div className="text-slate-500 text-[11px]">DRAG OR TOUCH TO ROTATE • SCROLL TO MORPH</div>
          </div>
        </div>

        <button
          onClick={scrollToWork}
          className="group flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span className="tracking-widest uppercase text-[11px]">SCROLL TO EXPLORE</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-cyan-400" />
        </button>
      </div>
    </section>
  );
};
