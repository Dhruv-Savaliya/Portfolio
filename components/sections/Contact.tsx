'use client';

import { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const setCoreMorphTarget = useExperienceStore((s) => s.setCoreMorphTarget);
  const { play } = useSound();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCoreMorphTarget('contact');
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCoreMorphTarget]);

  const handleCopy = () => {
    navigator.clipboard.writeText('dhruvsavaliya075@gmail.com');
    setCopied(true);
    play('click');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative px-[5vw] py-[22vh] border-t border-ds-border overflow-hidden select-none"
      aria-label="Contact Dhruv Savaliya"
    >
      {/* Telemetry Header */}
      <div className="flex items-center gap-6 mb-14">
        <span className="text-label-mono text-ds-blue-highlight text-xs font-mono tracking-widest">
          07 // THE CLIMAX
        </span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      {/* Massive Climax Headline */}
      <div className="mb-14">
        <h2
          className="font-display font-bold text-ds-text tracking-tighter"
          style={{
            fontSize: 'clamp(3rem, 11vw, 15rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
          }}
        >
          <span>HAVE AN IDEA</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-blue-highlight via-ds-blue to-ds-signal">
            WORTH BUILDING?
          </span>
        </h2>
      </div>

      {/* Magnetic Primary Action CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
        <a
          href="mailto:dhruvsavaliya075@gmail.com"
          onClick={() => play('click')}
          className="group inline-flex items-center gap-4 px-8 md:px-10 py-5 rounded-full border border-ds-blue bg-ds-blue text-white hover:bg-ds-blue-highlight transition-all duration-300 font-display font-bold text-xl md:text-2xl tracking-tight shadow-xl shadow-ds-blue/20 cursor-none"
          aria-label="Initiate direct email to Dhruv Savaliya"
        >
          <span>LET&apos;S TALK</span>
          <span className="font-mono text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
            ↗
          </span>
        </a>

        {/* Quick Copy Action */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-3 px-6 py-5 rounded-full border border-ds-border bg-ds-surface/60 hover:border-ds-blue-highlight/50 transition-colors text-xs font-mono text-ds-text-muted hover:text-ds-text cursor-none"
          aria-label="Copy email address to clipboard"
        >
          <span className="text-ds-blue-highlight">
            {copied ? '✓ COPIED TO CLIPBOARD' : 'COPY: dhruvsavaliya075@gmail.com'}
          </span>
        </button>
      </div>

      {/* Direct Channel Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-ds-border">
        <div>
          <p className="text-label-mono text-ds-text-dim text-xs mb-1">DIRECT INBOX</p>
          <a
            href="mailto:dhruvsavaliya075@gmail.com"
            className="font-mono text-sm text-ds-text hover:text-ds-blue-highlight transition-colors cursor-none"
          >
            dhruvsavaliya075@gmail.com
          </a>
        </div>
        <div>
          <p className="text-label-mono text-ds-text-dim text-xs mb-1">GITHUB REPOSITORY</p>
          <a
            href="https://github.com/Dhruv-Savaliya"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-ds-text hover:text-ds-blue-highlight transition-colors cursor-none"
          >
            github.com/Dhruv-Savaliya ↗
          </a>
        </div>
        <div>
          <p className="text-label-mono text-ds-text-dim text-xs mb-1">PROFESSIONAL NETWORK</p>
          <a
            href="https://linkedin.com/in/dhruvsavaliya"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-ds-text hover:text-ds-blue-highlight transition-colors cursor-none"
          >
            linkedin.com/in/dhruvsavaliya ↗
          </a>
        </div>
      </div>
    </section>
  );
}
