import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreMorphTarget } from '../../types';
import { sound } from '../../lib/audio';

interface DigitalCoreCanvasProps {
  activeSection: CoreMorphTarget;
  wireframeOverride?: boolean;
  speedMultiplier?: number;
  distortionMultiplier?: number;
  scrollProgress?: number;
  onModelLoaded?: () => void;
}

// ============================================
// CUSTOM GLSL SHADERS FOR DIGITAL CORE
// ============================================
const coreVertexShader = `
  uniform float uTime;
  uniform float uDistortion;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Organic cybernetic wave displacement
    float wave = sin(position.x * 2.5 + uTime * 0.9) * cos(position.y * 2.5 + uTime * 0.7);
    float displacement = wave * uDistortion * 0.14;
    
    vec3 newPos = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Optical fresnel rim calculation
    vec3 viewDir = normalize(-mvPosition.xyz);
    vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);
  }
`;

const coreFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorBase;
  uniform vec3 uColorRim;
  uniform vec3 uColorInner;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;

  void main() {
    // Solid obsidian base blended with electric cyan & royal blue fresnel edge
    vec3 color = mix(uColorBase, uColorRim, vFresnel * 0.92);
    
    // Core internal chromatic glow
    color += uColorInner * (1.0 - vFresnel) * 0.35;

    // High-tech subtle holographic scanlines
    float scan = sin(vPosition.y * 42.0 + uTime * 2.8) * 0.04 + 0.96;
    color *= scan;

    gl_FragColor = vec4(color, uOpacity * (0.92 + vFresnel * 0.08));
  }
