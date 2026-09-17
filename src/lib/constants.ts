import { Project, ExperienceItem, TechnologyCategory } from '../types';

export const COLORS = {
  bg: '#F3F5F8',
  text: '#080B10',
  textMuted: '#525866',
  accent: '#356DFF',
  accentHover: '#1e55ee',
  highlight: '#B8FF5A',
  border: 'rgba(8, 11, 16, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
} as const;

export const PROJECTS: Project[] = [
  {
    id: 'bizdhan',
    chapter: '01',
    title: 'BIZDHAN',
    subtitle: 'Personal & SME Financial Operating System',
    summary:
      'Solo-designed and engineered full-stack SaaS managing multi-tier financial operations: invoicing, purchase orders, categorized income/expense ledgers, and intelligent fiscal reporting.',
    description: [
      'Architected distinct dual workspaces for individual budgeting and SME team accounting, incorporating Groq API for sub-second, LLM-generated contextual fiscal summaries and anomaly detection.',
      'Constructed a reliable double-entry reconciliation engine preventing ledger discrepancies, integrated client-side dynamic invoice generators with PDF rendering, and interactive cashflow analytics.',
    ],
    role: 'Creator & Lead Full-Stack Engineer',
    year: '2024 - 2025',
    timeline: '6 Months (Iterative Production)',
    architectureNotes: [
      'Stateless micro-endpoints with cryptographic JWT session validation',
      'Optimistic client updates with indexed offline cache fallback',
      'Sub-200ms streaming LLM fiscal health reports powered by Groq',
    ],
    metrics: [
      { label: 'Ledger Consistency', value: '99.9%', detail: 'Zero audit drift across reconciliations' },
      { label: 'Fiscal AI Latency', value: '<180ms', detail: 'Real-time contextual advisory via Groq' },
      { label: 'Document Export', value: '0.4s', detail: 'Instant client-side PDF invoice generation' },
    ],
    stack: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'MongoDB',
      'Tailwind CSS',
      'Groq AI',
      'JWT Auth',
      'Recharts',
    ],
    liveUrl: 'https://github.com/Dhruv-Savaliya/Portfolio',
    githubUrl: 'https://github.com/Dhruv-Savaliya',
    featuredDemoType: 'finance-ledger',
  },
  {
    id: 'clearclaim',
    chapter: '02',
    title: 'CLEARCLAIM',
    subtitle: 'Enterprise Health Insurance Claim Pipeline & Fraud Detection',
    summary:
      'Distributed healthcare insurance claim processing system with automated fraud probability scoring, clinical policy compliance checks, and multi-tenant audit logs.',
    description: [
      'Eliminated manual claim verification bottlenecks by engineering an asynchronous evaluation pipeline that cross-references diagnostic codes against policy exclusions in milliseconds.',
      'Designed role-based operational dashboards for claims adjudicators, hospital providers, and compliance officers with tamper-evident audit trails and automated settlement escrow.',
    ],
    role: 'System Architect & Backend Engineer',
    year: '2024',
    timeline: '4 Months',
    architectureNotes: [
      'Multi-tenant PostgreSQL schema isolation with row-level security',
      'Vector similarity pipeline flagging duplicate or inflated billings',
      'FHIR standard compliance for seamless hospital data exchange',
    ],
    metrics: [
      { label: 'Verification Speedup', value: '84%', detail: 'Reduction in manual adjudication time' },
      { label: 'Anomaly Precision', value: '94.2%', detail: 'Flagged fraudulent claims before payout' },
      { label: 'Audit Integrity', value: '100%', detail: 'Cryptographically hashed event journal' },
    ],
    stack: [
      'React 19',
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'Prisma ORM',
      'Python Microservice',
      'Docker',
      'Tailwind CSS',
    ],
    liveUrl: 'https://github.com/Dhruv-Savaliya',
    githubUrl: 'https://github.com/Dhruv-Savaliya',
    featuredDemoType: 'claim-pipeline',
  },
  {
    id: 'smartreceipt',
    chapter: '03',
    title: 'SMART RECEIPT OCR',
    subtitle: 'Edge-Accelerated AI Document Parsing & Expense Categorization',
    summary:
      'Client-side optical intelligence tool translating complex unformatted receipts and invoices into structured financial records with zero server data retention.',
    description: [
      'Engineered an edge-first computer vision and multimodal LLM pipeline extracting line-item prices, GST/sales taxes, vendor metadata, and payment methods from camera captures or PDF uploads.',
      'Implemented real-time canvas bounding box verification allowing users to visually inspect and correct detected coordinates with instant recalculations.',
    ],
    role: 'AI & Creative Frontend Engineer',
    year: '2024',
    timeline: '3 Months',
    architectureNotes: [
      'Web Workers running background image preprocessing and thresholding',
      'Gemini 2.0 Flash multimodal structuring with strict JSON schema parsing',
      'Client-side currency conversion cache with real-time foreign exchange feeds',
    ],
    metrics: [
      { label: 'Field Accuracy', value: '96.8%', detail: 'Accurate taxonomy on noisy receipt captures' },
      { label: 'Edge Parse Time', value: '1.2s', detail: 'From raw snap to verified structured record' },
      { label: 'Privacy Guarantee', value: 'Zero-Trace', detail: 'No sensitive receipt data persisted on server' },
    ],
    stack: [
      'React 19',
      'TypeScript',
      'Gemini Flash SDK',
      'Web Workers',
      'Canvas 2D API',
      'Tailwind CSS',
      'Motion',
    ],
    liveUrl: 'https://github.com/Dhruv-Savaliya',
    githubUrl: 'https://github.com/Dhruv-Savaliya',
    featuredDemoType: 'receipt-scanner',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Full-Stack Software Engineer',
    company: 'Independent Engineering & SaaS Building',
    location: 'Surat, India',
    period: '2023 - Present',
    type: 'Product Engineering',
    summary:
      'Designing and shipping end-to-end cloud products, interactive WebGL interfaces, and intelligent automated workflows with extreme craft.',
    keyContributions: [
      'Conceived and deployed BizDhan, scaling multi-tenant financial SaaS tools for businesses',
      'Pioneered AI-integrated developer tools leveraging Gemini Flash, Groq, and custom multimodal parsing pipelines',
      'Constructed award-level 3D web experiences using Three.js, GSAP, and cinematic motion design',
    ],
    technologies: ['React 19', 'Next.js', 'TypeScript', 'Node.js', 'Three.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'exp-2',
    role: 'Creative Web & Systems Developer',
    company: 'Contract & High-Impact Systems',
    location: 'Remote',
    period: '2022 - 2023',
    type: 'Full-Stack Development',
    summary:
      'Specialized in architecting high-performance client applications, database modeling, and fluid interactive user interfaces.',
    keyContributions: [
      'Engineered automated claim intake portals and regulatory compliant workflows',
      'Optimized Core Web Vitals to sub-1.2s LCP on heavy client-side applications',
      'Implemented responsive design systems with mathematically balanced spatial rhythms and accessible glassmorphism',
    ],
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Docker', 'Express', 'Prisma', 'RESTful APIs'],
  },
];

