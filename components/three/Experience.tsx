'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import DigitalCore from './DigitalCore';
import { useExperienceStore } from '@/lib/store';

interface ExperienceProps {
  mouseX?: number;
  mouseY?: number;
  coreScale?: number;
  showPostProcessing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function SceneContent({
  mouseX = 0,
  mouseY = 0,
  coreScale = 1,
  showPostProcessing = true,
}: ExperienceProps) {
  return (
    <>
      {/* ── Cinematic Lighting ── */}
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.6}
        color="#F4F6FA"
      />
      {/* Electric Blue Rim Light */}
      <pointLight
        position={[-5, -3, -4]}
        intensity={0.8}
        color="#356DFF"
      />
      {/* Secondary Signal Accent */}
      <pointLight
        position={[3, -4, 3]}
        intensity={0.3}
        color="#B8FF5A"
      />

      {/* ── Persistent Digital Core ── */}
      <DigitalCore mouseX={mouseX} mouseY={mouseY} scale={coreScale} />

      {/* ── Restrained Cinematic Post-Processing ── */}
      {showPostProcessing && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.28}
            luminanceThreshold={0.65}
            luminanceSmoothing={0.3}
          />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}

      <Preload all />
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function Experience({
  mouseX = 0,
  mouseY = 0,
  coreScale = 1,
  showPostProcessing = true,
  className = '',
  style,
}: ExperienceProps) {
  const setWebglReady = useExperienceStore((s) => s.setWebglReady);

  useEffect(() => {
    // Notify store on mount
    setWebglReady(true);
  }, [setWebglReady]);

  return (
    <div
      className={`w-full h-full ${className}`}
      style={style}
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [0, 0, 5.5],
          fov: 42,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent
            mouseX={mouseX}
            mouseY={mouseY}
            coreScale={coreScale}
            showPostProcessing={showPostProcessing}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
