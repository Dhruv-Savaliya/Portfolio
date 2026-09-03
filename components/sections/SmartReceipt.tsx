'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ============================================
// SMART RECEIPT OCR PROJECT CHAPTER
// ============================================

const TECH = ['Tesseract.js', 'Groq', 'Gemini AI', 'Next.js', 'TypeScript'];

const PIPELINE_STEPS = [
  { label: 'RECEIPT',           icon: '🧾', color: '#C8FF00' },
  { label: 'OCR',               icon: '👁', color: '#00E5FF' },
  { label: 'TEXT EXTRACTION',   icon: '📝', color: '#C8FF00' },
  { label: 'AI PROCESSING',     icon: '🧠', color: '#a29bfe' },
  { label: 'STRUCTURED DATA',   icon: '📊', color: '#00E5FF' },
  { label: 'VALIDATION',        icon: '✓',  color: '#C8FF00' },
];

// Simulated receipt
function ReceiptMockup({ scanning, visible }: { scanning: boolean; visible: boolean }) {
  return (
    <div
      className="relative rounded-xl border border-ds-border bg-ds-surface-2 overflow-hidden font-mono"
      style={{
        width: '100%',
        maxWidth: '280px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      {/* Scan line */}
      {scanning && (
        <div
          className="absolute left-0 right-0 h-0.5 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #C8FF00, transparent)',
            boxShadow: '0 0 12px rgba(200,255,0,0.8)',
            animation: 'scan-line 2s linear infinite',
          }}
        />
      )}

      {/* OCR bounding boxes */}
      {scanning && (
        <>
          {[
            { top: '22%', left: '10%', width: '80%', height: '5%', delay: '0.2s' },
            { top: '35%', left: '10%', width: '60%', height: '5%', delay: '0.4s' },
            { top: '47%', left: '10%', width: '40%', height: '5%', delay: '0.6s' },
            { top: '47%', left: '60%', width: '30%', height: '5%', delay: '0.7s' },
            { top: '60%', left: '10%', width: '45%', height: '5%', delay: '0.8s' },
            { top: '60%', left: '65%', width: '25%', height: '5%', delay: '0.9s' },
          ].map((box, i) => (
            <div
              key={i}
              className="absolute border border-ds-lime rounded-sm pointer-events-none"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                opacity: 0,
                animation: `fade-in 0.3s ease forwards ${box.delay}`,
              }}
            />
          ))}
        </>
      )}

      {/* Receipt content */}
      <div className="p-4">
        <div className="text-center mb-3 pb-3 border-b border-ds-border">
          <p className="text-ds-text font-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
            GROCERY MART
          </p>
          <p className="text-ds-text-muted" style={{ fontSize: '0.55rem' }}>
            123 Market Street, Surat
          </p>
          <p className="text-ds-text-muted" style={{ fontSize: '0.55rem' }}>
            Tel: +91 9876543210
          </p>
        </div>

        <div className="space-y-1 mb-3 pb-3 border-b border-ds-border">
          {[
            { item: 'Organic Milk 1L',    price: '₹65.00' },
            { item: 'Bread Wheat 400g',   price: '₹45.00' },
            { item: 'Fresh Vegetables',   price: '₹120.00' },
            { item: 'Rice Basmati 5kg',   price: '₹340.00' },
          ].map((row) => (
            <div key={row.item} className="flex justify-between">
              <span style={{ fontSize: '0.55rem', color: '#F0EDE6' }}>{row.item}</span>
              <span style={{ fontSize: '0.55rem', color: '#F0EDE6' }}>{row.price}</span>
            </div>
          ))}
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between">
            <span style={{ fontSize: '0.55rem', color: '#555' }}>SUBTOTAL</span>
            <span style={{ fontSize: '0.55rem', color: '#F0EDE6' }}>₹570.00</span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: '0.55rem', color: '#555' }}>GST 5%</span>
            <span style={{ fontSize: '0.55rem', color: '#F0EDE6' }}>₹28.50</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-ds-border">
            <span style={{ fontSize: '0.65rem', color: '#C8FF00', fontWeight: 700 }}>TOTAL</span>
            <span style={{ fontSize: '0.65rem', color: '#C8FF00', fontWeight: 700 }}>₹598.50</span>
          </div>
        </div>

        <div className="text-center mt-3">
          <p style={{ fontSize: '0.5rem', color: '#333', letterSpacing: '0.2em' }}>
            * * * * * * * * * * * * *
          </p>
          <p style={{ fontSize: '0.5rem', color: '#333' }}>
            Date: 02/09/2026  Time: 14:32
          </p>
        </div>
      </div>
    </div>
  );
}

