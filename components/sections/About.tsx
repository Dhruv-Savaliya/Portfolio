'use client';

import { useRef, useEffect, useState } from 'react';

export default function About() {
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
      id="about"
      className="relative bg-ds-bg px-[5vw] py-[12vw] overflow-hidden"
      aria-label="About Dhruv Savaliya"
    >
      {/* Rule */}
      <div
        className="flex items-center gap-6 mb-[6vw]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        <span className="text-label-mono text-ds-lime">ABOUT</span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Main statement — takes up 7 cols */}
        <div className="lg:col-span-7">
          <h2
            className="font-display font-bold text-ds-text mb-10"
            style={{
              fontSize: 'clamp(2rem, 5vw, 6rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            NOT JUST
            <br />
            <span style={{ color: '#C8FF00' }}>WRITING CODE.</span>
            <br />
            SOLVING
            <br />
            PROBLEMS.
          </h2>

          <div
            className="space-y-6 max-w-xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <p className="font-body text-ds-text-muted" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', lineHeight: 1.8 }}>
              I&apos;m Dhruv — a full-stack developer from Surat, India, obsessed with
              building web products that feel effortless to use. My work sits at
              the intersection of engineering, design, and applied AI.
            </p>
            <p className="font-body text-ds-text-muted" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', lineHeight: 1.8 }}>
              I started with curiosity and ended up with a craft. Every project I
              take on — whether it&apos;s a finance SaaS, a multi-tenant workflow
              system, or an AI document pipeline — gets the same treatment:
              thoughtful architecture, clean code, and interfaces that respect
              the people who use them.
            </p>
            <p className="font-body text-ds-text-muted" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', lineHeight: 1.8 }}>
              I&apos;m drawn to the hard parts — security, multi-tenancy, real-time
              data, AI integration. The problems most developers avoid are the
              ones I find most interesting.
            </p>
          </div>
        </div>

        {/* Right sidebar — 5 cols */}
        <div className="lg:col-span-5 space-y-8">
          {/* Status */}
          <div
            className="p-6 rounded-2xl border border-ds-border bg-ds-surface"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ds-lime animate-pulse" />
              <span className="text-label-mono text-ds-lime">AVAILABLE FOR WORK</span>
            </div>
            <p className="font-body text-ds-text-muted text-sm">
              Open to full-stack development roles, freelance projects, and
              AI-powered product builds.
            </p>
          </div>

          {/* Focus areas */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.4s',
            }}
          >
            <p className="text-label-mono text-ds-text-muted mb-4">FOCUS AREAS</p>
            <div className="space-y-3">
              {[
                'Modern web applications',
                'SaaS product engineering',
                'AI-powered features',
                'Interactive experiences',
                'Production systems',
              ].map((area) => (
                <div key={area} className="flex items-center gap-3">
                  <span style={{ color: '#C8FF00', fontSize: '0.6rem' }}>▸</span>
                  <span className="font-body text-ds-text" style={{ fontSize: '0.9rem' }}>
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick facts */}
          <div
            className="grid grid-cols-2 gap-4"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.5s',
            }}
          >
            {[
              { label: 'LOCATION', value: 'Surat, India' },
              { label: 'EDUCATION', value: 'BCA — SDJ College' },
              { label: 'EXPERIENCE', value: '2+ Internships' },
              { label: 'PROJECTS', value: '3 Major Builds' },
            ].map((fact) => (
              <div key={fact.label} className="p-4 rounded-xl border border-ds-border bg-ds-surface">
                <p className="text-label-mono text-ds-text-muted mb-1">{fact.label}</p>
                <p className="font-body text-ds-text text-sm font-medium">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
