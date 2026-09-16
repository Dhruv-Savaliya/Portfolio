import React from 'react';
import { Lightbulb, Layout, GitBranch, Database, Sparkles, Rocket } from 'lucide-react';
import { sound } from '../../lib/audio';

export const HowIBuildSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'IDEA',
      desc: 'Formulate core product thesis, identify real user pain points, and eliminate non-essential scope before writing a line of code.',
      icon: Lightbulb,
      color: 'text-amber-400',
    },
    {
      num: '02',
      title: 'INTERFACE',
      desc: 'Design purposeful interfaces using mathematical typography scales, strict optical alignment, and deep glassmorphism.',
      icon: Layout,
      color: 'text-cyan-400',
    },
    {
      num: '03',
      title: 'ARCHITECTURE',
      desc: 'Engineer modular full-stack codebases using Next.js 15, TypeScript, and clean separation between client and server layers.',
      icon: GitBranch,
      color: 'text-purple-400',
    },
    {
      num: '04',
      title: 'DATA',
      desc: 'Structure scalable database models with MongoDB, ensuring tenant isolation, indexed queries, and resilient validation.',
      icon: Database,
      color: 'text-emerald-400',
    },
    {
      num: '05',
      title: 'AI PIPELINE',
      desc: 'Integrate Groq, Gemini, and OCR services with robust fallbacks, rate-limit resilience, and strict Zod output schemas.',
      icon: Sparkles,
      color: 'text-sky-400',
    },
    {
      num: '06',
      title: 'DEPLOYMENT',
      desc: 'Conduct end-to-end security audits, harden middleware routes, and deploy continuous CI/CD pipelines to Vercel.',
      icon: Rocket,
      color: 'text-pink-400',
    },
  ];

  return (
    <section id="how-i-build" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          <span>03 / 04 — METHODOLOGY</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
          I build from{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
            systems
          </span>
          , not guesswork.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light max-w-2xl">
          High-end engineering is systematic: from problem discovery to hardened multi-tenant architecture and fluid WebGL interactions.
        </p>
      </div>

      {/* 6-step Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              onMouseEnter={() => sound.playHover()}
              className="p-7 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                  PHASE {step.num}
                </span>
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${step.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
