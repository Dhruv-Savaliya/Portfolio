import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreMorphTarget } from '../../types';
import { sound } from '../../lib/audio';
import { subscribeToScroll, getScrollState } from '../../hooks/useLenis';

interface DigitalCoreCanvasProps {
  activeSection: CoreMorphTarget;
  wireframeOverride?: boolean;
  speedMultiplier?: number;
  distortionMultiplier?: number;
  onModelLoaded?: () => void;
}

// Morph Target World Coordinates (Podium / Reference spec)
interface TransformState {
  pos: [number, number, number];
  rotSpeed: number;
}

const MORPH_STATES: Record<CoreMorphTarget, TransformState> = {
  hero: { pos: [0, 0, 0], rotSpeed: 0.0035 },
  intro: { pos: [1.35, 0, -0.6], rotSpeed: 0.0025 },
  bizdhan: { pos: [1.25, 0.2, -0.3], rotSpeed: 0.004 },
  clearclaim: { pos: [-1.25, 0.2, -0.3], rotSpeed: 0.0035 },
  smartreceipt: { pos: [1.25, 0.2, -0.3], rotSpeed: 0.005 },
  howibuild: { pos: [0, 0, -0.5], rotSpeed: 0.003 },
  about: { pos: [-1.2, 0.15, -0.4], rotSpeed: 0.0025 },
  experience: { pos: [0, 0, -0.8], rotSpeed: 0.002 },
  technology: { pos: [0, 0, 0], rotSpeed: 0.006 },
  contact: { pos: [1.35, 0.2, -0.8], rotSpeed: 0.008 },
  footer: { pos: [0, 0, 0], rotSpeed: 0.0015 },
  idle: { pos: [0, 0, 0], rotSpeed: 0.003 },
};

