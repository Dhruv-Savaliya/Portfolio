'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/lib/store';

// ============================================
// DIGITAL CORE SHADER
// ============================================
const vertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform float uDistortionStrength;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Noise-based displacement
    float noise = snoise(position * 0.8 + uTime * 0.3);
    float noise2 = snoise(position * 1.5 - uTime * 0.2);
    vNoise = noise;
    
    // Mouse influence
    float mouseInfluence = dot(normalize(position), vec3(uMouse, 0.5)) * 0.5;
    
    // Morph displacement — transforms core shape
    float morphDisplace = mix(
      noise * uDistortionStrength,
      noise2 * uDistortionStrength * 1.5,
      uMorphProgress
    );
    
    vec3 displaced = position + normal * (morphDisplace + mouseInfluence * 0.1);
    vPosition = displaced;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorAccent;
  uniform float uMorphProgress;
  uniform float uOpacity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;
  
  void main() {
    // Fresnel rim light
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    // Base color gradient
    float t = vNoise * 0.5 + 0.5;
    vec3 baseColor = mix(uColorA, uColorB, t);
    
    // Accent glow on rim
    vec3 rimColor = mix(baseColor, uColorAccent, fresnel * 0.8);
    
    // Scanline pattern
    float scanline = sin(vPosition.y * 20.0 + uTime * 2.0) * 0.04 + 0.96;
    rimColor *= scanline;
    
    // Energy pulse
    float pulse = sin(uTime * 1.5 + vPosition.x * 3.0) * 0.1 + 0.9;
    rimColor *= pulse;
    
    gl_FragColor = vec4(rimColor, uOpacity * (0.7 + fresnel * 0.3));
  }
`;

const wireframeVertexShader = `
  uniform float uTime;
  uniform float uDistortionStrength;
  uniform vec2 uMouse;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    float noise = snoise(position * 0.8 + uTime * 0.3);
    float mouseInfluence = dot(normalize(position), vec3(uMouse, 0.5)) * 0.08;
    vec3 displaced = position + normal * (noise * uDistortionStrength + mouseInfluence);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const wireframeFragmentShader = `
  uniform vec3 uWireColor;
  uniform float uOpacity;
  
  void main() {
    gl_FragColor = vec4(uWireColor, uOpacity);
  }
`;

// ============================================
// PARTICLE SYSTEM SHADER
// ============================================
const particleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute float aOffset;
  
  void main() {
    vec3 pos = position;
    float angle = uTime * 0.4 + aOffset * 6.28318;
    float radius = length(pos.xz);
    pos.x += cos(angle) * 0.05;
    pos.z += sin(angle) * 0.05;
    pos.y += sin(uTime * 0.8 + aOffset * 3.14) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  uniform vec3 uColor;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(uColor, alpha * 0.6);
  }
`;

// ============================================
// MORPH CONFIGS PER SECTION
// ============================================
const MORPH_CONFIGS = {
  idle:       { distortion: 0.18, rotSpeed: 0.003, colorB: [0.08, 0.08, 0.1]  },
  bizdhan:    { distortion: 0.25, rotSpeed: 0.005, colorB: [0.0, 0.2, 0.05]   },
  clearclaim: { distortion: 0.22, rotSpeed: 0.004, colorB: [0.0, 0.1, 0.2]    },
  receipt:    { distortion: 0.3,  rotSpeed: 0.007, colorB: [0.1, 0.0, 0.2]    },
  footer:     { distortion: 0.05, rotSpeed: 0.001, colorB: [0.05, 0.05, 0.05] },
} as const;

// ============================================
// COMPONENT
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
  const meshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const coreMorphTarget = useExperienceStore((s) => s.coreMorphTarget);
  const morphProgressRef = useRef(0);

  // Build geometry
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 5);
    return geo;
  }, []);

  // Build wireframe geometry (lower detail)
  const wireGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.25, 2);
    return geo;
  }, []);

  // Build particle geometry (~350 particles)
  const particleGeometry = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.6 + Math.random() * 0.8;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      scales[i] = Math.random() * 0.8 + 0.2;
      offsets[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    return geo;
  }, []);

  // Core material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:              { value: 0 },
        uMorphProgress:     { value: 0 },
        uDistortionStrength:{ value: 0.18 },
        uMouse:             { value: new THREE.Vector2(0, 0) },
        uColorA:            { value: new THREE.Color(0.03, 0.03, 0.03) },
        uColorB:            { value: new THREE.Color(0.08, 0.08, 0.1) },
        uColorAccent:       { value: new THREE.Color(0.784, 1.0, 0.0) }, // lime #C8FF00
        uOpacity:           { value: 0.9 },
      },
      transparent: true,
      side: THREE.FrontSide,
    });
  }, []);

  // Wireframe material
  const wireMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: wireframeVertexShader,
      fragmentShader: wireframeFragmentShader,
      uniforms: {
        uTime:              { value: 0 },
        uDistortionStrength:{ value: 0.18 },
        uMouse:             { value: new THREE.Vector2(0, 0) },
        uWireColor:         { value: new THREE.Color(0.784, 1.0, 0.0) },
        uOpacity:           { value: 0.12 },
      },
      transparent: true,
      wireframe: true,
    });
  }, []);

  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uSize:  { value: 3.0 },
        uColor: { value: new THREE.Color(0.784, 1.0, 0.0) },
      },
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      wireGeometry.dispose();
      particleGeometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      particleMaterial.dispose();
    };
  }, [geometry, wireGeometry, particleGeometry, material, wireMaterial, particleMaterial]);

  // Animate
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const config = MORPH_CONFIGS[coreMorphTarget];

    // Lerp morph progress
    morphProgressRef.current = THREE.MathUtils.lerp(
      morphProgressRef.current,
      coreMorphTarget === 'idle' ? 0 : 1,
      0.02
    );

    // Update uniforms
    material.uniforms.uTime.value = t;
    material.uniforms.uMorphProgress.value = morphProgressRef.current;
    material.uniforms.uDistortionStrength.value = THREE.MathUtils.lerp(
      material.uniforms.uDistortionStrength.value,
      config.distortion,
      0.03
    );
    material.uniforms.uMouse.value.set(mouseX * 0.3, mouseY * 0.3);

    wireMaterial.uniforms.uTime.value = t;
    wireMaterial.uniforms.uDistortionStrength.value = material.uniforms.uDistortionStrength.value;
    wireMaterial.uniforms.uMouse.value.set(mouseX * 0.3, mouseY * 0.3);

    particleMaterial.uniforms.uTime.value = t;

    // Footer collapse
    if (coreMorphTarget === 'footer') {
      material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        material.uniforms.uOpacity.value, 0.0, 0.02
      );
      wireMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        wireMaterial.uniforms.uOpacity.value, 0.0, 0.02
      );
    } else {
      material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        material.uniforms.uOpacity.value, 0.9, 0.02
      );
      wireMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        wireMaterial.uniforms.uOpacity.value, 0.12, 0.02
      );
    }

    // Idle rotation + mouse influence
    if (groupRef.current) {
      groupRef.current.rotation.y += config.rotSpeed + mouseX * 0.002;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.3,
        0.04
      );
      // Breathing scale
      const breathe = 1 + Math.sin(t * 0.5) * 0.015;
      groupRef.current.scale.setScalar(scale * breathe);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core mesh */}
      <mesh ref={meshRef} geometry={geometry} material={material} />

      {/* Wireframe overlay */}
      <mesh ref={wireMeshRef} geometry={wireGeometry} material={wireMaterial} />

      {/* Particles */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
    </group>
  );
}
