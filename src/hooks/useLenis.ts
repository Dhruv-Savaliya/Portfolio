import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
const scrollListeners = new Set<(progress: number, velocity: number, scroll: number) => void>();
let currentProgress = 0;
let currentScroll = 0;
let currentVelocity = 0;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function getScrollState() {
  return {
    progress: currentProgress,
    scroll: currentScroll,
    velocity: currentVelocity,
  };
}

export function subscribeToScroll(callback: (progress: number, velocity: number, scroll: number) => void) {
  scrollListeners.add(callback);
  return () => {
    scrollListeners.delete(callback);
  };
}

export function useLenis(onSectionCheck?: () => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Cinematic, buttery smooth scroll configuration (Podium / Noomo Labs feel)
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    let lastSectionCheckTime = 0;

    const handleScroll = (e: { progress: number; scroll: number; velocity: number }) => {
      currentProgress = e.progress;
      currentScroll = e.scroll;
      currentVelocity = e.velocity || 0;

      scrollListeners.forEach((listener) => {
        listener(e.progress, currentVelocity, e.scroll);
      });

      // Throttle section check for UI performance
      const now = performance.now();
      if (onSectionCheck && now - lastSectionCheckTime > 50) {
        lastSectionCheckTime = now;
        onSectionCheck();
      }
    };

    lenis.on('scroll', handleScroll);

    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisInstance = null;
      lenisRef.current = null;
    };
  }, [onSectionCheck]);

  return lenisRef;
}

