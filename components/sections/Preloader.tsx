'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ============================================================================
// PROCEDURAL SHADERS FOR CELESTIAL EARTH SPHERE
// ============================================================================
const EarthVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EarthFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec3 viewDir = normalize(-vPosition);
    vec3 normal = normalize(vNormal);

    vec3 sphereCoord = vPosition * 0.45;
    float n1 = snoise(sphereCoord * 1.8 + vec3(0.0, uTime * 0.02, 0.0));
    float n2 = snoise(sphereCoord * 4.2 - vec3(uTime * 0.01, 0.0, 0.0)) * 0.5;
    float n3 = snoise(sphereCoord * 9.5) * 0.25;
    float terrain = n1 + n2 + n3;

    float latLines = step(0.96, sin(vUv.y * 3.14159265 * 36.0));
    float longLines = step(0.96, sin(vUv.x * 3.14159265 * 48.0));
    float grid = max(latLines, longLines) * 0.25;

    vec3 sunDir = normalize(vec3(-0.9, 0.65, 0.75));
    float NdotL = dot(normal, sunDir);
    float diffuse = clamp(NdotL, 0.0, 1.0);

    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

    float nightMask = smoothstep(0.15, -0.4, NdotL);
    float cityNodes = step(0.72, snoise(sphereCoord * 14.0)) * step(0.1, terrain);
    vec3 cityGlow = vec3(0.55, 0.75, 1.0) * cityNodes * nightMask * 1.6;

    vec3 oceanColor = vec3(0.04, 0.06, 0.09);
    vec3 landColor = vec3(0.16, 0.18, 0.22);
    if (terrain > 0.05) {
      oceanColor = mix(oceanColor, landColor, smoothstep(0.05, 0.25, terrain));
    }

    vec3 litSurface = oceanColor * (0.08 + diffuse * 0.85);
    vec3 rimAtmosphere = vec3(0.48, 0.68, 0.95) * fresnel * (0.4 + diffuse * 1.4);
    vec3 hudGridColor = vec3(0.4, 0.6, 0.9) * grid * (0.3 + diffuse * 0.7);

    vec3 finalColor = litSurface + rimAtmosphere + cityGlow + hudGridColor;

    float alpha = smoothstep(-0.2, 0.15, dot(viewDir, normal));
    gl_FragColor = vec4(finalColor, min(1.0, alpha + fresnel * 0.8));
  }
`;

const AtmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AtmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    vec3 normal = normalize(vNormal);
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.2);
    vec3 atmosphereColor = vec3(0.42, 0.65, 0.98);
    gl_FragColor = vec4(atmosphereColor, fresnel * 0.65);
  }
`;

