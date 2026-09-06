'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

// ============================================
// SOUND TOGGLE COMPONENT
// ============================================
function SoundToggle() {
  const soundEnabled = useExperienceStore((s) => s.soundEnabled);
  const toggleSound = useExperienceStore((s) => s.toggleSound);
  const { play } = useSound();

  return (
    <button
      onClick={() => {
        toggleSound();
        play('click');
      }}
      className="flex items-center gap-3 group cursor-none focus-visible:outline-2 focus-visible:outline-ds-blue px-3 py-1.5 rounded-full border border-ds-border hover:border-ds-blue-highlight/40 transition-colors"
      aria-label={soundEnabled ? 'Disable audio experience' : 'Enable audio experience'}
      aria-pressed={soundEnabled}
    >
      <span className="text-label-mono text-ds-text-muted group-hover:text-ds-blue-highlight transition-colors duration-300">
        AUDIO
      </span>
      <div className="relative w-8 h-4 rounded-full border border-ds-border overflow-hidden bg-ds-surface">
        <div
          className={`absolute inset-y-0.5 left-0.5 w-3 h-3 rounded-full transition-all duration-300 ease-expo-out ${
            soundEnabled ? 'bg-ds-blue-highlight translate-x-4' : 'bg-ds-text-dim translate-x-0'
          }`}
        />
      </div>
      <span
        className={`text-label-mono font-mono text-[10px] transition-colors duration-300 ${
          soundEnabled ? 'text-ds-blue-highlight' : 'text-ds-text-muted'
        }`}
      >
        {soundEnabled ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

// ============================================
// PRELOADER
// ============================================
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ENVIRONMENT');
  const [glInfo, setGlInfo] = useState('CHECKING GPU PIPELINE');
  const [isExiting, setIsExiting] = useState(false);
  const targetProgressRef = useRef(10);
  const { play } = useSound();

  // Genuine asset readiness tracker
  useEffect(() => {
    let isMounted = true;

    async function runReadinessChecks() {
      // 1. Font Readiness
      if (typeof document !== 'undefined' && 'fonts' in document) {
        setStatusText('SYNCING TYPOGRAPHY ENGINE');
        await document.fonts.ready;
        if (!isMounted) return;
        targetProgressRef.current = Math.max(targetProgressRef.current, 35);
      }

      // 2. Real WebGL Context & Shader Compilation Check
      if (typeof window !== 'undefined') {
        setStatusText('PROBING WEBGL HARDWARE');
        try {
          const testCanvas = document.createElement('canvas');
          const gl = (testCanvas.getContext('webgl2') ||
            testCanvas.getContext('webgl') ||
            testCanvas.getContext('experimental-webgl')) as
            | WebGLRenderingContext
            | WebGL2RenderingContext
            | null;

          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const renderer = debugInfo
              ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              : 'GENERIC_GPU';
            setGlInfo(renderer.substring(0, 32));

            // Warm up shader compiler with tiny test program
            const vs = gl.createShader(gl.VERTEX_SHADER);
            if (vs) {
              gl.shaderSource(vs, 'void main(){gl_Position=vec4(0.0,0.0,0.0,1.0);}');
              gl.compileShader(vs);
              gl.deleteShader(vs);
            }
          } else {
            setGlInfo('FALLBACK_2D_RENDERER');
          }
        } catch {
          setGlInfo('FALLBACK_MODE');
        }

        if (!isMounted) return;
        targetProgressRef.current = Math.max(targetProgressRef.current, 65);
      }

      // 3. Document Complete
      setStatusText('MOUNTING SCENIC GRAPH');
      if (document.readyState === 'complete') {
        targetProgressRef.current = Math.max(targetProgressRef.current, 85);
      } else {
        await new Promise((res) => {
          window.addEventListener('load', res, { once: true });
        });
      }

      if (!isMounted) return;
      setStatusText('CORE SYSTEM READY');
      targetProgressRef.current = 100;
    }

    runReadinessChecks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth RAF progress interpolation
  useEffect(() => {
    let animId: number;

    const tick = () => {
      setDisplayProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) * 0.12));
          const next = Math.min(target, prev + step);
          if (next === 100 && prev < 100) {
            // Trigger exit transition sequence
            setTimeout(() => {
              play('transition');
              setIsExiting(true);
              setTimeout(onComplete, 900);
            }, 300);
          }
          return next;
        }
        return prev;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onComplete, play]);

  const formattedProgress = String(Math.floor(displayProgress)).padStart(2, '0');

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-ds-bg flex flex-col justify-between p-[6vw] select-none transition-all duration-700 ease-expo-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Digital experience asset loader"
    >
      {/* Top Bar: Telemetry + Audio */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-ds-blue animate-pulse" />
          <span className="text-label-mono text-ds-text-muted">
            DHRUV SAVALIYA // SYSTEM READY: {formattedProgress}%
          </span>
        </div>
        <SoundToggle />
      </div>

      {/* Center: Massive Editorial LOADING & Morph Axis */}
      <div className="relative my-auto flex flex-col justify-center">
        <div className="overflow-hidden">
          <h1
            className={`font-display font-bold text-ds-text tracking-tighter transition-all duration-700 ease-expo-out ${
              isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            }`}
            style={{
              fontSize: 'clamp(3.5rem, 13vw, 15rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.05em',
            }}
          >
            LOADING
          </h1>
        </div>

        {/* Progress Line — Morphs into the Core central vertical axis at exit */}
        <div className="relative mt-8 md:mt-12 w-full h-[2px] bg-ds-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ds-blue via-ds-blue-highlight to-ds-signal transition-all duration-200 ease-out"
            style={{
              width: `${displayProgress}%`,
              boxShadow: '0 0 12px rgba(53, 109, 255, 0.4)',
            }}
          />
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="flex items-center justify-between mt-3 text-label-mono text-ds-text-dim text-[11px]">
          <span>{statusText}</span>
          <span className="font-mono text-ds-text-muted">{glInfo}</span>
        </div>
      </div>

      {/* Bottom Counter & System Specifications */}
      <div className="flex items-end justify-between border-t border-ds-border pt-6">
        <div>
          <p className="text-label-mono text-ds-text-dim mb-1">ARCHITECTURE</p>
          <p className="font-mono text-xs text-ds-text">R3F / THREE.JS / NEXT.JS 15</p>
        </div>

        <div className="text-right">
          <span
            className="font-display font-bold text-ds-text tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', lineHeight: 0.9 }}
          >
            {formattedProgress}
          </span>
          <span className="text-label-mono text-ds-blue-highlight ml-2 align-super text-xs">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}
