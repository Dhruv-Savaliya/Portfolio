'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

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

// ── Dynamic (client-only) ──────────────────────────────────
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

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      {/* Grain noise overlay */}
      <GrainOverlay />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Preloader — shown until loading complete */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Main experience */}
      <main
        id="main-content"
        className="relative"
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
        aria-label="Dhruv Savaliya Portfolio"
      >
        {/* Skip to content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ds-lime focus:text-ds-bg focus:font-bold focus:rounded"
        >
          Skip to main content
        </a>

        {/* ── Navigation ── */}
        <Navigation />

        {/* ── Hero ── */}
        <Hero />

        {/* ── Intro editorial ── */}
        <Intro />

        {/* ── Work chapters ── */}
        <section id="work" aria-label="Selected Work">
          <BizDhan />
          <ClearClaim />
          <SmartReceipt />
        </section>

        {/* ── Process ── */}
        <HowIBuild />

        {/* ── About ── */}
        <About />

        {/* ── Experience ── */}
        <ExperienceSection />

        {/* ── Technology ── */}
        <Technology />

        {/* ── Contact ── */}
        <Contact />

        {/* ── Footer ── */}
        <Footer />
      </main>
    </>
  );
}
