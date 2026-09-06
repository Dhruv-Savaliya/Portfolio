'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useExperienceStore } from '@/lib/store';

const RECEIPT_STACK = [
  'Next.js',
  'Tesseract.js',
  'Groq API',
  'Gemini AI',
  'TypeScript',
  'Zod Schema',
];

const PIPELINE_STAGES = [
  { step: '01', title: 'IMAGE INGEST', desc: 'Raw document normalization & binarization' },
  { step: '02', title: 'TESSERACT OCR', desc: 'Coordinate bounding box extraction & character matrix' },
  { step: '03', title: 'AI PARSER', desc: 'Groq & Gemini contextual entity resolution' },
  { step: '04', title: 'SCHEMA VALIDATION', desc: 'Zod-enforced JSON validation & confidence scoring' },
];

export default function SmartReceipt() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCoreMorphTarget('receipt');
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
      id="smart-receipt"
      className="relative px-[5vw] py-[18vh] border-t border-ds-border overflow-hidden transition-all duration-700 ease-expo-out"
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label="Smart Receipt OCR Pipeline — AI-Powered Document Processing"
    >
      {/* Chapter Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ds-blue-highlight">03 // PROJECT CHAPTER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ds-blue animate-pulse" />
        </div>
        <span className="text-label-mono text-ds-text-dim text-[11px]">
          COMPUTER VISION & AI EXTRACTION PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Pipeline Architecture */}
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
              SMART RECEIPT
            </h2>
            <p className="font-mono text-sm text-ds-blue-highlight mt-2 uppercase tracking-widest">
              OCR & AI Document Processing Engine
            </p>
          </div>

          <div className="space-y-4 text-ds-text-muted font-body text-sm md:text-base leading-relaxed">
            <p>
              High-throughput document extraction engine combining Tesseract.js client-side/server-side
              OCR with secondary LLM parsing (Groq & Gemini AI) to transform unconstrained receipt photos into structured schemas.
            </p>
            <p>
              Diagnosed and resolved critical deprecated AI model endpoints, engineered resilient rate-limit
              exponential backoffs, and eliminated silent error states to guarantee deterministic JSON output.
            </p>
          </div>

          {/* 4-Stage Pipeline List */}
          <div className="space-y-3">
            <p className="text-label-mono text-ds-text-dim text-xs">PIPELINE SEQUENCE</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PIPELINE_STAGES.map((st) => (
                <div
                  key={st.step}
                  className="p-4 rounded-xl border border-ds-border bg-ds-surface/40 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-ds-blue-highlight font-mono text-xs font-bold">
                      {st.step}
                    </span>
                    <span className="font-mono text-xs text-ds-text">{st.title}</span>
                  </div>
                  <p className="text-[11px] text-ds-text-muted font-sans">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stack Pills */}
          <div>
            <p className="text-label-mono text-ds-text-dim text-xs mb-3">ENGINEERING STACK</p>
            <div className="flex flex-wrap gap-2">
              {RECEIPT_STACK.map((tech) => (
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
              href="/work/smart-receipt"
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

        {/* Right Column: Interactive Bounding Box & Validated JSON Schema */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 md:p-8 rounded-2xl border border-ds-border bg-ds-surface/80 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ds-border">
              <span className="font-mono text-xs text-ds-text">OCR_PARSER_OUTPUT.JSON</span>
              <span className="font-mono text-[11px] text-ds-signal font-semibold">
                STATUS: 200_OK
              </span>
            </div>

            {/* Document Scan Frame Simulation (Abstract schema, no fake address) */}
            <div className="relative p-5 rounded-xl border border-ds-border bg-ds-bg/60 font-mono text-xs overflow-hidden">
              {/* Animated Laser Scanning Line */}
              <div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ds-blue-highlight to-transparent pointer-events-none"
                style={{
                  boxShadow: '0 0 10px rgba(126,162,255,0.8)',
                  animation: 'scan-line 3s linear infinite',
                }}
              />

              <div className="space-y-2 text-ds-text-muted text-[11px] leading-relaxed">
                <p className="text-ds-blue-highlight">{'// EXTRACTED_NORMALIZED_TENSOR'}</p>
                <p>{'{'}</p>
                <p className="pl-4 text-ds-text">
                  &quot;document_type&quot;: &quot;EXPENSE_TAX_INVOICE&quot;,
                </p>
                <p className="pl-4 text-ds-text">
                  &quot;bounding_boxes_detected&quot;: 18,
                </p>
                <p className="pl-4 text-ds-text">
                  &quot;ocr_engine_confidence&quot;: 0.984,
                </p>
                <p className="pl-4 text-ds-text">
                  &quot;model_inference_layer&quot;: &quot;GROQ_MIXTRAL_LLM&quot;,
                </p>
                <p className="pl-4 text-ds-text">
                  &quot;rate_limit_fallback_active&quot;: false,
                </p>
                <p className="pl-4 text-ds-signal">
                  &quot;schema_validated&quot;: true
                </p>
                <p>{'}'}</p>
              </div>
            </div>

            {/* Extraction Telemetry Indicators */}
            <div className="grid grid-cols-2 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-label-mono text-ds-text-dim text-[10px] block mb-1">
                  AI LATENCY
                </span>
                <span className="text-ds-text font-bold">&lt; 320ms</span>
              </div>
              <div className="p-3 rounded-lg border border-ds-border/60 bg-ds-bg/40">
                <span className="text-label-mono text-ds-text-dim text-[10px] block mb-1">
                  PARSER RELIABILITY
                </span>
                <span className="text-ds-signal font-bold">DETERMINISTIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
