import React, { useEffect, useRef, useState } from 'react';
import { TECHNOLOGIES } from '../../lib/constants';
import { store } from '../../lib/store';

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('technology');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: 'all', label: 'ALL DISCIPLINES' },
    { id: 'frontend', label: 'FRONTEND & 3D' },
    { id: 'backend', label: 'BACKEND & DATA' },
    { id: 'ai-tools', label: 'AI & CLOUD' },
  ];

  const filteredCategories =
    activeTab === 'all'
      ? TECHNOLOGIES
      : TECHNOLOGIES.filter((cat) => cat.id === activeTab);

  return (
    <section
      ref={sectionRef}
      id="technology"
      aria-label="Technology Stack & Skills"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
          03 / 04 — TECHNICAL EXPERTISE MATRIX
        </span>
        <span className="w-8 h-[1px] bg-[#356DFF]/40" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display font-bold text-4xl sm:text-6xl text-[var(--color-text)] tracking-tight leading-none mb-2">
            TECHNOLOGY STACK
          </h2>
          <p className="font-body text-sm text-[var(--color-text-muted)]">
            Every tool in my arsenal is selected for performance, type safety, and product velocity.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-[#356DFF] text-white font-medium shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Technology Categories */}
      <div className="space-y-10">
        {filteredCategories.map((group) => (
          <div key={group.id} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#356DFF]" />
                <h3 className="font-display font-bold text-xl text-[var(--color-text)]">
                  {group.category}
                </h3>
              </div>
              <span className="font-body text-xs text-[var(--color-text-muted)] hidden md:inline">
                {group.description}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-5 rounded-2xl glass-panel space-y-2 hover:border-[#356DFF]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-base text-[var(--color-text)]">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#356DFF]/15 text-[#356DFF] font-medium">
                        {skill.level}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[var(--color-text-muted)]">
                      {skill.focus}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                    <span>EXPERIENCE</span>
                    <span className="text-[var(--color-text)] font-medium">{skill.experience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