// ============================================================================
// SOUND WAVE TOGGLE COMPONENT
// ============================================================================
function SoundIndicator() {
  const soundEnabled = useExperienceStore((s) => s.soundEnabled);
  const toggleSound = useExperienceStore((s) => s.toggleSound);
  const { play } = useSound();

  return (
    <button
      onClick={() => {
        toggleSound();
        play('click');
      }}
      className="flex items-center gap-2 group cursor-pointer font-mono text-[11px] tracking-wider text-white/60 hover:text-white transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-blue focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
      aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
      aria-pressed={soundEnabled}
    >
      <div className="flex items-center gap-[2.5px] h-3.5 px-1">
        {[0.4, 0.8, 1.0, 0.6, 0.9, 0.5].map((h, i) => (
          <span
            key={i}
            className={`w-[1.5px] bg-white/70 transition-all duration-300 ${
              soundEnabled ? 'animate-pulse' : 'opacity-30'
            }`}
            style={{
              height: soundEnabled ? `${h * 100}%` : '3px',
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>
      <span className="tracking-widest">
        SOUND {soundEnabled ? 'ON' : 'OFF'}
      </span>
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          soundEnabled ? 'bg-ds-signal shadow-[0_0_8px_#B8FF5A]' : 'bg-white/30'
        }`}
      />
    </button>
  );
}

// ============================================================================
// HUD GLYPHS (BOTTOM-LEFT 4 TACTICAL RETICLE ICONS)
// ============================================================================
function HudGlyphs() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* 01: Concentric Dial */}
      <div className="relative w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border border-dashed border-white/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
      </div>
      {/* 02: Geodesic Globe */}
      <div className="relative w-7 h-7 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0.5 border border-white/30 rounded-full" />
        <div className="w-full h-px bg-white/30 absolute" />
        <div className="w-px h-full bg-white/30 absolute" />
        <div className="w-3.5 h-3.5 rounded-full border border-white/50" />
      </div>
      {/* 03: Crosshair Radar */}
      <div className="relative w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
        <div className="absolute top-0 bottom-0 w-px bg-white/40" />
        <div className="absolute left-0 right-0 h-px bg-white/40" />
        <div className="w-3 h-3 rounded-full border border-white/60" />
      </div>
      {/* 04: Polygon Node Tracker */}
      <div className="relative w-7 h-7 border border-white/20 flex items-center justify-center rotate-45">
        <div className="w-3.5 h-3.5 border border-white/40 rotate-45 animate-spin" style={{ animationDuration: '14s' }} />
        <div className="w-1 h-1 bg-ds-blue-highlight" />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PRELOADER — WITH CINEMATIC GSAP EXIT
// ============================================================================
interface PreloaderProps {
  onComplete: () => void;
  /** Called when exit timeline starts — allows hero to begin mounting early */
  onTransitionStart?: () => void;
}

export default function Preloader({ onComplete, onTransitionStart }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const loadingLabelRef = useRef<HTMLParagraphElement>(null);
  const percentDisplayRef = useRef<HTMLDivElement>(null);
  const hudTopRef = useRef<HTMLDivElement>(null);
  const hudBottomRef = useRef<HTMLDivElement>(null);
  const hudCenterRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  const [displayProgress, setDisplayProgress] = useState(0);
  const [activePopupIndex, setActivePopupIndex] = useState(0);
  const targetProgressRef = useRef(15);
  const exitStartedRef = useRef(false);
  const { play } = useSound();
  const prefersReducedMotion = useReducedMotion();

  // Marvel Iron Man Tactical Telemetry Popups
  const popups = useMemo(
    () => [
      { code: 'MK-85 // CORE INITIALIZED', loc: 'ORBITAL TRAJECTORY: STABLE' },
      { code: 'GEO_POS: 21.1702°N, 72.8311°E', loc: 'SURAT GROUND STATION LINK' },
      { code: 'NEURAL LINK: ESTABLISHED', loc: 'DATA LATENCY: < 1.4MS' },
      { code: 'QUANTUM BUFFER: 100% SYNC', loc: 'SHADERS COMPILED' },
      { code: 'RENDER TARGET: THREE.JS 3D', loc: 'DIGITAL CORE FLIGHT READY' },
    ],
    []
  );

  // Cycling telemetry popup
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePopupIndex((prev) => (prev + 1) % popups.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [popups.length]);

  // Genuine asset readiness sequence
  useEffect(() => {
    let isMounted = true;

    async function runReadiness() {
      // 1. Fonts readiness
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
        if (!isMounted) return;
        targetProgressRef.current = Math.max(targetProgressRef.current, 45);
      }

      // 2. Short delay for dramatic boot sequence
      await new Promise((res) => setTimeout(res, 350));
      if (!isMounted) return;
      targetProgressRef.current = Math.max(targetProgressRef.current, 72);

      // 3. Document ready state
      if (document.readyState !== 'complete') {
        await new Promise((res) => {
          window.addEventListener('load', res, { once: true });
        });
      }

      await new Promise((res) => setTimeout(res, 400));
      if (!isMounted) return;
      targetProgressRef.current = 100;
    }

    runReadiness();
    return () => { isMounted = false; };
  }, []);

  // ── CINEMATIC EXIT TIMELINE ──────────────────────────────────────────────
  const triggerCinematicExit = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    play('transition');

    // Notify parent so hero can begin mounting beneath us
    onTransitionStart?.();

    if (prefersReducedMotion) {
      // Reduced motion: simple fade, no flourish
      if (containerRef.current) {
        containerRef.current.style.transition = 'opacity 0.4s ease-out';
        containerRef.current.style.opacity = '0';
      }
      setTimeout(onComplete, 450);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // ── Step 1: Collapse peripheral HUD elements (0.0 → 0.35s)
    tl.to(
      [hudTopRef.current, hudBottomRef.current, popupRef.current, svgOverlayRef.current],
      {
        opacity: 0,
        y: -8,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.in',
      },
      0
    );

    // ── Step 2: Collapse center HUD readouts but keep bar & percent (0.1 → 0.45s)
    tl.to(
      hudCenterRef.current?.querySelectorAll(
        '.hud-radar, .hud-popup, .hud-telemetry'
      ) ?? [],
      {
        opacity: 0,
        scale: 0.96,
        duration: 0.3,
        ease: 'power2.in',
      },
      0.1
    );

    // ── Step 3: "LOADING" label morphs → scale up then fade (0.2 → 0.55s)
    tl.to(
      loadingLabelRef.current,
      {
        letterSpacing: '0.6em',
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
      },
      0.2
    );

    // ── Step 4: Percent counter completes and fades (0.3 → 0.6s)
    tl.to(
      percentDisplayRef.current,
      {
        scale: 1.08,
        opacity: 0,
        duration: 0.35,
        ease: 'expo.out',
      },
      0.3
    );

    // ── Step 5: Progress bar expands full-width then becomes a horizontal rule (0.4 → 0.9s)
    tl.to(
      progressBarFillRef.current,
      {
        width: '100%',
        duration: 0.3,
        ease: 'power2.inOut',
      },
      0.4
    ).to(
      progressBarRef.current,
      {
        scaleY: 0.3,
        duration: 0.25,
        ease: 'power2.in',
      },
      0.55
    );

    // ── Step 6: The line glows electric blue then shoots upward (0.7 → 1.05s)
    tl.to(
      progressBarRef.current,
      {
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 0.4,
        ease: 'expo.inOut',
      },
      0.7
    );

    // ── Step 7: Entire container fades out (0.8 → 1.1s)
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      0.8
    );
  }, [onComplete, onTransitionStart, play, prefersReducedMotion]);

  // Smooth progress count-up RAF loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      setDisplayProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) * 0.09));
          const next = Math.min(target, prev + step);
          if (next >= 100 && prev < 100) {
            // Trigger cinematic exit after a brief hold at 100%
            setTimeout(triggerCinematicExit, 500);
          }
          return next;
        }
        return prev;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [triggerCinematicExit]);

  // Three.js Earth / Celestial Rotating Sphere
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const updatePlanetPlacement = () => {
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect > 1.2) {
        planetGroup.position.set(aspect * 3.4, -0.2, 0);
        planetGroup.scale.set(1.0, 1.0, 1.0);
      } else {
        planetGroup.position.set(aspect * 2.2, -0.6, -1.5);
        planetGroup.scale.set(0.85, 0.85, 0.85);
      }
    };
    updatePlanetPlacement();

    // Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(3.6, 64, 64);
    const earthUniforms = { uTime: { value: 0 } };
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: EarthVertexShader,
      fragmentShader: EarthFragmentShader,
      uniforms: earthUniforms,
      transparent: true,
      blending: THREE.NormalBlending,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    planetGroup.add(earthMesh);

    // Atmospheric Glow
    const atmoGeometry = new THREE.SphereGeometry(3.78, 48, 48);
    const atmoMaterial = new THREE.ShaderMaterial({
      vertexShader: AtmosphereVertexShader,
      fragmentShader: AtmosphereFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    planetGroup.add(new THREE.Mesh(atmoGeometry, atmoMaterial));

    // Orbital Ring
    const ringGeometry = new THREE.RingGeometry(4.3, 4.34, 96);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x7ea2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.45;
    ringMesh.rotation.y = Math.PI * 0.15;
    planetGroup.add(ringMesh);

    // Satellite Beacon
    const satGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const satMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellite = new THREE.Mesh(satGeometry, satMaterial);
    planetGroup.add(satellite);

    // Starfield
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 35;
      starPositions[i + 1] = (Math.random() - 0.5) * 25;
      starPositions[i + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x9aa4b2,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updatePlanetPlacement();
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      earthMesh.rotation.y = elapsed * 0.08;
      earthMesh.rotation.x = 0.12;
      earthUniforms.uTime.value = elapsed;

      const orbitAngle = elapsed * 0.8;
      satellite.position.set(
        Math.cos(orbitAngle) * 4.32,
        Math.sin(orbitAngle) * 1.2,
        Math.sin(orbitAngle) * 3.4
      );

      planetGroup.rotation.y = mouseX * 0.5;
      planetGroup.rotation.x = -mouseY * 0.5;

      renderer?.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmoGeometry.dispose();
      atmoMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      satGeometry.dispose();
      satMaterial.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer?.dispose();
    };
  }, []);

  // Sub-telemetry percentages derived from overall progress
  const fontProgress    = Math.min(100, Math.round(displayProgress * 1.15));
  const imageProgress   = Math.min(100, Math.round(displayProgress * 1.08));
  const assets3dProgress = Math.min(100, Math.round(displayProgress * 0.95));
  const textureProgress = Math.min(100, Math.round(displayProgress * 0.92));
  const webglProgress   = Math.min(100, Math.round(displayProgress * 0.88));
  const appAssetsProgress = Math.min(100, Math.round(displayProgress * 0.85));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#050608] text-[#E8ECF2] overflow-hidden select-none flex flex-col justify-between p-[4vw] md:p-[3.5vw] font-mono"
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading Dhruv Savaliya's portfolio experience"
    >
      {/* Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* SVG Orbital Trajectory Overlay */}
      <svg
        ref={svgOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M -100,280 Q 700,-50 1700,260"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <path
          d="M 50,850 L 1400,-100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
        />
        <circle r="3.5" fill="#7EA2FF" className="animate-pulse">
          <animateMotion path="M -100,280 Q 700,-50 1700,260" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#FFFFFF">
          <animateMotion path="M -100,280 Q 700,-50 1700,260" dur="9s" begin="-4.5s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#B8FF5A">
          <animateMotion path="M 50,850 L 1400,-100" dur="7s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Grid crosshair markers */}
      <div className="absolute top-[16%] left-[6%] text-white/20 text-xs select-none pointer-events-none">+</div>
      <div className="absolute top-[22%] right-[10%] text-white/20 text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-[28%] left-[12%] text-white/20 text-xs select-none pointer-events-none">+</div>

      {/* ── TOP RIGHT: SOUND TOGGLE ────────────────────────────────── */}
      <div ref={hudTopRef} className="absolute top-8 right-8 z-20 flex items-center gap-6">
        <SoundIndicator />
      </div>

      {/* ── CENTER LEFT: LOADING HUD ───────────────────────────────── */}
      <div
        ref={hudCenterRef}
        className="relative z-20 h-full flex flex-col justify-center items-start pl-[5vw] lg:pl-[8vw] w-full max-w-2xl"
      >
        <div className="flex flex-col gap-2">
          {/* Small top text */}
          <p className="text-[10px] md:text-xs tracking-[0.25em] text-white/50 uppercase mb-2">
            INITIALIZING SYSTEMS
          </p>
          
          {/* Main LOADING text */}
          <p
            ref={loadingLabelRef}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-widest text-white uppercase"
          >
            LOADING
          </p>

          {/* Percentage */}
          <div
            ref={percentDisplayRef}
            className="text-3xl md:text-5xl font-mono text-white/90 mt-2 mb-4"
            aria-live="polite"
            aria-atomic="true"
          >
            {displayProgress}%
          </div>

          {/* Progress Bar */}
          <div ref={progressBarRef} className="w-64 md:w-80 h-[2px] bg-white/10 mb-8 relative rounded-full overflow-hidden">
            <div
              ref={progressBarFillRef}
              className="absolute top-0 left-0 bottom-0 bg-ds-blue shadow-[0_0_15px_#356DFF] transition-all duration-200 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Details List */}
          <div className="flex flex-col gap-2 text-[10px] md:text-xs font-mono text-white/60 tracking-wider">
            <div className="flex items-center gap-4 w-64 md:w-80">
              <span className="w-44 text-white/80">&gt; LOADING FONTS</span>
              <span className="flex-1 text-right">{fontProgress}%</span>
            </div>
            <div className="flex items-center gap-4 w-64 md:w-80">
              <span className="w-44 text-white/80">&gt; LOADING 3D MODELS</span>
              <span className="flex-1 text-right">{assets3dProgress}%</span>
            </div>
            <div className="flex items-center gap-4 w-64 md:w-80">
              <span className="w-44 text-white/80">&gt; LOADING TEXTURES</span>
              <span className="flex-1 text-right">{textureProgress}%</span>
            </div>
            <div className="flex items-center gap-4 w-64 md:w-80">
              <span className="w-44 text-white/80">&gt; INITIALIZING WEBGL</span>
              <span className="flex-1 text-right">{webglProgress}%</span>
            </div>
            <div className="flex items-center gap-4 w-64 md:w-80">
              <span className="w-44 text-white/80">&gt; FINALIZING SCENE</span>
              <span className="flex-1 text-right">{displayProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
