import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Sun, Moon, Github, Linkedin, Mail } from 'lucide-react';
import { store, useStore } from '../../lib/store';

export default function Navigation() {
  const soundMuted = useStore((s) => s.soundMuted);
  const theme = useStore((s) => s.theme);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'WORK', href: '#bizdhan' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation"
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-3.5 sm:py-4 ${
        scrolled 
          ? 'backdrop-blur-xl bg-[var(--color-bg)]/80 border-b border-[var(--color-border)] shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#356DFF] rounded-lg p-1"
          aria-label="Dhruv Savaliya Portfolio — Back to Top"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#356DFF] shadow-[0_0_10px_#356DFF] group-hover:scale-125 transition-transform" />
          <span className="font-display font-bold tracking-tight text-sm text-[var(--color-text)]">
            DHRUV.S
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-[var(--color-text-muted)] uppercase px-2 py-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50">
            CORE
          </span>
        </a>

        {/* Center Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-panel"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-1 text-xs font-mono text-[var(--color-text-muted)] hover:text-[#356DFF] rounded-full transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#356DFF]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Theme Switcher, Sound & Menu Drawer */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={() => store.toggleTheme()}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel hover:border-[#356DFF]/50 text-xs font-mono text-[var(--color-text)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#B8FF5A]" />
                <span className="text-[11px] font-mono hidden sm:inline">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[11px] font-mono hidden sm:inline">DARK</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => store.toggleSound()}
            aria-label={soundMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel hover:border-[#356DFF]/50 text-xs font-mono text-[var(--color-text)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
          >
            {soundMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span className="hidden sm:inline text-[11px]">SOUND OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#356DFF] animate-pulse" />
                <span className="hidden sm:inline text-[11px] text-[#356DFF] font-medium">SOUND ON</span>
              </>
            )}
          </button>

          {/* Menu Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel text-xs font-mono text-[var(--color-text)] hover:border-[#356DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#356DFF] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hidden sm:inline">MENU</span>
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Slide-out Glass Drawer (Matches mockup right panel) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div 
            className="w-full max-w-sm h-full glass-panel p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-l border-[var(--color-border)] animate-in slide-in-from-right duration-300"
            style={{ background: 'var(--color-card-bg)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#356DFF] shadow-[0_0_8px_#356DFF]" />
                <span className="font-display font-bold text-sm tracking-tight text-[var(--color-text)]">
                  DHRUV.S
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex flex-col gap-4 py-8" aria-label="Drawer Navigation">
              {[
                { label: 'WORK', href: '#bizdhan', num: '01' },
                { label: 'ABOUT', href: '#about', num: '02' },
                { label: 'TECH', href: '#technology', num: '03' },
                { label: 'EXPERIENCE', href: '#experience', num: '04' },
                { label: 'CONTACT', href: '#contact', num: '05' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center justify-between py-2 text-xl font-display font-medium text-[var(--color-text)] hover:text-[#356DFF] group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">{item.num}</span>
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[#356DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </nav>

            {/* Drawer Footer with Socials and Theme Toggle */}
            <div className="pt-6 border-t border-[var(--color-border)] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
                <span>THEME</span>
                <button
                  type="button"
                  onClick={() => store.toggleTheme()}
                  className="px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:border-[#356DFF] transition-colors"
                >
                  {theme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)] pt-2">
                <span>SOCIAL</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Dhruv-Savaliya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/dhruv-savaliya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:dhruvsavaliya075@gmail.com"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
