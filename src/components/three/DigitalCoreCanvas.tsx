import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../../lib/store';
import { CoreMorphTarget } from '../../types';

interface MorphParameters {
  coreRadius: number;
  nodeSpread: number;
  rotSpeed: number;
  distortion: number;
  signalStrength: number;
  colorRim: THREE.Color;
  colorSignal: THREE.Color;
  scanlineIntensity: number;
  ringsRadius: number;
  wireframeOpacity: number;
  posXDesktop: number;
  posYDesktop: number;
}

const SECTION_PARAMS: Record<CoreMorphTarget, MorphParameters> = {
  hero: {
    coreRadius: 1.65,
    nodeSpread: 2.8,
    rotSpeed: 0.0035,
    distortion: 0.22,
    signalStrength: 0.25,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00F0FF'),
    scanlineIntensity: 0.18,
    ringsRadius: 3.2,
    wireframeOpacity: 0.3,
    posXDesktop: 2.2, // Right column in Hero layout
    posYDesktop: 0.1,
  },
  intro: {
    coreRadius: 1.4,
    nodeSpread: 2.2,
    rotSpeed: 0.002,
    distortion: 0.12,
    signalStrength: 0.1,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00E5FF'),
    scanlineIntensity: 0.1,
    ringsRadius: 2.6,
    wireframeOpacity: 0.2,
    posXDesktop: 1.8,
    posYDesktop: 0.0,
  },
  bizdhan: {
    coreRadius: 1.7,
    nodeSpread: 3.4,
    rotSpeed: 0.004,
    distortion: 0.3,
    signalStrength: 0.45,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#B8FF5A'),
    scanlineIntensity: 0.25,
    ringsRadius: 3.6,
    wireframeOpacity: 0.35,
    posXDesktop: -2.0, // Swaps dynamically per section
    posYDesktop: 0.0,
  },
  clearclaim: {
    coreRadius: 1.55,
    nodeSpread: 3.2,
    rotSpeed: 0.0035,
    distortion: 0.2,
    signalStrength: 0.35,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00F0FF'),
    scanlineIntensity: 0.3,
    ringsRadius: 3.4,
    wireframeOpacity: 0.4,
    posXDesktop: 2.0,
    posYDesktop: 0.0,
  },
  smartreceipt: {
    coreRadius: 1.6,
    nodeSpread: 3.0,
    rotSpeed: 0.0045,
    distortion: 0.35,
    signalStrength: 0.5,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#B8FF5A'),
    scanlineIntensity: 0.4,
    ringsRadius: 3.3,
    wireframeOpacity: 0.4,
    posXDesktop: -2.0,
    posYDesktop: 0.0,
  },
  howibuild: {
    coreRadius: 1.5,
    nodeSpread: 2.7,
    rotSpeed: 0.003,
    distortion: 0.18,
    signalStrength: 0.2,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00F0FF'),
    ringsRadius: 3.1,
    scanlineIntensity: 0.2,
    wireframeOpacity: 0.25,
    posXDesktop: 1.8,
    posYDesktop: 0.0,
  },
  about: {
    coreRadius: 1.45,
    nodeSpread: 2.6,
    rotSpeed: 0.0025,
    distortion: 0.15,
    signalStrength: 0.2,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#B8FF5A'),
    ringsRadius: 2.9,
    scanlineIntensity: 0.15,
    wireframeOpacity: 0.25,
    posXDesktop: -1.9,
    posYDesktop: 0.0,
  },
  technology: {
    coreRadius: 1.8,
    nodeSpread: 3.6,
    rotSpeed: 0.0045,
    distortion: 0.3,
    signalStrength: 0.4,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00F0FF'),
    ringsRadius: 3.8,
    scanlineIntensity: 0.3,
    wireframeOpacity: 0.35,
    posXDesktop: 0.0, // Center nucleus in technology section
    posYDesktop: 0.0,
  },
  experience: {
    coreRadius: 1.5,
    nodeSpread: 2.8,
    rotSpeed: 0.003,
    distortion: 0.18,
    signalStrength: 0.25,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#356DFF'),
    ringsRadius: 3.2,
    scanlineIntensity: 0.2,
    wireframeOpacity: 0.25,
    posXDesktop: 2.0,
    posYDesktop: 0.0,
  },
  contact: {
    coreRadius: 1.6,
    nodeSpread: 2.9,
    rotSpeed: 0.002,
    distortion: 0.12,
    signalStrength: 0.15,
    colorRim: new THREE.Color('#356DFF'),
    colorSignal: new THREE.Color('#00F0FF'),
    ringsRadius: 3.4,
    scanlineIntensity: 0.12,
    wireframeOpacity: 0.25,
    posXDesktop: 0.0,
    posYDesktop: 0.2,
  },
};

