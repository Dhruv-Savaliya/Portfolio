'use client';

import { useRef, useEffect, useState } from 'react';
import { useExperienceStore, TechCategory } from '@/lib/store';

const TECH_SYSTEMS = [
  {
    category: 'FRONTEND',
    subtitle: 'Interface System & State Architecture',
    color: '#356DFF',
    items: [
      'Next.js 15 (App Router)',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'PixiJS (2D Canvas)',
      'Recharts',
      'TanStack Table',
    ],
  },
  {
    category: 'BACKEND',
    subtitle: 'Infrastructure & Protected Services',
    color: '#7EA2FF',
    items: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'JWT Authentication',
      'Better Auth',
      'Zod Validation',
      'Role-Based Access Control (RBAC)',
    ],
  },
  {
    category: 'DATABASE',
    subtitle: 'Clustered Data & Isolation Boundaries',
    color: '#F4F6FA',
    items: [
      'MongoDB',
      'Mongoose ODM',
      'Multi-Tenant Tenant Isolation',
      'Aggregation Pipelines',
      'Index Optimization',
    ],
  },
  {
    category: 'AI',
    subtitle: 'Intelligent Nodes & Computer Vision',
    color: '#B8FF5A',
    items: [
      'Groq API (Sub-second LLM)',
      'Gemini AI',
      'Tesseract.js (Client/Server OCR)',
      'AI Application Development',
      'Structured Schema Extraction',
    ],
  },
  {
    category: 'WEBGL',
    subtitle: 'Spatial Systems & Motion Choreography',
    color: '#356DFF',
    items: [
      'Three.js',
      'React Three Fiber (R3F)',
      '@react-three/drei',
      'GSAP & ScrollTrigger',
      'Lenis Smooth Scroll',
      'GLSL Shader Programming',
    ],
  },
] as const;

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('FRONTEND');
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const setActiveTechCategory = useExperienceStore((s) => s.setActiveTechCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCoreMorphTarget('technology');
          setActiveTechCategory(selectedCategory);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget, setActiveTechCategory, selectedCategory]);

  const handleCategorySelect = (cat: TechCategory) => {
    setSelectedCategory(cat);
    setActiveTechCategory(cat);
    setCoreMorphTarget('technology');
  };

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative px-[5vw] py-[20vh] border-t border-ds-border overflow-hidden"
      aria-label="Technology Stack Matrix"
    >
      {/* Telemetry Header */}
      <div className="flex items-center gap-6 mb-12">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-mono tracking-widest">
          06 // TECHNICAL MATRIX
        </span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading + Interactive Category Tabs */}
        <div className="lg:col-span-5 space-y-8 select-none">
          <div>
            <h2
              className="font-display font-bold text-ds-text tracking-tighter"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 7rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              <span>THE STACK I</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-blue-highlight to-ds-blue">
                ARCHITECT.
              </span>
            </h2>
            <p className="font-mono text-xs text-ds-text-dim mt-3">
              HOVER OR SELECT CATEGORY TO TRANSFORM 3D CORE
            </p>
          </div>

          <div
            className="space-y-2.5"
            role="tablist"
            aria-label="Technology categories"
          >
            {TECH_SYSTEMS.map((sys) => {
              const isSelected = selectedCategory === sys.category;
              return (
                <button
                  key={sys.category}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategorySelect(sys.category as TechCategory)}
                  onMouseEnter={() => handleCategorySelect(sys.category as TechCategory)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 cursor-none flex items-center justify-between group ${
                    isSelected
                      ? 'border-ds-blue bg-ds-blue/10'
                      : 'border-ds-border bg-ds-surface/40 hover:border-ds-border-light'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isSelected ? 'bg-ds-blue-highlight' : 'bg-ds-text-dim group-hover:bg-ds-text-muted'
                        }`}
                      />
                      <span className="font-display font-bold text-lg md:text-xl text-ds-text tracking-tight">
                        {sys.category}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-ds-text-muted mt-1 pl-5">
                      {sys.subtitle}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-xs transition-transform duration-300 ${
                      isSelected ? 'text-ds-blue-highlight translate-x-1' : 'text-ds-text-dim'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active System Skill Node Cards */}
        <div className="lg:col-span-7">
          {TECH_SYSTEMS.map((sys) => {
            if (sys.category !== selectedCategory) return null;
            return (
              <div
                key={sys.category}
                className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/80 backdrop-blur-md shadow-2xl space-y-6 animate-fade-in"
              >
                <div className="flex items-center justify-between pb-4 border-b border-ds-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-ds-blue animate-pulse" />
                    <span className="font-mono text-xs text-ds-text">
                      {`${sys.category} // ARCHITECTURAL_MODULE`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-ds-signal">VERIFIED_SKILLS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sys.items.map((item, i) => (
                    <div
                      key={item}
                      className="p-4 rounded-xl border border-ds-border/60 bg-ds-bg/60 flex items-center gap-3 group hover:border-ds-blue-highlight/40 transition-colors"
                    >
                      <span className="font-mono text-[11px] text-ds-blue">
                        0{i + 1}
                      </span>
                      <span className="font-mono text-xs text-ds-text">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-ds-border/40 bg-ds-bg/30 text-xs font-mono text-ds-text-dim flex items-center justify-between">
                  <span>INTERACTION_FEEDBACK:</span>
                  <span className="text-ds-blue-highlight">
                    DIGITAL CORE TRANSMITTING {sys.category} STATE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
