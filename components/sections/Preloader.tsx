'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

// ============================================
// ASSET LOADING TASKS
// ============================================
const LOADING_TASKS: Array<{ label: string; weight: number; fn: () => Promise<void> }> = [
  {
    label: 'FONTS',
    weight: 15,
    fn: async () => {
      if (typeof document !== 'undefined') {
        await document.fonts.ready;
      }
    },
  },
  {
    label: 'INITIALIZING WEBGL',
    weight: 20,
    fn: () =>
      new Promise<void>((resolve) => {
        // WebGL context check + brief initialization window
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl');
        // Give WebGL time to init
        setTimeout(resolve, gl ? 400 : 800);
      }),
  },
  {
    label: 'LOADING 3D ENGINE',
    weight: 25,
    fn: () =>
      new Promise<void>((resolve) => {
        // Simulate Three.js + R3F module resolution
        setTimeout(resolve, 600);
      }),
  },
  {
    label: 'PREPARING SHADERS',
    weight: 20,
    fn: () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      }),
  },
  {
    label: 'BUILDING EXPERIENCE',
    weight: 20,
    fn: () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 400);
      }),
  },
];

// ============================================
// SOUND TOGGLE
// ============================================
function SoundToggle() {
  const { soundEnabled, toggleSound } = useExperienceStore((s) => ({
    soundEnabled: s.soundEnabled,
    toggleSound: s.toggleSound,
  }));
  const { play } = useSound();

  return (
    <button
      onClick={() => {
        toggleSound();
        play('click');
      }}
      className="flex items-center gap-3 group cursor-none focus-visible:outline-2 focus-visible:outline-ds-lime"
      aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
      aria-pressed={soundEnabled}
    >
      <span className="text-label-mono text-ds-text-muted group-hover:text-ds-lime transition-colors duration-300">
        SOUND
      </span>
      <div className="relative w-10 h-5 rounded-full border border-ds-border overflow-hidden bg-ds-surface">
        <div
          className={`absolute inset-y-0 left-0 w-5 h-5 rounded-full transition-all duration-400 ease-expo-out ${
            soundEnabled ? 'bg-ds-lime translate-x-5' : 'bg-ds-text-dim translate-x-0'
          }`}
        />
      </div>
      <span
        className={`text-label-mono transition-colors duration-300 ${
          soundEnabled ? 'text-ds-lime' : 'text-ds-text-muted'
        }`}
      >
        {soundEnabled ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

// ============================================
// COUNTER
// ============================================
function Counter({ value }: { value: number }) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!displayRef.current) return;
    const start = prevValue.current;
    const end = value;
    const dur = 300;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (displayRef.current) {
        displayRef.current.textContent = String(current).padStart(2, '0');
      }
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span
      ref={displayRef}
      className="tabular-nums"
    >
      {String(value).padStart(2, '0')}
    </span>
  );
}

// ============================================
// PRELOADER
// ============================================
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const { setLoadingProgress, setLoadingComplete, loadingProgress } =
    useExperienceStore((s) => ({
      setLoadingProgress: s.setLoadingProgress,
      setLoadingComplete: s.setLoadingComplete,
      loadingProgress: s.loadingProgress,
    }));

  const [currentTask, setCurrentTask] = useState('INITIALIZING');
  const preloaderRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const startExit = useCallback(() => {
    setLoadingComplete(true);

    // Cinematic exit: clip-path wipe up
    if (preloaderRef.current) {
      preloaderRef.current.style.transition =
        'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease 0.8s';
      preloaderRef.current.style.clipPath = 'inset(0 0 100% 0)';
      preloaderRef.current.style.opacity = '0';
    }

    setTimeout(() => {
      onComplete();
    }, 1400);
  }, [onComplete, setLoadingComplete]);

  // Run loading tasks
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    let accumulated = 0;
    const totalWeight = LOADING_TASKS.reduce((s, t) => s + t.weight, 0);

    (async () => {
      for (const task of LOADING_TASKS) {
        setCurrentTask(task.label);
        await task.fn();
        accumulated += task.weight;
        setLoadingProgress(Math.round((accumulated / totalWeight) * 100));
        // Small gap between tasks
        await new Promise<void>((r) => setTimeout(r, 50));
      }
      // Complete
      setLoadingProgress(100);
      await new Promise<void>((r) => setTimeout(r, 500));
      startExit();
    })();
  }, [setLoadingProgress, startExit]);

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        clipPath: 'inset(0 0 0% 0)',
        willChange: 'clip-path, opacity',
      }}
      role="progressbar"
      aria-valuenow={loadingProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading portfolio"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-mono text-ds-text-muted mb-2">
            DHRUV SAVALIYA
          </p>
          <p className="text-label-mono text-ds-text-dim">
            PORTFOLIO — 2026
          </p>
        </div>
        <SoundToggle />
      </div>

      {/* Giant LOADING text */}
      <div className="flex-1 flex items-center">
        <h1
          className="font-display font-bold text-ds-text select-none"
          style={{
            fontSize: 'clamp(5rem, 18vw, 22rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
          }}
        >
          LOADING
        </h1>
      </div>

      {/* Progress section */}
      <div className="space-y-6">
        {/* Task label */}
        <div className="flex items-center justify-between">
          <p className="text-label-mono text-ds-text-muted tracking-widest">
            {currentTask}
          </p>
          <p
            className="font-display font-bold text-ds-lime"
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            <Counter value={loadingProgress} />
            <span className="text-ds-text-muted" style={{ fontSize: '0.4em' }}>%</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="preloader__progress-bar-track h-px bg-ds-border w-full">
            <div
              className="preloader__progress-bar-fill h-px bg-ds-lime"
              style={{
                width: `${loadingProgress}%`,
                boxShadow: '0 0 12px rgba(200,255,0,0.6)',
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>

          {/* Animated dot on bar */}
          <div
            className="absolute top-1/2 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-ds-lime"
            style={{
              left: `${loadingProgress}%`,
              boxShadow: '0 0 8px rgba(200,255,0,0.8)',
              transition: 'left 0.3s ease-out',
            }}
          />
        </div>

        {/* Bottom bar labels */}
        <div className="flex justify-between">
          <span className="text-label-mono text-ds-text-dim">
            CODE → DATA → AI → INTERACTION
          </span>
          <span className="text-label-mono text-ds-text-dim">
            {loadingProgress < 100 ? 'LOADING...' : 'READY'}
          </span>
        </div>
      </div>
    </div>
  );
}
