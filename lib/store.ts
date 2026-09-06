import { create } from 'zustand';

export type Section =
  | 'preloader'
  | 'hero'
  | 'intro'
  | 'work'
  | 'bizdhan'
  | 'clearclaim'
  | 'receipt'
  | 'how-i-build'
  | 'about'
  | 'experience'
  | 'technology'
  | 'contact'
  | 'footer';

export type CoreMorphTarget =
  | 'hero'
  | 'intro'
  | 'bizdhan'
  | 'clearclaim'
  | 'receipt'
  | 'about'
  | 'technology'
  | 'contact'
  | 'footer'
  | 'idle';

export type TechCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'AI' | 'WEBGL' | null;

interface ExperienceStore {
  // Loading
  loadingProgress: number;
  loadingComplete: boolean;
  setLoadingProgress: (progress: number) => void;
  setLoadingComplete: (complete: boolean) => void;

  // Sound
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;

  // Navigation
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  // Sections
  currentSection: Section;
  setCurrentSection: (section: Section) => void;

  // Projects
  currentProject: string | null;
  setCurrentProject: (project: string | null) => void;

  // WebGL
  webglReady: boolean;
  setWebglReady: (ready: boolean) => void;

  // Scroll
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Core Morph State
  coreMorphTarget: CoreMorphTarget;
  setCoreMorphTarget: (target: CoreMorphTarget) => void;

  // Active Tech Category
  activeTechCategory: TechCategory;
  setActiveTechCategory: (cat: TechCategory) => void;
}

export const useExperienceStore = create<ExperienceStore>((set) => ({
  // Loading
  loadingProgress: 0,
  loadingComplete: false,
  setLoadingProgress: (progress) =>
    set({ loadingProgress: Math.min(100, Math.max(0, progress)) }),
  setLoadingComplete: (loadingComplete) => set({ loadingComplete }),

  // Sound (OFF by default)
  soundEnabled: false,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  // Navigation
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),

  // Sections
  currentSection: 'hero',
  setCurrentSection: (currentSection) => set({ currentSection }),

  // Projects
  currentProject: null,
  setCurrentProject: (currentProject) => set({ currentProject }),

  // WebGL
  webglReady: false,
  setWebglReady: (webglReady) => set({ webglReady }),

  // Scroll
  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),

  // Core morph
  coreMorphTarget: 'hero',
  setCoreMorphTarget: (coreMorphTarget) => set({ coreMorphTarget }),

  // Tech category
  activeTechCategory: null,
  setActiveTechCategory: (activeTechCategory) => set({ activeTechCategory }),
}));
