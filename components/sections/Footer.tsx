'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="footer"
      className="relative bg-ds-bg px-[5vw] py-[10vw] overflow-hidden border-t border-ds-border"
      aria-label="Footer"
    >
      {/* Mini 3D scene — core collapses to D */}
      <div
        className="relative mx-auto mb-[4vw]"
        style={{
          width: 'clamp(120px, 20vw, 200px)',
          height: 'clamp(120px, 20vw, 200px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease 0.3s',
        }}
      >
        {/* Fallback "D" letterform that fades in as core "collapses" */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-bold text-ds-lime select-none"
            style={{
              fontSize: 'clamp(4rem, 10vw, 8rem)',
              letterSpacing: '-0.05em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.6)',
              transition: 'opacity 1.2s ease 0.8s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
            }}
          >
            D
          </span>
        </div>

        {/* Subtle glow rings around the D */}
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute inset-0 rounded-full border pointer-events-none"
            style={{
              borderColor: `rgba(200,255,0,${0.08 / ring})`,
              transform: `scale(${1 + ring * 0.3})`,
              opacity: visible ? 1 : 0,
              transition: `opacity 1s ease ${0.6 + ring * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Name */}
      <div
        className="text-center mb-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.5s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
        }}
      >
        <p
          className="font-display font-bold text-ds-text"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 4rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          DHRUV SAVALIYA
        </p>
        <p className="text-label-mono text-ds-text-muted mt-2">
          FULL-STACK DEVELOPER · AI / WEB / INTERACTION
        </p>
      </div>

      {/* Links row */}
      <div
        className="flex flex-wrap justify-center gap-6 md:gap-10 mb-[4vw]"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}
      >
        {[
          { label: 'EMAIL', href: 'mailto:dhruvsavaliya001@gmail.com' },
          { label: 'GITHUB', href: 'https://github.com/dhruvsavaliya' },
          { label: 'LINKEDIN', href: 'https://linkedin.com/in/dhruvsavaliya' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            className="text-label-mono text-ds-text-muted hover:text-ds-lime transition-colors duration-300 cursor-none"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-ds-border pt-6"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.7s',
        }}
      >
        <p className="text-label-mono text-ds-text-dim">
          © 2026 DHRUV SAVALIYA
        </p>
        <p className="text-label-mono text-ds-text-dim">
          BUILT WITH NEXT.JS · THREE.JS · GSAP
        </p>
        <p className="text-label-mono text-ds-text-dim">
          SURAT, INDIA
        </p>
      </div>
    </footer>
  );
}
