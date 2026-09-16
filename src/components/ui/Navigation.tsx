import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Cpu, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { sound } from '../../lib/audio';

interface NavigationProps {
  onOpenModelSpec: () => void;
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenModelSpec, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(() => sound.getIsSoundOn());

  useEffect(() => {
    setIsSoundOn(sound.getIsSoundOn());
    const interval = setInterval(() => {
      setIsSoundOn(sound.getIsSoundOn());
    }, 500);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleToggleSound = () => {
    const state = sound.toggleSound();
    setIsSoundOn(state);
  };

  const navLinks = [
    { label: 'WORK', href: '#work', id: 'bizdhan' },
    { label: 'HOW I BUILD', href: '#how-i-build', id: 'howibuild' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'EXPERIENCE', href: '#experience', id: 'experience' },
    { label: 'TECH', href: '#technology', id: 'technology' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = (href: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#040711]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="group flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_12px_#00f0ff]" />
            <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              DHRUV.S
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
              FULL-STACK & AI
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3D Model Spec Inspector Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenModelSpec();
              }}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              title="Open 3D Model & GLTF Specs"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline font-semibold">3D CORE SPEC</span>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
              aria-label="Toggle sound"
            >
              {isSoundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline text-cyan-300">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">SOUND OFF</span>
                </>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between p-8 bg-[#040711]/95 backdrop-blur-2xl animate-fade-in text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                DHRUV SAVALIYA
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 py-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-left py-2 font-display text-2xl font-bold tracking-tight text-slate-300 hover:text-cyan-400 hover:translate-x-2 transition-all flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono text-cyan-400/60">→</span>
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModelSpec();
              }}
              className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm"
            >
              <span className="flex items-center gap-2 font-bold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                3D MODEL & GLTF SPECIFICATIONS
              </span>
              <span>↗</span>
            </button>
          </div>

          <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Dhruv-Savaliya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/dhruvsavaliya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:dhruvsavaliya075@gmail.com"
                className="hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <span>SURAT, GUJARAT, IN</span>
          </div>
        </div>
      )}
    </>
  );
};
