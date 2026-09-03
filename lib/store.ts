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

  // Core morph state
  coreMorphTarget:
    | 'idle'
    | 'bizdhan'
    | 'clearclaim'
    | 'receipt'
    | 'footer';
  setCoreMorphTarget: (target: ExperienceStore['coreMorphTarget']) => void;
}

export const useExperienceStore = create<ExperienceStore>((set) => ({
  // Loading
  loadingProgress: 0,
  loadingComplete: false,
  setLoadingProgress: (progress) => set({ loadingProgress: Math.min(100, Math.max(0, progress)) }),
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
  currentSection: 'preloader',
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
  coreMorphTarget: 'idle',
  setCoreMorphTarget: (coreMorphTarget) => set({ coreMorphTarget }),
}));
