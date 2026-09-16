import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis(onScroll?: (progress: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Cinematic, buttery smooth scroll configuration (Podium / Noomo Labs feel)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    const handleScroll = (e: { progress: number; scroll: number }) => {
      if (onScroll) {
        onScroll(e.progress);
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
  }, [onScroll]);

  return lenisRef;
}
