'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Experience to prevent SSR
const Experience = dynamic(() => import('@/components/three/Experience'), {
  ssr: false,
  loading: () => null,
});

// ============================================
// HERO
// ============================================
export default function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Show hero after mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse for 3D parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseX(x);
      setMouseY(y);
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const enterStyle = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden bg-ds-bg"
      style={{ height: '100svh', minHeight: '600px' }}
      aria-label="Hero — Dhruv Savaliya, Full Stack Developer"
    >
      {/* 3D Canvas — fills entire hero */}
      <Experience
        mouseX={mouseX}
        mouseY={mouseY}
        coreScale={1}
        className="z-0"
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(3,3,3,0.7) 80%, rgba(3,3,3,0.98) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(3,3,3,1))',
        }}
      />

      {/* Metadata — top-left */}
      <div
        className="absolute top-[12vh] left-[5vw] z-20 hidden md:block"
        style={enterStyle(0.6)}
      >
        <div className="space-y-1">
          <p className="text-label-mono text-ds-text-muted">LOCATION</p>
          <p className="text-label-mono text-ds-text" style={{ letterSpacing: '0.1em' }}>
            SURAT / INDIA
          </p>
        </div>
      </div>

      {/* Metadata — top-right */}
      <div
        className="absolute top-[12vh] right-[5vw] z-20 hidden md:flex flex-col items-end gap-1"
        style={enterStyle(0.7)}
      >
        <p className="text-label-mono text-ds-text-muted">DISCIPLINE</p>
        <p className="text-label-mono text-ds-text" style={{ letterSpacing: '0.1em' }}>
          FULL-STACK / AI / 3D
        </p>
      </div>

      {/* Main copy — bottom-left */}
      <div className="absolute bottom-[14vh] left-[5vw] right-[5vw] z-20">
        {/* Name */}
        <div className="overflow-hidden">
          <h1
            className="font-display font-bold text-ds-text"
            style={{
              fontSize: 'clamp(4.5rem, 15vw, 18rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.05em',
              ...enterStyle(0.3),
            }}
          >
            DHRUV
            <br />
            <span style={{ color: '#C8FF00' }}>SAVALIYA</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-6">
          {/* Role */}
          <div style={enterStyle(0.5)}>
            <p
              className="font-display font-medium text-ds-text-muted"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                letterSpacing: '0.08em',
              }}
            >
              FULL-STACK
              <br />
              DEVELOPER
            </p>
          </div>

          {/* Statement + scroll */}
          <div className="md:text-right" style={enterStyle(0.6)}>
            <p
              className="font-body text-ds-text-muted mb-4 max-w-sm md:ml-auto"
              style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.6 }}
            >
              I build digital products with<br />
              code, AI &amp; interaction.
            </p>

            {/* Scroll indicator */}
            <div className="flex md:justify-end items-center gap-3" style={enterStyle(0.8)}>
              <div className="w-8 h-px bg-ds-text-muted" />
              <p className="text-label-mono text-ds-text-muted">
                SCROLL TO EXPLORE ↓
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated corner brackets */}
      <CornerBracket position="top-left" visible={visible} delay={0.9} />
      <CornerBracket position="bottom-right" visible={visible} delay={1.0} />
    </section>
  );
}

// ============================================
// CORNER BRACKETS
// ============================================
function CornerBracket({
  position,
  visible,
  delay,
}: {
  position: 'top-left' | 'bottom-right';
  visible: boolean;
  delay: number;
}) {
  const isTopLeft = position === 'top-left';
  const posClass = isTopLeft
    ? 'top-6 left-[5vw] md:top-[5vh] md:left-[5vw]'
    : 'bottom-6 right-[5vw] md:bottom-[10vh] md:right-[5vw]';

  return (
    <div
      className={`absolute ${posClass} z-20 pointer-events-none`}
      style={{
        opacity: visible ? 0.4 : 0,
        transition: `opacity 1s ease ${delay}s`,
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: isTopLeft ? 'none' : 'rotate(180deg)',
        }}
      >
        <path
          d="M0 12V0H12"
          stroke="#C8FF00"
          strokeWidth="1"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
