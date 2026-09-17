import React, { useEffect, useRef } from 'react';
import { User, MapPin, Code2, Sparkles, BookOpen } from 'lucide-react';
import { store } from '../../lib/store';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          store.setSection('about');
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Dhruv Savaliya"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 border-t border-[var(--color-border)]"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-[#356DFF] uppercase tracking-widest font-semibold">
          02 / 04 — BIOGRAPHY &amp; PERSONA
        </span>
        <span className="w-8 h-[1px] bg-[#356DFF]/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Heading & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display font-bold text-4xl sm:text-6xl text-[var(--color-text)] tracking-tight leading-none">
            ENGINEERING AT THE INTERSECTION OF CODE &amp; AI
          </h2>

          <div className="space-y-4 text-base text-[var(--color-text-muted)] font-body leading-relaxed">
            <p>
              I am Dhruv Savaliya, a full-stack engineer and product builder based in Surat, India. My journey began with pure curiosity about how computers turn raw mathematical logic into interactive digital experiences.
            </p>
            <p>
              Over the past several years, I have gravitated towards end-to-end product architecture—building systems that are not only robust under the hood (typed APIs, relational &amp; document databases, asynchronous pipelines) but also captivating on the surface (Three.js WebGL, mathematical glassmorphism, responsive micro-interactions).
            </p>
            <p>
              Today, I focus heavily on operationalizing generative AI and computer vision into production workflows—from multi-tier financial operating platforms like <span className="text-[var(--color-text)] font-semibold">BizDhan</span> to automated insurance fraud detection engines like <span className="text-[var(--color-text)] font-semibold">ClearClaim</span>.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono text-[var(--color-text)]">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel">
              <MapPin className="w-3.5 h-3.5 text-[#356DFF]" />
              <span>SURAT, GUJARAT, INDIA</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel">
              <Code2 className="w-3.5 h-3.5 text-[#356DFF]" />
              <span>FULL-STACK &amp; 3D SPECIALIST</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel">
              <Sparkles className="w-3.5 h-3.5 text-[#B8FF5A]" />
              <span>AI INTEGRATOR</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Stats & Glass Highlight Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl glass-panel shadow-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <User className="w-5 h-5 text-[#356DFF]" />
              <span className="font-mono text-xs font-semibold text-[var(--color-text)] uppercase">
                CORE STATS AT A GLANCE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] space-y-1">
                <div className="font-display font-bold text-3xl text-[var(--color-text)]">3+</div>
                <div className="font-mono text-xs text-[#356DFF]">Years Building</div>
                <div className="font-body text-[11px] text-[var(--color-text-muted)]">Full-stack products</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] space-y-1">
                <div className="font-display font-bold text-3xl text-[var(--color-text)]">15+</div>
                <div className="font-mono text-xs text-[#356DFF]">Shipped Systems</div>
                <div className="font-body text-[11px] text-[var(--color-text-muted)]">Web apps &amp; SaaS</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] space-y-1">
                <div className="font-display font-bold text-3xl text-[var(--color-text)]">60fps</div>
                <div className="font-mono text-xs text-[#356DFF]">Interactive 3D</div>
                <div className="font-body text-[11px] text-[var(--color-text-muted)]">WebGL &amp; Three.js</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] space-y-1">
                <div className="font-display font-bold text-3xl text-[var(--color-text)]">100%</div>
                <div className="font-mono text-xs text-[#356DFF]">Type-Safe</div>
                <div className="font-body text-[11px] text-[var(--color-text-muted)]">Strict TypeScript</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-bg-secondary)]/80 border border-[var(--color-border)] space-y-2 font-mono text-xs">
              <div className="text-[#B8FF5A] flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-4 h-4" /> CONTINUOUS EVOLUTION
              </div>
              <p className="text-[var(--color-text-muted)] font-body text-xs leading-relaxed">
                Always experimenting with cutting-edge runtimes (React 19, Vite), WebGL shaders, and next-generation multimodal LLM agents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
