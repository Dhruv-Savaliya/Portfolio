'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLenis } from '@/hooks/useLenis';

// ── Sections ──────────────────────────────────────────────
import Navigation from '@/components/sections/Navigation';
import Hero from '@/components/sections/Hero';
import Intro from '@/components/sections/Intro';
import BizDhan from '@/components/sections/BizDhan';
import ClearClaim from '@/components/sections/ClearClaim';
import SmartReceipt from '@/components/sections/SmartReceipt';
import HowIBuild from '@/components/sections/HowIBuild';
import About from '@/components/sections/About';
import ExperienceSection from '@/components/sections/ExperienceSection';
import Technology from '@/components/sections/Technology';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

// ── Dynamic 3D Experience (Persistent across scroll scenes) ──
const Experience = dynamic(() => import('@/components/three/Experience'), {
  ssr: false,
  loading: () => null,
});

// ── Client UI Elements ──────────────────────────────────────
const Preloader = dynamic(() => import('@/components/sections/Preloader'), {
  ssr: false,
});

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), {
  ssr: false,
});

// ── Grain overlay ──────────────────────────────────────────
function GrainOverlay() {
  return <div className="grain-overlay pointer-events-none" aria-hidden="true" />;
}

// ── Main Page ──────────────────────────────────────────────
export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Initialize Lenis smooth scroll synchronized with GSAP
  useLenis();

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // Global mouse tracking for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseX(x);
      setMouseY(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Cinematic Grain Overlay */}
      <GrainOverlay />

      {/* Responsive Custom Cursor */}
      <CustomCursor />

      {/* Preloader — tracks genuine asset readiness */}
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Persistent 3D Digital Core Canvas (Fixed Background) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-expo-out"
        style={{ opacity: preloaderDone ? 1 : 0 }}
        aria-hidden="true"
      >
        <Experience mouseX={mouseX} mouseY={mouseY} coreScale={1.0} />
      </div>

      {/* Main Experience DOM Layers */}
      <main
        id="main-content"
        className="relative z-10 select-text"
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label="Dhruv Savaliya — Full-Stack Developer Portfolio"
      >
        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ds-blue focus:text-white focus:font-mono focus:text-xs focus:rounded-full"
        >
          Skip to main content
        </a>

        {/* Minimal Fixed Navigation */}
        <Navigation />

        {/* Scene 01: Hero Composition */}
        <Hero />

        {/* Scene 02: Editorial Manifesto */}
        <Intro />

        {/* Scene 03: Selected Work Chapters */}
        <div id="work" role="region" aria-label="Selected Engineering Work">
          <BizDhan />
          <ClearClaim />
          <SmartReceipt />
        </div>

        {/* Scene 04: Engineering Methodology */}
        <HowIBuild />

        {/* Scene 05: Identity & Philosophy */}
        <About />

        {/* Scene 06: Verified Trajectory */}
        <ExperienceSection />

        {/* Scene 07: Technical Matrix */}
        <Technology />

        {/* Scene 08: Climax Call to Action */}
        <Contact />

        {/* Scene 09: Core Monogram Resolution Footer */}
        <Footer />
      </main>
    </>
  );
}
