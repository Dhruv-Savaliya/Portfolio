import React from 'react';
import { MapPin, GraduationCap, Award, Code, Sparkles, Terminal } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Narrative */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            <span>04 / 04 — PROFILE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            I'm Dhruv Savaliya. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-400">
              Full-Stack Developer
            </span>{' '}
            focused on AI & Interactive Web.
          </h2>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light mb-8">
            <p>
              I build web applications where clean systems architecture meets tactile interaction. My focus spans
              the entire development continuum: designing modern frontends in <strong className="text-white font-medium">Next.js 15</strong> and <strong className="text-white font-medium">React 19</strong>,
              architecting resilient APIs in <strong className="text-white font-medium">Node.js</strong> and <strong className="text-white font-medium">Express</strong>,
              and incorporating real-world AI pipelines using <strong className="text-white font-medium">Groq</strong> and <strong className="text-white font-medium">Gemini</strong>.
            </p>
            <p>
              Whether it's building a multi-tenant expense approval SaaS with hardened RBAC, engineering OCR document extraction pipelines, or rendering interactive 3D WebGL scenes with Three.js, I treat craft as an uncompromisable priority.
            </p>
          </div>

          {/* Key Facts / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-500 block mb-1">LOCATION</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Surat, India
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-500 block mb-1">EDUCATION</span>
              <span className="text-white font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                BCA Graduate
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-500 block mb-1">RECOGNITION</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Hackathon Finalist
              </span>
            </div>
          </div>
        </div>

        {/* Right Glass Profile / Holographic Spec Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel-glow p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-300 font-bold tracking-wider uppercase">
                  ACTIVE DEVELOPER STATE
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">SURAT (UTC+5:30)</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Core Specialty</span>
                <span className="text-white font-bold">Full Stack + AI Systems</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Languages</span>
                <span className="text-cyan-300">TypeScript, JavaScript, Python</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Frontend Paradigm</span>
                <span className="text-white">Next.js 15, React 19, Tailwind v4</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Interactive 3D</span>
                <span className="text-purple-300">Three.js, GLSL, PixiJS</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Backend & Security</span>
                <span className="text-white">Node.js, Express, RBAC, JWT</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Database</span>
                <span className="text-emerald-300">MongoDB, Mongoose</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-400">
                &gt; READY FOR FULL-TIME ROLES & HIGH-IMPACT PROJECTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
