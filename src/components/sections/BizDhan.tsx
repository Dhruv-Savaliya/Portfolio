import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, CheckCircle2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { store } from '../../lib/store';

export default function BizDhan() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'reconciliation'>('analytics');
  const [invoiceAmount, setInvoiceAmount] = useState(4850);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('bizdhan');
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
      id="bizdhan"
      aria-label="BizDhan — Finance Platform"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      {/* Chapter Marker */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-[#356DFF] tracking-widest uppercase">
            01 / 03 — FEATURED PROJECT
          </span>
          <span className="w-2 h-2 rounded-full bg-[#356DFF] animate-ping" />
        </div>
        <span className="font-mono text-[11px] text-[var(--color-text-muted)] uppercase hidden sm:inline-block">
          FINANCE SAAS PLATFORM
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Narrative, Architecture & Links */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-5xl sm:text-7xl text-[var(--color-text)] tracking-tighter leading-none mb-3">
              BIZDHAN
            </h2>
            <p className="font-mono text-sm text-[#356DFF] font-medium uppercase tracking-wider">
              FINANCE PLATFORM
            </p>
          </div>

          <p className="text-base sm:text-lg text-[var(--color-text-muted)] font-body leading-relaxed max-w-xl">
            A modern financial platform to manage income, expenses, reports and get AI-powered insights. 
            Built for SMEs and freelancers with instant double-entry ledger reconciliation.
          </p>

          {/* Tech Stack Chips */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
              TECHNOLOGIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS'].map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono glass-pill text-[var(--color-text)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="https://github.com/Dhruv-Savaliya/Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#356DFF] text-white text-xs font-mono font-semibold flex items-center gap-2 hover:bg-[#1e55ee] transition-all shadow-md shadow-[#356DFF]/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
            >
              <span>LIVE DEMO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/Dhruv-Savaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass-panel text-[var(--color-text)] text-xs font-mono font-semibold flex items-center gap-2 hover:border-[#356DFF]/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 3D Isometric Financial Platform Pedestal */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden space-y-6">
            {/* Top Bar with Controls */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#356DFF]" />
                <span className="font-mono text-xs font-semibold text-[var(--color-text)] uppercase">
                  FINANCIAL OVERVIEW
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-[#356DFF] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  METRICS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reconciliation')}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
                    activeTab === 'reconciliation'
                      ? 'bg-[#356DFF] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  LEDGER
                </button>
              </div>
            </div>

            {/* 3D Isometric Graph Visualizer */}
            <div className="relative py-4">
              <div className="grid grid-cols-5 gap-3 items-end h-40 pt-4 px-2">
                {[
                  { month: 'JAN', height: '55%', amount: '$12.4k' },
                  { month: 'FEB', height: '70%', amount: '$18.2k' },
                  { month: 'MAR', height: '62%', amount: '$15.9k' },
                  { month: 'APR', height: '88%', amount: '$24.6k' },
                  { month: 'MAY', height: '100%', amount: '$31.8k' },
                ].map((bar, i) => (
                  <div key={bar.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.amount}
                    </span>
                    <div 
                      className={`w-full rounded-xl transition-all duration-500 relative ${
                        i === 4 
                          ? 'bg-gradient-to-t from-[#356DFF] to-[#00F0FF] shadow-[0_0_15px_rgba(53,109,255,0.5)]' 
                          : 'bg-[#356DFF]/30 group-hover:bg-[#356DFF]/60'
                      }`}
                      style={{ height: bar.height }}
                    >
                      {i === 4 && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#B8FF5A] shadow-[0_0_8px_#B8FF5A]" />
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)] font-semibold">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Holographic Signal Badges (Matches Mockup) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-center">
                <span className="font-mono text-[10px] text-[var(--color-text-muted)] block uppercase">SAVINGS</span>
                <span className="font-display font-bold text-lg text-[#B8FF5A]">+12.4%</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-center">
                <span className="font-mono text-[10px] text-[var(--color-text-muted)] block uppercase">REPORTS</span>
                <span className="font-display font-bold text-lg text-[#00F0FF]">+48%</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-center">
                <span className="font-mono text-[10px] text-[var(--color-text-muted)] block uppercase">GROWTH</span>
                <span className="font-display font-bold text-lg text-[#356DFF]">3.2x</span>
              </div>
            </div>

            {/* Contextual AI Insight */}
            <div className="p-3.5 rounded-xl bg-[#356DFF]/10 border border-[#356DFF]/20 flex items-center gap-3 text-xs font-mono">
              <TrendingUp className="w-4 h-4 text-[#356DFF] shrink-0" />
              <span className="text-[var(--color-text)]">
                AI Insight: Automated anomaly detection active with 99.8% precision.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