export const TECHNOLOGIES: TechnologyCategory[] = [
  {
    id: 'frontend',
    category: 'Frontend & Interactive',
    description: 'High-framerate, fluid reactive user interfaces built on modern component architectures.',
    skills: [
      { name: 'React 19 / Next.js 15', level: 'Expert', experience: '3+ Years', focus: 'Server components, hooks, concurrent rendering' },
      { name: 'TypeScript', level: 'Advanced', experience: '3+ Years', focus: 'Strict typing, generic systems, interfaces' },
      { name: 'Tailwind CSS & Glassmorphism', level: 'Expert', experience: '3+ Years', focus: 'Mathematical spacing, custom tokens, blur filters' },
      { name: 'Three.js & WebGL', level: 'Proficient', experience: '2 Years', focus: 'Procedural geometries, GLSL shaders, camera choreography' },
      { name: 'GSAP & Motion', level: 'Advanced', experience: '2+ Years', focus: 'Timeline sequencing, ScrollTrigger, spring physics' },
    ],
  },
  {
    id: 'backend',
    category: 'Backend & Systems',
    description: 'Scalable API architectures, distributed state, and fault-tolerant data storage.',
    skills: [
      { name: 'Node.js & Express', level: 'Advanced', experience: '3+ Years', focus: 'Asynchronous event loops, REST APIs, middleware' },
      { name: 'MongoDB & Mongoose', level: 'Advanced', experience: '2+ Years', focus: 'Aggregation pipelines, indexing, schema design' },
      { name: 'PostgreSQL & Prisma', level: 'Proficient', experience: '2 Years', focus: 'Relational modeling, migrations, query optimization' },
      { name: 'JWT & Security', level: 'Advanced', experience: '2+ Years', focus: 'Stateless sessions, CSRF protection, RBAC validation' },
      { name: 'Python & FastAPI', level: 'Proficient', experience: '1.5 Years', focus: 'Data processing microservices, anomaly pipelines' },
    ],
  },
  {
    id: 'ai-tools',
    category: 'AI, Data & Cloud',
    description: 'Practical generative AI integration, computer vision, and cloud deployment.',
    skills: [
      { name: 'Gemini API & Groq AI', level: 'Advanced', experience: '2 Years', focus: 'Multimodal vision, function calling, streaming inference' },
      { name: 'Document OCR & Computer Vision', level: 'Proficient', experience: '1.5 Years', focus: 'Bounding box parsing, thresholding, structured outputs' },
      { name: 'Docker & Containerization', level: 'Proficient', experience: '2 Years', focus: 'Multi-stage builds, container isolation, Cloud Run' },
      { name: 'Git & CI/CD Pipelines', level: 'Advanced', experience: '3+ Years', focus: 'Trunk development, automated testing, Vercel deployments' },
    ],
  },
];
