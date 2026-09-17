import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import { store, useStore } from './lib/store';
import Preloader from './components/sections/Preloader';
import Navigation from './components/sections/Navigation';
import Hero from './components/sections/Hero';
import Intro from './components/sections/Intro';
import BizDhan from './components/sections/BizDhan';
import ClearClaim from './components/sections/ClearClaim';
import SmartReceipt from './components/sections/SmartReceipt';
import HowIBuild from './components/sections/HowIBuild';
import About from './components/sections/About';
import Technology from './components/sections/Technology';
import ExperienceSection from './components/sections/ExperienceSection';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import DigitalCoreCanvas from './components/three/DigitalCoreCanvas';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const preloaderCompleteInStore = useStore((s) => s.preloaderComplete);
  const theme = useStore((s) => s.theme);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // Synchronize <html> root class with active theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Failsafe timer: ensures application renders even under degraded network/frames
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setPreloaderDone(true);
      store.setPreloaderComplete(true);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Initialize Lenis smooth scroll engine
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: Lenis | null = null;
    let rafId: number;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    } catch {
      // Fallback to native browser scroll
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  // Global mouse tracking for 3D Core parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      store.setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] bg-starfield selection:bg-[#356DFF] selection:text-white transition-colors duration-500">
      {/* Accessibility: Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#356DFF] focus:text-white focus:font-mono focus:text-xs focus:rounded-full focus:shadow-lg focus:outline-none"
      >
        Skip directly to main content
      </a>

      {/* Cinematic Custom Interactive Cursor */}
      <CustomCursor />

      {/* Cinematic Astral Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Persistent 3D Digital Core Canvas (Fixed Background & Orbiting Core) */}
      <DigitalCoreCanvas />

      {/* Fixed Glassmorphic Navigation Bar */}
      <Navigation />

      {/* Main Experience Flow */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 select-text transition-opacity duration-1000 ease-out"
        style={{
          opacity: preloaderDone || preloaderCompleteInStore ? 1 : 0,
        }}
        aria-label="Dhruv Savaliya — Full-Stack Developer & 3D Web Portfolio"
      >
        <Hero />
        <Intro />
        <BizDhan />
        <ClearClaim />
        <SmartReceipt />
        <HowIBuild />
        <About />
        <Technology />
        <ExperienceSection />
        <Contact />
      </main>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
}
