import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClearClaim Case Study — Dhruv Savaliya',
  description:
    'Security and multi-tenant workflow architecture case study of ClearClaim, co-developed with Next.js 15, TypeScript, MongoDB, and custom RBAC middleware.',
};

export default function ClearClaimCaseStudy() {
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
          CASE STUDY // 02 CLEARCLAIM
        </span>
      </div>

      {/* Editorial Title */}
      <div className="max-w-4xl mb-16 space-y-4">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-semibold">
          SECURITY &amp; MULTI-TENANCY AUDIT
        </span>
        <h1
          className="font-display font-bold text-ds-text tracking-tighter"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.9 }}
        >
          CLEARCLAIM WORKFLOW
        </h1>
        <p className="font-body text-lg md:text-xl text-ds-text-muted leading-relaxed">
          Architecting multi-tenant expense management with cryptographic role hierarchies,
          tenant database scoping, and a 35-issue comprehensive security remediation.
        </p>
      </div>

      {/* Metadata Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-ds-border bg-ds-surface/60 mb-16 font-mono text-xs">
        <div>
          <span className="text-ds-text-dim block mb-1">PROJECT TYPE</span>
          <span className="text-ds-text font-semibold">BCA Capstone Project</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">ACCESS CONTROL</span>
          <span className="text-ds-text font-semibold">Strict 3-Tier RBAC</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">ISOLATION</span>
          <span className="text-ds-text font-semibold">Tenant-Keyed MongoDB</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">AUDIT OUTCOME</span>
          <span className="text-ds-signal font-semibold">35 Flaws Remediated</span>
        </div>
      </div>

      {/* Narrative Breakdown */}
      <div className="max-w-3xl space-y-12 text-sm md:text-base leading-relaxed text-ds-text-muted">
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Multi-Tenant Isolation Model
          </h2>
          <p>
            In multi-tenant SaaS, cross-tenant data leakage is a critical vulnerability. ClearClaim enforces
            tenant separation at the middleware boundary: incoming JWT sessions carry cryptographically signed
            tenant IDs that are injected into every database query, ensuring Organization A can never query
            Organization B records under any parameter manipulation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Security Audit &amp; Remediation
          </h2>
          <p>
            During internal pre-production testing, a systematic code audit of 35 issues was conducted. The most
            critical was a middleware misconfiguration in Next.js where certain static sub-paths permitted
            unauthenticated route traversal.
          </p>
          <div className="p-4 rounded-xl border border-ds-border bg-ds-surface/40 font-mono text-xs text-ds-text space-y-2">
            <p className="text-ds-blue-highlight font-bold">REMEDIATION ARCHITECTURE:</p>
            <p>1. Rewrote Next.js edge matcher regular expressions to enforce universal default-deny.</p>
            <p>2. Enforced Zod payload verification on all expense submission and approval mutations.</p>
            <p>3. Added timestamped, append-only audit trail logs for all administrative approvals.</p>
          </div>
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