export default function DigitalCoreCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSection = useStore((s) => s.currentSection);
  const preloaderComplete = useStore((s) => s.preloaderComplete);
  const mousePos = useStore((s) => s.mousePos);
  const theme = useStore((s) => s.theme);

  const sectionRef = useRef<CoreMorphTarget>(currentSection);
  sectionRef.current = currentSection;

  const mouseRef = useRef(mousePos);
  mouseRef.current = mousePos;

  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Dynamic Lighting adjusted per theme
    const ambientLight = new THREE.AmbientLight(0xffffff, themeRef.current === 'light' ? 1.1 : 0.7);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x356dff, 5.0, 25);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 20);
    cyanLight.position.set(-5, -4, 4);
    scene.add(cyanLight);

    const limeLight = new THREE.PointLight(0xb8ff5a, 2.0, 15);
    limeLight.position.set(0, -5, -3);
    scene.add(limeLight);

    // Root Group for the 3D Digital Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // --- 1. Inner Crystalline / Energy Core (GLSL Custom Shader) ---
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

        // Fluid organic surface turbulence
        float wave = sin(position.x * 2.8 + uTime * 1.1) * cos(position.y * 2.8 + uTime * 1.3) * sin(position.z * 2.2 + uTime * 0.9);
        vec3 newPos = position + normal * (wave * uDistortion * 0.16);

        vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);
        gl_Position = projectionMatrix * mvPos;

        vec3 viewDir = normalize(-mvPos.xyz);
        vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);
      }
    `;

    const coreFragmentShader = `
      uniform float uTime;
      uniform vec3 uColorBase;
      uniform vec3 uColorRim;
      uniform vec3 uColorSignal;
      uniform float uSignalStrength;
      uniform float uScanline;
      uniform float uOpacity;
      uniform float uIsLight;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vFresnel;

      void main() {
        // Base glass refraction look
        vec3 col = mix(uColorBase, uColorRim, vFresnel * 0.9);

        // Technical scanline effect
        float scan = sin(vPosition.y * 38.0 + uTime * 3.0) * (uScanline * 0.25) + (1.0 - uScanline * 0.12);
        col *= scan;

        // High-energy signal emission highlights
        if (uSignalStrength > 0.01) {
          col += uColorSignal * (uSignalStrength * 0.8 * vFresnel);
        }

        // Add inner radiant caustic glow
        float innerGlow = pow(vFresnel, 1.5) * 0.4;
        col += vec3(0.0, 0.94, 1.0) * innerGlow;

        float alpha = uIsLight > 0.5 
          ? uOpacity * (0.55 + vFresnel * 0.4) 
          : uOpacity * (0.75 + vFresnel * 0.25);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    const coreUniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.22 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorBase: { value: new THREE.Color(themeRef.current === 'light' ? '#FFFFFF' : '#040711') },
      uColorRim: { value: new THREE.Color('#356DFF') },
      uColorSignal: { value: new THREE.Color('#00F0FF') },
      uSignalStrength: { value: 0.25 },
      uScanline: { value: 0.18 },
      uOpacity: { value: 0.92 },
      uIsLight: { value: themeRef.current === 'light' ? 1.0 : 0.0 },
    };

    const coreGeo = new THREE.IcosahedronGeometry(1.65, 6);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      uniforms: coreUniforms,
      transparent: true,
      side: THREE.FrontSide,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // --- 2. Outer Faceted Geodesic Cage ---
    const cageGeo = new THREE.IcosahedronGeometry(1.95, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x356dff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // --- 3. Concentric Gyroscopic Orbital Rings ---
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    const createRing = (radius: number, tiltX: number, tiltY: number, colorHex: number, opacity: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.015, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.rotation.x = tiltX;
      mesh.rotation.y = tiltY;
      return mesh;
    };

    const ring1 = createRing(3.1, Math.PI / 3, 0.2, 0x356dff, 0.45);
    const ring2 = createRing(3.5, -Math.PI / 3.8, 0.5, 0x00f0ff, 0.4);
    const ring3 = createRing(2.7, Math.PI / 2.1, -0.4, 0xb8ff5a, 0.35);
    ringGroup.add(ring1, ring2, ring3);

    // Glowing orbital beads / satellites on rings
    const createSatellite = (size: number, colorHex: number) => {
      const satGeo = new THREE.SphereGeometry(size, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: colorHex,
      });
      return new THREE.Mesh(satGeo, satMat);
    };

    const sat1 = createSatellite(0.08, 0x00f0ff);
    const sat2 = createSatellite(0.07, 0x356dff);
    const sat3 = createSatellite(0.06, 0xb8ff5a);
    ring1.add(sat1);
    ring2.add(sat2);
    ring3.add(sat3);
    sat1.position.set(3.1, 0, 0);
    sat2.position.set(3.5, 0, 0);
    sat3.position.set(2.7, 0, 0);

    // --- 4. Orbiting Telemetry Network Nodes ---
    const NODE_COUNT = 52;
    const nodePositions: THREE.Vector3[] = [];
    const nodeSpeeds: number[] = [];
    const nodeRadii: number[] = [];

    const nodesGeo = new THREE.BufferGeometry();
    const nodePositionsArr = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const radius = 2.5 + (i % 6) * 0.3;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeSpeeds.push(0.003 + (i % 4) * 0.0015);
      nodeRadii.push(radius);

      nodePositionsArr[i * 3] = x;
      nodePositionsArr[i * 3 + 1] = y;
      nodePositionsArr[i * 3 + 2] = z;
    }

    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositionsArr, 3));

    const nodesMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.085,
      transparent: true,
      opacity: 0.9,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    coreGroup.add(nodesMesh);

    // Connecting Lines between near nodes
    const MAX_LINES = 100;
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x356dff,
      transparent: true,
      opacity: 0.22,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    coreGroup.add(lineMesh);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener('resize', handleResize);

    // Interactive Drag Physics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      dragRotY += deltaX * 0.008;
      dragRotX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    let currentLerp = {
      coreScale: 1.0,
      distortion: 0.22,
      signalStrength: 0.25,
      scanline: 0.18,
      cageOpacity: 0.3,
      ringScale: 1.0,
      targetRotSpeed: 0.0035,
      posX: 2.2,
      posY: 0.1,
    };

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const isDesktop = window.innerWidth >= 1024;
      const isLight = themeRef.current === 'light';

      // Update theme uniforms & lighting
      ambientLight.intensity = isLight ? 1.1 : 0.7;
      coreUniforms.uIsLight.value = isLight ? 1.0 : 0.0;
      coreUniforms.uColorBase.value.lerp(new THREE.Color(isLight ? '#EBF2FF' : '#040711'), 0.08);
      cageMat.color.lerp(new THREE.Color(isLight ? '#2563EB' : '#356DFF'), 0.08);

      // Section target parameters
      const activeParams = SECTION_PARAMS[sectionRef.current] || SECTION_PARAMS.hero;
      const targetPosX = isDesktop ? activeParams.posXDesktop : 0;
      const targetPosY = isDesktop ? activeParams.posYDesktop : (sectionRef.current === 'hero' ? 0.8 : 0);

      // Smooth state interpolation (lerp)
      currentLerp.coreScale += (activeParams.coreRadius / 1.65 - currentLerp.coreScale) * 0.04;
      currentLerp.distortion += (activeParams.distortion - currentLerp.distortion) * 0.05;
      currentLerp.signalStrength += (activeParams.signalStrength - currentLerp.signalStrength) * 0.05;
      currentLerp.scanline += (activeParams.scanlineIntensity - currentLerp.scanline) * 0.05;
      currentLerp.cageOpacity += (activeParams.wireframeOpacity - currentLerp.cageOpacity) * 0.05;
      currentLerp.ringScale += (activeParams.ringsRadius / 3.2 - currentLerp.ringScale) * 0.04;
      currentLerp.targetRotSpeed += (activeParams.rotSpeed - currentLerp.targetRotSpeed) * 0.05;
      currentLerp.posX += (targetPosX - currentLerp.posX) * 0.04;
      currentLerp.posY += (targetPosY - currentLerp.posY) * 0.04;

      // Update shader uniforms
      coreUniforms.uTime.value = elapsed;
      coreUniforms.uDistortion.value = currentLerp.distortion;
      coreUniforms.uSignalStrength.value = currentLerp.signalStrength;
      coreUniforms.uScanline.value = currentLerp.scanline;
      coreUniforms.uColorRim.value.lerp(activeParams.colorRim, 0.05);
      coreUniforms.uColorSignal.value.lerp(activeParams.colorSignal, 0.05);

      // Apply transforms
      coreMesh.scale.setScalar(currentLerp.coreScale);
      cageMesh.scale.setScalar(currentLerp.coreScale * 1.16);
      cageMat.opacity = currentLerp.cageOpacity;
      ringGroup.scale.setScalar(currentLerp.ringScale);

      // Position in viewport
      coreGroup.position.x = currentLerp.posX;
      coreGroup.position.y = currentLerp.posY;

      // Rotations & drag dampening
      coreGroup.rotation.y += currentLerp.targetRotSpeed + dragRotY * 0.1;
      coreGroup.rotation.x += dragRotX * 0.1;
      dragRotX *= 0.92;
      dragRotY *= 0.92;

      cageMesh.rotation.x -= currentLerp.targetRotSpeed * 0.8;
      cageMesh.rotation.z += currentLerp.targetRotSpeed * 0.5;

      ring1.rotation.z += 0.0025;
      ring2.rotation.z -= 0.003;
      ring3.rotation.z += 0.0035;

      // Pointer deflection
      const targetParallaxX = mouseRef.current.y * 0.25;
      const targetParallaxY = mouseRef.current.x * 0.35;
      coreGroup.rotation.x += (targetParallaxX - coreGroup.rotation.x) * 0.03;
      coreGroup.rotation.y += (targetParallaxY - coreGroup.rotation.y) * 0.03;

      // Update node positions and calculate nearest connection lines
      const positionsAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      const posArray = positionsAttr.array as Float32Array;

      let lineIndex = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const speed = nodeSpeeds[i];
        const rad = nodeRadii[i] * (activeParams.nodeSpread / 2.8);

        const ang = elapsed * speed + (i * 0.4);
        const x = Math.cos(ang) * rad;
        const y = Math.sin(ang * 0.8) * (rad * 0.8);
        const z = Math.sin(ang) * rad;

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        for (let j = i + 1; j < NODE_COUNT && lineIndex < MAX_LINES; j++) {
          const dx = x - posArray[j * 3];
          const dy = y - posArray[j * 3 + 1];
          const dz = z - posArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 1.9) {
            linePositions[lineIndex * 6] = x;
            linePositions[lineIndex * 6 + 1] = y;
            linePositions[lineIndex * 6 + 2] = z;
            linePositions[lineIndex * 6 + 3] = posArray[j * 3];
            linePositions[lineIndex * 6 + 4] = posArray[j * 3 + 1];
            linePositions[lineIndex * 6 + 5] = posArray[j * 3 + 2];
            lineIndex++;
          }
        }
      }

      for (let k = lineIndex; k < MAX_LINES; k++) {
        linePositions[k * 6] = 0;
        linePositions[k * 6 + 1] = 0;
        linePositions[k * 6 + 2] = 0;
        linePositions[k * 6 + 3] = 0;
        linePositions[k * 6 + 4] = 0;
        linePositions[k * 6 + 5] = 0;
      }

      positionsAttr.needsUpdate = true;
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="digital-core-canvas"
      className="digital-core fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-out"
      style={{
        opacity: preloaderComplete ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
}
