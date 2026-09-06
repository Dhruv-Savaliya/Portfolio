import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BizDhan Case Study — Dhruv Savaliya',
  description:
    'Deep-dive architectural review of BizDhan, a personal and SME financial operating SaaS built with Next.js 15, React 19, TypeScript, MongoDB, and Groq AI.',
};

export default function BizDhanCaseStudy() {
  return (
    <main className="min-h-screen bg-ds-bg text-ds-text px-[6vw] py-[12vh] font-body">
      {/* Navigation Return */}
      <div className="flex items-center justify-between pb-8 border-b border-ds-border mb-12">
        <Link
          href="/#work"
          className="font-mono text-xs text-ds-blue-highlight hover:underline flex items-center gap-2"
        >
          ← BACK TO EXPERIENCE
        </Link>
        <span className="font-mono text-xs text-ds-text-dim">
          CASE STUDY // 01 BIZDHAN
        </span>
      </div>

      {/* Editorial Title */}
      <div className="max-w-4xl mb-16 space-y-4">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-semibold">
          SYSTEM ARCHITECTURE DEEP-DIVE
        </span>
        <h1
          className="font-display font-bold text-ds-text tracking-tighter"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.9 }}
        >
          BIZDHAN ARCHITECTURE
        </h1>
        <p className="font-body text-lg md:text-xl text-ds-text-muted leading-relaxed">
          Engineering a dual-workspace SaaS platform for personal budgeting and SME financial
          operations with real-time AI fiscal summaries.
        </p>
      </div>

      {/* Metadata Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-ds-border bg-ds-surface/60 mb-16 font-mono text-xs">
        <div>
          <span className="text-ds-text-dim block mb-1">ROLE</span>
          <span className="text-ds-text font-semibold">Solo Designer &amp; Engineer</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">DEPLOYMENT</span>
          <span className="text-ds-text font-semibold">Vercel Edge</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">DATABASE</span>
          <span className="text-ds-text font-semibold">MongoDB Atlas</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">AI INFERENCE</span>
          <span className="text-ds-signal font-semibold">Groq API (&lt;280ms)</span>
        </div>
      </div>

      {/* Architectural Breakdown */}
      <div className="max-w-3xl space-y-12 text-sm md:text-base leading-relaxed text-ds-text-muted">
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            The Problem Space
          </h2>
          <p>
            Small business owners and individuals routinely face fragmented tooling: standard personal budgeting
            apps lack invoicing and SME tax line-items, while full ERP systems (SAP, QuickBooks) introduce
            prohibitive complexity, high licensing fees, and steep learning curves.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Dual Workspace Architecture
          </h2>
          <p>
            BizDhan solves this by isolating user operations into two context domains within a unified Next.js 15
            App Router architecture:
          </p>
          <ul className="list-disc pl-6 space-y-2 font-mono text-xs text-ds-text">
            <li>Personal Mode: Automated daily expense categorizations, liquid savings tracking, and recurring bills.</li>
            <li>SME Mode: Client management, itemized tax invoice generation (PDF via jsPDF), purchase orders, and team ledgers.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Sub-Second AI Financial Intelligence
          </h2>
          <p>
            Using the Groq LPU inference engine, BizDhan parses structured MongoDB transaction aggregations
            to synthesize concise natural-language fiscal insights. Users receive real-time visibility into burn rate
            deviations and cash-flow projections without manual spreadsheet analysis.
          </p>
        </section>

        <section className="pt-8 border-t border-ds-border flex items-center gap-6">
          <a
            href="https://github.com/Dhruv-Savaliya/Portfolio.git"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-ds-blue bg-ds-blue text-white font-mono text-xs hover:bg-ds-blue-highlight transition-colors"
          >
            VIEW SOURCE REPOSITORY ↗
          </a>
          <Link
            href="/#work"
            className="font-mono text-xs text-ds-text-muted hover:text-ds-text"
          >
            BACK TO MAIN PORTFOLIO
          </Link>
        </section>
      </div>
    </main>
  );
}
