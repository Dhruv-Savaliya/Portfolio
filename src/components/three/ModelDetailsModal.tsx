import React from 'react';
import { X, Box, Cpu, Sparkles, Layers, Sliders, Code2, Download } from 'lucide-react';
import { CoreMorphTarget } from '../../types';
import { sound } from '../../lib/audio';

interface ModelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: CoreMorphTarget;
  onSelectSection: (section: CoreMorphTarget) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  speed: number;
  onChangeSpeed: (s: number) => void;
  distortion: number;
  onChangeDistortion: (d: number) => void;
}

export const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  wireframe,
  onToggleWireframe,
  speed,
  onChangeSpeed,
  distortion,
  onChangeDistortion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div 
        id="model-spec-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-3xl p-6 sm:p-8 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                Digital Core — 3D Architecture & GLTF Specification
              </h2>
              <p className="text-xs sm:text-sm text-cyan-400 font-mono">
                ENGINE: Three.js r170 • SHADERS: GLSL 3.0 • PHYSICS: React Spring / LERP
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Controller Panel */}
        <div className="mb-8 p-5 rounded-2xl bg-[#070b16] border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-3 text-sm">
            <Sliders className="w-4 h-4" />
            <span>Interactive 3D Core Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            {/* Wireframe toggle */}
            <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400">Wireframe Mesh</span>
              <button
                onClick={() => {
                  sound.playTick();
                  onToggleWireframe();
                }}
                className={`mt-2 py-1.5 px-3 rounded-lg font-semibold transition-all ${
                  wireframe 
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                {wireframe ? 'WIREFRAME ON' : 'SOLID SHADED'}
              </button>
            </div>

            {/* Rotation speed */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Rotation Velocity</span>
                <span className="text-cyan-400">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
            </div>

            {/* Distortion wave */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Shader Wave Displace</span>
                <span className="text-purple-400">{distortion.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={distortion}
                onChange={(e) => onChangeDistortion(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Morph Targets Quick Jump */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-xs text-slate-400 font-mono block mb-2">Morph State Preview:</span>
            <div className="flex flex-wrap gap-2">
              {(['hero', 'bizdhan', 'clearclaim', 'smartreceipt', 'about', 'experience', 'technology', 'footer'] as CoreMorphTarget[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    sound.playWarp();
                    onSelectSection(st);
                  }}
                  className={`text-xs uppercase px-3 py-1 rounded-full font-mono transition-all border ${
                    activeSection === st
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Tabs / Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Section 1: Color Palette & Glassmorphism Design Tokens */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              1. Deep Neon & Glassmorphism Color Palette
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-4">
              Designed according to strict optical contrast ratios and high-saturation neon accents to evoke a sleek, cyberpunk, futuristic aesthetic without oversaturating the eye:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#040711] border border-cyan-500/30">
                <div className="w-6 h-6 rounded-md bg-[#040711] border border-white/20 mb-2" />
                <span className="text-white font-bold block">Void Obsidian</span>
                <span className="text-slate-400">#040711</span>
                <span className="text-[10px] text-slate-500 block mt-1">Background Root</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0b1020] border border-cyan-500/30">
                <div className="w-6 h-6 rounded-md bg-[#0b1020] border border-cyan-400/40 mb-2" />
                <span className="text-cyan-300 font-bold block">Cyber Glass</span>
                <span className="text-slate-400">rgba(11,16,32,0.65)</span>
                <span className="text-[10px] text-slate-500 block mt-1">Backdrop Blur 16px</span>
              </div>
              <div className="p-3 rounded-xl bg-[#00f0ff]/10 border border-cyan-500/50">
                <div className="w-6 h-6 rounded-md bg-[#00f0ff] mb-2 shadow-[0_0_10px_#00f0ff]" />
                <span className="text-cyan-400 font-bold block">Electric Cyan</span>
                <span className="text-slate-400">#00F0FF</span>
                <span className="text-[10px] text-slate-500 block mt-1">Fresnel Rim & UI</span>
              </div>
              <div className="p-3 rounded-xl bg-[#a855f7]/10 border border-purple-500/50">
                <div className="w-6 h-6 rounded-md bg-[#a855f7] mb-2 shadow-[0_0_10px_#a855f7]" />
                <span className="text-purple-400 font-bold block">Neon Violet</span>
                <span className="text-slate-400">#A855F7</span>
                <span className="text-[10px] text-slate-500 block mt-1">Gradient Base & Glow</span>
              </div>
            </div>
          </div>

          {/* Section 2: How the 3D Model Works & Morph Transitions */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-purple-400" />
              2. How the 3D Digital Core Works Across the Website
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-3">
              Rather than loading disconnected 3D objects, the site treats the <strong>Digital Core</strong> as an omnipresent entity that continuously morphs based on your scroll position:
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/40">
                <span className="text-cyan-400 font-bold min-w-28">01 HERO / INTRO:</span>
                <span className="text-slate-300">Crystalline icosahedron with procedural sine-wave vertex displacement + dual rotating gyroscopic neon rings.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/40">
                <span className="text-cyan-400 font-bold min-w-28">02 BIZDHAN:</span>
                <span className="text-slate-300">Transforms into isometric 3D glowing financial bar charts, cyber grid floor, and orbiting financial transaction badges.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/40">
                <span className="text-cyan-400 font-bold min-w-28">03 CLEARCLAIM:</span>
                <span className="text-slate-300">Morphs into a multi-tenant cloud architecture cluster: central auth gateway connected by laser pipelines to isolated tenant DB cubes.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/40">
                <span className="text-cyan-400 font-bold min-w-28">04 SMART RECEIPT:</span>
                <span className="text-slate-300">Morphs into an angled glass document pedestal with a real-time oscillating green/cyan laser scanner beam and OCR bounding boxes.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/40">
                <span className="text-cyan-400 font-bold min-w-28">05 FOOTER:</span>
                <span className="text-slate-300">Collapses and aligns into the signature sculpted "D" glyph letterform representing Dhruv.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Step-by-Step Custom GLTF Creation & Loading Pipeline */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-emerald-400" />
              3. How to Build & Load Custom GLTF Models in Three.js
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-3">
              Here is the exact production pipeline to model, export, and load your custom 3D models with Three.js and React:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <h4 className="font-semibold text-cyan-300 mb-1">Step A: 3D Modeling in Blender</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                  <li>Create base mesh (e.g., Icosahedron or geodesic sphere with 2-3 subdivisions).</li>
                  <li>Assign separate Material slots: <code>Core_Glass</code>, <code>Neon_Rim</code>, <code>Laser_Glow</code>.</li>
                  <li>Group morph parts in empty nodes: <code>Core_Hero</code>, <code>Chart_Group</code>, <code>Tenant_Cubes</code>.</li>
                  <li>File &gt; Export &gt; glTF 2.0 (.glb) with <strong>Draco Mesh Compression</strong> enabled.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono">
                <h4 className="font-semibold text-cyan-300 mb-2">Step B: Three.js GLTF Loading Pipeline</h4>
                <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 rounded bg-black/60 border border-white/5">
{`import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('/models/digital-core.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.isMesh) {
      // Inject custom Fresnel or PBR glass materials
      child.material = customShaderMaterial;
      child.castShadow = true;
    }
  });
  scene.add(model);
});`}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                <h4 className="font-semibold text-cyan-300 mb-1">Step C: React Spring Physics & Touch Damping</h4>
                <p className="text-slate-400 text-xs">
                  We bind touch drag listeners (<code>onTouchStart</code>, <code>onTouchMove</code>) and calculate angular delta with a continuous lerp dampening loop: <code>currentRot = lerp(currentRot, targetRot, delta * 5)</code>. This ensures zero jank on mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <span>PORTFOLIO SPEC • DHRUV SAVALIYA</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
          >
            RETURN TO EXPERIENCE
          </button>
        </div>
      </div>
    </div>
  );
};
