# Dhruv Savaliya — Cinematic Portfolio Website

A premium, award-level interactive developer portfolio built as one continuous cinematic experience.

## Vision Summary

> "CODE → DATA → AI → INTERACTION"

The site tells Dhruv's story through a single **Digital Core** 3D object that morphs across every section — from a crystalline geometric form in the hero, to a financial data network in BizDhan, to a multi-tenant architecture in ClearClaim, to an AI pipeline in Smart Receipt OCR, finally collapsing into the "D" letterform in the footer.

---

## User Review Required

> [!IMPORTANT]
> **Project Directory**: All code will be created in `f:\Dhurv\`. The Next.js app will be initialized there directly.

> [!WARNING]
> **Build Time**: This is an 18-phase project. I will execute phases sequentially, verifying each before proceeding. Expect this to take multiple turns. I'll report progress at each phase milestone.

> [!IMPORTANT]
> **Content Clarifications (answers assumed)**:
> - Email for contact: `dhruvsavaliya001@gmail.com` (placeholder — update if different)
> - GitHub: `github.com/dhruvsavaliya` (placeholder — update if different)
> - LinkedIn: `linkedin.com/in/dhruvsavaliya` (placeholder — update if different)
> - BizDhan live demo URL: placeholder until provided
> - ClearClaim live demo URL: placeholder until provided

---

## Architecture Overview

```
f:\Dhurv\
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Main experience page
│   └── globals.css         # Global styles
├── components/
│   ├── three/              # All WebGL/3D components
│   │   ├── Experience.tsx
│   │   ├── DigitalCore.tsx
│   │   ├── HeroScene.tsx
│   │   ├── ProjectScene.tsx
│   │   ├── ReceiptScene.tsx
│   │   └── FooterScene.tsx
│   ├── sections/           # Page sections
│   │   ├── Preloader.tsx
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Intro.tsx
│   │   ├── Work.tsx
│   │   ├── BizDhan.tsx
│   │   ├── ClearClaim.tsx
│   │   ├── SmartReceipt.tsx
│   │   ├── HowIBuild.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Technology.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── ui/                 # Reusable UI primitives
│       ├── Typography.tsx
│       ├── MagneticButton.tsx
│       ├── SoundToggle.tsx
│       └── ScrollIndicator.tsx
├── hooks/
│   ├── useLenis.ts
│   ├── useGSAP.ts
│   ├── useSound.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── store.ts            # Zustand global state
│   ├── animations.ts       # GSAP animation utilities
│   └── constants.ts        # Design tokens, magic numbers
├── public/
│   ├── fonts/
│   ├── sounds/
│   └── textures/
└── tailwind.config.ts
```

---

## Design System

### Color Palette (Original Identity)
```
Background:     #030303 (near-black, not pure)
Surface:        #0A0A0A
Accent:         #C8FF00 (electric lime — Dhruv's signature color)
Accent Alt:     #00E5FF (cyan for AI/data)
Text Primary:   #F0EDE6 (warm off-white)
Text Muted:     #555555
Border:         #1A1A1A
```

### Typography Scale
- **Display**: Space Grotesk (ultra-bold, 8–20vw for hero/intro)
- **Heading**: Space Grotesk (medium-bold)
- **Body**: Inter (clean, technical)
- **Mono**: JetBrains Mono (code/data elements)
- **Accent**: Syne (editorial labels/captions)

### Motion Principles
- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` — expo out
- Duration scale: 0.4s / 0.8s / 1.2s / 2.0s
- Stagger: 0.08s between items
- Scroll scrub: pinned sections with 150–300vh scroll distance

---

## Proposed Changes

### Phase 1 — Project Setup

#### [NEW] `f:\Dhurv\` (Next.js app)
- `npx create-next-app@latest` with TypeScript, Tailwind, App Router
- Install all dependencies

#### Key dependencies:
```json
{
  "three": "^0.170",
  "@react-three/fiber": "^8",
  "@react-three/drei": "^9",
  "@react-three/postprocessing": "^2",
  "gsap": "^3.12",
  "lenis": "^1.1",
  "@studio-freight/react-lenis": "latest",
  "zustand": "^5",
  "framer-motion": "^11",
  "howler": "^2.2"
}
```

---

### Phase 2 — Design System

#### [MODIFY] `tailwind.config.ts`
- Custom color tokens
- Custom font families
- Custom animation keyframes
- Extended spacing scale

#### [MODIFY] `app/globals.css`
- CSS custom properties
- Typography base styles
- Smooth rendering hints

---

### Phase 3 — Navigation

#### [NEW] `components/sections/Navigation.tsx`
- Fixed, minimal header
- Logo "DHRUV.S" (desktop) / "D" (mobile)
- WORK / ABOUT / CONTACT links
- Fullscreen cinematic menu overlay
- GSAP entrance/exit animations

---

### Phase 4 — Preloader

#### [NEW] `components/sections/Preloader.tsx`
- Tracks real asset loading state via Zustand
- Giant "LOADING" text
- Horizontal progress bar
- Large percentage counter
- Sound ON/OFF toggle
- Cinematic exit → dissolves into hero

---

### Phase 5 — Lenis Setup

#### [NEW] `hooks/useLenis.ts`
- Lenis smooth scroll instance
- GSAP ScrollTrigger integration (`ScrollTrigger.normalizeScroll`)
- Cleanup on unmount

