import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { store, useStore } from '../../lib/store';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const soundMuted = useStore((s) => s.soundMuted);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLParagraphElement>(null);
  const loadingLabelRef = useRef<HTMLHeadingElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const hasFinishedRef = useRef(false);

  // Transition out and complete
  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(100);

    try {
      const tl = gsap.timeline({
        onComplete: () => {
          store.setPreloaderComplete(true);
          onComplete();
        },
      });

      tl.to(progressBarRef.current, {
        scaleX: 1,
        opacity: 0.4,
        duration: 0.3,
        ease: 'power2.out',
      });

      tl.to([loadingLabelRef.current, percentTextRef.current, metadataRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.inOut',
      }, '-=0.1');

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '-=0.2');
    } catch {
      store.setPreloaderComplete(true);
      onComplete();
    }
  }, [onComplete]);

  // Guaranteed smooth deterministic loader progression
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200; // 1.2s total smooth sequence
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);

      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          finishLoading();
        }, 150);
      }
    };

    rafId = requestAnimationFrame(tick);

    // Hard fallback safety: never stuck under any circumstance
    const fallbackTimer = setTimeout(() => {
      finishLoading();
    }, 2200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
    };
  }, [finishLoading]);

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleSound();
  };

  return (
    <aside
      ref={containerRef}
      id="preloader-screen"
      role="status"
      aria-label="Application Loading"
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#040711] text-white select-none overflow-hidden"
    >
      {/* Dynamic Starfield / Radiant Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(53, 109, 255, 0.25) 0%, transparent 70%),
              radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 32px 32px',
          }}
        />
      </div>

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#356DFF] shadow-[0_0_10px_#356DFF] animate-pulse" />
          <span className="font-display font-bold text-sm tracking-tight text-white">
            DHRUV.S
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            id="sound-toggle"
            type="button"
            onClick={handleSoundToggle}
            aria-label={soundMuted ? 'Sound is muted. Click to unmute.' : 'Sound is active. Click to mute.'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-mono text-white/80 hover:text-white hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#356DFF] transition-all cursor-pointer"
          >
            {soundMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/60" aria-hidden="true" />
                <span>SOUND: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B8FF5A] animate-pulse" aria-hidden="true" />
                <span className="text-[#B8FF5A]">SOUND: ON</span>
              </>
            )}
          </button>

          {/* Instant Skip Button */}
          <button
            type="button"
            onClick={finishLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <span>ENTER</span>
            <ArrowRight className="w-3 h-3 text-[#356DFF]" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Typography & Numerical Progress Counter */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-xl mx-auto w-full px-4">
        {/* Subtitle tag */}
        <p className="font-mono text-[11px] tracking-widest text-[#356DFF] uppercase mb-2">
          :: INITIALIZING SYSTEMS
        </p>

        {/* Large "LOADING" Display Headline */}
        <h1
          ref={loadingLabelRef}
          className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight text-white mb-2"
        >
          LOADING
        </h1>

        {/* Percentage Counter (0% to 100%) */}
        <p
          ref={percentTextRef}
          id="loading-percent"
          aria-live="polite"
          className="text-2xl sm:text-3xl font-mono font-medium text-[#356DFF] tracking-wider mb-6"
        >
          {progress}%
        </p>

        {/* Thin Horizontal Progress Line */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Loading progress"
          className="w-full max-w-md h-[3px] bg-white/10 overflow-hidden rounded-full relative"
        >
          <div
            ref={progressBarRef}
            id="progress-bar"
            className="h-full bg-[#356DFF] transition-all duration-75 ease-out origin-left rounded-full"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 16px rgba(53, 109, 255, 0.9), 0 0 30px rgba(0, 240, 255, 0.5)',
            }}
          />
        </div>

        {/* Technical Subsystem Checklist (Matches Mockup) */}
        <div ref={metadataRef} className="mt-8 grid grid-cols-1 gap-1.5 text-left font-mono text-xs text-white/60 w-full max-w-xs">
          <div className="flex justify-between">
            <span>&gt; LOADING FONTS</span>
            <span className="text-[#356DFF]">100%</span>
          </div>
          <div className="flex justify-between">
            <span>&gt; LOADING 3D MODELS</span>
            <span className="text-[#356DFF]">{Math.min(100, Math.round(progress * 1.05))}%</span>
          </div>
          <div className="flex justify-between">
            <span>&gt; LOADING TEXTURES</span>
            <span className="text-[#356DFF]">{Math.min(100, Math.round(progress * 0.95))}%</span>
          </div>
          <div className="flex justify-between">
            <span>&gt; INITIALIZING WEBGL</span>
            <span className="text-[#356DFF]">{Math.min(100, Math.round(progress * 0.90))}%</span>
          </div>
          <div className="flex justify-between">
            <span>&gt; FINALIZING SCENE</span>
            <span className="text-[#356DFF]">{Math.min(100, Math.round(progress * 0.70))}%</span>
          </div>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-2 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#356DFF]" />
          <span>SCROLL TO CONTINUE</span>
        </div>
        <span>DHRUV SAVALIYA // CORE: GLSL THREE.JS</span>
      </div>
    </aside>
  );
}
