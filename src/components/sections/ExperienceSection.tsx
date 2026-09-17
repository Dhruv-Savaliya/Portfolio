import React, { useEffect, useRef } from 'react';
import { EXPERIENCES } from '../../lib/constants';
import { store } from '../../lib/store';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('experience');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Professional Experience & Timeline"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
          04 / 04 — CAREER MILESTONES
        </span>
        <span className="w-8 h-[1px] bg-[#356DFF]/40" />
      </div>

      <h2 className="font-display font-bold text-4xl sm:text-6xl text-[var(--color-text)] tracking-tight leading-none mb-12">
        EXPERIENCE &amp; TRACK RECORD
      </h2>

      <div className="space-y-8">
        {EXPERIENCES.map((item) => (
          <div
            key={item.id}
            className="p-8 sm:p-10 rounded-3xl glass-panel shadow-md space-y-6 hover:border-[#356DFF]/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[var(--color-border)] pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-2xl text-[var(--color-text)]">
                    {item.role}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#356DFF]/15 text-[#356DFF] font-semibold">
                    {item.type}
                  </span>
                </div>
                <div className="font-display text-lg text-[#356DFF] font-medium">
                  {item.company}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#356DFF]" />
                  <span>{item.period}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#356DFF]" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            <p className="font-body text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              {item.summary}
            </p>

            {/* Key Contributions */}
            <div className="space-y-2.5">
              <span className="font-mono text-xs text-[var(--color-text)] font-semibold uppercase tracking-wider block">
                NOTABLE ACHIEVEMENTS:
              </span>
              <ul className="space-y-2">
                {item.keyContributions.map((contrib, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-body text-[var(--color-text-muted)]">
                    <CheckCircle2 className="w-4 h-4 text-[#356DFF] shrink-0 mt-0.5" />
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="pt-2 flex flex-wrap gap-2">
              {item.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono glass-pill text-[var(--color-text)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
