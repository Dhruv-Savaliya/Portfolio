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
  
  // 3D Core Interactive Controls
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [distortion, setDistortion] = useState(1.0);

  // Synchronize active section with scroll positions deterministically
  const checkActiveSection = useCallback(() => {
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

    const viewportCenter = window.innerHeight * 0.45;
    let closestTarget: CoreMorphTarget = 'hero';
    let minDistance = Infinity;

    for (const { id, target } of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if element overlaps viewport center
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          closestTarget = target;
          break;
        }
        const dist = Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));
        if (dist < minDistance) {
          minDistance = dist;
          closestTarget = target;
        }
      }
    }

    setActiveSection((prev) => (prev !== closestTarget ? closestTarget : prev));
  }, []);

  useLenis(checkActiveSection);

  useEffect(() => {
    checkActiveSection();
    window.addEventListener('scroll', checkActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', checkActiveSection);
  }, [checkActiveSection, isPreloaderComplete]);

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
