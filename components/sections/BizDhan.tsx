'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// BIZDHAN PROJECT CHAPTER
// ============================================

const TECH = ['Next.js', 'React', 'TypeScript', 'MongoDB', 'Tailwind', 'Groq AI'];

// Simple animated bar chart component
function MiniChart({ values, visible }: { values: number[]; visible: boolean }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            backgroundColor: i % 3 === 0 ? '#C8FF00' : i % 3 === 1 ? '#00E5FF' : '#1A1A1A',
            height: visible ? `${v}%` : '4px',
            transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

// Dashboard mockup using pure CSS
function DashboardMockup({ visible }: { visible: boolean }) {
  const data = [45, 72, 38, 85, 62, 91, 54, 78, 43, 67, 82, 59];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-ds-border bg-ds-surface"
      style={{
        aspectRatio: '16/10',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) rotateX(0deg)' : 'translateY(40px) rotateX(5deg)',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-ds-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ds-lime" />
          <span className="text-label-mono text-ds-text" style={{ fontSize: '0.65rem' }}>BIZDHAN DASHBOARD</span>
        </div>
        <div className="flex gap-1">
          {['#FF6B6B', '#FFD93D', '#C8FF00'].map((c, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      <div className="p-5 grid grid-cols-3 gap-4 h-[calc(100%-44px)]">
        {/* Stat cards */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {[
            { label: 'REVENUE', value: '₹2.4L', delta: '+12%', color: '#C8FF00' },
            { label: 'EXPENSES', value: '₹0.8L', delta: '-3%', color: '#FF6B6B' },
            { label: 'SAVINGS', value: '₹1.6L', delta: '+18%', color: '#00E5FF' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-ds-border bg-ds-surface-2 p-3"
            >
              <p style={{ fontSize: '0.55rem', color: '#555', letterSpacing: '0.15em', fontFamily: 'var(--font-accent)' }}>
                {stat.label}
              </p>
              <p
                className="font-display font-bold mt-1"
                style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', color: stat.color }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: '0.55rem', color: stat.color, opacity: 0.7 }}>
                {stat.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="col-span-2 rounded-lg border border-ds-border bg-ds-surface-2 p-3">
          <p style={{ fontSize: '0.55rem', color: '#555', letterSpacing: '0.15em', marginBottom: '0.5rem', fontFamily: 'var(--font-accent)' }}>
            MONTHLY OVERVIEW
          </p>
          <MiniChart values={data} visible={visible} />
        </div>

        {/* AI insight */}
        <div className="col-span-1 rounded-lg border border-ds-lime/20 bg-ds-lime/5 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-ds-lime animate-pulse" />
            <span style={{ fontSize: '0.5rem', color: '#C8FF00', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
              GROQ AI
            </span>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#F0EDE6', lineHeight: 1.5 }}>
            &quot;Expenses trending 8% below forecast. Consider investing surplus.&quot;
          </p>
        </div>

        {/* Transactions */}
        <div className="col-span-3 rounded-lg border border-ds-border bg-ds-surface-2 px-3 py-2">
          <div className="space-y-1.5">
            {[
              { desc: 'Invoice #INV-2041', type: 'INCOME',  amount: '+₹45,000', color: '#C8FF00' },
              { desc: 'AWS Subscription',  type: 'EXPENSE', amount: '-₹3,200',  color: '#FF6B6B' },
              { desc: 'Client Payment',    type: 'INCOME',  amount: '+₹85,000', color: '#C8FF00' },
            ].map((tx) => (
              <div key={tx.desc} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: tx.color }}
                  />
                  <span style={{ fontSize: '0.55rem', color: '#F0EDE6', fontFamily: 'var(--font-body)' }}>
                    {tx.desc}
                  </span>
                </div>
                <div className="text-right">
                  <span style={{ fontSize: '0.55rem', color: tx.color, fontFamily: 'var(--font-mono)' }}>
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BizDhan() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bizdhan"
      className="relative bg-ds-bg px-[5vw] py-[12vw] overflow-hidden"
      aria-label="BizDhan project"
    >
      {/* Section rule */}
      <div className="flex items-center gap-6 mb-[6vw]">
        <span className="text-label-mono text-ds-lime">01</span>
        <div className="flex-1 h-px bg-ds-border" />
        <span className="text-label-mono text-ds-text-muted">SELECTED WORK</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Copy */}
        <div className="flex flex-col justify-between">
          <div>
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p className="text-label-mono text-ds-lime mb-4">PERSONAL &amp; SME FINANCE</p>
              <h2
                className="font-display font-bold text-ds-text"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 9rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  marginBottom: '2rem',
                }}
              >
                BIZ
                <span style={{ color: '#C8FF00' }}>DHAN</span>
              </h2>
            </div>

            <p
              className="font-body text-ds-text-muted mb-8"
              style={{
                fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
                lineHeight: 1.7,
                maxWidth: '42ch',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
              }}
            >
              A full-stack finance SaaS for purchases, invoicing, income,
              expenses and reporting — enhanced with AI-powered financial insights.
            </p>

            {/* Tech tags */}
            <div
              className="flex flex-wrap gap-2 mb-10"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.8s ease 0.25s',
              }}
            >
              {TECH.map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div
            className="flex items-center gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            }}
          >
            <Link
              href="#"
              className="flex items-center gap-2 px-6 py-3 bg-ds-lime text-ds-bg font-display font-bold text-sm tracking-wide hover:bg-white transition-colors duration-300 cursor-none rounded-full"
            >
              LIVE DEMO ↗
            </Link>
            <Link
              href="https://github.com/dhruvsavaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-label-mono text-ds-text-muted hover:text-ds-lime transition-colors duration-300 cursor-none"
            >
              GITHUB →
            </Link>
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div
          style={{
            perspective: '1000px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        >
          <DashboardMockup visible={visible} />
        </div>
      </div>
    </section>
  );
}