`;

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

export const DigitalCoreCanvas: React.FC<DigitalCoreCanvasProps> = ({
  activeSection,
  wireframeOverride = false,
  speedMultiplier = 1,
  distortionMultiplier = 1,
  scrollProgress = 0,
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
  const bizdhanGroupRef = useRef<THREE.Group | null>(null);
  const clearclaimGroupRef = useRef<THREE.Group | null>(null);
  const smartReceiptGroupRef = useRef<THREE.Group | null>(null);
  const aboutGroupRef = useRef<THREE.Group | null>(null);
  const experienceGroupRef = useRef<THREE.Group | null>(null);
  const technologyGroupRef = useRef<THREE.Group | null>(null);
  const footerDGroupRef = useRef<THREE.Group | null>(null);
  
  const particlesRef = useRef<THREE.Points | null>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const laserRef = useRef<THREE.Mesh | null>(null);

  // Inertia Parallax & Motion Physics
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
  const clockRef = useRef(new THREE.Clock());
  const activeSectionRef = useRef(activeSection);
  const scrollProgressRef = useRef(scrollProgress);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    // Trigger reactive atmospheric soundscape morph
    sound.morphSoundscape(activeSection);
  }, [activeSection]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);
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
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Cinematic Directional & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1128, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f6fa, 0.8);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 4.5, 20);
    cyanRimLight.position.set(4, 3, 5);
    scene.add(cyanRimLight);

    const blueRimLight = new THREE.PointLight(0x356dff, 5.0, 20);
    blueRimLight.position.set(-5, -3, -4);
    scene.add(blueRimLight);

    const limeAccentLight = new THREE.PointLight(0xb8ff5a, 2.0, 15);
    limeAccentLight.position.set(3, -4, 3);
    scene.add(limeAccentLight);

    // 4. Background Starfield / Data Dust
    const particleCount = 650;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0x356dff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? colorCyan : colorPurple;
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Main Centered Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // ----------------------------------------------------
    // SUB-SCENE 1: SIGNATURE DIGITAL CORE (SOLID OBSIDIAN JEWEL)
    // ----------------------------------------------------
    const heroGroup = new THREE.Group();
    mainGroup.add(heroGroup);
    heroGroupRef.current = heroGroup;

    // A. Inner Solid Obsidian Core (NOT HOLLOW!)
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.08, 2);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x060913,
      roughness: 0.12,
      metalness: 0.95,
      emissive: 0x050f24,
      emissiveIntensity: 0.4,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    heroGroup.add(innerCoreMesh);

    // B. Middle Shader Crust (Wave Displacement + Fresnel Rim)
    const coreGeo = new THREE.IcosahedronGeometry(1.28, 3);
    const shaderMat = new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDistortion: { value: 1.0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorBase: { value: new THREE.Color(0x060913) }, // Obsidian Black Void
        uColorRim: { value: new THREE.Color(0x00f0ff) },  // Electric Neon Cyan
        uColorInner: { value: new THREE.Color(0x356dff) }, // Royal Blue
        uOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: true,
      depthTest: true,
    });
    shaderMaterialRef.current = shaderMat;

    const coreMesh = new THREE.Mesh(coreGeo, shaderMat);
    heroGroup.add(coreMesh);

    // C. Outer Geometric Lattice Cage
    const wireGeo = new THREE.OctahedronGeometry(1.48, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7ea2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    heroGroup.add(wireMesh);

    // D. Dual Concentric Gyro Rings
    const ring1Geo = new THREE.TorusGeometry(1.92, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    heroGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.15, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x356dff,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    heroGroup.add(ring2);

    // E. 4 Satellite Architecture Pillars (API, DATABASE, AI, UI/UX) with laser connectors
    const pillars = [
      { name: 'API', pos: [0, 2.1, 0], color: 0x00f0ff },
      { name: 'DATABASE', pos: [-2.1, 0, 0], color: 0xa855f7 },
      { name: 'AI', pos: [2.1, 0, 0], color: 0xb8ff5a },
      { name: 'UI', pos: [0, -2.1, 0], color: 0x38bdf8 },
    ];

    pillars.forEach((p) => {
      // Node Cube
      const nodeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
      heroGroup.add(nodeMesh);

      // Connector laser line to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2]),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      heroGroup.add(line);
    });

    // ----------------------------------------------------
    // SUB-SCENE 2: BIZDHAN FINANCIAL SAAS MATRIX
    // ----------------------------------------------------
    const bizdhanGroup = new THREE.Group();
    bizdhanGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(bizdhanGroup);
    bizdhanGroupRef.current = bizdhanGroup;

    // Solid Financial Columns with Illuminated Tops
    const barHeights = [0.9, 1.4, 1.1, 1.9, 1.6, 2.3];
    barHeights.forEach((val, idx) => {
      const barGeo = new THREE.BoxGeometry(0.32, val, 0.32);
      const barMat = new THREE.MeshStandardMaterial({
        color: idx === 5 ? 0x00f0ff : 0x1e3a8a,
        emissive: idx === 5 ? 0x00f0ff : 0x172554,
        emissiveIntensity: idx === 5 ? 0.6 : 0.2,
        roughness: 0.15,
        metalness: 0.85,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((idx - 2.5) * 0.46, val / 2 - 0.9, 0);
      bizdhanGroup.add(bar);

      // Glowing edges
      const edgeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(barGeo),
        new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 })
      );
      edgeLines.position.copy(bar.position);
      bizdhanGroup.add(edgeLines);
    });

    // Luminous Cyber Grid Floor
    const grid = new THREE.GridHelper(4.0, 12, 0x00f0ff, 0x356dff);
    grid.position.y = -0.9;
    bizdhanGroup.add(grid);

    // Orbiting currency ring
    const bizRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.015, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 })
    );
    bizRing.rotation.x = Math.PI / 2.2;
    bizdhanGroup.add(bizRing);

    // ----------------------------------------------------
    // SUB-SCENE 3: CLEARCLAIM MULTI-TENANT ISOLATED CLUSTER
    // ----------------------------------------------------
    const clearclaimGroup = new THREE.Group();
    clearclaimGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(clearclaimGroup);
    clearclaimGroupRef.current = clearclaimGroup;

    // Central Security Hub (Solid Gold/Cyan Vault)
    const authHub = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.0, 1.0),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    clearclaimGroup.add(authHub);

    // 4 Satellite Isolated Tenant Databases
    const tenantOffsets = [
      [-1.5, 0.9, 0.4],
      [1.5, 0.9, -0.4],
      [-1.4, -0.9, -0.4],
      [1.4, -0.9, 0.4],
    ];

    tenantOffsets.forEach(([x, y, z]) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 0.55),
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

      // Secure laser transmission pipeline
      const pipeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const pipe = new THREE.Line(
        pipeGeo,
        new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 })
      );
      clearclaimGroup.add(pipe);
    });

    // ----------------------------------------------------
    // SUB-SCENE 4: SMART RECEIPT OCR SCANNER
    // ----------------------------------------------------
    const smartReceiptGroup = new THREE.Group();
    smartReceiptGroup.scale.set(0.001, 0.001, 0.001);
    smartReceiptGroup.rotation.x = -0.3;
    mainGroup.add(smartReceiptGroup);
    smartReceiptGroupRef.current = smartReceiptGroup;

    // Solid Angled Receipt Document
    const doc = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 2.3, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x080c18,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x040814,
      })
    );
    smartReceiptGroup.add(doc);

    // Glowing Frame
    const docEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.7, 2.3, 0.04)),
      new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 })
    );
    smartReceiptGroup.add(docEdges);

    // Text Lines
    for (let i = 0; i < 7; i++) {
      const lineMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2 - (i % 3) * 0.25, 0.04, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
      );
      lineMesh.position.set(-0.1 + (i % 2) * 0.1, 0.8 - i * 0.26, 0.03);
      smartReceiptGroup.add(lineMesh);
    }

    // Active Sweeping Laser Beam (Neon Lime #b8ff5a)
    const laser = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.03, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xb8ff5a })
    );
    laser.position.set(0, 0, 0.06);
    smartReceiptGroup.add(laser);
    laserRef.current = laser;

    // ----------------------------------------------------
    // SUB-SCENE 5: HOW I BUILD / ABOUT NEURAL NETWORK
    // ----------------------------------------------------
    const aboutGroup = new THREE.Group();
    aboutGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(aboutGroup);
    aboutGroupRef.current = aboutGroup;

    // Central Sphere
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
      })
    );
    aboutGroup.add(centerSphere);

    // Outer Synaptic Nodes
    const nodeCount = 16;
    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.6 + (i % 3) * 0.2;
      const theta = (i / nodeCount) * Math.PI * 2;
      const phi = ((i % 4) / 4) * Math.PI - Math.PI / 2;

      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);

      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f0ff : 0x356dff })
      );
      nMesh.position.set(x, y, z);
      aboutGroup.add(nMesh);

      const sLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z),
        ]),
        new THREE.LineBasicMaterial({ color: 0x356dff, transparent: true, opacity: 0.35 })
      );
      aboutGroup.add(sLine);
    }

    // ----------------------------------------------------
    // SUB-SCENE 6: EXPERIENCE TIMELINE HELIX
    // ----------------------------------------------------
    const experienceGroup = new THREE.Group();
    experienceGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(experienceGroup);
    experienceGroupRef.current = experienceGroup;

    for (let i = 0; i < 30; i++) {
      const angle = i * 0.32;
      const radius = 0.95 + (i % 2) * 0.2;
      const x = Math.cos(angle) * radius;
      const y = (i - 15) * 0.12;
      const z = Math.sin(angle) * radius;

      const bead = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.06, 0.12),
        new THREE.MeshStandardMaterial({
          color: i > 20 ? 0xb8ff5a : i > 10 ? 0x00f0ff : 0x356dff,
          emissive: i > 20 ? 0xb8ff5a : 0x00f0ff,
          emissiveIntensity: 0.4,
        })
      );
      bead.position.set(x, y, z);
      experienceGroup.add(bead);
    }

    // ----------------------------------------------------
    // SUB-SCENE 7: TECHNOLOGY ORBITAL GLOBE
    // ----------------------------------------------------
    const technologyGroup = new THREE.Group();
    technologyGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(technologyGroup);
    technologyGroupRef.current = technologyGroup;

    const techSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    technologyGroup.add(techSphere);

    [0, Math.PI / 3, -Math.PI / 3].forEach((rotX, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8 + idx * 0.2, 0.015, 16, 64),
        new THREE.MeshBasicMaterial({
          color: idx === 0 ? 0x00f0ff : 0x356dff,
          transparent: true,
          opacity: 0.55,
        })
      );
      ring.rotation.x = rotX;
      ring.rotation.y = idx * 0.5;
      technologyGroup.add(ring);
    });

    // ----------------------------------------------------
    // SUB-SCENE 8: FOOTER "D" MONOLITH COLLAPSE
    // ----------------------------------------------------
    const footerDGroup = new THREE.Group();
    footerDGroup.scale.set(0.001, 0.001, 0.001);
    mainGroup.add(footerDGroup);
    footerDGroupRef.current = footerDGroup;

    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 2.2, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    spine.position.set(-0.6, 0, 0);
    footerDGroup.add(spine);

    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.16, 16, 32, Math.PI),
      new THREE.MeshStandardMaterial({
        color: 0x356dff,
        emissive: 0x356dff,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    arc.rotation.z = -Math.PI / 2;
    arc.position.set(-0.6, 0, 0);
    footerDGroup.add(arc);

    setModelStatus('ready');
    if (onModelLoaded) {
      onModelLoaded();
    }

    // ----------------------------------------------------
    // ANIMATION & RENDER LOOP
    // ----------------------------------------------------
    let animationFrameId: number;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();
      const section = activeSectionRef.current;
      const targetTransform = MORPH_STATES[section] || MORPH_STATES.hero;

      // Update shader uniforms
      if (shaderMaterialRef.current) {
        shaderMaterialRef.current.uniforms.uTime.value = elapsedTime;
        shaderMaterialRef.current.uniforms.uDistortion.value = distortionMultiplier;
        shaderMaterialRef.current.wireframe = wireframeOverride;
      }

      // Laser scanner animation
      if (laserRef.current) {
        laserRef.current.position.y = Math.sin(elapsedTime * 2.8) * 0.9;
      }

      // Smooth Mouse Parallax Physics
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

      // Smooth World Position Lerp
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

        // Continuous rotational dynamics
        mainGroupRef.current.rotation.y += targetTransform.rotSpeed * speedMultiplier;
        mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          mainGroupRef.current.rotation.x,
          currentRotation.current.x,
          delta * 4
        );
        mainGroupRef.current.rotation.z = THREE.MathUtils.lerp(
          mainGroupRef.current.rotation.z,
          currentRotation.current.y * 0.5,
          delta * 4
        );
      }

      // Starfield subtle rotation
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
        particlesRef.current.rotation.x = elapsedTime * 0.015;
      }

      // Sub-model Scaling Transitions (Spring-like Lerp)
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

    // Global Pointer Interaction (Parallax & Audio Modulation)
    const handleGlobalPointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -((e.clientY / window.innerHeight) * 2 - 1);

      targetRotation.current.y = normX * 0.6;
      targetRotation.current.x = -normY * 0.35;

      // Real-time acoustic modulation
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
      {/* Visual neon ambient gradient cones */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};
