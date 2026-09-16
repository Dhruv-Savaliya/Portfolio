export type CoreMorphTarget = 
  | 'hero'
  | 'intro'
  | 'bizdhan'
  | 'clearclaim'
  | 'smartreceipt'
  | 'howibuild'
  | 'about'
  | 'experience'
  | 'technology'
  | 'contact'
  | 'footer'
  | 'idle';

export interface ProjectData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl: string;
  accentColor: string;
  badge: string;
  auditHighlight?: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  type: string;
  location: string;
  highlights: string[];
  current?: boolean;
}

export interface TechCategory {
  title: string;
  color: string;
  skills: { name: string; level: number; highlight?: boolean }[];
}

export interface ModelInspectorSettings {
  wireframe: boolean;
  rotationSpeed: number;
  distortion: number;
  particlesCount: number;
  colorMode: 'cyan-purple' | 'emerald-cyan' | 'electric-violet';
}
