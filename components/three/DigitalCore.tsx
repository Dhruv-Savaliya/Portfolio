'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore, CoreMorphTarget } from '@/lib/store';

// ============================================
// CORE SHADER DEFINITIONS
// ============================================
const coreVertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform float uDistortion;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;
  varying float vElevation;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Controlled procedural surface resonance
    float wave = sin(position.x * 2.5 + uTime * 0.8) * cos(position.y * 2.5 + uTime * 0.6);
    float displacement = wave * uDistortion * 0.15;
    
    // Subtle pointer deflection
    float mouseDist = length(position.xy - uMouse);
    displacement += sin(mouseDist * 3.0 - uTime * 1.5) * 0.03 * uDistortion;

    vec3 newPos = position + normal * displacement;
    vElevation = displacement;

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
  uniform vec3 uColorSignal;
  uniform float uSignalStrength;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vFresnel;
  varying float vElevation;

  void main() {
    // Dark ink core with electric blue rim
    vec3 color = mix(uColorBase, uColorRim, vFresnel * 0.85);

    // Subtle technical scanline
    float scan = sin(vPosition.y * 40.0 + uTime * 3.0) * 0.03 + 0.97;
    color *= scan;

    // Signal accent pulse (for AI / active transitions)
    if (uSignalStrength > 0.01) {
      color = mix(color, uColorSignal, uSignalStrength * (vElevation * 4.0 + 0.3));
    }

    gl_FragColor = vec4(color, uOpacity * (0.8 + vFresnel * 0.2));
  }
