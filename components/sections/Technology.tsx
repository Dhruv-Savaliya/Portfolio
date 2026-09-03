'use client';

import { useRef, useEffect, useState } from 'react';

const SKILLS = {
  FRONTEND: {
    color: '#C8FF00',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'PixiJS', 'Recharts'],
  },
  BACKEND: {
    color: '#00E5FF',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT', 'Better Auth', 'Zod'],
  },
  DATABASE: {
    color: '#a29bfe',
    items: ['MongoDB', 'Mongoose'],
  },
  AI: {
    color: '#FFD93D',
    items: ['Groq', 'Gemini', 'Tesseract.js'],
  },
  TOOLS: {
    color: '#FF6B6B',
    items: ['Git', 'GitHub', 'Postman', 'Vercel', 'Cloudinary', 'jsPDF', 'Nodemailer'],
  },
} as const;

type CategoryKey = keyof typeof SKILLS;

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('FRONTEND');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const active = SKILLS[activeCategory];

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative bg-ds-bg px-[5vw] py-[12vw] overflow-hidden"
      aria-label="Technology stack"
    >
      {/* Rule */}
      <div
        className="flex items-center gap-6 mb-[6vw]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        <span className="text-label-mono text-ds-lime">TECHNOLOGY</span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Header + categories */}
        <div className="lg:col-span-5">
          <h2
            className="font-display font-bold text-ds-text mb-8"
            style={{
              fontSize: 'clamp(2rem, 5vw, 6rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            THE
            <br />
            STACK I
            <br />
            <span style={{ color: '#C8FF00' }}>MASTER.</span>
          </h2>

          {/* Category tabs */}
          <div
            className="space-y-2"
            role="tablist"
            aria-label="Technology categories"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}
          >
            {(Object.keys(SKILLS) as CategoryKey[]).map((cat, i) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${cat}`}
                  id={`tab-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border cursor-none transition-all duration-300 group"
                  style={{
                    borderColor: isActive ? `${SKILLS[cat].color}60` : '#1A1A1A',
                    backgroundColor: isActive ? `${SKILLS[cat].color}10` : 'transparent',
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.6s ease ${0.25 + i * 0.07}s, border-color 0.3s, background-color 0.3s`,
                  }}
                >
                  <span
                    className="font-display font-bold"
                    style={{
                      fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
                      color: isActive ? SKILLS[cat].color : '#555',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    className="text-label-mono"
                    style={{
                      fontSize: '0.6rem',
                      color: isActive ? SKILLS[cat].color : '#333',
                    }}
                  >
                    {SKILLS[cat].items.length} TOOLS
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active skill display */}
        <div
          className="lg:col-span-7 flex flex-col justify-center"
          role="tabpanel"
          id={`panel-${activeCategory}`}
          aria-labelledby={`tab-${activeCategory}`}
        >
          <div className="mb-6">
            <p className="text-label-mono mb-2" style={{ color: active.color }}>
              {activeCategory}
            </p>
            <div
              className="w-full h-px"
              style={{ backgroundColor: `${active.color}30` }}
            />
          </div>

          {/* Skill grid */}
          <div className="flex flex-wrap gap-3">
            {active.items.map((skill, i) => (
              <div
                key={skill}
                className="group px-4 py-3 rounded-xl border cursor-none transition-all duration-300"
                style={{
                  borderColor: `${active.color}30`,
                  backgroundColor: `${active.color}08`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
                  transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = `${active.color}20`;
                  el.style.borderColor = active.color;
                  el.style.transform = 'translateY(-4px) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = `${active.color}08`;
                  el.style.borderColor = `${active.color}30`;
                  el.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <span
                  className="font-display font-medium"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)',
                    color: active.color,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {skill}
                </span>
              </div>
            ))}
          </div>

          {/* Visual constellation */}
          <div
            className="mt-10 relative h-32 rounded-2xl border border-ds-border bg-ds-surface overflow-hidden"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}
          >
            {active.items.map((_, i) => {
              const x = 10 + (i / (active.items.length - 1)) * 80;
              const y = 30 + Math.sin(i * 1.5) * 35;
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: active.color,
                    opacity: 0.6,
                    boxShadow: `0 0 8px ${active.color}`,
                    animation: `float ${3 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              );
            })}
            <svg className="absolute inset-0 w-full h-full">
              {active.items.slice(0, -1).map((_, i) => {
                const x1 = 10 + (i / (active.items.length - 1)) * 80;
                const y1 = 30 + Math.sin(i * 1.5) * 35;
                const x2 = 10 + ((i + 1) / (active.items.length - 1)) * 80;
                const y2 = 30 + Math.sin((i + 1) * 1.5) * 35;
                return (
                  <line
                    key={i}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={active.color}
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