// Helper: Create high-contrast floating 3D HUD chip texture
function createDataBadgeTexture(label: string, value: string, colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 72;
  const ctx = canvas.getContext('2d')!;

  // Background panel with rounded corners
  ctx.fillStyle = 'rgba(6, 12, 26, 0.88)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2.5;

  const r = 12;
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 64, r);
  ctx.fill();
  ctx.stroke();

  // Status indicator LED
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.arc(22, 36, 6, 0, Math.PI * 2);
  ctx.fill();

  // Typography
  ctx.font = 'bold 18px "Space Grotesk", monospace, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, 38, 32);

  ctx.font = '14px "Space Grotesk", monospace, sans-serif';
  ctx.fillStyle = colorHex;
  ctx.fillText(value, 38, 52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const DigitalCoreCanvas: React.FC<DigitalCoreCanvasProps> = ({
  activeSection,
  wireframeOverride = false,
  speedMultiplier = 1,
  distortionMultiplier = 1,
  onModelLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setModelStatus] = useState<'loading' | 'ready'>('loading');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Model Groups
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const heroGroupRef = useRef<THREE.Group | null>(null);
  const nucleusRef = useRef<THREE.Mesh | null>(null);
  const crystalShellRef = useRef<THREE.Mesh | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  
  // Project Chapter Groups
  const bizdhanGroupRef = useRef<THREE.Group | null>(null);
  const clearclaimGroupRef = useRef<THREE.Group | null>(null);
  const smartReceiptGroupRef = useRef<THREE.Group | null>(null);
  const aboutGroupRef = useRef<THREE.Group | null>(null);
  const experienceGroupRef = useRef<THREE.Group | null>(null);
  const technologyGroupRef = useRef<THREE.Group | null>(null);
  const footerDGroupRef = useRef<THREE.Group | null>(null);
  
  const particlesRef = useRef<THREE.Points | null>(null);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const dataPacketsRef = useRef<THREE.Mesh[]>([]);

  // Physics & Parallax
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
  const clockRef = useRef(new THREE.Clock());
  const activeSectionRef = useRef(activeSection);
  const scrollStateRef = useRef(getScrollState());

  useEffect(() => {
    activeSectionRef.current = activeSection;
    sound.morphSoundscape(activeSection);
  }, [activeSection]);

  // Subscribe to Lenis Smooth Scroll without React re-renders
  useEffect(() => {
    const unsubscribe = subscribeToScroll((progress, velocity, scroll) => {
      scrollStateRef.current = { progress, velocity, scroll };
    });
    return unsubscribe;
  }, []);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.6);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Multi-Point Cinematic Studio Lighting (Specular Glints on Crystal)
    const ambientLight = new THREE.AmbientLight(0x071126, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 5.0, 18);
    cyanPoint.position.set(3.5, 2.5, 4);
    scene.add(cyanPoint);

    const bluePoint = new THREE.PointLight(0x356dff, 6.0, 18);
    bluePoint.position.set(-4, -2.5, -3);
    scene.add(bluePoint);

    const limeAccent = new THREE.PointLight(0xb8ff5a, 3.2, 14);
    limeAccent.position.set(2.5, -3.5, 2);
    scene.add(limeAccent);

    // 4. Background Data Nebula & Quantum Dust (600 Micro-Particles)
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorRoyal = new THREE.Color(0x356dff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.4 ? colorCyan : colorRoyal;
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Main Hierarchical Centered Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // ====================================================
    // SIGNATURE DIGITAL CORE (HEAVY SOLID OBSIDIAN & REFRACTIVE GLASS)
    // ====================================================
    const heroGroup = new THREE.Group();
    mainGroup.add(heroGroup);
    heroGroupRef.current = heroGroup;

    // A. Quantum Nucleus (The Glowing Energy Heart inside)
    const nucleusGeo = new THREE.DodecahedronGeometry(0.72, 1);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    heroGroup.add(nucleus);
    nucleusRef.current = nucleus;

    // Internal Spark Dust inside the core
    const sparkCount = 60;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPos[i] = (Math.random() - 0.5) * 0.9;
      sparkPos[i + 1] = (Math.random() - 0.5) * 0.9;
      sparkPos[i + 2] = (Math.random() - 0.5) * 0.9;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xb8ff5a,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    nucleus.add(sparkPoints);

    // B. Thick Refractive Obsidian Crystal Shell
    const crystalGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x061124,
      emissive: 0x030a16,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
      transmission: 0.65,
      ior: 1.6,
      thickness: 1.5,
    });
    const crystalShell = new THREE.Mesh(crystalGeo, crystalMat);
    heroGroup.add(crystalShell);
    crystalShellRef.current = crystalShell;

    // Glowing Edge Geometry for the Crystal Shell
    const edgeGeo = new THREE.EdgesGeometry(crystalGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7,
    });
    const crystalEdges = new THREE.LineSegments(edgeGeo, edgeMat);
    crystalShell.add(crystalEdges);

    // C. Heavy Outer Titanium Structural Exoskeleton
    const exoGeo = new THREE.OctahedronGeometry(1.52, 1);
    const exoMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: true,
    });
    const exoskeleton = new THREE.Mesh(exoGeo, exoMat);
    heroGroup.add(exoskeleton);

    // Vertex Sensor Nodes (Illuminated micro-sensors at vertices)
    const nodePosArray = exoGeo.getAttribute('position');
    for (let i = 0; i < nodePosArray.count; i++) {
      const vx = nodePosArray.getX(i);
      const vy = nodePosArray.getY(i);
      const vz = nodePosArray.getZ(i);

      const sensorGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const sensorMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 1.2,
      });
      const sensor = new THREE.Mesh(sensorGeo, sensorMat);
      sensor.position.set(vx, vy, vz);
      heroGroup.add(sensor);
    }

    // D. Dual Concentric Precision Gyroscopic Gimbal Rings
    const ring1Geo = new THREE.TorusGeometry(1.95, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 5;
    heroGroup.add(ring1);
    ring1Ref.current = ring1;

    const ring2Geo = new THREE.TorusGeometry(2.25, 0.022, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x356dff,
      emissiveIntensity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 4;
    heroGroup.add(ring2);
    ring2Ref.current = ring2;

    // E. 4 Satellite Architecture Pillars (API, DATABASE, AI, UI/UX)
    const pillars = [
      { name: 'API', pos: [0, 2.2, 0], color: 0x00f0ff, label: 'REST / WS' },
      { name: 'DATABASE', pos: [-2.2, 0, 0], color: 0xa855f7, label: 'MONGODB' },
      { name: 'AI', pos: [2.2, 0, 0], color: 0xb8ff5a, label: 'GROQ / LLM' },
      { name: 'UI/UX', pos: [0, -2.2, 0], color: 0x38bdf8, label: 'R3F / WEBGL' },
    ];

    const dataPackets: THREE.Mesh[] = [];

    pillars.forEach((p) => {
      // Node housing
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.22, 6),
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.2,
          emissive: p.color,
          emissiveIntensity: 0.5,
        })
      );
      housing.position.set(p.pos[0], p.pos[1], p.pos[2]);
      heroGroup.add(housing);

      // Glowing laser pipeline to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2]),
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.55 })
      );
      heroGroup.add(line);

      // Data Packet traveling back and forth
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: p.color })
      );
      heroGroup.add(packet);
      packet.userData = {
        origin: new THREE.Vector3(0, 0, 0),
        target: new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2]),
        speed: 1.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI,
      };
      dataPackets.push(packet);
    });

    dataPacketsRef.current = dataPackets;

    // F. Floating 3D Telemetry Badges (The "Small Floating UI Fragments" from AGENT.md)
    const badgeConfigs = [
      { label: 'CORE', value: 'ONLINE 99.9%', color: '#00f0ff', pos: [1.6, 1.3, 0.8] },
      { label: 'STACK', value: 'FULL-STACK + AI', color: '#b8ff5a', pos: [-1.6, 1.2, 0.6] },
      { label: 'LATENCY', value: '16ms 60FPS', color: '#356dff', pos: [1.7, -1.2, -0.6] },
    ];

    badgeConfigs.forEach((b) => {
      const tex = createDataBadgeTexture(b.label, b.value, b.color);
      const badgeMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const badgeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.35), badgeMat);
      badgeMesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
      heroGroup.add(badgeMesh);
    });

    // ====================================================
    // SUB-SCENE 2: BIZDHAN FINANCIAL MATRIX
    // ====================================================
    const bizdhanGroup = new THREE.Group();
    bizdhanGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(bizdhanGroup);
    bizdhanGroupRef.current = bizdhanGroup;

    const barHeights = [0.9, 1.4, 1.1, 1.9, 1.6, 2.4];
    barHeights.forEach((val, idx) => {
      const barGeo = new THREE.BoxGeometry(0.34, val, 0.34);
      const barMat = new THREE.MeshStandardMaterial({
        color: idx === 5 ? 0x00f0ff : 0x1e3a8a,
        emissive: idx === 5 ? 0x00f0ff : 0x172554,
        emissiveIntensity: idx === 5 ? 0.75 : 0.3,
        roughness: 0.15,
        metalness: 0.85,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((idx - 2.5) * 0.48, val / 2 - 0.9, 0);
      bizdhanGroup.add(bar);

      const edgeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(barGeo),
        new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 })
      );
      edgeLines.position.copy(bar.position);
      bizdhanGroup.add(edgeLines);
    });

    const grid = new THREE.GridHelper(4.5, 14, 0x00f0ff, 0x1e40af);
    grid.position.y = -0.9;
    bizdhanGroup.add(grid);

    // ====================================================
    // SUB-SCENE 3: CLEARCLAIM MULTI-TENANT ARCHITECTURE
    // ====================================================
    const clearclaimGroup = new THREE.Group();
    clearclaimGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(clearclaimGroup);
    clearclaimGroupRef.current = clearclaimGroup;

    const authHub = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.65,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    clearclaimGroup.add(authHub);

    const tenantOffsets = [
      [-1.6, 0.9, 0.4],
      [1.6, 0.9, -0.4],
      [-1.5, -0.9, -0.4],
      [1.5, -0.9, 0.4],
    ];

    tenantOffsets.forEach(([x, y, z]) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.58, 0.58),
        new THREE.MeshStandardMaterial({
          color: 0x356dff,
          emissive: 0x1d4ed8,
          emissiveIntensity: 0.5,
          roughness: 0.2,
          metalness: 0.85,
        })
      );
      cube.position.set(x, y, z);
      clearclaimGroup.add(cube);

      const pipe = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]),
        new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 })
      );
      clearclaimGroup.add(pipe);
    });

    // ====================================================
    // SUB-SCENE 4: SMART RECEIPT SCANNER & OCR
    // ====================================================
    const smartReceiptGroup = new THREE.Group();
    smartReceiptGroup.scale.set(0.001, 0.001, 0.001);
    smartReceiptGroup.rotation.x = -0.32;
    mainGroup.add(smartReceiptGroup);
    smartReceiptGroupRef.current = smartReceiptGroup;

    const doc = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.5, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0x080c18,
        roughness: 0.2,
        metalness: 0.85,
        emissive: 0x040814,
      })
    );
    smartReceiptGroup.add(doc);

    const docEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 2.5, 0.05)),
      new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 })
    );
    smartReceiptGroup.add(docEdges);

    for (let i = 0; i < 7; i++) {
      const lineMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.3 - (i % 3) * 0.3, 0.04, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
      );
      lineMesh.position.set(-0.1 + (i % 2) * 0.1, 0.9 - i * 0.28, 0.04);
      smartReceiptGroup.add(lineMesh);
    }

    const laser = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.035, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xb8ff5a })
    );
    laser.position.set(0, 0, 0.07);
    smartReceiptGroup.add(laser);
    laserRef.current = laser;

    // ====================================================
    // SUB-SCENE 5: HOW I BUILD & ABOUT NEURAL CLUSTER
    // ====================================================
    const aboutGroup = new THREE.Group();
    aboutGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(aboutGroup);
    aboutGroupRef.current = aboutGroup;

    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
        roughness: 0.15,
        metalness: 0.85,
      })
    );
    aboutGroup.add(centerSphere);

    const nodeCount = 18;
    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.65 + (i % 3) * 0.25;
      const theta = (i / nodeCount) * Math.PI * 2;
      const phi = ((i % 4) / 4) * Math.PI - Math.PI / 2;

      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);

      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f0ff : 0x356dff })
      );
      nMesh.position.set(x, y, z);
      aboutGroup.add(nMesh);

      const sLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]),
        new THREE.LineBasicMaterial({ color: 0x356dff, transparent: true, opacity: 0.4 })
      );
      aboutGroup.add(sLine);
    }

    // ====================================================
    // SUB-SCENE 6: EXPERIENCE TIMELINE HELIX
    // ====================================================
    const experienceGroup = new THREE.Group();
    experienceGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(experienceGroup);
    experienceGroupRef.current = experienceGroup;

    for (let i = 0; i < 32; i++) {
      const angle = i * 0.35;
      const radius = 0.95;
      const x = Math.cos(angle) * radius;
      const y = (i - 16) * 0.13;
      const z = Math.sin(angle) * radius;

      const bead = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.07, 0.14),
        new THREE.MeshStandardMaterial({
          color: i > 22 ? 0xb8ff5a : i > 12 ? 0x00f0ff : 0x356dff,
          emissive: i > 22 ? 0xb8ff5a : 0x00f0ff,
          emissiveIntensity: 0.45,
        })
      );
      bead.position.set(x, y, z);
      experienceGroup.add(bead);
    }

    // ====================================================
    // SUB-SCENE 7: TECHNOLOGY ORBITAL GLOBE
    // ====================================================
    const technologyGroup = new THREE.Group();
    technologyGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(technologyGroup);
    technologyGroupRef.current = technologyGroup;

    const techSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      })
    );
    technologyGroup.add(techSphere);

    [0, Math.PI / 3, -Math.PI / 3].forEach((rotX, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.9 + idx * 0.22, 0.016, 16, 64),
        new THREE.MeshBasicMaterial({
          color: idx === 0 ? 0x00f0ff : 0x356dff,
          transparent: true,
          opacity: 0.6,
        })
      );
      ring.rotation.x = rotX;
      ring.rotation.y = idx * 0.5;
      technologyGroup.add(ring);
    });

    // ====================================================
    // SUB-SCENE 8: FOOTER "D" MONOLITH
    // ====================================================
    const footerDGroup = new THREE.Group();
    footerDGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(footerDGroup);
    footerDGroupRef.current = footerDGroup;

    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 2.3, 0.35),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    spine.position.set(-0.65, 0, 0);
    footerDGroup.add(spine);

    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.18, 16, 32, Math.PI),
      new THREE.MeshStandardMaterial({
        color: 0x356dff,
        emissive: 0x356dff,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    arc.rotation.z = -Math.PI / 2;
    arc.position.set(-0.65, 0, 0);
    footerDGroup.add(arc);

    setModelStatus('ready');
    if (onModelLoaded) {
      onModelLoaded();
    }

    // ====================================================
    // CONTINUOUS RENDER LOOP (PHYSICS & LERP SMOOTHING)
    // ====================================================
    let animationFrameId: number;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();
      const section = activeSectionRef.current;
      const targetTransform = MORPH_STATES[section] || MORPH_STATES.hero;
      const scroll = scrollStateRef.current;

      // 1. Quantum Nucleus Cardiac Pulse
      if (nucleusRef.current) {
        const pulse = 1.0 + Math.sin(elapsedTime * 3.2) * 0.06;
        nucleusRef.current.scale.set(pulse, pulse, pulse);
        nucleusRef.current.rotation.y = elapsedTime * 0.4;
        nucleusRef.current.rotation.x = elapsedTime * 0.25;
      }

      // 2. Crystal Shell Glints & Rotation
      if (crystalShellRef.current) {
        crystalShellRef.current.rotation.y = -elapsedTime * 0.2;
        crystalShellRef.current.rotation.z = elapsedTime * 0.15;
        crystalShellRef.current.material.wireframe = wireframeOverride;
      }

      // 3. Counter-Rotating Gyroscopic Rings
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += 0.008 * speedMultiplier;
        ring1Ref.current.rotation.x += 0.004 * speedMultiplier;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z -= 0.006 * speedMultiplier;
        ring2Ref.current.rotation.y += 0.005 * speedMultiplier;
      }

      // 4. Animate Data Packets Traveling Along Pipelines
      dataPacketsRef.current.forEach((pkt) => {
        const d = pkt.userData;
        const progress = (Math.sin(elapsedTime * d.speed + d.phase) + 1) * 0.5;
        pkt.position.lerpVectors(d.origin, d.target, progress);
      });

      // 5. Laser Scanner Animation
      if (laserRef.current) {
        laserRef.current.position.y = Math.sin(elapsedTime * 2.8) * 0.95;
      }

      // 6. Smooth Mouse Parallax Physics
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        delta * 4.5
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        delta * 4.5
      );

      // 7. Dynamic Continuous Scroll Reaction
      const scrollOffsetRot = scroll.progress * Math.PI * 2;
      const scrollVelocityTilt = THREE.MathUtils.clamp(scroll.velocity * 0.0008, -0.3, 0.3);

      // 8. Smooth World Position Lerp
      const isDesktop = window.innerWidth > 1024;
      const targetX = isDesktop ? targetTransform.pos[0] : 0;
      const targetY = targetTransform.pos[1];
      const targetZ = targetTransform.pos[2];

      currentPosition.current.x = THREE.MathUtils.lerp(currentPosition.current.x, targetX, delta * 3.8);
      currentPosition.current.y = THREE.MathUtils.lerp(currentPosition.current.y, targetY, delta * 3.8);
      currentPosition.current.z = THREE.MathUtils.lerp(currentPosition.current.z, targetZ, delta * 3.8);

      if (mainGroupRef.current) {
        mainGroupRef.current.position.set(
          currentPosition.current.x,
          currentPosition.current.y,
          currentPosition.current.z
        );

        // Continuous rotational dynamics responding smoothly to scroll
        mainGroupRef.current.rotation.y += targetTransform.rotSpeed * speedMultiplier;
        mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          mainGroupRef.current.rotation.x,
          currentRotation.current.x + scrollVelocityTilt,
          delta * 4.0
        );
        mainGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          mainGroupRef.current.rotation.z,
          currentRotation.current.y * 0.5,
          delta * 4.0
        );
      }

      // Starfield subtle rotation
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.02 + scrollOffsetRot * 0.1;
        particlesRef.current.rotation.x = elapsedTime * 0.01;
      }

      // Sub-model Scaling Transitions (Smooth Ease Curves)
      const lerpSpeed = Math.min(1, delta * 6.5);

      const targetHero = (section === 'hero' || section === 'intro') ? 1 : 0.001;
      const targetBiz = section === 'bizdhan' ? 1 : 0.001;
      const targetClear = section === 'clearclaim' ? 1 : 0.001;
      const targetSmart = section === 'smartreceipt' ? 1 : 0.001;
      const targetAbout = (section === 'about' || section === 'howibuild') ? 1 : 0.001;
      const targetExp = section === 'experience' ? 1 : 0.001;
      const targetTech = section === 'technology' ? 1 : 0.001;
      const targetFooter = (section === 'contact' || section === 'footer') ? 1 : 0.001;

      const updateGroupScale = (group: THREE.Group | null, targetScale: number) => {
        if (!group) return;
        const cur = group.scale.x;
        const next = THREE.MathUtils.lerp(cur, targetScale, lerpSpeed);
        group.scale.set(next, next, next);
        group.visible = next > 0.01;
      };

      updateGroupScale(heroGroupRef.current, targetHero);
      updateGroupScale(bizdhanGroupRef.current, targetBiz);
      updateGroupScale(clearclaimGroupRef.current, targetClear);
      updateGroupScale(smartReceiptGroupRef.current, targetSmart);
      updateGroupScale(aboutGroupRef.current, targetAbout);
      updateGroupScale(experienceGroupRef.current, targetExp);
      updateGroupScale(technologyGroupRef.current, targetTech);
      updateGroupScale(footerDGroupRef.current, targetFooter);

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Global Pointer Interaction
    const handleGlobalPointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -((e.clientY / window.innerHeight) * 2 - 1);

      targetRotation.current.y = normX * 0.6;
      targetRotation.current.x = -normY * 0.35;

      sound.onPointerMoveAudio(normX, normY);
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [distortionMultiplier, onModelLoaded, speedMultiplier, wireframeOverride]);

  return (
    <div
      ref={containerRef}
      id="three-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-label="Interactive 3D Digital Core WebGL Scene"
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};
