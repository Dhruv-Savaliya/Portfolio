'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
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
      {/* Ambient + point lights */}
      <ambientLight intensity={0.05} />
      <pointLight
        position={[4, 4, 4]}
        intensity={0.4}
        color="#C8FF00"
      />
      <pointLight
        position={[-4, -2, -4]}
        intensity={0.2}
        color="#00E5FF"
      />

      {/* Digital Core */}
      <DigitalCore mouseX={mouseX} mouseY={mouseY} scale={coreScale} />

      {/* Post processing */}
      {showPostProcessing && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.4}
            blendFunction={BlendFunction.SCREEN}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0008, 0.0008)}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
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

  return (
    <div className={`absolute inset-0 ${className}`} style={style}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        onCreated={() => {
          setWebglReady(true);
        }}
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
