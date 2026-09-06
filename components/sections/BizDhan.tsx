'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useExperienceStore } from '@/lib/store';

const BIZDHAN_STACK = [
  'Next.js 15',
  'React 19',
  'TypeScript',
  'MongoDB',
  'Tailwind CSS',
  'Groq AI',
  'JWT',
  'Cloudinary',
  'Recharts',
];

export default function BizDhan() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('bizdhan');
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
      id="bizdhan"
      className="relative px-[5vw] py-[18vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="BizDhan — Personal & SME Finance SaaS"
    >
      {/* Chapter Number & Metadata Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ds-blue-highlight">01 // PROJECT CHAPTER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ds-blue animate-pulse" />
        </div>
        <span className="text-label-mono text-ds-text-dim text-[11px]">
          PERSONAL & SME FINANCE MANAGEMENT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Project Narrative & Technical Architecture */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h2
              className="font-display font-bold text-ds-text tracking-tighter"
              style={{
                fontSize: 'clamp(3rem, 7vw, 7.5rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
              }}
            >
              BIZDHAN
            </h2>
            <p className="font-mono text-sm text-ds-blue-highlight mt-2 uppercase tracking-widest">
              Personal & SME Financial Operating System
            </p>
          </div>

          <div className="space-y-4 text-ds-text-muted font-body text-sm md:text-base leading-relaxed">
            <p>
              Solo-designed and engineered full-stack SaaS managing multi-tier financial operations:
              invoicing, purchase orders, categorized income/expense ledgers, and intelligent fiscal reporting.
            </p>
            <p>
              Architected distinct dual workspaces for individual budgeting and SME team accounting,
              incorporating Groq API for sub-second, LLM-generated contextual fiscal summaries and anomaly detection.
            </p>
          </div>

          {/* Architecture Vector Nodes */}
          <div className="p-6 rounded-2xl border border-ds-border bg-ds-surface/60 backdrop-blur-md space-y-4">
            <p className="text-label-mono text-ds-text-dim text-xs">VERIFIED SYSTEM PIPELINE</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-ds-text">
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-ds-blue text-[10px] block mb-1">01 INGEST</span>
                Purchases & Invoices
              </div>
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-ds-blue text-[10px] block mb-1">02 LEDGER</span>
                MongoDB Aggregation
              </div>
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-ds-blue-highlight text-[10px] block mb-1">03 INSIGHT</span>
                Groq AI Summaries
              </div>
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-ds-signal text-[10px] block mb-1">04 REPORT</span>
                Visual Analytics
              </div>
            </div>
          </div>

          {/* Stack Pills */}
          <div>
            <p className="text-label-mono text-ds-text-dim text-xs mb-3">ENGINEERING STACK</p>
            <div className="flex flex-wrap gap-2">
              {BIZDHAN_STACK.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-ds-border bg-ds-surface/40 text-ds-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 pt-4">
            <Link
              href="/work/bizdhan"
              className="inline-flex items-center gap-2 text-xs font-mono text-ds-blue-highlight hover:underline tracking-wider"
            >
              VIEW CASE STUDY ARCHITECTURE ↗
            </Link>
            <a
              href="https://github.com/Dhruv-Savaliya/Portfolio.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-ds-text-muted hover:text-ds-text tracking-wider"
            >
              GITHUB ↗
            </a>
          </div>
        </div>

        {/* Right Column: Visual System Representation (No Fake Revenue Numbers) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/80 backdrop-blur-md shadow-2xl">
            {/* Top Terminal Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-ds-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ds-blue" />
                <span className="font-mono text-xs text-ds-text">BIZDHAN.SYSTEM.FLOW</span>
              </div>
              <span className="font-mono text-[11px] text-ds-text-dim">TLS_ENCRYPTED // JWT</span>
            </div>

            {/* Architecture Ledger Topology */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-ds-border/60 bg-ds-bg/60">
                <div className="flex items-center gap-3">
                  <span className="text-ds-blue-highlight font-bold">WORKSPACE_A</span>
                  <span className="text-ds-text-muted">Personal Financial Stream</span>
                </div>
                <span className="text-ds-signal text-[11px]">ACTIVE_SESSION</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-ds-border/60 bg-ds-bg/60">
                <div className="flex items-center gap-3">
                  <span className="text-ds-blue-highlight font-bold">WORKSPACE_B</span>
                  <span className="text-ds-text-muted">SME Invoice & Ledger Flow</span>
                </div>
                <span className="text-ds-signal text-[11px]">ISOLATED_TENANT</span>
              </div>

              {/* Data Pipeline Telemetry Box */}
              <div className="p-4 rounded-xl border border-ds-blue/30 bg-ds-blue/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ds-blue-highlight font-semibold">GROQ AI ANALYTIC GENERATION</span>
                  <span className="text-ds-signal font-bold">LATENCY &lt; 280ms</span>
                </div>
                <p className="text-xs text-ds-text-muted font-sans leading-relaxed">
                  Real-time pipeline aggregates categorized expenses and predicts burn variance using structured JSON prompting.
                </p>
              </div>

              {/* Visual Pulse Bars representing data stream throughput */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-[11px] text-ds-text-dim">
                  <span>DATA AGGREGATION THROUGHPUT</span>
                  <span>SYNCED</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-ds-border overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-ds-blue via-ds-blue-highlight to-ds-signal rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
