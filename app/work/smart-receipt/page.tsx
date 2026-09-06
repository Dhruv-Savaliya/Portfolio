import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Receipt Case Study — Dhruv Savaliya',
  description:
    'Document engineering case study of the Smart Receipt OCR & AI processing pipeline built with Tesseract.js, Groq API, Gemini AI, and Next.js.',
};

export default function SmartReceiptCaseStudy() {
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
          CASE STUDY // 03 SMART RECEIPT
        </span>
      </div>

      {/* Editorial Title */}
      <div className="max-w-4xl mb-16 space-y-4">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-semibold">
          COMPUTER VISION &amp; LLM EXTRACTION
        </span>
        <h1
          className="font-display font-bold text-ds-text tracking-tighter"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.9 }}
        >
          OCR &amp; AI PIPELINE
        </h1>
        <p className="font-body text-lg md:text-xl text-ds-text-muted leading-relaxed">
          Transforming degraded receipt images into strongly typed, normalized JSON data
          through hybrid client OCR and dual LLM inference resilience.
        </p>
      </div>

      {/* Metadata Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-ds-border bg-ds-surface/60 mb-16 font-mono text-xs">
        <div>
          <span className="text-ds-text-dim block mb-1">OPTICAL ENGINE</span>
          <span className="text-ds-text font-semibold">Tesseract.js OCR</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">PARSER ENGINES</span>
          <span className="text-ds-text font-semibold">Groq &amp; Gemini AI</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">FALLBACK SYSTEM</span>
          <span className="text-ds-signal font-semibold">Exponential Backoff</span>
        </div>
        <div>
          <span className="text-ds-text-dim block mb-1">SCHEMA</span>
          <span className="text-ds-text font-semibold">Zod Enforced</span>
        </div>
      </div>

      {/* Architectural Breakdown */}
      <div className="max-w-3xl space-y-12 text-sm md:text-base leading-relaxed text-ds-text-muted">
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Hybrid OCR &amp; LLM Architecture
          </h2>
          <p>
            Standard OCR engines output unformatted bounding boxes with significant noise from receipt folds,
            faded thermal paper, and skew. Rather than relying on rigid regex patterns that break across
            differing store formats, the pipeline feeds coordinate-indexed token arrays into an instruction-tuned LLM
            with a strict JSON schema prompt.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ds-text tracking-tight">
            Stabilization &amp; Rate-Limit Engineering
          </h2>
          <p>
            During real-world testing, third-party AI endpoints periodically returned 429 rate limits or changed
            model endpoint availability. The pipeline was hardened by:
          </p>
          <ul className="list-disc pl-6 space-y-2 font-mono text-xs text-ds-text">
            <li>Updating deprecated model references to stable Groq and Gemini generation versions.</li>
            <li>Implementing an automated fallback switch: if primary inference experiences latency &gt;1.5s or 429s, the request cascades automatically to secondary AI providers.</li>
            <li>Replacing silent failure catches with typed Zod errors returned to the client interface.</li>
          </ul>
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
