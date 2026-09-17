import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, ShieldCheck, ShieldAlert, Network, Layers } from 'lucide-react';
import { store } from '../../lib/store';

export default function ClearClaim() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedTenant, setSelectedTenant] = useState<'A' | 'B' | 'C'>('A');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('clearclaim');
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
      id="clearclaim"
      aria-label="ClearClaim — Expense Workflow"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      {/* Chapter Marker */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-[#356DFF] tracking-widest uppercase">
            02 / 03 — FEATURED PROJECT
          </span>
          <span className="w-2 h-2 rounded-full bg-[#356DFF] animate-pulse" />
        </div>
        <span className="font-mono text-[11px] text-[var(--color-text-muted)] uppercase hidden sm:inline-block">
          MULTI-TENANT RBAC ARCHITECTURE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Narrative, Stack & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-5xl sm:text-7xl text-[var(--color-text)] tracking-tighter leading-none mb-3">
              CLEARCLAIM
            </h2>
            <p className="font-mono text-sm text-[#356DFF] font-medium uppercase tracking-wider">
              EXPENSE WORKFLOW
            </p>
          </div>

          <p className="text-base sm:text-lg text-[var(--color-text-muted)] font-body leading-relaxed max-w-xl">
            Multi-tenant platform with secure RBAC, JWT authentication and isolated databases.
            Features automated expense approval hierarchies, policy audit logs, and fraud anomaly detection.
          </p>

          {/* Tech Stack Chips */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
              TECHNOLOGIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Prisma'].map((tech) => (
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

        {/* Right Column: 3D Isometric Networked Cubes & Tenant Workflow Panel */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#356DFF]" />
                <span className="font-mono text-xs font-semibold text-[var(--color-text)] uppercase">
                  TENANT ISOLATION ARCHITECTURE
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#B8FF5A]/20 text-[#B8FF5A] font-semibold border border-[#B8FF5A]/40">
                STRICT RBAC
              </span>
            </div>

            {/* Interactive Tenant Switcher */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'A', name: 'Enterprise Corp', status: 'Compliant', claims: 142 },
                { id: 'B', name: 'HealthTech Inc', status: 'In Review', claims: 68 },
                { id: 'C', name: 'Global Logistics', status: 'Compliant', claims: 310 },
              ].map((tenant) => (
                <button
                  key={tenant.id}
                  type="button"
                  onClick={() => setSelectedTenant(tenant.id as 'A' | 'B' | 'C')}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                    selectedTenant === tenant.id
                      ? 'border-[#356DFF] bg-[#356DFF]/15 shadow-[0_0_15px_rgba(53,109,255,0.3)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 hover:border-[#356DFF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#356DFF]">
                      TENANT {tenant.id}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF5A]" />
                  </div>
                  <span className="font-display font-medium text-xs text-[var(--color-text)] block truncate">
                    {tenant.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)] block mt-0.5">
                    {tenant.claims} claims
                  </span>
                </button>
              ))}
            </div>

            {/* Isometric Multi-Tenant Workflow Schema */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>DATABASE ISOLATION:</span>
                <span className="text-[#00F0FF]">SCHEMA-PER-TENANT</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>JWT ACCESS PROTOCOL:</span>
                <span className="text-[#B8FF5A]">ED25519 VERIFIED</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>FRAUD ENGINE LATENCY:</span>
                <span className="text-[#356DFF]">18ms EDGE TIME</span>
              </div>
            </div>

            {/* Bottom Status Card */}
            <div className="p-3.5 rounded-xl bg-[#356DFF]/10 border border-[#356DFF]/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8FF5A]" />
                <span className="text-[var(--color-text)]">
                  Zero Data Leakage between Tenant Schemas
                </span>
              </div>
              <span className="text-[#356DFF] font-semibold">PASS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
