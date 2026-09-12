'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore, CoreMorphTarget } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ============================================
// CORE SHADER DEFINITIONS
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

    float wave = sin(position.x * 2.5 + uTime * 0.8) * cos(position.y * 2.5 + uTime * 0.6);
    float displacement = wave * uDistortion * 0.15;
    
    vec3 newPos = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec3 viewDir = normalize(-mvPosition.xyz);
    vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);
  }
`;

const coreFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorBase;
  uniform vec3 uColorRim;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;

  void main() {
    vec3 color = mix(uColorBase, uColorRim, vFresnel * 0.85);
    float scan = sin(vPosition.y * 40.0 + uTime * 3.0) * 0.03 + 0.97;
    color *= scan;
    gl_FragColor = vec4(color, uOpacity * (0.8 + vFresnel * 0.2));
  }
`;

// ============================================
// MORPH TARGET TRANSFORMATIONS
// ============================================
interface TransformState {
  pos: [number, number, number];
  rotSpeed: number;
}

const MORPH_STATES: Record<CoreMorphTarget, TransformState> = {
  hero: { pos: [0, 0, 0], rotSpeed: 0.003 },
  intro: { pos: [1.5, 0, -1], rotSpeed: 0.002 },
  bizdhan: { pos: [1.2, 0.2, -0.4], rotSpeed: 0.004 },
  clearclaim: { pos: [1.2, 0.2, -0.4], rotSpeed: 0.0035 },
  smartreceipt: { pos: [1.2, 0.2, -0.4], rotSpeed: 0.005 },
  about: { pos: [1.2, 0.2, -0.4], rotSpeed: 0.002 },
  experience: { pos: [0, 0, -0.8], rotSpeed: 0.002 },
  technology: { pos: [0, 0, 0], rotSpeed: 0.006 },
  contact: { pos: [1.5, 0.2, -1], rotSpeed: 0.008 },
  footer: { pos: [0, 0, 0], rotSpeed: 0.001 },
  idle: { pos: [0, 0, 0], rotSpeed: 0.003 },
};

// ============================================
// MAIN DIGITAL CORE COMPONENT
// ============================================
interface DigitalCoreProps {
  mouseX?: number;
  mouseY?: number;
  scale?: number;
}

