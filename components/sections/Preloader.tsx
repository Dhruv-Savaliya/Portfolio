'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useExperienceStore } from '@/lib/store';
import { useSound } from '@/hooks/useSound';

// ============================================================================
// PROCEDURAL SHADERS FOR MARVEL IRON MAN / CELESTIAL EARTH SPHERE
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

  // Simplex-like procedural 3D noise for continental landmasses
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

    // Continental multi-octave FBM terrain map
    vec3 sphereCoord = vPosition * 0.45;
    float n1 = snoise(sphereCoord * 1.8 + vec3(0.0, uTime * 0.02, 0.0));
    float n2 = snoise(sphereCoord * 4.2 - vec3(uTime * 0.01, 0.0, 0.0)) * 0.5;
    float n3 = snoise(sphereCoord * 9.5) * 0.25;
    float terrain = n1 + n2 + n3;

    // Technical latitude/longitude holographic coordinate lines
    float latLines = step(0.96, sin(vUv.y * 3.14159265 * 36.0));
    float longLines = step(0.96, sin(vUv.x * 3.14159265 * 48.0));
    float grid = max(latLines, longLines) * 0.25;

    // Directional sunlight coming from top-left
    vec3 sunDir = normalize(vec3(-0.9, 0.65, 0.75));
    float NdotL = dot(normal, sunDir);
    float diffuse = clamp(NdotL, 0.0, 1.0);

    // Fresnel atmospheric rim illumination
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

    // Night side city light grid & data cluster glow
    float nightMask = smoothstep(0.15, -0.4, NdotL);
    float cityNodes = step(0.72, snoise(sphereCoord * 14.0)) * step(0.1, terrain);
    vec3 cityGlow = vec3(0.55, 0.75, 1.0) * cityNodes * nightMask * 1.6;

    // Base color tones: Dark celestial deep space ocean & crisp lunar landmasses
    vec3 oceanColor = vec3(0.04, 0.06, 0.09);
    vec3 landColor = vec3(0.16, 0.18, 0.22);
    if (terrain > 0.05) {
      oceanColor = mix(oceanColor, landColor, smoothstep(0.05, 0.25, terrain));
    }

    // Color assembly
    vec3 litSurface = oceanColor * (0.08 + diffuse * 0.85);
    vec3 rimAtmosphere = vec3(0.48, 0.68, 0.95) * fresnel * (0.4 + diffuse * 1.4);
    vec3 hudGridColor = vec3(0.4, 0.6, 0.9) * grid * (0.3 + diffuse * 0.7);

    vec3 finalColor = litSurface + rimAtmosphere + cityGlow + hudGridColor;

    // Subtle edge fade to merge seamlessly into cosmic background
    float alpha = smoothstep(-0.2, 0.15, dot(viewDir, normal));
    gl_FragColor = vec4(finalColor, min(1.0, alpha + fresnel * 0.8));
  }
