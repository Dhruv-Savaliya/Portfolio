import React, { useState, useEffect } from 'react';
import { ArrowUp, Clock, Globe } from 'lucide-react';

export default function Footer() {
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      role="contentinfo"
      className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 text-[var(--color-text)] pt-16 pb-12 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Row: Giant Footer Monogram & Back to top */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border)] pb-12">
          <div>
            <div className="flex items-center gap-2 text-[#356DFF] font-mono text-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#356DFF]" />
              <span>DHRUV SAVALIYA // FULL-STACK ARCHITECT</span>
            </div>
            <div className="font-display font-bold text-4xl sm:text-6xl text-[var(--color-text)] tracking-tighter">
              DESIGNED TO INSPIRE.
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] hover:bg-[#356DFF] hover:text-white text-xs font-mono text-[var(--color-text)] transition-all cursor-pointer w-fit focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Row: Telemetry, Time, & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-[var(--color-text-muted)]">
          <div className="space-y-1">
            <div className="uppercase text-[10px] opacity-60">CURRENT LOCATION</div>
            <div className="text-[var(--color-text)] font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#356DFF]" />
              <span>SURAT, INDIA // 21.17° N</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="uppercase text-[10px] opacity-60">LOCAL TIME (IST)</div>
            <div className="text-[var(--color-text)] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B8FF5A]" />
              <span>{istTime || '17:30:00'} UTC+5:30</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="uppercase text-[10px] opacity-60">SYSTEM CORE</div>
            <div className="text-[var(--color-text)] font-medium">THREE.JS // GLSL PROCEDURAL</div>
          </div>

          <div className="space-y-1">
            <div className="uppercase text-[10px] opacity-60">AVAILABILITY</div>
            <div className="text-[#B8FF5A] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF5A] animate-ping" />
              <span>OPEN FOR SELECT ROLES</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Legal / Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-muted)]">
          <div>© 2026 DHRUV SAVALIYA. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <span>TYPESCRIPT</span>
            <span>•</span>
            <span>THREE.JS</span>
            <span>•</span>
            <span>TAILWIND</span>
            <span>•</span>
            <span>REACT 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
