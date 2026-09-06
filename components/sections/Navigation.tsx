'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

const NAV_LINKS = [
  { label: 'WORK', href: '#work', sub: 'SELECTED SYSTEMS & SAAS' },
  { label: 'ABOUT', href: '#about', sub: 'BACKGROUND & PHILOSOPHY' },
  { label: 'EXPERIENCE', href: '#experience', sub: 'TRAJECTORY & EDUCATION' },
  { label: 'STACK', href: '#technology', sub: 'ARCHITECTURE & TOOLS' },
  { label: 'CONTACT', href: '#contact', sub: 'START A CONVERSATION' },
];

// ============================================
// FULLSCREEN CINEMATIC MENU OVERLAY
// ============================================
function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    if (!overlayRef.current) return;
    if (isOpen) {
      overlayRef.current.style.visibility = 'visible';
      overlayRef.current.style.clipPath = 'inset(0 0 0% 0)';
      document.body.style.overflow = 'hidden';
    } else {
      overlayRef.current.style.clipPath = 'inset(0 0 100% 0)';
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.visibility = 'hidden';
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-ds-bg/95 backdrop-blur-2xl z-[7999] flex flex-col justify-between p-[6vw] border-b border-ds-border"
      style={{
        visibility: 'hidden',
        clipPath: 'inset(0 0 100% 0)',
        transition: 'clip-path 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'clip-path',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      aria-hidden={!isOpen}
    >
      {/* Top Telemetry */}
      <div className="flex items-center justify-between border-b border-ds-border pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-ds-blue animate-pulse" />
          <span className="text-label-mono text-ds-text-muted">SYSTEM NAVIGATION // 2026</span>
        </div>
        <button
          onClick={() => {
            play('click');
            onClose();
          }}
          className="group flex items-center gap-2 text-label-mono text-ds-text-muted hover:text-ds-blue-highlight transition-colors cursor-none focus-visible:outline-2 focus-visible:outline-ds-blue"
          aria-label="Close navigation menu"
        >
          <span>CLOSE</span>
          <span className="font-mono text-ds-blue-highlight group-hover:rotate-90 transition-transform duration-300">
            [ESC]
          </span>
        </button>
      </div>

      {/* Main Links */}
      <nav aria-label="Full menu navigation" className="my-auto py-8">
        <ul className="space-y-4 md:space-y-3">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => {
                  play('click');
                  onClose();
                }}
                className="group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 font-display font-bold text-ds-text hover:text-ds-blue-highlight transition-colors duration-300 cursor-none"
                style={{
                  fontSize: 'clamp(2.5rem, 6.5vw, 7rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.04em',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.12 + i * 0.06}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.12 + i * 0.06}s, color 0.3s`,
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-label-mono text-ds-blue text-xs align-super group-hover:text-ds-signal transition-colors">
                    0{i + 1}
                  </span>
                  <span>{link.label}</span>
                </div>
                <span className="text-label-mono text-ds-text-dim text-xs font-normal tracking-widest uppercase md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  {link.sub}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Telemetry Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-ds-border">
        <div>
          <p className="text-label-mono text-ds-text-dim mb-1">COORDINATES</p>
          <p className="font-mono text-xs text-ds-text">21.1702° N, 72.8311° E</p>
          <p className="text-xs text-ds-text-muted mt-0.5">Surat, Gujarat, India</p>
        </div>
        <div>
          <p className="text-label-mono text-ds-text-dim mb-1">DISCIPLINE</p>
          <p className="font-mono text-xs text-ds-text">Full-Stack / Next.js / AI</p>
          <p className="text-xs text-ds-text-muted mt-0.5">Systems & Interactive 3D</p>
        </div>
        <div className="sm:text-right">
          <p className="text-label-mono text-ds-text-dim mb-1">DIRECT SIGNAL</p>
          <a
            href="mailto:dhruvsavaliya075@gmail.com"
            className="font-mono text-xs text-ds-blue-highlight hover:underline cursor-none"
          >
            dhruvsavaliya075@gmail.com
          </a>
          <p className="text-xs text-ds-signal mt-0.5">● Ready for opportunities</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN MINIMAL NAVIGATION HEADER
// ============================================
export default function Navigation() {
  const menuOpen = useExperienceStore((s) => s.menuOpen);
  const toggleMenu = useExperienceStore((s) => s.toggleMenu);
  const { play } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) toggleMenu();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen, toggleMenu]);

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[8000] flex items-center justify-between px-[5vw] transition-all duration-500 ease-expo-out"
        style={{
          paddingTop: scrolled ? '1.1rem' : '2rem',
          paddingBottom: scrolled ? '1.1rem' : '2rem',
          borderBottom: scrolled ? '1px solid rgba(244, 246, 250, 0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          backgroundColor: scrolled ? 'rgba(8, 11, 16, 0.85)' : 'transparent',
        }}
        role="banner"
      >
        {/* Logo: Desktop "DHRUV.S", Mobile "D" */}
        <Link
          href="/"
          className="font-display font-bold text-ds-text hover:text-ds-blue-highlight transition-colors duration-300 cursor-none flex items-center gap-2 group"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', letterSpacing: '-0.02em' }}
          aria-label="Dhruv Savaliya — Home"
        >
          <span className="w-2 h-2 rounded-full bg-ds-blue group-hover:bg-ds-signal transition-colors duration-300" />
          <span className="hidden md:inline">DHRUV.S</span>
          <span className="md:hidden">D</span>
        </Link>

        {/* Desktop Minimal Links */}
        <nav
          className="hidden md:flex items-center gap-8 lg:gap-10"
          aria-label="Primary navigation"
        >
          {['WORK', 'ABOUT', 'CONTACT'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => play('click')}
              className="text-label-mono text-ds-text-muted hover:text-ds-text transition-colors duration-300 cursor-none relative py-1 group"
            >
              <span>{item}</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-ds-blue-highlight group-hover:w-full transition-all duration-300 ease-expo-out" />
            </Link>
          ))}
        </nav>

        {/* Menu Action Trigger */}
        <button
          onClick={() => {
            play('click');
            toggleMenu();
          }}
          className="flex items-center gap-3 group cursor-none focus-visible:outline-2 focus-visible:outline-ds-blue py-1"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span className="text-label-mono text-ds-text-muted group-hover:text-ds-blue-highlight transition-colors duration-300">
            {menuOpen ? 'CLOSE' : 'MENU'}
          </span>
          {/* Minimal Kinetic Indicator */}
          <div className="flex flex-col gap-[5px] w-5">
            <span
              className="block h-[1.5px] bg-current transition-all duration-400 ease-expo-out"
              style={{
                transform: menuOpen ? 'rotate(45deg) translateY(4.5px)' : 'none',
                color: menuOpen ? 'var(--color-blue)' : 'var(--color-text-muted)',
              }}
            />
            <span
              className="block h-[1.5px] bg-current transition-all duration-400 ease-expo-out"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translateY(-4.5px)' : 'none',
                opacity: menuOpen ? 1 : 0.7,
                color: menuOpen ? 'var(--color-blue)' : 'var(--color-text-muted)',
              }}
            />
          </div>
        </button>
      </header>

      {/* Fullscreen Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={toggleMenu} />
    </>
  );
}
