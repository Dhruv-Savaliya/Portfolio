'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useExperienceStore } from '@/lib/store';

const CLEARCLAIM_STACK = [
  'Next.js 15',
  'TypeScript',
  'MongoDB',
  'JWT Authentication',
  'RBAC Security',
  'Tailwind CSS',
  'Zod Validation',
];

export default function ClearClaim() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('clearclaim');
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
      id="clearclaim"
      className="relative px-[5vw] py-[18vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="ClearClaim — Multi-Tenant Expense Approval Workflow System"
    >
      {/* Chapter Number & Telemetry Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ds-blue-highlight">02 // PROJECT CHAPTER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ds-blue animate-pulse" />
        </div>
        <span className="text-label-mono text-ds-text-dim text-[11px]">
          MULTI-TENANT EXPENSE WORKFLOW & SECURITY ARCHITECTURE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Technical Narrative & Security Audit */}
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
              CLEARCLAIM
            </h2>
            <p className="font-mono text-sm text-ds-blue-highlight mt-2 uppercase tracking-widest">
              Multi-Tenant Expense Workflow System
            </p>
          </div>

          <div className="space-y-4 text-ds-text-muted font-body text-sm md:text-base leading-relaxed">
            <p>
              BCA capstone project co-developed to provide enterprise organizations with strictly
              isolated multi-tenant expense management and customizable multi-level approval hierarchies.
            </p>
            <p>
              Engineered robust Role-Based Access Control (RBAC) categorizing permissions across Employees,
              Managers, and Administrators with cryptographically signed JWT session middleware and strict tenant database scoping.
            </p>
          </div>

          {/* Code Audit & Remediation Milestone */}
          <div className="p-6 rounded-2xl border border-ds-border bg-ds-surface/60 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-label-mono text-ds-signal text-xs font-semibold">
                SECURITY CODE AUDIT MILESTONE
              </span>
              <span className="font-mono text-xs text-ds-text-muted">35 ISSUES REMEDIATED</span>
            </div>
            <p className="text-xs text-ds-text font-mono leading-relaxed">
              Identified critical middleware misconfiguration allowing route access bypass; architected complete
              session-validation middleware barrier with immutable audit trails.
            </p>
          </div>

          {/* Stack Pills */}
          <div>
            <p className="text-label-mono text-ds-text-dim text-xs mb-3">CORE SPECIFICATION</p>
            <div className="flex flex-wrap gap-2">
              {CLEARCLAIM_STACK.map((tech) => (
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
              href="/work/clearclaim"
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

        {/* Right Column: Multi-Tenant Hierarchy Architecture Visual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/80 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ds-border">
              <span className="font-mono text-xs text-ds-text">TENANT_ISOLATION_MODEL</span>
              <span className="font-mono text-[11px] text-ds-signal">RBAC_ENFORCED</span>
            </div>

            {/* Tenant A Box */}
            <div className="p-4 rounded-xl border border-ds-blue/40 bg-ds-blue/5 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-ds-blue-highlight font-bold">TENANT CLUSTER // ORG_ALPHA</span>
                <span className="text-[10px] text-ds-text-dim">DB_KEY: 0x9F41</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                <div className="p-2 rounded bg-ds-bg/60 border border-ds-border/40 text-ds-text-muted">
                  EMPLOYEE
                </div>
                <div className="p-2 rounded bg-ds-bg/60 border border-ds-border/40 text-ds-text-muted">
                  MANAGER
                </div>
                <div className="p-2 rounded bg-ds-bg/60 border border-ds-blue/40 text-ds-blue-highlight font-semibold">
                  ADMIN
                </div>
              </div>
            </div>

            {/* Security Middleware Barrier Line */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-ds-border" />
              </div>
              <span className="relative px-3 py-1 rounded-full bg-ds-surface border border-ds-border text-[10px] font-mono text-ds-text-dim">
                JWT MIDDLEWARE // ZERO-LEAK BARRIER
              </span>
            </div>

            {/* Tenant B Box */}
            <div className="p-4 rounded-xl border border-ds-border bg-ds-bg/40 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-ds-text font-bold">TENANT CLUSTER // ORG_BETA</span>
                <span className="text-[10px] text-ds-text-dim">DB_KEY: 0xE82B</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                <div className="p-2 rounded bg-ds-surface/60 border border-ds-border/40 text-ds-text-muted">
                  EMPLOYEE
                </div>
                <div className="p-2 rounded bg-ds-surface/60 border border-ds-border/40 text-ds-text-muted">
                  MANAGER
                </div>
                <div className="p-2 rounded bg-ds-surface/60 border border-ds-border/40 text-ds-text-muted">
                  ADMIN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
