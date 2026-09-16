import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sound } from '../../lib/audio';

export const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      period: 'Jul 2026 — Aug 2026',
      role: 'Full Stack Development Intern',
      company: 'CodeAlpha',
      type: 'Remote Internship',
      location: 'Remote',
      highlights: [
        'Selected for competitive remote Full Stack Development internship focusing on end-to-end application engineering.',
        'Developed robust REST APIs, client-server data synchronization, and algorithmic problem-solving tasks.',
      ],
      current: false,
      badge: 'INTERNSHIP',
    },
    {
      period: 'Nov 2025 — Jun 2026',
      role: 'Web Development Intern',
      company: 'ZenVara Infotech',
      type: 'On-site Internship',
      location: 'Surat, India',
      highlights: [
        'Engineered internal web-based applications and interactive browser experiences utilizing React.js, Next.js, TypeScript, and Tailwind CSS.',
        'Created interactive canvas graphics and game mechanics with PixiJS, applying strict component architecture and state management.',
        'Participated in production code reviews, Git pull request workflows, and cross-browser performance optimizations.',
      ],
      current: false,
      badge: 'ON-SITE EXPERIENCE',
    },
    {
      period: '2023 — 2026',
      role: 'Bachelor of Computer Applications (BCA)',
      company: 'SDJ International College',
      type: 'Veer Narmada South Gujarat University',
      location: 'Surat, India',
      highlights: [
        'Graduated with honors in Computer Applications, focusing on Data Structures, Database Systems, Computer Networks, and Object-Oriented Software Design.',
        'Capstone project: Co-developed the ClearClaim multi-tenant expense approval workflow platform.',
      ],
      current: false,
      badge: 'DEGREE',
    },
  ];

  return (
    <section id="experience" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          <span>CAREER TIMELINE</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          Professional Experience
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light max-w-2xl">
          A track record of on-site and remote development, production shipping, and rigorous academic foundations.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            onMouseEnter={() => sound.playHover()}
            className="relative group"
          >
            {/* Pulsing Timeline Node */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#040711] border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_#00f0ff]" />

            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  {exp.period}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {exp.badge}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {exp.role}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-4">
                <span className="text-slate-300 font-medium">{exp.company}</span>
                <span>•</span>
                <span>{exp.type}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {exp.location}
                </span>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold mt-1 text-xs">▹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
