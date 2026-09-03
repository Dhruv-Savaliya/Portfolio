'use client';

import { useRef, useEffect, useState } from 'react';

const TIMELINE = [
  {
    period: '2022 – PRESENT',
    role: 'BCA',
    org: 'SDJ International College',
    type: 'EDUCATION',
    color: '#C8FF00',
    desc: 'Bachelor of Computer Applications — building a strong foundation in software engineering, data structures, and modern web development.',
  },
  {
    period: '2024',
    role: 'Web Development Intern',
    org: 'ZenVara Infotech',
    type: 'EXPERIENCE',
    color: '#00E5FF',
    desc: 'Contributed to client web projects, gaining hands-on experience with real-world codebases and development workflows.',
  },
  {
    period: '2024 – 2025',
    role: 'Full Stack Development Intern',
    org: 'CodeAlpha',
    type: 'EXPERIENCE',
    color: '#C8FF00',
    desc: 'Worked across the full stack — frontend interfaces, backend APIs, database design — delivering production-grade features.',
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-ds-surface px-[5vw] py-[12vw] overflow-hidden"
      aria-label="Experience and Education"
    >
      {/* Rule */}
      <div
        className="flex items-center gap-6 mb-[6vw]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        <span className="text-label-mono text-ds-lime">JOURNEY</span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <h2
        className="font-display font-bold text-ds-text mb-[5vw]"
        style={{
          fontSize: 'clamp(2rem, 6vw, 7rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        EDUCATION &
        <br />
        <span style={{ color: '#C8FF00' }}>EXPERIENCE</span>
      </h2>

      {/* Timeline */}
      <div className="space-y-0">
        {TIMELINE.map((item, i) => (
          <div
            key={item.role}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 border-b border-ds-border last:border-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`,
            }}
          >
            {/* Period + type */}
            <div className="md:col-span-3">
              <p className="text-label-mono text-ds-text-muted mb-1">{item.period}</p>
              <span
                className="inline-flex items-center gap-1 text-label-mono px-2 py-0.5 rounded-full border"
                style={{
                  fontSize: '0.55rem',
                  color: item.color,
                  borderColor: `${item.color}40`,
                  backgroundColor: `${item.color}10`,
                }}
              >
                {item.type}
              </span>
            </div>

            {/* Role + org */}
            <div className="md:col-span-5">
              <h3
                className="font-display font-bold text-ds-text"
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '0.25rem',
                }}
              >
                {item.role}
              </h3>
              <p
                className="font-accent"
                style={{ color: item.color, fontSize: '0.85rem', fontWeight: 600 }}
              >
                {item.org}
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-4">
              <p
                className="font-body text-ds-text-muted"
                style={{ fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)', lineHeight: 1.7 }}
              >
                {item.desc}
              </p>
            </div>

            {/* Decorative dot */}
            <div
              className="hidden md:block absolute left-[24.5%] top-1/2 w-2 h-2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
