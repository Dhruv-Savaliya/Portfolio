import React, { useState } from 'react';
import { Mail, Github, Linkedin, Phone, Copy, Check, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MagneticButton } from '../ui/MagneticButton';
import { sound } from '../../lib/audio';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const email = 'dhruvsavaliya075@gmail.com';
  const phone = '+91 8469598520';

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f0ff', '#a855f7', '#38bdf8'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWarp();
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#a855f7', '#a3e635'],
    });
  };

  return (
    <section id="contact" className="relative py-28 px-6 sm:px-10 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
            <span>07 / 07 — GET IN TOUCH</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            Have an idea worth building? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              Let's talk.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-xl mb-10">
            Open for full-stack engineering roles, ambitious contract builds, and AI web applications.
            Let's create something memorable together.
          </p>

          {/* Direct Communication Channels */}
          <div className="space-y-4 font-mono text-sm max-w-lg mb-8">
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">PRIMARY EMAIL</span>
                  <a href={`mailto:${email}`} className="text-white hover:text-cyan-300 transition-colors font-medium">
                    {email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">PHONE / WHATSAPP</span>
                  <a href={`tel:${phone}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                    {phone}
                  </a>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 px-2 py-1 rounded bg-white/5">
                UTC+5:30
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Dhruv-Savaliya"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/dhruvsavaliya"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right Glass Inquiry Box */}
        <div className="lg:col-span-5">
          <div className="glass-panel-glow p-8 sm:p-10 rounded-3xl border border-white/10 relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                TRANSMIT INQUIRY
              </span>
              <span className="text-[11px] font-mono text-slate-500">ENCRYPTED</span>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Transmission Acknowledged</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Thank you! Dhruv will respond promptly. You can also reach out directly via email at {email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-cyan-400 underline pt-4 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                    Project Brief / Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your product, timeline, or open role..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-sm transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <span>SEND TRANSMISSION</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-500">
                Notice: The 3D Digital Core above condenses into the signature "D" in this section.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