---

### Phase 6 — GSAP Architecture

#### [NEW] `lib/animations.ts`
- Reusable timeline factories
- Text split/reveal animations
- Clip-path transitions
- Pinning utilities
- Magnetic effect helper

---

### Phase 7 — Digital Core (3D)

#### [NEW] `components/three/DigitalCore.tsx`
- IcosahedronGeometry base
- Custom GLSL vertex/fragment shader for energy field
- Wireframe overlay with animated edges
- Floating particles around the core
- Morph targets for section transforms:
  - `idle` → crystalline geometric form
  - `bizdhan` → financial network/chart nodes
  - `clearclaim` → multi-node network graph
  - `receipt` → scanning laser + data pipeline
  - `footer` → collapses to "D" letterform
- Mouse parallax response
- Scroll-linked rotation

#### [NEW] `components/three/Experience.tsx`
- R3F Canvas wrapper
- Camera setup (responsive FOV)
- Post-processing (bloom, chromatic aberration, vignette)
- Suspense boundary with fallback
- DPR management (mobile optimization)

---

### Phase 8 — Hero

#### [NEW] `components/sections/Hero.tsx`
- Full viewport canvas with Digital Core
- Giant split typography "DHRUV / SAVALIYA"
- "FULL-STACK DEVELOPER" label
- Supporting statement
- Metadata tags (SURAT / INDIA, FULL-STACK / AI / 3D)
- SCROLL TO EXPLORE ↓ indicator
- GSAP entrance after preloader exit

---

### Phase 9 — BizDhan Chapter

#### [NEW] `components/sections/BizDhan.tsx`
- Pinned scroll section (~300vh)
- Core transforms → financial network
- Animated dashboard mockup (canvas-drawn charts)
- Tech stack tags
- LIVE DEMO / GITHUB CTAs

---

### Phase 10 — ClearClaim Chapter

#### [NEW] `components/sections/ClearClaim.tsx`
- Pinned scroll section (~300vh)
- "35 ISSUES IDENTIFIED" counter animation
- Security audit → remediation → secure system flow
- Network diagram of tenants/roles
- RBAC badge highlights

---

### Phase 11 — Smart Receipt Chapter

#### [NEW] `components/sections/SmartReceipt.tsx`
- Cinematic receipt scanning sequence
- OCR bounding box animation
- Text extraction flow
- JSON output reveal
- AI pipeline step indicators

---

### Phase 12 — About / Experience / Stack

#### [NEW] `components/sections/About.tsx` — Editorial personal statement
#### [NEW] `components/sections/Experience.tsx` — Elegant timeline
#### [NEW] `components/sections/Technology.tsx` — Interactive skill constellation

---

### Phase 13 — Contact / Footer

#### [NEW] `components/sections/Contact.tsx` — Magnetic CTA, large typography
#### [NEW] `components/sections/Footer.tsx` — Core collapses to "D" mark

---

### Phase 14 — Sound System

#### [NEW] `lib/soundSystem.ts` + `hooks/useSound.ts`
- Howler.js powered
- UI click sounds
- Transition swooshes
- Subtle ambient hum (optional, user-controlled)
- Default OFF

---

### Phases 15–18 — Polish, Mobile, A11y, SEO
- Mobile-specific reduced-3D experience
- `prefers-reduced-motion` support
- Semantic HTML / ARIA labels
- Full OpenGraph / Twitter metadata
- Sitemap + robots.txt

---

## Zustand Store Shape

```typescript
interface ExperienceStore {
  loadingProgress: number;       // 0–100
  soundEnabled: boolean;         // false by default
  currentSection: string;        // 'hero' | 'bizdhan' | ...
  currentProject: string | null;
  menuOpen: boolean;
  webglReady: boolean;
  scrollProgress: number;        // 0–1
}
```

---

## Digital Core — Shader Concept

The core uses a custom shader with:
- **Vertex displacement**: sine-wave energy pulses
- **Fragment gradient**: dark center → electric lime edges
- **Wireframe overlay**: instanced line segments
- **Particle system**: ~500 floating points
- **Morph animation**: GSAP-driven uniform lerping between states

---

## Verification Plan

### After Each Phase
- `npm run dev` — check for console errors
- Check animations in Chrome DevTools
- Test at 1440px and 390px viewport
- Verify no memory leaks in WebGL

### Final Checklist
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, SEO)
- [ ] No layout shift on load
- [ ] Smooth 60fps scrolling
- [ ] Mobile experience functional
- [ ] Sound system defaults to OFF
- [ ] All links/CTAs functional
- [ ] Keyboard navigation complete
- [ ] OpenGraph preview renders correctly

---

## Open Questions

> [!IMPORTANT]
> Please confirm or correct the following before I proceed:
> 1. **Contact email**: Is `dhruvsavaliya001@gmail.com` correct?
> 2. **GitHub username**: `dhruvsavaliya` or different?
> 3. **LinkedIn URL**: Confirm the exact URL.
> 4. **Live demo URLs** for BizDhan and ClearClaim (or leave as placeholders)?
> 5. **Project location**: Should I initialize the Next.js app directly in `f:\Dhurv\`, replacing current content, or create a subdirectory like `f:\Dhurv\portfolio\`?
> 6. **Sounds**: Do you have any audio files, or should I use programmatic Web Audio API tones only?
