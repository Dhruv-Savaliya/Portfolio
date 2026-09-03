'use client';

import { useRef, useEffect, useState } from 'react';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const links = [
    { label: 'EMAIL', href: 'mailto:dhruvsavaliya001@gmail.com', value: 'dhruvsavaliya001@gmail.com' },
    { label: 'LINKEDIN', href: 'https://linkedin.com/in/dhruvsavaliya', value: 'linkedin.com/in/dhruvsavaliya' },
    { label: 'GITHUB', href: 'https://github.com/dhruvsavaliya', value: 'github.com/dhruvsavaliya' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-ds-surface px-[5vw] py-[15vw] overflow-hidden"
      aria-label="Contact Dhruv Savaliya"
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '60vw',
          height: '40vw',
          background: 'radial-gradient(ellipse, rgba(200,255,0,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Rule */}
      <div
        className="flex items-center gap-6 mb-[8vw]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        <span className="text-label-mono text-ds-lime">CONTACT</span>
        <div className="flex-1 h-px bg-ds-border" />
      </div>

      {/* Headline */}
      <h2
        className="font-display font-bold text-ds-text mb-[5vw]"
        style={{
          fontSize: 'clamp(3rem, 10vw, 14rem)',
          lineHeight: 0.85,
          letterSpacing: '-0.05em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        HAVE AN
        <br />
        IDEA WORTH
        <br />
        <span style={{ color: '#C8FF00' }}>BUILDING?</span>
      </h2>

      {/* Magnetic CTA */}
      <div className="mb-[6vw]">
        <a
          href="mailto:dhruvsavaliya001@gmail.com"
          className="inline-flex items-center gap-4 group cursor-none"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          aria-label="Send email to Dhruv Savaliya"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          <div
            className="flex items-center gap-4 px-8 py-5 rounded-full border transition-all duration-500"
            style={{
              borderColor: hovering ? '#C8FF00' : '#1A1A1A',
              backgroundColor: hovering ? '#C8FF00' : 'transparent',
              transform: hovering ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <span
              className="font-display font-bold transition-colors duration-300"
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)',
                letterSpacing: '-0.03em',
                color: hovering ? '#030303' : '#F0EDE6',
              }}
            >
              LET&apos;S TALK
            </span>
            <span
              className="font-display font-bold transition-all duration-300"
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)',
                color: hovering ? '#030303' : '#C8FF00',
                transform: hovering ? 'translate(6px, -6px)' : 'none',
              }}
            >
              ↗
            </span>
          </div>
        </a>
      </div>

      {/* Contact links */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-ds-border pt-[4vw]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}
      >
        {links.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            className="group flex flex-col gap-1 cursor-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease ${0.5 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + i * 0.1}s`,
            }}
          >
            <p className="text-label-mono text-ds-text-muted">{link.label}</p>
            <p
              className="font-body text-ds-text group-hover:text-ds-lime transition-colors duration-300"
              style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', wordBreak: 'break-all' }}
            >
              {link.value}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