`;

// Atmosphere outer halo shader
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
      className="flex items-center gap-2 group cursor-pointer font-mono text-[11px] tracking-wider text-white/60 hover:text-white transition-colors select-none focus:outline-none"
      aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
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
      {/* 01: Concentric Dial with rotating tick */}
      <div className="relative w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border border-dashed border-white/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
      </div>

      {/* 02: Geodesic Globe Wireframe */}
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
// MAIN MARVEL IRON MAN HUD PRELOADER
// ============================================================================
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [activePopupIndex, setActivePopupIndex] = useState(0);
  const targetProgressRef = useRef(15);
  const { play } = useSound();

  // Marvel Iron Man Tactical Telemetry Popups
  const popups = useMemo(
    () => [
      { code: 'MK-85 // CORE INITIALIZED', loc: 'ORBITAL TRAJECTORY: STABLE' },
      { code: 'GEO_POS: 21.1702°N, 72.8311°E', loc: 'SURAT GROUND STATION LINK' },
      { code: 'NEURAL LINK: ESTABLISHED', loc: 'DATA LATENCY: < 1.4MS' },
      { code: 'QUANTUM BUFFER: 100% SYNC', loc: 'SHADERS COMPILED' },
      { code: 'RENDER TARGET: THREE.JS 3D', loc: 'IRON MAN HUD FLIGHT READY' },
    ],
    []
  );

  // Cycling telemetry popup marker
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

      // 2. Short synthetic delay for dramatic Iron Man boot sequence
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

    return () => {
      isMounted = false;
    };
  }, []);

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
            // Iron Man HUD Launch sequence
            setTimeout(() => {
              play('transition');
              setIsExiting(true);
              setTimeout(onComplete, 850);
            }, 500);
          }
          return next;
        }
        return prev;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onComplete, play]);

  // Three.js Earth / Celestial Rotating Sphere Implementation
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

    // Group for planet and orbital satellite rings
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Initial position on right edge matching user's image
    const updatePlanetPlacement = () => {
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect > 1.2) {
        // Desktop / wide screens: emerge gracefully on the right
        planetGroup.position.set(aspect * 3.4, -0.2, 0);
        planetGroup.scale.set(1.0, 1.0, 1.0);
      } else {
        // Mobile screens: placed centered or lower-right
        planetGroup.position.set(aspect * 2.2, -0.6, -1.5);
        planetGroup.scale.set(0.85, 0.85, 0.85);
      }
    };
    updatePlanetPlacement();

    // 1. Earth Sphere Core (Procedural Shader)
    const earthGeometry = new THREE.SphereGeometry(3.6, 64, 64);
    const earthUniforms = {
      uTime: { value: 0 },
    };
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: EarthVertexShader,
      fragmentShader: EarthFragmentShader,
      uniforms: earthUniforms,
      transparent: true,
      blending: THREE.NormalBlending,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    planetGroup.add(earthMesh);

    // 2. Outer Atmospheric Glow Shell
    const atmoGeometry = new THREE.SphereGeometry(3.78, 48, 48);
    const atmoMaterial = new THREE.ShaderMaterial({
      vertexShader: AtmosphereVertexShader,
      fragmentShader: AtmosphereFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    planetGroup.add(atmoMesh);

    // 3. Orbital Satellite Ring Trajectory
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

    // 4. Moving Orbital Satellite Beacon
    const satGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const satMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellite = new THREE.Mesh(satGeometry, satMaterial);
    planetGroup.add(satellite);

    // 5. Starfield & Cosmic Particle Dust in the deep background
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
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Mouse parallax tracking (Iron Man helmet interactive feedback)
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize handler
    const onResize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updatePlanetPlacement();
    };
    window.addEventListener('resize', onResize);

    // Render loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Rotate planet on its technical axis
      earthMesh.rotation.y = elapsed * 0.08;
      earthMesh.rotation.x = 0.12;

      // Update procedural landmass evolution & atmosphere
      earthUniforms.uTime.value = elapsed;

      // Orbit satellite along the inclined ring
      const orbitAngle = elapsed * 0.8;
      satellite.position.set(
        Math.cos(orbitAngle) * 4.32,
        Math.sin(orbitAngle) * 1.2,
        Math.sin(orbitAngle) * 3.4
      );

      // Mouse parallax easing
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

  // Formatted sub-telemetry items based on overall progress
  const fontProgress = Math.min(100, Math.round(displayProgress * 1.15));
  const imageProgress = Math.min(100, Math.round(displayProgress * 1.08));
  const assets3dProgress = Math.min(100, Math.round(displayProgress * 0.95));
  const textureProgress = Math.min(100, Math.round(displayProgress * 0.92));
  const webglProgress = Math.min(100, Math.round(displayProgress * 0.88));
  const appAssetsProgress = Math.min(100, Math.round(displayProgress * 0.85));

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#050608] text-[#E8ECF2] overflow-hidden select-none flex flex-col justify-between p-[4vw] md:p-[3.5vw] font-mono transition-opacity duration-700 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Dhruv Savaliya Iron Man HUD Experience Initializer"
    >
      {/* Three.js 3D Earth / Planet WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Subtle Iron Man HUD Orbital Trajectory Splines & Moving Dots Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Upper major orbital trajectory ellipse */}
        <path
          d="M -100,280 Q 700,-50 1700,260"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Diagonal trajectory */}
        <path
          d="M 50,850 L 1400,-100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
        />

        {/* Animated tracking dots moving along the Iron Man orbital path */}
        <circle r="3.5" fill="#7EA2FF" className="animate-pulse">
          <animateMotion
            path="M -100,280 Q 700,-50 1700,260"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.5" fill="#FFFFFF">
          <animateMotion
            path="M -100,280 Q 700,-50 1700,260"
            dur="9s"
            begin="-4.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="#B8FF5A">
          <animateMotion
            path="M 50,850 L 1400,-100"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Grid crosshair markers (+) */}
      <div className="absolute top-[16%] left-[6%] text-white/20 text-xs font-mono select-none pointer-events-none">+</div>
      <div className="absolute top-[22%] right-[10%] text-white/20 text-xs font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-[28%] left-[12%] text-white/20 text-xs font-mono select-none pointer-events-none">+</div>

      {/* ── TOP HEADER HUD ──────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-start justify-between w-full">
        {/* Left: ⌖ DHRUV.S with horizontal rule */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-mono text-white/80">⌖</span>
            <span className="font-mono text-xs md:text-sm font-semibold tracking-[0.22em]">
              DHRUV.S
            </span>
          </div>
          <div className="hidden sm:block w-20 md:w-28 h-px bg-white/20" />
        </div>

        {/* Right: Technical disciplines */}
        <div className="text-right font-mono text-[10px] md:text-[11px] leading-tight text-white/60">
          <p className="tracking-widest uppercase text-white/80 font-medium">
            FULL-STACK DEVELOPER
          </p>
          <p className="tracking-wider mt-0.5 text-white/40">
            NEXT.JS / REACT / TYPESCRIPT / NODE.JS / AI / INTERACTIVE WEB
          </p>
        </div>
      </header>

      {/* ── CENTER AREA: UPPER RADAR RETICLE & MAIN LOADING HUD ─────────── */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        {/* UPPER RETICLE RADAR / CORE INITIALIZER */}
        <div className="flex items-center gap-5 mb-10 md:mb-14 select-none">
          {/* Circular radar target reticle */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center">
            {/* Outer spinning dashed ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-white/40 animate-spin"
              style={{ animationDuration: '10s' }}
            />
            {/* Inner rotating reticle ticks */}
            <div
              className="absolute inset-2 rounded-full border border-white/25 animate-spin"
              style={{ animationDuration: '6s', animationDirection: 'reverse' }}
            />
            {/* Center glowing core point */}
            <div className="relative w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 w-px bg-white/30" />
            <div className="absolute left-0 right-0 h-px bg-white/30" />
          </div>

          {/* Telemetry Status Lines beside Radar */}
          <div className="text-left font-mono text-[9px] md:text-[10px] leading-relaxed text-white/50 tracking-wider">
            <p className="text-white/80 font-medium">INITIALIZING DIGITAL CORE</p>
            <p>LOADING ASSETS</p>
            <p>PREPARING EXPERIENCE</p>
          </div>
        </div>

        {/* Dynamic Iron Man HUD Target Popup (Pops up with bracket notation) */}
        <div className="mb-4 text-center select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-widest text-white/70 animate-pulse">
            <span className="text-ds-blue-highlight">⌖</span>
            <span>[{popups[activePopupIndex].code}]</span>
            <span className="text-white/40">//</span>
            <span className="text-white/50 hidden sm:inline">{popups[activePopupIndex].loc}</span>
          </div>
        </div>

        {/* LOADING LABEL & LARGE PERCENTAGE DISPLAY */}
        <div className="text-center space-y-1 select-none">
          <p className="text-xs md:text-sm font-mono tracking-[0.35em] text-white/70 uppercase">
            LOADING
          </p>
          <div className="font-display font-bold text-3xl md:text-5xl tracking-tight text-white">
            {displayProgress}%
          </div>
        </div>

        {/* TACTICAL PROGRESS BAR CONTAINER */}
        <div className="relative w-full max-w-sm md:max-w-md mt-5 mb-8">
          {/* Tactical Corner Brackets [   ] */}
          <div className="relative h-7 md:h-8 p-1 border border-white/25 bg-black/60 backdrop-blur-sm">
            {/* Left bracket decorative tick */}
            <span className="absolute -left-1.5 -top-1.5 w-2 h-2 border-t-2 border-l-2 border-white/60" />
            <span className="absolute -left-1.5 -bottom-1.5 w-2 h-2 border-b-2 border-l-2 border-white/60" />
            {/* Right bracket decorative tick */}
            <span className="absolute -right-1.5 -top-1.5 w-2 h-2 border-t-2 border-r-2 border-white/60" />
            <span className="absolute -right-1.5 -bottom-1.5 w-2 h-2 border-b-2 border-r-2 border-white/60" />

            {/* Inner Progress Fill with Metallic / Scanline Texture */}
            <div
              className="h-full bg-gradient-to-r from-[#505763] via-[#8A94A6] to-[#C8D1E0] relative overflow-hidden transition-all duration-200 ease-out"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Scanline overlay pattern */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 6px)',
                }}
              />
              {/* Glowing leading edge */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#FFFFFF]" />
            </div>
          </div>
        </div>

        {/* SUB-TELEMETRY TABLE (6-ITEM GRID WITH LIVE PERCENTAGES) */}
        <div className="w-full max-w-sm md:max-w-md grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] md:text-[11px] font-mono select-none text-white/70">
          {/* Column 1 */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> FONTS
            </span>
            <span className="text-white font-medium">{fontProgress}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> TEXTURES
            </span>
            <span className="text-white font-medium">{textureProgress}%</span>
          </div>

          {/* Column 2 */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> IMAGES
            </span>
            <span className="text-white font-medium">{imageProgress}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> WEBGL
            </span>
            <span className="text-white font-medium">{webglProgress}%</span>
          </div>

          {/* Column 3 */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> 3D ASSETS
            </span>
            <span className="text-white font-medium">{assets3dProgress}%</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-white/40">→</span> APP ASSETS
            </span>
            <span className="text-white font-medium">{appAssetsProgress}%</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HUD FOOTER ────────────────────────────────────────────── */}
      <footer className="relative z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 w-full pt-4">
        {/* Left: 4 Animated HUD Dials + Location Telemetry */}
        <div className="flex items-center gap-5">
          <HudGlyphs />
          <div className="font-mono text-[10px] md:text-[11px] leading-tight text-white/60">
            <p className="text-white/80">SURAT / INDIA</p>
            <p className="text-white/40 mt-0.5">FULL-STACK / AI / 3D</p>
          </div>
        </div>

        {/* Right: Signature Display Headline & Sound Toggle */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right gap-3">
          <div className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-white leading-tight">
            <span>BUILDING</span>
            <br />
            <span>DIGITAL WORLDS</span>
            <br />
            <span>WITH CODE &amp; AI</span>
          </div>

          <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-[11px] font-mono">
            <span className="w-8 h-px bg-white/20 hidden md:inline-block" />
            <span className="tracking-widest">DHRUV SAVALIYA</span>
          </div>

          {/* Audio Visualizer Toggle */}
          <div className="mt-1">
            <SoundIndicator />
          </div>
        </div>
      </footer>
    </div>
  );
}
