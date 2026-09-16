import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, FastForward } from 'lucide-react';
import { sound } from '../../lib/audio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [logs, setLogs] = useState<string[]>([
    '> INITIALIZING SYSTEMS',
  ]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const hasTriggeredEnter = useRef(false);

  const handleEnter = () => {
    if (hasTriggeredEnter.current) return;
    hasTriggeredEnter.current = true;
    sound.playWarp();
    setHasEntered(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 6;
        if (next >= 100) {
          clearInterval(timer);
          setIsReady(true);
          // Automatically transition after reaching 100% so user is never stuck
          setTimeout(() => {
            handleEnter();
          }, 600);
          return 100;
        }

        // Add progressive diagnostic log lines
        if (next > 25 && !logs.includes('> LOADING FONTS')) {
          setLogs((l) => [...l, '> LOADING FONTS [OK]']);
          sound.playTick(900);
        }
        if (next > 50 && !logs.includes('> LOADING 3D DIGITAL CORE')) {
          setLogs((l) => [...l, '> LOADING 3D DIGITAL CORE [OK]']);
          sound.playTick(1050);
        }
        if (next > 75 && !logs.includes('> COMPILING GLSL SHADERS')) {
          setLogs((l) => [...l, '> COMPILING GLSL SHADERS [OK]']);
          sound.playTick(1200);
        }
        if (next > 90 && !logs.includes('> INITIALIZING WEBGL SCENE')) {
          setLogs((l) => [...l, '> INITIALIZING WEBGL SCENE [OK]']);
          sound.playTick(1350);
        }

        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [logs]);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = sound.toggleSound();
    setIsSoundEnabled(newState);
  };

  return (
    <div
      id="preloader"
      onClick={isReady ? handleEnter : undefined}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#040711] transition-opacity duration-700 select-none ${
        hasEntered ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar: Identifier, Sound Toggle & Instant Skip */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-slate-300 font-bold">DHRUV.S // CORE 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all text-xs font-mono text-slate-300 cursor-pointer"
          >
            {isSoundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-300">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>SOUND OFF</span>
              </>
            )}
          </button>

          {/* Instant Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-cyan-400 hover:text-white transition-all text-xs font-mono cursor-pointer"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center: Heroic Loading Readout */}
      <div className="max-w-xl mx-auto w-full my-auto text-center sm:text-left">
        <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono block mb-2">
          INITIALIZING CINEMATIC EXPERIENCE
        </span>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
          <h1 className="text-6xl sm:text-8xl font-display font-extrabold tracking-tighter text-white">
            LOADING
          </h1>
          <span className="text-4xl sm:text-6xl font-display font-bold text-cyan-400 font-mono">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5 mb-6">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-200 rounded-full transition-all duration-75 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Diagnostic Terminal Logs */}
        <div className="space-y-1 font-mono text-xs text-slate-400 min-h-[5.5rem]">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-2 animate-fade-in">
              <span className="text-cyan-400/90">{log}</span>
            </div>
          ))}
          {isReady && (
            <div className="text-emerald-400 font-bold animate-pulse pt-1">
              &gt; ALL MODULES SYNCHRONIZED. ENTERING SCENE...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Action / Enter Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500 border-t border-white/5 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>PORTFOLIO DIGITAL CORE • SURAT, INDIA</span>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold font-sans tracking-wide transition-all cursor-pointer ${
              isReady 
                ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
            }`}
          >
            <span>{isReady ? 'ENTER EXPERIENCE' : 'CLICK TO ENTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
