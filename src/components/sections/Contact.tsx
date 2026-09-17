import React, { useEffect, useRef, useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Github, Linkedin, Send, MessageSquare } from 'lucide-react';
import { store } from '../../lib/store';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const EMAIL = 'dhruvsavaliya075@gmail.com';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('contact');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact Dhruv Savaliya"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
          04 / 04 — COMMENCE COLLABORATION
        </span>
        <span className="w-8 h-[1px] bg-[#356DFF]/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Outreach & Identity */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h2 className="font-display font-bold text-5xl sm:text-7xl text-[var(--color-text)] tracking-tighter leading-none mb-4">
              LET’S BUILD<br />
              <span className="text-[#356DFF]">SOMETHING ICONIC.</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Whether you are architecting a new AI SaaS, seeking an exceptional full-stack developer, or wanting to elevate your product with interactive 3D craft—my inbox is open.
            </p>
          </div>

          {/* Quick Copy Email Box */}
          <div className="p-6 rounded-3xl glass-panel space-y-3">
            <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider block">
              PRIMARY DIRECT CHANNEL:
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border)]">
              <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-[var(--color-text)] font-medium truncate">
                <Mail className="w-4 h-4 text-[#356DFF] shrink-0" />
                <span className="truncate">{EMAIL}</span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                className="px-4 py-2 rounded-full bg-[#356DFF] text-white text-xs font-mono font-semibold flex items-center gap-1.5 hover:bg-[#1e55ee] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://github.com/Dhruv-Savaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-panel text-xs font-mono text-[var(--color-text)] hover:border-[#356DFF]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
            >
              <Github className="w-4 h-4 text-[var(--color-text)]" />
              <span>GITHUB // DHRUV-SAVALIYA</span>
              <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)]" />
            </a>
            <a
              href="https://linkedin.com/in/dhruvsavaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-panel text-xs font-mono text-[var(--color-text)] hover:border-[#356DFF]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
            >
              <Linkedin className="w-4 h-4 text-[#356DFF]" />
              <span>LINKEDIN // PROFILE</span>
              <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)]" />
            </a>
          </div>
        </div>

        {/* Right Column: Direct Message Terminal */}
        <div className="lg:col-span-6">
          <div className="p-8 sm:p-10 rounded-3xl glass-panel shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#356DFF]" />
                <span className="font-mono text-xs font-semibold text-[var(--color-text)] uppercase">
                  DISPATCH INQUIRY TERMINAL
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#B8FF5A] bg-[#356DFF]/20 px-2.5 py-0.5 rounded-full border border-[#B8FF5A]/30">
                ONLINE
              </span>
            </div>

            {formSent ? (
              <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)]/80 text-[var(--color-text)] text-center space-y-3 font-mono">
                <div className="w-10 h-10 rounded-full bg-[#B8FF5A]/20 text-[#B8FF5A] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#B8FF5A]">TRANSMISSION LOGGED</div>
                <p className="text-xs text-[var(--color-text-muted)] font-body">
                  Thank you, {formData.name || 'friend'}. Your message has been prepared for dispatch to {EMAIL}.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSent(false)}
                  className="mt-4 px-4 py-2 rounded-full bg-[#356DFF] text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[var(--color-text-muted)] mb-1.5 uppercase">
                    Your Name / Organization:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera // Founder"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--color-text-muted)] mb-1.5 uppercase">
                    Return Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--color-text-muted)] mb-1.5 uppercase">
                    Project Scope &amp; Vision:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your product, timeline, and technical objectives..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#356DFF] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#356DFF] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1e55ee] transition-all shadow-md shadow-[#356DFF]/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#356DFF]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT MESSAGE DIRECTLY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
