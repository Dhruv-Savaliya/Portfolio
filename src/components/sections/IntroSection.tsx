import React from 'react';
import { Layers, Brain, Cuboid, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { sound } from '../../lib/audio';

export const IntroSection: React.FC = () => {
  const pillars = [
    {
      icon: Layers,
      title: 'Full Stack Systems',
      desc: 'Architecting scalable SaaS applications with Next.js 15, React 19, Node.js, and clean API boundaries.',
      tag: 'ARCHITECTURE',
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/40',
    },
    {
      icon: Brain,
      title: 'Applied AI & ML',
      desc: 'Integrating Groq, Gemini AI, and Tesseract OCR pipelines to transform messy unstructured data into validated schemas.',
      tag: 'INTELLIGENCE',
      color: 'text-purple-400',
      border: 'hover:border-purple-500/40',
    },
    {
      icon: Cuboid,
      title: 'Interactive 3D Web',
      desc: 'Crafting fluid WebGL experiences with Three.js, GLSL shaders, React Spring physics, and responsive touch controls.',
      tag: 'EXPERIENCE',
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/40',
    },
    {
      icon: ShieldCheck,
      title: 'Security & Audits',
      desc: 'Enforcing robust RBAC, multi-tenant database isolation, and conducting rigorous vulnerability audits.',
      tag: 'HARDENED',
      color: 'text-blue-400',
      border: 'hover:border-blue-500/40',
    },
  ];

  return (
    <section id="intro" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      {/* Editorial Headline */}
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
          <span>01 / 04 — PHILOSOPHY</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
          I like turning{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
            complex ideas
          </span>{' '}
          into products that feel deceptively simple.
        </h2>

        <p className="mt-6 text-base sm:text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
          I'm Dhruv Savaliya — a Full-Stack Developer passionate about building high-performance web applications,
          AI-powered document pipelines, and interactive 3D interfaces that leave an impression.
        </p>
      </div>

      {/* 4 Architectural Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onMouseEnter={() => sound.playHover()}
              className={`p-6 rounded-2xl glass-panel border border-white/10 transition-all duration-300 ${item.border} hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] group`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 py-0.5 rounded bg-white/[0.03]">
                  {item.tag}
                </span>
              </div>

              <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
