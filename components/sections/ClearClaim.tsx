'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ============================================
// CLEARCLAIM PROJECT CHAPTER
// ============================================

const TECH = ['Next.js', 'TypeScript', 'MongoDB', 'JWT', 'Better Auth', 'RBAC', 'Zod'];

// Node in the network diagram
function NetworkNode({
  label,
  sub,
  color,
  x,
  y,
  visible,
  delay,
}: {
  label: string;
  sub?: string;
  color: string;
  x: string;
  y: string;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        scale: visible ? '1' : '0.6',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, scale 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div
        className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center border"
        style={{
          borderColor: color,
          backgroundColor: `${color}15`,
          boxShadow: visible ? `0 0 20px ${color}30` : 'none',
          transition: `box-shadow 0.6s ease ${delay + 0.2}s`,
        }}
      >
        <span
          className="font-mono text-center"
          style={{ fontSize: '0.55rem', color, letterSpacing: '0.05em' }}
        >
          {label}
        </span>
      </div>
      {sub && (
        <span className="text-label-mono text-ds-text-muted" style={{ fontSize: '0.5rem' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// Security flow badge
function FlowBadge({
  step,
  label,
  active,
  delay,
}: {
  step: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        opacity: active ? 1 : 0.3,
        transform: active ? 'translateX(0)' : 'translateX(-10px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div
        className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0"
        style={{ borderColor: active ? '#C8FF00' : '#1A1A1A', backgroundColor: active ? '#C8FF00' : 'transparent' }}
      >
        <span className="text-ds-bg font-mono font-bold" style={{ fontSize: '0.55rem' }}>
          {step}
        </span>
      </div>
      <span className="text-label-mono text-ds-text" style={{ fontSize: '0.65rem' }}>
        {label}
      </span>
    </div>
  );
}

export default function ClearClaim() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clearclaim"
      className="relative bg-ds-surface px-[5vw] py-[12vw] overflow-hidden"
      aria-label="ClearClaim project"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,26,26,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4,
        }}
      />

      {/* Section rule */}
      <div className="flex items-center gap-6 mb-[6vw] relative z-10">
        <span className="text-label-mono text-ds-cyan">02</span>
        <div className="flex-1 h-px bg-ds-border" />
        <span className="text-label-mono text-ds-text-muted">SELECTED WORK</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
        {/* Left: Visual */}
        <div className="order-2 lg:order-1">
          {/* Security Audit counter */}
          <div
            className="mb-8 p-6 rounded-2xl border border-ds-border bg-ds-surface-2"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.1s',
            }}
          >
            <p className="text-label-mono text-ds-text-muted mb-3">SECURITY AUDIT RESULT</p>
            <div className="flex items-end gap-4 mb-4">
              <span
                className="font-display font-bold"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#FF6B6B',
                }}
              >
                35
              </span>
              <span className="text-label-mono text-ds-text-muted mb-2">
                ISSUES IDENTIFIED
              </span>
            </div>

            {/* Flow */}
            <div className="space-y-3">
              <FlowBadge step="1" label="SECURITY AUDIT" active={visible} delay={0.3} />
              <div className="ml-3 w-px h-4 bg-ds-border" />
              <FlowBadge step="2" label="REMEDIATION" active={visible} delay={0.5} />
              <div className="ml-3 w-px h-4 bg-ds-border" />
              <FlowBadge step="3" label="SECURE SYSTEM ✓" active={visible} delay={0.7} />
            </div>
          </div>

          {/* Network diagram */}
          <div
            className="relative w-full rounded-2xl border border-ds-border bg-ds-surface-2 overflow-hidden"
            style={{
              height: '260px',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.2s',
            }}
          >
            {/* SVG connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {visible && (
                <>
                  <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#C8FF0030" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#C8FF0030" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="50%" x2="15%" y2="75%" stroke="#00E5FF30" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="0.9s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="50%" x2="85%" y2="75%" stroke="#00E5FF30" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.1s" repeatCount="indefinite" />
                  </line>
                  <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#C8FF0030" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.3s" repeatCount="indefinite" />
                  </line>
                </>
              )}
            </svg>

            {/* Nodes */}
            <NetworkNode label="API" sub="GATEWAY" color="#C8FF00" x="50%" y="50%" visible={visible} delay={0.2} />
            <NetworkNode label="TENANT\nA" color="#00E5FF" x="20%" y="25%" visible={visible} delay={0.3} />
            <NetworkNode label="TENANT\nB" color="#00E5FF" x="80%" y="25%" visible={visible} delay={0.4} />
            <NetworkNode label="ADMIN" color="#C8FF00" x="50%" y="15%" visible={visible} delay={0.5} />
            <NetworkNode label="DB\nA" sub="ISOLATED" color="#a29bfe" x="15%" y="75%" visible={visible} delay={0.6} />
            <NetworkNode label="DB\nB" sub="ISOLATED" color="#a29bfe" x="85%" y="75%" visible={visible} delay={0.7} />
          </div>

          {/* RBAC badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['RBAC', 'JWT AUTH', 'MIDDLEWARE', 'TENANT ISOLATION', 'PROTECTED ROUTES'].map((badge, i) => (
              <span
                key={badge}
                className="text-label-mono border border-ds-cyan/30 text-ds-cyan px-3 py-1 rounded-full"
                style={{
                  fontSize: '0.6rem',
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.4 + i * 0.08}s`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Copy */}
        <div className="order-1 lg:order-2 flex flex-col justify-between">
          <div>
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p className="text-label-mono text-ds-cyan mb-4">MULTI-TENANT EXPENSE WORKFLOW</p>
              <h2
                className="font-display font-bold text-ds-text"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 8rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  marginBottom: '2rem',
                }}
              >
                CLEAR
                <span style={{ color: '#00E5FF' }}>CLAIM</span>
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
              A multi-tenant expense approval workflow system with role-based access control,
              database isolation, and a complete security remediation from 35 identified
              vulnerabilities to a production-ready, secure system.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {TECH.map((t, i) => (
                <span
                  key={t}
                  className="tech-tag"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${0.2 + i * 0.06}s`,
                  }}
                >
                  {t}
                </span>
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
              className="flex items-center gap-2 px-6 py-3 border border-ds-cyan text-ds-cyan font-display font-bold text-sm tracking-wide hover:bg-ds-cyan hover:text-ds-bg transition-all duration-300 cursor-none rounded-full"
            >
              LIVE DEMO ↗
            </Link>
            <Link
              href="https://github.com/dhruvsavaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-label-mono text-ds-text-muted hover:text-ds-cyan transition-colors duration-300 cursor-none"
            >
              GITHUB →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
