'use client';

import { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

const TIMELINE = [
  {
    period: '2023 – 2026',
    role: 'Bachelor of Computer Applications (BCA)',
    org: 'SDJ International College · Veer Narmad South Gujarat University',
    type: 'ACADEMIC GRADUATION',
    status: 'Graduated',
    badgeColor: '#7EA2FF',
    details: [
      'Comprehensive foundation in software engineering, relational & document database systems, computer networks, and algorithms.',
      'Completed full-stack capstone project (ClearClaim) covering multi-tenant architectures and RBAC security systems.',
    ],
  },
  {
    period: 'Nov 2025 – Jun 2026',
    role: 'Web Development Intern',
    org: 'ZenVara Infotech · On-site',
    type: 'PRODUCTION INTERNSHIP',
    status: 'Completed',
    badgeColor: '#356DFF',
    details: [
      'Engineered internal web applications and interactive browser games using React.js, Next.js, TypeScript, and Tailwind CSS.',
      'Developed 2D interactive canvas graphics and game mechanics utilizing PixiJS with component-based state architecture.',
      'Contributed to code reviews, cross-device debugging, and responsive user interfaces within an agile production cycle.',
    ],
  },
  {
    period: 'Jul 2026 – Aug 2026',
    role: 'Full Stack Development Intern',
    org: 'CodeAlpha · Remote',
    type: 'ENGINEERING INTERNSHIP',
    status: 'Incoming / Evaluated',
    badgeColor: '#B8FF5A',
    details: [
      'Selected after technical evaluation for remote Full Stack Development internship.',
      'Focus areas: end-to-end web application engineering, RESTful API integrations, and scalable problem solving.',
    ],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('about');
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative px-[5vw] py-[20vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="Experience and Education"
    >
      {/* Telemetry Header */}
      <div className="flex items-center gap-6 mb-12">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-mono tracking-widest">
          05 // VERIFIED TRAJECTORY
        </span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <h2
        className="font-display font-bold text-ds-text tracking-tighter mb-14"
        style={{
          fontSize: 'clamp(2.6rem, 6.5vw, 7.5rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
        }}
      >
        <span>EXPERIENCE &amp;</span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-blue-highlight to-ds-blue">
          EDUCATION.
        </span>
      </h2>

      {/* Cinematic Timeline List */}
      <div className="space-y-6">
        {TIMELINE.map((item) => (
          <div
            key={item.role}
            className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/60 backdrop-blur-md space-y-4 hover:border-ds-blue-highlight/40 transition-colors duration-300"
          >
            {/* Top Bar: Period & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ds-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-ds-blue-highlight font-bold">
                  {item.period}
                </span>
                <span className="text-label-mono text-[10px] px-2.5 py-0.5 rounded-full border border-ds-border bg-ds-bg text-ds-text-dim font-mono">
                  {item.type}
                </span>
              </div>
              <span
                className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border w-fit"
                style={{
                  color: item.badgeColor,
                  borderColor: `${item.badgeColor}40`,
                  backgroundColor: `${item.badgeColor}10`,
                }}
              >
                ● {item.status}
              </span>
            </div>

            {/* Role & Org */}
            <div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-ds-text tracking-tight">
                {item.role}
              </h3>
              <p className="font-mono text-xs md:text-sm text-ds-text-muted mt-1">
                {item.org}
              </p>
            </div>

            {/* Verified Details Bullet Points */}
            <ul className="space-y-2 pt-2 border-t border-ds-border/40">
              {item.details.map((bullet, bIdx) => (
                <li
                  key={bIdx}
                  className="flex items-start gap-3 font-body text-xs md:text-sm text-ds-text-muted leading-relaxed"
                >
                  <span className="text-ds-blue-highlight font-mono mt-0.5">›</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
