import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Scan, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import { store } from '../../lib/store';

const SAMPLE_RECEIPTS = [
  {
    vendor: 'BLUE BOTTLE COFFEE',
    date: '2026-08-14 09:42',
    tax: 3.42,
    total: 22.42,
    items: [
      { name: 'Whole Bean Blend 12oz', category: 'Supplies', price: 16.0 },
      { name: 'Oat Milk Cortado', category: 'Beverage', price: 6.42 },
    ],
  },
  {
    vendor: 'AWS CLOUD SERVICES',
    date: '2026-08-01 00:00',
    tax: 18.25,
    total: 119.5,
    items: [
      { name: 'EC2 Compute Instance', category: 'Compute', price: 60.35 },
      { name: 'S3 Standard Storage', category: 'Storage', price: 40.9 },
    ],
  },
];

export default function SmartReceipt() {
  const sectionRef = useRef<HTMLElement>(null);
  const [receiptIndex, setReceiptIndex] = useState(0);
  const [scanning, setScanning] = useState(false);

  const receipt = SAMPLE_RECEIPTS[receiptIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('smartreceipt');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setReceiptIndex((prev) => (prev + 1) % SAMPLE_RECEIPTS.length);
      setScanning(false);
    }, 450);
  };

  return (
    <section
      ref={sectionRef}
      id="smartreceipt"
      aria-label="Smart Receipt — OCR & AI Data Extraction"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      {/* Chapter Marker */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-[#356DFF] tracking-widest uppercase">
            03 / 03 — FEATURED PROJECT
          </span>
          <span className="w-2 h-2 rounded-full bg-[#B8FF5A] shadow-[0_0_8px_#B8FF5A]" />
        </div>
        <span className="font-mono text-[11px] text-[var(--color-text-muted)] uppercase hidden sm:inline-block">
          AI OCR &amp; EDGE EXTRACTION
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Narrative, Stack & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-5xl sm:text-7xl text-[var(--color-text)] tracking-tighter leading-none mb-3">
              SMART RECEIPT
            </h2>
            <p className="font-mono text-sm text-[#356DFF] font-medium uppercase tracking-wider">
              OCR &amp; DATA EXTRACTION
            </p>
          </div>

          <p className="text-base sm:text-lg text-[var(--color-text-muted)] font-body leading-relaxed max-w-xl">
            Extract key data from receipts using OCR and convert them into structured data with AI processing. 
            Automates categorization, expense filing, and tax deduction mapping with zero manual entry.
          </p>

          {/* Tech Stack Chips */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
              TECHNOLOGIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'Tesseract.js', 'Node.js', 'Tailwind CSS', 'Gemini AI'].map((tech) => (
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

        {/* Right Column: 3D Holographic Illuminated Scanner Pedestal */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-[#356DFF]" />
                <span className="font-mono text-xs font-semibold text-[var(--color-text)] uppercase">
                  OPTICAL VISION PARSER
                </span>
              </div>
              <button
                type="button"
                onClick={triggerScan}
                disabled={scanning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#356DFF] text-white hover:bg-[#1e55ee] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
                <span>SCAN NEXT</span>
              </button>
            </div>

            {/* Simulated Floating Receipt with Laser Scanner */}
            <div className="relative p-5 rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border)] space-y-3 font-mono text-xs overflow-hidden">
              {/* Laser Scan Line */}
              {scanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_15px_#00F0FF] animate-pulse z-20" />
              )}

              <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                <span className="font-bold text-[var(--color-text)]">{receipt.vendor}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">{receipt.date}</span>
              </div>

              <div className="space-y-2">
                {receipt.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-card-border)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[var(--color-text)] font-medium block">{item.name}</span>
                      <span className="text-[10px] text-[#356DFF] font-mono">{item.category}</span>
                    </div>
                    <span className="font-bold text-[var(--color-text)]">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-dashed border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">RECONCILED TOTAL</span>
                <span className="font-display font-bold text-base text-[#B8FF5A]">${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Real-time Extracted Structured Schema (Matches Mockup) */}
            <div className="p-4 rounded-2xl bg-[#040711] text-[#00F0FF] font-mono text-[11px] border border-[#356DFF]/30">
              <div className="text-white/40 text-[10px] uppercase flex items-center justify-between pb-1.5 border-b border-white/10">
                <span>STRUCTURED JSON OUTPUT</span>
                <span className="text-[#B8FF5A]">ACCURACY: 99.4%</span>
              </div>
              <pre className="overflow-x-auto text-[10px] leading-tight pt-1.5 text-white/90">
{`{
  "merchant": "${receipt.vendor}",
  "total": ${receipt.total},
  "tax": ${receipt.tax},
  "verified": true
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
