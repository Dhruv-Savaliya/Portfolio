import React, { useState } from 'react';
import { Layers, Server, Database, Sparkles, Wrench, Check } from 'lucide-react';
import { sound } from '../../lib/audio';

export const TechnologySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const categories = [
    {
      name: 'Frontend',
      icon: Layers,
      color: 'text-cyan-400',
      badge: 'border-cyan-500/30 bg-cyan-500/10',
      description: 'Component architecture, SSR, responsive design, and fluid WebGL canvases.',
      skills: [
        { name: 'Next.js 15 (App Router)', highlight: true },
        { name: 'React 19', highlight: true },
        { name: 'TypeScript', highlight: true },
        { name: 'Tailwind CSS v4', highlight: true },
        { name: 'Three.js / WebGL', highlight: true },
        { name: 'Motion / Spring', highlight: false },
        { name: 'PixiJS (2D Canvas)', highlight: false },
        { name: 'Recharts & D3', highlight: false },
        { name: 'TanStack Table', highlight: false },
      ],
    },
    {
      name: 'Backend',
      icon: Server,
      color: 'text-purple-400',
      badge: 'border-purple-500/30 bg-purple-500/10',
      description: 'RESTful API contracts, role-based authorization, and secure middleware execution.',
      skills: [
        { name: 'Node.js', highlight: true },
        { name: 'Express.js', highlight: true },
        { name: 'REST API Architecture', highlight: true },
        { name: 'JWT Authentication', highlight: true },
        { name: 'Better Auth', highlight: false },
        { name: 'Zod Data Validation', highlight: true },
        { name: 'Role-Based Access (RBAC)', highlight: true },
        { name: 'Middleware Security Audits', highlight: true },
      ],
    },
    {
      name: 'Database',
      icon: Database,
      color: 'text-emerald-400',
      badge: 'border-emerald-500/30 bg-emerald-500/10',
      description: 'Document database modeling, tenant partitioning, indexing, and aggregations.',
      skills: [
        { name: 'MongoDB', highlight: true },
        { name: 'Mongoose ORM', highlight: true },
        { name: 'Multi-Tenant Isolation', highlight: true },
        { name: 'Schema Validation', highlight: false },
        { name: 'Aggregation Pipelines', highlight: false },
        { name: 'Indexed Queries', highlight: false },
      ],
    },
    {
      name: 'AI & Vision',
      icon: Sparkles,
      color: 'text-sky-400',
      badge: 'border-sky-500/30 bg-sky-500/10',
      description: 'Document OCR processing, multimodal prompt pipelines, and structured schema extraction.',
      skills: [
        { name: 'Groq API (Llama 3 / Mixtral)', highlight: true },
        { name: 'Gemini AI Integration', highlight: true },
        { name: 'Tesseract.js OCR Pipeline', highlight: true },
        { name: 'Structured JSON Generation', highlight: true },
        { name: 'Rate-Limit Recovery Fallbacks', highlight: false },
      ],
    },
    {
      name: 'Tools & DevOps',
      icon: Wrench,
      color: 'text-amber-400',
      badge: 'border-amber-500/30 bg-amber-500/10',
      description: 'Modern developer toolchains, version control, and production hosting.',
      skills: [
        { name: 'Git & GitHub', highlight: true },
        { name: 'Vercel Deployment', highlight: true },
        { name: 'Postman API Testing', highlight: false },
        { name: 'VS Code & CLI Tools', highlight: false },
        { name: 'Cloudinary Media CDN', highlight: false },
        { name: 'jsPDF Document Engine', highlight: false },
        { name: 'Nodemailer SMTP', highlight: false },
      ],
    },
  ];

  return (
    <section id="technology" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          <span>05 / 07 — TECH STACK</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          Engineering Stack
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light max-w-2xl">
          Carefully chosen tools configured for maximum type safety, sub-second execution speeds, and fluid user experiences.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === idx;
          return (
            <button
              key={cat.name}
              onClick={() => {
                sound.playTick();
                setActiveCategory(idx);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Display Panel */}
      <div className="glass-panel-glow p-8 sm:p-12 rounded-3xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              {categories[activeCategory].name}
            </h3>
            <p className="text-sm font-mono text-slate-400">
              {categories[activeCategory].description}
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 self-start sm:self-auto">
            {categories[activeCategory].skills.length} TECHNOLOGIES
          </span>
        </div>

        {/* Skill Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories[activeCategory].skills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => sound.playHover()}
              className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                skill.highlight
                  ? 'bg-white/[0.04] border-cyan-500/30 text-white shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-sm font-mono font-medium">{skill.name}</span>
              {skill.highlight && (
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                  CORE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
