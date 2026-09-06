'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

const NAV_LINKS = [
  { label: 'WORK',    href: '#work'    },
  { label: 'ABOUT',   href: '#about'   },
  { label: 'CONTACT', href: '#contact' },
];

// ============================================
// FULLSCREEN MENU OVERLAY
// ============================================
function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    if (!overlayRef.current) return;
    if (isOpen) {
      overlayRef.current.style.visibility = 'visible';
      overlayRef.current.style.clipPath = 'inset(0 0 0% 0)';
    } else {
      overlayRef.current.style.clipPath = 'inset(0 0 100% 0)';
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.visibility = 'hidden';
      }, 600);
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-ds-bg z-[7999] flex flex-col justify-between p-[5vw]"
      style={{
        visibility: 'hidden',
        clipPath: 'inset(0 0 100% 0)',
        transition: 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'clip-path',
      }}
      aria-hidden={!isOpen}
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <span className="text-label-mono text-ds-text-muted">NAVIGATION</span>
        <button
          onClick={() => { play('click'); onClose(); }}
          className="text-label-mono text-ds-text-muted hover:text-ds-lime transition-colors cursor-none"
          aria-label="Close menu"
        >
          CLOSE Ã—
        </button>
      </div>

      {/* Main links */}
      <nav aria-label="Full menu navigation">
        <ul className="space-y-4 md:space-y-2">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ transitionDelay: isOpen ? `${0.1 + i * 0.08}s` : '0s' }}>
              <Link
                href={link.href}
                onClick={() => { play('click'); onClose(); }}
                className="block font-display font-bold text-ds-text hover:text-ds-lime transition-colors duration-300 cursor-none"
                style={{
                  fontSize: 'clamp(3rem, 10vw, 10rem)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.04em',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s, color 0.3s`,
                }}
              >
                <span className="text-label-mono text-ds-lime text-xs mr-4 align-super">
                  0{i + 1}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-label-mono text-ds-text-muted mb-1">LOCATION</p>
          <p className="font-display font-medium text-ds-text" style={{ fontSize: '1.1rem' }}>
            Surat, India
          </p>
        </div>
        <div className="text-right">
          <p className="text-label-mono text-ds-text-muted mb-1">AVAILABLE FOR</p>
          <p className="font-display font-medium text-ds-lime" style={{ fontSize: '1.1rem' }}>
            Freelance & Roles
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NAVIGATION
// ============================================
export default function Navigation() {
  const menuOpen = useExperienceStore((s) => s.menuOpen);
  const toggleMenu = useExperienceStore((s) => s.toggleMenu);
  const { play } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
        className="fixed top-0 left-0 right-0 z-[8000] flex items-center justify-between px-[5vw]"
        style={{
          paddingTop: scrolled ? '1.2rem' : '2rem',
          paddingBottom: scrolled ? '1.2rem' : '2rem',
          borderBottom: scrolled ? '1px solid rgba(26,26,26,0.5)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          backgroundColor: scrolled ? 'rgba(3,3,3,0.8)' : 'transparent',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        role="banner"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-ds-text hover:text-ds-lime transition-colors duration-300 cursor-none"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', letterSpacing: '-0.02em' }}
          aria-label="Dhruv Savaliya â€” Home"
        >
          <span className="hidden md:inline">DHRUV.S</span>
          <span className="md:hidden">D</span>
        </Link>

        {/* Desktop links */}
        <nav
          className="hidden md:flex items-center gap-10"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => play('click')}
              className="text-label-mono text-ds-text-muted hover:text-ds-text transition-colors duration-300 cursor-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menu button */}
        <button
          onClick={() => { play('click'); toggleMenu(); }}
          className="flex items-center gap-3 group cursor-none focus-visible:outline-2 focus-visible:outline-ds-lime"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span className="text-label-mono text-ds-text-muted group-hover:text-ds-lime transition-colors duration-300">
            MENU
          </span>
          {/* Hamburger */}
          <div className="flex flex-col gap-[5px] w-5">
            <span
              className="block h-px bg-current transition-all duration-400 ease-expo-out"
              style={{
                transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none',
                color: menuOpen ? '#C8FF00' : '#555',
              }}
            />
            <span
              className="block h-px bg-current transition-all duration-400 ease-expo-out"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none',
                opacity: menuOpen ? 1 : 0.6,
                color: menuOpen ? '#C8FF00' : '#555',
              }}
            />
          </div>
        </button>
      </header>

      {/* Fullscreen overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={toggleMenu} />
    </>
  );
}