`;

// ============================================
// MORPH TARGET TRANSFORMATIONS
// ============================================
interface TransformState {
  pos: [number, number, number];
  rotSpeed: number;
  scale: number;
  distortion: number;
  signal: number;
  ringSpread: number;
}

const MORPH_STATES: Record<CoreMorphTarget, TransformState> = {
  hero: {
    pos: [0, 0, 0],
    rotSpeed: 0.003,
    scale: 1.0,
    distortion: 0.2,
    signal: 0.0,
    ringSpread: 1.0,
  },
  intro: {
    pos: [0, 0, -1.2],
    rotSpeed: 0.002,
    scale: 0.8,
    distortion: 0.1,
    signal: 0.0,
    ringSpread: 0.8,
  },
  bizdhan: {
    pos: [1.3, 0.1, -0.4],
    rotSpeed: 0.004,
    scale: 0.95,
    distortion: 0.35,
    signal: 0.1,
    ringSpread: 1.4,
  },
  clearclaim: {
    pos: [-1.2, -0.1, -0.5],
    rotSpeed: 0.0035,
    scale: 0.9,
    distortion: 0.25,
    signal: 0.15,
    ringSpread: 1.6,
  },
  receipt: {
    pos: [1.2, 0.0, -0.3],
    rotSpeed: 0.005,
    scale: 0.9,
    distortion: 0.4,
    signal: 0.3,
    ringSpread: 1.2,
  },
  about: {
    pos: [0, 0, -0.6],
    rotSpeed: 0.002,
    scale: 0.85,
    distortion: 0.15,
    signal: 0.0,
    ringSpread: 0.9,
  },
  technology: {
    pos: [1.4, -0.2, -0.2],
    rotSpeed: 0.006,
    scale: 1.05,
    distortion: 0.3,
    signal: 0.4,
    ringSpread: 1.5,
  },
  contact: {
    pos: [0, 0.2, -0.1],
    rotSpeed: 0.008,
    scale: 1.15,
    distortion: 0.45,
    signal: 0.6,
    ringSpread: 1.3,
  },
  footer: {
    pos: [0, 0, 0],
    rotSpeed: 0.001,
    scale: 0.75,
    distortion: 0.05,
    signal: 0.2,
    ringSpread: 0.4,
  },
  idle: {
    pos: [0, 0, 0],
    rotSpeed: 0.003,
    scale: 1.0,
    distortion: 0.2,
    signal: 0.0,
    ringSpread: 1.0,
  },
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
  scale = 1,
}: DigitalCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const innerCageRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  const dMonogramRef = useRef<THREE.Group>(null);

  const coreMorphTarget = useExperienceStore((s) => s.coreMorphTarget);
  const activeTechCategory = useExperienceStore((s) => s.activeTechCategory);

  // Shader uniforms
  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorphProgress: { value: 0 },
      uDistortion: { value: 0.2 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorBase: { value: new THREE.Color('#080B10') },
      uColorRim: { value: new THREE.Color('#356DFF') },
      uColorSignal: { value: new THREE.Color('#B8FF5A') },
      uSignalStrength: { value: 0 },
      uOpacity: { value: 1.0 },
    }),
    []
  );

  // Instanced nodes data (24 network nodes that reorganize per scene)
  const nodeCount = 24;
  const nodeCoords = useMemo(() => {
    const coords: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      coords.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * 1.8,
          Math.sin(theta) * Math.sin(phi) * 1.8,
          Math.cos(phi) * 1.8
        )
      );
    }
    return coords;
  }, [nodeCount]);

  // Current interpolated values for smooth transitions
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentScale = useRef(1.0);
  const currentDistortion = useRef(0.2);
  const currentSignal = useRef(0.0);

  // Node position targets based on active scene / tech category
  useFrame((state, delta) => {
    const targetState = MORPH_STATES[coreMorphTarget] || MORPH_STATES.hero;
    const time = state.clock.getElapsedTime();

    // 1. Smoothly interpolate position, scale, and distortion
    currentPos.current.lerp(
      new THREE.Vector3(...targetState.pos),
      Math.min(1, delta * 3.5)
    );
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetState.scale * scale,
      Math.min(1, delta * 3.5)
    );
    currentDistortion.current = THREE.MathUtils.lerp(
      currentDistortion.current,
      targetState.distortion,
      Math.min(1, delta * 3.5)
    );

    // Boost signal if tech category hovered
    let targetSignal = targetState.signal;
    if (activeTechCategory) targetSignal = 0.7;

    currentSignal.current = THREE.MathUtils.lerp(
      currentSignal.current,
      targetSignal,
      Math.min(1, delta * 4.0)
    );

    // Apply to group
    if (groupRef.current) {
      // Parallax mouse follow with controlled damping
      const targetParallaxX = currentPos.current.x + mouseX * 0.25;
      const targetParallaxY = currentPos.current.y - mouseY * 0.25;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetParallaxX,
        Math.min(1, delta * 4)
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetParallaxY,
        Math.min(1, delta * 4)
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        currentPos.current.z,
        Math.min(1, delta * 4)
      );

      groupRef.current.scale.setScalar(currentScale.current);

      // Controlled rotational drift
      groupRef.current.rotation.y += targetState.rotSpeed;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.15,
        Math.min(1, delta * 3)
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouseX * 0.1,
        Math.min(1, delta * 3)
      );
    }

    // 2. Orbital Rings Kinetic Choreography
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.35;
      ring1Ref.current.rotation.y = time * 0.2;
      const ringScale = targetState.ringSpread;
      ring1Ref.current.scale.setScalar(ringScale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.45;
      ring2Ref.current.rotation.z = time * 0.25;
      const ringScale = targetState.ringSpread * 1.15;
      ring2Ref.current.scale.setScalar(ringScale);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.25;
      ring3Ref.current.rotation.z = -time * 0.35;
      const ringScale = targetState.ringSpread * 1.3;
      ring3Ref.current.scale.setScalar(ringScale);
    }

    // 3. Inner Cage Counter-Rotation
    if (innerCageRef.current) {
      innerCageRef.current.rotation.x = -time * 0.4;
      innerCageRef.current.rotation.y = -time * 0.3;
    }

    // 4. Update Uniforms
    coreUniforms.uTime.value = time;
    coreUniforms.uDistortion.value = currentDistortion.current;
    coreUniforms.uSignalStrength.value = currentSignal.current;
    coreUniforms.uMouse.value.set(mouseX, mouseY);

    // 5. Footer Monogram Mode: Reveal "D" structural form when footer is active
    if (dMonogramRef.current) {
      const isFooter = coreMorphTarget === 'footer';
      dMonogramRef.current.scale.lerp(
        new THREE.Vector3(isFooter ? 1 : 0.01, isFooter ? 1 : 0.01, isFooter ? 1 : 0.01),
        Math.min(1, delta * 4)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Central Polyhedral Nucleus (Icosahedron with Custom Shader) ── */}
      <mesh ref={nucleusRef}>
        <icosahedronGeometry args={[1.2, 3]} />
        <shaderMaterial
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={coreUniforms}
          transparent
          depthWrite
        />
      </mesh>

      {/* ── Inner Structural Wireframe Lattice ── */}
      <mesh ref={innerCageRef}>
        <octahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          color="#7EA2FF"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ── Precision Orbital Gimbal Rings ── */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.65, 0.012, 16, 100]} />
        <meshBasicMaterial color="#356DFF" transparent opacity={0.5} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.9, 0.01, 16, 100]} />
        <meshBasicMaterial color="#7EA2FF" transparent opacity={0.35} />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.15, 0.008, 16, 100]} />
        <meshBasicMaterial color="#B8FF5A" transparent opacity={0.25} />
      </mesh>

      {/* ── Network Satellite Nodes (Instanced Flow Points) ── */}
      <group ref={nodesGroupRef}>
        {nodeCoords.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <octahedronGeometry args={[0.045, 0]} />
            <meshBasicMaterial
              color={idx % 4 === 0 ? '#B8FF5A' : '#7EA2FF'}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* ── Monogram "D" Structural Geometry (Revealed at Footer Collapse) ── */}
      <group ref={dMonogramRef} scale={[0.01, 0.01, 0.01]}>
        {/* Spine line */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.08, 2.0, 0.08]} />
          <meshBasicMaterial color="#356DFF" />
        </mesh>
        {/* Top bar */}
        <mesh position={[-0.05, 0.95, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.08]} />
          <meshBasicMaterial color="#7EA2FF" />
        </mesh>
        {/* Bottom bar */}
        <mesh position={[-0.05, -0.95, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.08]} />
          <meshBasicMaterial color="#7EA2FF" />
        </mesh>
        {/* Arc */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.95, 0.04, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#B8FF5A" />
        </mesh>
      </group>
    </group>
  );
}