export default function DigitalCore({
  mouseX = 0,
  mouseY = 0,
}: DigitalCoreProps) {
  const mainGroupRef = useRef<THREE.Group>(null);
  
  // Model refs
  const heroCoreRef = useRef<THREE.Group>(null);
  const bizdhanRef = useRef<THREE.Group>(null);
  const clearclaimRef = useRef<THREE.Group>(null);
  const smartreceiptRef = useRef<THREE.Group>(null);
  const aboutRef = useRef<THREE.Group>(null);
  const experienceRef = useRef<THREE.Group>(null);
  const technologyRef = useRef<THREE.Group>(null);

  const coreMorphTarget = useExperienceStore((s) => s.coreMorphTarget);
  const prefersReducedMotion = useReducedMotion();

  // Internal animated properties
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  
  // Scales for individual models
  const scales = useRef({
    heroCore: 1,
    bizdhan: 0,
    clearclaim: 0,
    smartreceipt: 0,
    about: 0,
    experience: 0,
    technology: 0,
  });

  const coreUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDistortion: { value: 0.2 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorBase: { value: new THREE.Color('#080B10') },
    uColorRim: { value: new THREE.Color('#356DFF') },
    uOpacity: { value: 1.0 },
  }), []);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();
    const targetState = MORPH_STATES[coreMorphTarget] || MORPH_STATES.hero;

    // 1. Move the entire group to position
    currentPos.current.lerp(new THREE.Vector3(...targetState.pos), Math.min(1, delta * 3.5));
    if (mainGroupRef.current) {
      const targetParallaxX = currentPos.current.x + mouseX * 0.25;
      const targetParallaxY = currentPos.current.y - mouseY * 0.25;
      mainGroupRef.current.position.set(
        THREE.MathUtils.lerp(mainGroupRef.current.position.x, targetParallaxX, delta * 4),
        THREE.MathUtils.lerp(mainGroupRef.current.position.y, targetParallaxY, delta * 4),
        THREE.MathUtils.lerp(mainGroupRef.current.position.z, currentPos.current.z, delta * 4)
      );
      mainGroupRef.current.rotation.y += targetState.rotSpeed;
      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(mainGroupRef.current.rotation.x, mouseY * 0.15, delta * 3);
      mainGroupRef.current.rotation.z = THREE.MathUtils.lerp(mainGroupRef.current.rotation.z, mouseX * 0.1, delta * 3);
    }

    // 2. Animate individual model scales based on active state
    const dt = Math.min(1, delta * 5.0);
    scales.current.heroCore = THREE.MathUtils.lerp(scales.current.heroCore, ['hero', 'intro', 'contact', 'footer', 'idle'].includes(coreMorphTarget) ? 1 : 0, dt);
    scales.current.bizdhan = THREE.MathUtils.lerp(scales.current.bizdhan, coreMorphTarget === 'bizdhan' ? 1 : 0, dt);
    scales.current.clearclaim = THREE.MathUtils.lerp(scales.current.clearclaim, coreMorphTarget === 'clearclaim' ? 1 : 0, dt);
    scales.current.smartreceipt = THREE.MathUtils.lerp(scales.current.smartreceipt, coreMorphTarget === 'smartreceipt' ? 1 : 0, dt);
    scales.current.about = THREE.MathUtils.lerp(scales.current.about, coreMorphTarget === 'about' ? 1 : 0, dt);
    scales.current.experience = THREE.MathUtils.lerp(scales.current.experience, coreMorphTarget === 'experience' ? 1 : 0, dt);
    scales.current.technology = THREE.MathUtils.lerp(scales.current.technology, coreMorphTarget === 'technology' ? 1 : 0, dt);

    // Apply scales
    if (heroCoreRef.current) heroCoreRef.current.scale.setScalar(scales.current.heroCore);
    if (bizdhanRef.current) bizdhanRef.current.scale.setScalar(scales.current.bizdhan);
    if (clearclaimRef.current) clearclaimRef.current.scale.setScalar(scales.current.clearclaim);
    if (smartreceiptRef.current) smartreceiptRef.current.scale.setScalar(scales.current.smartreceipt);
    if (aboutRef.current) aboutRef.current.scale.setScalar(scales.current.about);
    if (experienceRef.current) experienceRef.current.scale.setScalar(scales.current.experience);
    if (technologyRef.current) technologyRef.current.scale.setScalar(scales.current.technology);

    // 3. Update uniforms and internal animations
    coreUniforms.uTime.value = time;
    
    if (heroCoreRef.current) {
      heroCoreRef.current.rotation.x = time * 0.1;
      heroCoreRef.current.rotation.y = time * 0.15;
    }
    if (bizdhanRef.current) {
      bizdhanRef.current.rotation.y = time * 0.2;
    }
    if (clearclaimRef.current) {
      clearclaimRef.current.rotation.x = time * 0.1;
      clearclaimRef.current.rotation.y = time * 0.2;
    }
    if (smartreceiptRef.current) {
      smartreceiptRef.current.rotation.y = time * 0.1;
      // Animate laser scanner line
      const laser = smartreceiptRef.current.children.find(c => c.name === 'laser');
      if (laser) {
        laser.position.z = Math.sin(time * 2) * 0.8;
      }
    }
    if (aboutRef.current) {
      aboutRef.current.rotation.y = time * 0.1;
      aboutRef.current.rotation.z = time * 0.05;
    }
    if (experienceRef.current) {
      experienceRef.current.rotation.z = time * 0.05;
    }
    if (technologyRef.current) {
      technologyRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={mainGroupRef}>
      
      {/* 1. HERO CORE */}
      <group ref={heroCoreRef}>
        <mesh>
          <icosahedronGeometry args={[1.2, 3]} />
          <shaderMaterial vertexShader={coreVertexShader} fragmentShader={coreFragmentShader} uniforms={coreUniforms} transparent depthWrite />
        </mesh>
        <mesh>
          <octahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#7EA2FF" wireframe transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
          <torusGeometry args={[1.8, 0.012, 16, 100]} />
          <meshBasicMaterial color="#356DFF" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 2. BIZDHAN CHART */}
      <group ref={bizdhanRef}>
        {/* Three bar charts */}
        {[0, 1, 2].map((i) => {
          const height = 0.8 + (i * 0.4);
          return (
            <mesh key={i} position={[(i - 1) * 0.6, height / 2 - 0.5, 0]}>
              <boxGeometry args={[0.4, height, 0.4]} />
              <meshBasicMaterial color="#356DFF" transparent opacity={0.6} wireframe />
              <mesh scale={[0.9, 0.9, 0.9]}>
                <boxGeometry args={[0.4, height, 0.4]} />
                <meshBasicMaterial color="#080B10" />
              </mesh>
            </mesh>
          );
        })}
        {/* Base grid */}
        <gridHelper args={[3, 10, '#356DFF', '#356DFF']} position={[0, -0.5, 0]} rotation={[0, 0, 0]} material-transparent material-opacity={0.3} />
      </group>

      {/* 3. CLEARCLAIM NODES */}
      <group ref={clearclaimRef}>
        <mesh position={[0, 1, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial color="#B8FF5A" wireframe />
        </mesh>
        <mesh position={[-0.8, -0.5, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial color="#356DFF" wireframe />
        </mesh>
        <mesh position={[0.8, -0.5, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial color="#7EA2FF" wireframe />
        </mesh>
        {/* Connecting lines */}
        <mesh position={[-0.4, 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.01, 0.01, 1.2]} />
          <meshBasicMaterial color="#356DFF" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.4, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.01, 0.01, 1.2]} />
          <meshBasicMaterial color="#356DFF" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 1.6]} />
          <meshBasicMaterial color="#356DFF" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 4. SMART RECEIPT SCANNER */}
      <group ref={smartreceiptRef} rotation={[-Math.PI/2 + 0.2, 0, 0]}>
        {/* Document plane */}
        <mesh>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#080B10" side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#356DFF" wireframe />
        </mesh>
        {/* Laser line */}
        <mesh name="laser" position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.02, 0.05]} />
          <meshBasicMaterial color="#B8FF5A" />
        </mesh>
      </group>

      {/* 5. ABOUT NEURAL NODES */}
      <group ref={aboutRef}>
        {[...Array(15)].map((_, i) => {
          const pos = [
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ] as [number, number, number];
          return (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#356DFF" />
            </mesh>
          );
        })}
        {/* Inner glow core */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#7EA2FF" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      {/* 6. EXPERIENCE TIMELINE SPIRAL */}
      <group ref={experienceRef}>
        {[...Array(30)].map((_, i) => {
          const angle = i * 0.3;
          const radius = 0.5 + i * 0.05;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <mesh key={i} position={[x, y, -i * 0.1]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.2, 0.02, 0.02]} />
              <meshBasicMaterial color="#356DFF" transparent opacity={1 - (i / 30)} />
            </mesh>
          );
        })}
      </group>

      {/* 7. TECHNOLOGY GLOBE */}
      <group ref={technologyRef}>
        <mesh>
          <sphereGeometry args={[2.0, 24, 24]} />
          <meshBasicMaterial color="#356DFF" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh scale={[0.9, 0.9, 0.9]}>
          <sphereGeometry args={[2.0, 16, 16]} />
          <meshBasicMaterial color="#080B10" />
        </mesh>
        {/* Equatorial ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#B8FF5A" transparent opacity={0.5} />
        </mesh>
      </group>

    </group>
  );
}
