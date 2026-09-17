export type CoreMorphTarget =
  | 'hero'
  | 'intro'
  | 'bizdhan'
  | 'clearclaim'
  | 'smartreceipt'
  | 'howibuild'
  | 'about'
  | 'technology'
  | 'experience'
  | 'contact';

export interface Project {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string[];
  role: string;
  year: string;
  timeline: string;
  architectureNotes: string[];
  metrics: { label: string; value: string; detail: string }[];
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featuredDemoType: 'finance-ledger' | 'claim-pipeline' | 'receipt-scanner';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  keyContributions: string[];
  technologies: string[];
}

export interface TechnologyCategory {
  id: string;
  category: string;
  description: string;
  skills: {
    name: string;
    level: string;
    experience: string;
    focus: string;
  }[];
}
