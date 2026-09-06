'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '@/lib/store';

// Register GSAP ScrollTrigger plugin safely in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress);

  useEffect(() => {
    // Heavy, smooth, cinematic scroll configuration
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger and Zustand
    lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress);
    });

    // Synchronize GSAP ticker with Lenis raf
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisInstance = null;
      lenisRef.current = null;
    };
  }, [setScrollProgress]);

  return lenisRef;
}