// JSON output mockup
function JsonOutput({ visible }: { visible: boolean }) {
  const lines = [
    { type: 'key',   content: '  merchant: ' },
    { type: 'str',   content: '"Grocery Mart",' },
    { type: 'key',   content: '  date: ' },
    { type: 'str',   content: '"2026-09-02",' },
    { type: 'key',   content: '  total: ' },
    { type: 'num',   content: '598.50,' },
    { type: 'key',   content: '  tax: ' },
    { type: 'num',   content: '28.50,' },
    { type: 'key',   content: '  items: ' },
    { type: 'plain', content: '[' },
    { type: 'str',   content: '    { "Organic Milk 1L", ₹65 },' },
    { type: 'str',   content: '    { "Bread Wheat 400g", ₹45 },' },
    { type: 'str',   content: '    ...' },
    { type: 'plain', content: '  ]' },
  ];

  return (
    <div
      className="code-block overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.5s',
      }}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-ds-border">
        <div className="w-2 h-2 rounded-full bg-ds-lime animate-pulse" />
        <span className="text-ds-lime" style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }}>
          AI OUTPUT · JSON
        </span>
      </div>
      <pre>
        <code>
          {'{'}
          {'\n'}
          {lines.map((line, i) => (
            <span key={i}>
              <span
                className={line.type}
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.3s ease ${0.6 + i * 0.06}s`,
                }}
              >
                {line.content}
              </span>
              {'\n'}
            </span>
          ))}
          {'}'}
        </code>
      </pre>
    </div>
  );
}

export default function SmartReceipt() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setScanning(true), 800);
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="receipt"
      className="relative bg-ds-bg px-[5vw] py-[12vw] overflow-hidden"
      aria-label="Smart Receipt OCR project"
    >
      {/* Section rule */}
      <div className="flex items-center gap-6 mb-[6vw]">
        <span className="text-label-mono text-ds-lime" style={{ color: '#a29bfe' }}>03</span>
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
              <p className="text-label-mono mb-4" style={{ color: '#a29bfe' }}>
                AI-POWERED DOCUMENT PROCESSING
              </p>
              <h2
                className="font-display font-bold text-ds-text"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 7rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  marginBottom: '2rem',
                }}
              >
                SMART
                <br />
                RECEIPT
                <br />
                <span style={{ color: '#a29bfe' }}>OCR</span>
              </h2>
            </div>

            {/* Pipeline */}
            <div className="space-y-2 mb-8">
              {PIPELINE_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}40` }}
                  >
                    <span style={{ fontSize: '0.7rem' }}>{step.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.65rem', color: step.color, letterSpacing: '0.1em' }}
                    >
                      {step.label}
                    </span>
                    {i < PIPELINE_STEPS.length - 1 && (
                      <div className="flex-1 border-t border-dashed border-ds-border" />
                    )}
                    {i < PIPELINE_STEPS.length - 1 && (
                      <span style={{ fontSize: '0.65rem', color: '#333' }}>↓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {TECH.map((t, i) => (
                <span
                  key={t}
                  className="tech-tag"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${0.5 + i * 0.08}s`,
                    borderColor: '#a29bfe40',
                    color: '#a29bfe',
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
              transition: 'opacity 0.8s ease 0.4s',
            }}
          >
            <Link
              href="#"
              className="flex items-center gap-2 px-6 py-3 font-display font-bold text-sm tracking-wide cursor-none rounded-full transition-all duration-300"
              style={{
                border: '1px solid #a29bfe',
                color: '#a29bfe',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#a29bfe';
                (e.currentTarget as HTMLAnchorElement).style.color = '#030303';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = '#a29bfe';
              }}
            >
              LIVE DEMO ↗
            </Link>
            <Link
              href="https://github.com/dhruvsavaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-label-mono text-ds-text-muted cursor-none transition-colors duration-300"
              style={{ '--hover-color': '#a29bfe' } as React.CSSProperties}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#a29bfe'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#555'; }}
            >
              GITHUB →
            </Link>
          </div>
        </div>

        {/* Right: Receipt + JSON */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-center lg:justify-start">
            <ReceiptMockup scanning={scanning} visible={visible} />
          </div>
          <JsonOutput visible={visible && scanning} />
        </div>
      </div>
    </section>
  );
}
