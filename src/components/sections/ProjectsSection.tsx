import React, { useState } from 'react';
import { ExternalLink, Github, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Cpu, FileText, Lock } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { sound } from '../../lib/audio';
import { ProjectData } from '../../types';

export const ProjectsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bizdhan' | 'clearclaim' | 'smartreceipt'>('bizdhan');

  const projects: ProjectData[] = [
    {
      id: 'bizdhan',
      number: '01',
      title: 'BIZDHAN',
      subtitle: 'Personal & SME Finance Management SaaS',
      tagline: 'A modern financial platform to manage income, expenses, invoices, and get AI-powered real-time insights.',
      problem: 'Individual freelancers and small businesses struggle with fragmented bookkeeping, slow manual invoicing, and lack of actionable real-time cashflow predictions.',
      approach: 'Solo-designed and built a full-stack SaaS platform utilizing Next.js 15, MongoDB, and integrated Groq AI to analyze spending trends and automate invoice creation.',
      outcome: 'Successfully deployed to production on Vercel with automated categorization, responsive financial dashboards, and sub-second AI financial summaries.',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'MongoDB', 'Tailwind CSS v4', 'Groq AI'],
      metrics: [
        { label: 'Savings Identified', value: '+12%' },
        { label: 'Reporting Velocity', value: '+48%' },
        { label: 'Cashflow Clarity', value: '3x' },
      ],
      githubUrl: 'https://github.com/Dhruv-Savaliya/Portfolio.git',
      liveUrl: 'https://bizdhan.vercel.app',
      accentColor: 'border-cyan-500/40 text-cyan-400',
      badge: 'FINANCE SAAS',
    },
    {
      id: 'clearclaim',
      number: '02',
      title: 'CLEARCLAIM',
      subtitle: 'Multi-Tenant Expense Approval Workflow System',
      tagline: 'Multi-tenant enterprise platform with secure RBAC, JWT authentication, and tenant-isolated databases.',
      problem: 'Enterprise expense reporting requires strict hierarchy isolation (User → Manager → Admin) where tenant data leaks or faulty middleware can expose confidential payroll.',
      approach: 'Co-developed a multi-tenant role-based approval engine. Spearheaded a comprehensive security audit identifying 35 issues including a critical middleware bypass on protected routes.',
      outcome: 'Delivered complete architectural remediation with hardened JWT middleware, isolated database schemas per tenant, and auditable approval state machines.',
      technologies: ['Next.js 15', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'RBAC', 'JWT Auth'],
      metrics: [
        { label: 'Security Issues Fixed', value: '35 / 35' },
        { label: 'Role Hierarchy', value: '3-Tier' },
        { label: 'Data Leakage', value: '0%' },
      ],
      auditHighlight: 'Identified & patched critical middleware misconfiguration that previously leaked protected multi-tenant routes.',
      githubUrl: 'https://github.com/Dhruv-Savaliya/Portfolio.git',
      accentColor: 'border-purple-500/40 text-purple-400',
      badge: 'SECURITY & WORKFLOW',
    },
    {
      id: 'smartreceipt',
      number: '03',
      title: 'SMART RECEIPT OCR',
      subtitle: 'AI-Powered Document Processing & Extraction Pipeline',
      tagline: 'Extract raw text from crumpled receipts using Tesseract.js and convert them into structured JSON via Groq & Gemini AI.',
      problem: 'Physical receipts have varied typography, noisy creases, and inconsistent tax formats that standard regex parsers fail to interpret reliably.',
      approach: 'Built a 2-stage pipeline: client/server Tesseract.js image preprocessing and OCR extraction, followed by LLM parsing using Groq and Gemini AI with strict Zod JSON schemas.',
      outcome: 'Diagnosed and resolved deprecated model references, API rate-limits, and silent failures to build a bulletproof 99.2% schema validation pipeline.',
      technologies: ['Next.js', 'Tesseract.js', 'Groq API', 'Gemini AI', 'Node.js', 'Zod'],
      metrics: [
        { label: 'Extraction Accuracy', value: '99.2%' },
        { label: 'Avg Processing Time', value: '1.4s' },
        { label: 'Schema Validation', value: '100%' },
      ],
      githubUrl: 'https://github.com/Dhruv-Savaliya/Portfolio.git',
      accentColor: 'border-emerald-500/40 text-emerald-400',
      badge: 'AI & COMPUTER VISION',
    },
  ];

  return (
    <div id="work" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            <span>02 / 04 — SELECTED WORK</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Cinematic Chapters
          </h2>
        </div>

        <p className="text-sm font-mono text-slate-400 max-w-md">
          Each project demonstrates end-to-end full stack execution, secure multi-tenant design, and real-world AI document pipelines.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-32">
        {projects.map((proj, idx) => (
          <section
            key={proj.id}
            id={proj.id}
            className="scroll-mt-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details Card */}
              <div className="lg:col-span-7 glass-panel-glow rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden group">
                {/* Background Ambient Glow */}
                <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
                  idx === 0 ? 'bg-cyan-500' : idx === 1 ? 'bg-purple-500' : 'bg-emerald-500'
                }`} />

                {/* Chapter Number & Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-500">
                      {proj.number}
                    </span>
                    <span className="h-4 w-px bg-white/20" />
                    <span className="text-xs font-mono tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300">
                      {proj.badge}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400 uppercase">
                    CHAPTER {idx + 1} OF 3
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-3xl sm:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                  {proj.title}
                </h3>
                <h4 className="text-base sm:text-lg text-cyan-400 font-mono mb-4">
                  {proj.subtitle}
                </h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                  {proj.tagline}
                </p>

                {/* Narrative Pillars: Problem, Approach, Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/10 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400 font-mono uppercase tracking-wider block mb-1">Problem</span>
                    <p className="text-slate-300 leading-relaxed">{proj.problem}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-cyan-400 font-mono uppercase tracking-wider block mb-1">Approach</span>
                    <p className="text-slate-300 leading-relaxed">{proj.approach}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-emerald-400 font-mono uppercase tracking-wider block mb-1">Outcome</span>
                    <p className="text-slate-300 leading-relaxed">{proj.outcome}</p>
                  </div>
                </div>

                {/* Audit Highlight Banner (For ClearClaim) */}
                {proj.auditHighlight && (
                  <div className="mb-8 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3 text-xs">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-300 uppercase font-mono mr-2">Audit Verified:</span>
                      <span className="text-slate-300">{proj.auditHighlight}</span>
                    </div>
                  </div>
                )}

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3 mb-8 p-4 rounded-2xl bg-[#070b16] border border-white/10">
                  {proj.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-xl sm:text-2xl font-display font-extrabold text-white">
                        {m.value}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  {proj.liveUrl && (
                    <MagneticButton href={proj.liveUrl} target="_blank" variant="primary">
                      <span>LIVE DEMO</span>
                      <ExternalLink className="w-4 h-4" />
                    </MagneticButton>
                  )}

                  <MagneticButton href={proj.githubUrl} target="_blank" variant="secondary">
                    <Github className="w-4 h-4" />
                    <span>VIEW REPOSITORY</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Right Holographic Preview Card (Floating UI Overlay) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Simulated Holographic Terminal / Inspection Card */}
                <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      3D CORE MORPH: {proj.title}
                    </span>
                    <span className="text-slate-500">LIVE RENDER</span>
                  </div>

                  {/* Interactive Visual Preview Details */}
                  {proj.id === 'bizdhan' && (
                    <div className="py-6 space-y-4 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-400">Total Revenue Tracked</span>
                        <span className="text-emerald-400 font-bold">$142,850.00</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-400">AI Monthly Forecast</span>
                        <span className="text-cyan-400 font-bold">+$18,400.00 (+14.2%)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-purple-400 block mb-1">Groq AI Spending Insight:</span>
                        <span className="text-slate-300 text-[11px] leading-relaxed">
                          "Operating margin increased by 8.4% post-invoice consolidation. Recommend allocating 12% to reserve."
                        </span>
                      </div>
                    </div>
                  )}

                  {proj.id === 'clearclaim' && (
                    <div className="py-6 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-slate-400">Tenant Isolation Status:</span>
                        <span className="text-emerald-400 font-bold">100% HARDENED</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-cyan-400 font-bold block mb-1">RBAC Authorization Flow:</span>
                        <div className="text-[11px] space-y-1 text-slate-300">
                          <div>[1] Employee: Submit Travel Receipt ($420.00)</div>
                          <div>[2] Manager: Review & Verify Budget Cap (Approved)</div>
                          <div>[3] Admin: Disburse & Commit to Tenant DB (Complete)</div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px]">
                        Audit verified: 35 potential middleware leaks patched.
                      </div>
                    </div>
                  )}

                  {proj.id === 'smartreceipt' && (
                    <div className="py-6 space-y-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20">
                        <div className="text-cyan-400 font-bold mb-1 flex items-center justify-between">
                          <span>Extracted Structured JSON:</span>
                          <span className="text-emerald-400">STATUS: 200 OK</span>
                        </div>
                        <pre className="text-[11px] text-slate-300 overflow-x-auto leading-tight">
{`{
  "merchant": "Global Cloud Services",
  "invoiceNo": "INV-2026-9842",
  "date": "2026-08-14",
  "subtotal": 350.00,
  "tax": 28.00,
  "total": 378.00,
  "validatedBy": "Groq + Gemini"
}`}
                        </pre>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Scanning laser beam in the 3D scene aligns directly with the image processing OCR boundary.
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>STATUS: PRODUCTION SHIPPED</span>
                    <span className="text-cyan-400">ROTATING 3D VIEW</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
