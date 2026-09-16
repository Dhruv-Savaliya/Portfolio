import React, { useState, useEffect, useCallback } from 'react';
import { Preloader } from './components/ui/Preloader';
import { Navigation } from './components/ui/Navigation';
import { DigitalCoreCanvas } from './components/three/DigitalCoreCanvas';
import { ModelDetailsModal } from './components/three/ModelDetailsModal';
import { HeroSection } from './components/sections/HeroSection';
import { IntroSection } from './components/sections/IntroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { HowIBuildSection } from './components/sections/HowIBuildSection';
import { AboutSection } from './components/sections/AboutSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { TechnologySection } from './components/sections/TechnologySection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { CoreMorphTarget } from './types';
import { useLenis } from './hooks/useLenis';

export default function App() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState<CoreMorphTarget>('hero');
  const [isModelSpecOpen, setIsModelSpecOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth Lenis Scroll Handler
  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  useLenis(handleScrollProgress);
  
  // 3D Core Interactive Controls
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [distortion, setDistortion] = useState(1.0);

  // Synchronize active section with scroll positions
  useEffect(() => {
    const sectionIds: { id: string; target: CoreMorphTarget }[] = [
      { id: 'hero', target: 'hero' },
      { id: 'intro', target: 'intro' },
      { id: 'bizdhan', target: 'bizdhan' },
      { id: 'clearclaim', target: 'clearclaim' },
      { id: 'smartreceipt', target: 'smartreceipt' },
      { id: 'how-i-build', target: 'howibuild' },
      { id: 'about', target: 'about' },
      { id: 'experience', target: 'experience' },
      { id: 'technology', target: 'technology' },
      { id: 'contact', target: 'contact' },
      { id: 'footer', target: 'footer' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sectionIds.find((s) => s.id === entry.target.id);
            if (match) {
              setActiveSection(match.target);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isPreloaderComplete]);

  return (
    <div className="relative min-h-screen bg-[#040711] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Cinematic Initializing Preloader */}
      {!isPreloaderComplete && (
        <Preloader onComplete={() => setIsPreloaderComplete(true)} />
      )}

      {/* Persistent Three.js WebGL Digital Core Canvas */}
      <DigitalCoreCanvas
        activeSection={activeSection}
        wireframeOverride={wireframe}
        speedMultiplier={speed}
        distortionMultiplier={distortion}
        scrollProgress={scrollProgress}
      />

      {/* Sticky Cinematic Navigation */}
      <Navigation
        onOpenModelSpec={() => setIsModelSpecOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Layout Sections */}
      <main className="relative z-10">
        <HeroSection onOpenModelSpec={() => setIsModelSpecOpen(true)} />
        <IntroSection />
        <ProjectsSection />
        <HowIBuildSection />
        <AboutSection />
        <ExperienceSection />
        <TechnologySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* 3D Model Spec & Custom GLTF Loading Guide Modal */}
      <ModelDetailsModal
        isOpen={isModelSpecOpen}
        onClose={() => setIsModelSpecOpen(false)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          const el = document.getElementById(sec === 'howibuild' ? 'how-i-build' : sec);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        wireframe={wireframe}
        onToggleWireframe={() => setWireframe((w) => !w)}
        speed={speed}
        onChangeSpeed={setSpeed}
        distortion={distortion}
        onChangeDistortion={setDistortion}
      />
    </div>
  );
}
