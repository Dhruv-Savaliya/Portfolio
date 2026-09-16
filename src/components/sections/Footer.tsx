import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Code2 } from 'lucide-react';
import { sound } from '../../lib/audio';

export const Footer: React.FC = () => {
  const [suratTime, setSuratTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setSuratTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative border-t border-white/10 pt-16 pb-12 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
        {/* Brand & Tagline */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              DHRUV SAVALIYA
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-md">
            Full-Stack Developer • Next.js, React, TypeScript, Node.js, AI & Interactive Web
          </p>
        </div>

        {/* Live Surat Clock & Status */}
        <div className="flex flex-col items-center md:items-end text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-500">SURAT, IN LOCAL TIME:</span>
            <span className="text-cyan-300 font-bold">{suratTime || '05:30 PM'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">AVAILABLE FOR NEW VENTURES</span>
          </div>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <span>© {new Date().getFullYear()} DHRUV SAVALIYA. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-1">
          <span>ENGINEERED WITH THREE.JS, REACT SPRING & TAILWIND</span>
        </div>
      </div>
    </footer>
  );
};
