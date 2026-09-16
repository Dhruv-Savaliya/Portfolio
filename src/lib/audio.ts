/**
 * Reactive Atmospheric Cybernetic Soundscape for Dhruv Savaliya's Portfolio
 * Fully synthesized via the Web Audio API with zero external audio dependencies.
 * Reacts to 3D core morphing states, pointer navigation, and UI interactions.
 */

import { CoreMorphTarget } from '../types';

interface MorphAudioProfile {
  rootFreq: number;
  harmonicFreq: number;
  filterCutoff: number;
  filterQ: number;
  gainLevel: number;
}

const SECTION_PROFILES: Record<CoreMorphTarget, MorphAudioProfile> = {
  hero: {
    rootFreq: 55.0, // A1
    harmonicFreq: 110.0, // A2
    filterCutoff: 380,
    filterQ: 3.0,
    gainLevel: 0.022,
  },
  intro: {
    rootFreq: 55.0,
    harmonicFreq: 165.0, // E3 (Fifth)
    filterCutoff: 500,
    filterQ: 3.5,
    gainLevel: 0.025,
  },
  bizdhan: {
    rootFreq: 65.41, // C2
    harmonicFreq: 130.81, // C3
    filterCutoff: 780,
    filterQ: 4.2,
    gainLevel: 0.028,
  },
  clearclaim: {
    rootFreq: 73.42, // D2
    harmonicFreq: 146.83, // D3
    filterCutoff: 620,
    filterQ: 4.8,
    gainLevel: 0.026,
  },
  smartreceipt: {
    rootFreq: 82.41, // E2
    harmonicFreq: 196.0, // G3
    filterCutoff: 950,
    filterQ: 5.5,
    gainLevel: 0.03,
  },
  howibuild: {
    rootFreq: 58.27, // A#1
    harmonicFreq: 116.54,
    filterCutoff: 580,
    filterQ: 3.8,
    gainLevel: 0.024,
  },
  about: {
    rootFreq: 65.41, // C2
    harmonicFreq: 164.81, // E3
    filterCutoff: 600,
    filterQ: 3.2,
    gainLevel: 0.025,
  },
  experience: {
    rootFreq: 73.42, // D2
    harmonicFreq: 174.61, // F3
    filterCutoff: 690,
    filterQ: 4.0,
    gainLevel: 0.026,
  },
  technology: {
    rootFreq: 82.41, // E2
    harmonicFreq: 220.0, // A3
    filterCutoff: 880,
    filterQ: 4.5,
    gainLevel: 0.028,
  },
  contact: {
    rootFreq: 55.0, // A1
    harmonicFreq: 130.81, // C3
    filterCutoff: 440,
    filterQ: 3.5,
    gainLevel: 0.026,
  },
  footer: {
    rootFreq: 55.0,
    harmonicFreq: 110.0,
    filterCutoff: 360,
    filterQ: 2.8,
    gainLevel: 0.02,
  },
  idle: {
    rootFreq: 55.0,
    harmonicFreq: 110.0,
    filterCutoff: 380,
    filterQ: 3.0,
    gainLevel: 0.02,
  },
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  
  // Ambient Soundscape Nodes
  private rootOsc: OscillatorNode | null = null;
  private harmonicOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private ambientGain: GainNode | null = null;

  private currentSection: CoreMorphTarget = 'hero';
  private targetFilterFreq: number = 380;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(force?: boolean): boolean {
    this.initContext();
    this.isMuted = force !== undefined ? !force : !this.isMuted;

    if (!this.isMuted) {
      this.playChime(640, 0.15, 'sine');
      setTimeout(() => this.playChime(880, 0.2, 'sine'), 80);
      this.startAtmosphericSoundscape();
    } else {
      this.stopAtmosphericSoundscape();
    }
    return !this.isMuted;
  }

  public getIsSoundOn(): boolean {
    return !this.isMuted;
  }

  /**
   * Dynamically shifts the atmospheric drone frequencies and filter resonance
   * to match the active 3D Core morph state.
   */
  public morphSoundscape(target: CoreMorphTarget) {
    this.currentSection = target;
    if (this.isMuted || !this.ctx || !this.rootOsc || !this.harmonicOsc || !this.filterNode || !this.ambientGain) {
      return;
    }

    const profile = SECTION_PROFILES[target] || SECTION_PROFILES.hero;
    const now = this.ctx.currentTime;
    const rampTime = 1.4; // Silky smooth exponential transition

    try {
      // Smoothly pitch bend root drone and harmonics
      this.rootOsc.frequency.cancelScheduledValues(now);
      this.rootOsc.frequency.exponentialRampToValueAtTime(profile.rootFreq, now + rampTime);

      this.harmonicOsc.frequency.cancelScheduledValues(now);
      this.harmonicOsc.frequency.exponentialRampToValueAtTime(profile.harmonicFreq, now + rampTime);

      // Smoothly shift filter cutoff and resonance
      this.targetFilterFreq = profile.filterCutoff;
      this.filterNode.frequency.cancelScheduledValues(now);
      this.filterNode.frequency.exponentialRampToValueAtTime(profile.filterCutoff, now + rampTime);

      this.filterNode.Q.cancelScheduledValues(now);
      this.filterNode.Q.linearRampToValueAtTime(profile.filterQ, now + rampTime);

      // Adjust master gain level
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(profile.gainLevel, now + rampTime);

      // Subtle atmospheric arrival cue
      if (target === 'smartreceipt') {
        this.playLaserPing();
      } else if (target === 'bizdhan') {
        this.playChime(523.25, 0.35, 'triangle');
      } else if (target === 'clearclaim') {
        this.playChime(440.0, 0.3, 'sine');
      }
    } catch {
      // Fallback in case of scheduling edge case
    }
  }

  /**
   * Modulates the filter cutoff frequency and stereo panning based on pointer movement
   */
  public onPointerMoveAudio(normX: number, normY: number) {
    if (this.isMuted || !this.ctx || !this.filterNode) return;

    try {
      const now = this.ctx.currentTime;
      // Modulate filter ±120Hz based on Y axis
      const modCutoff = Math.max(120, this.targetFilterFreq + normY * 120);
      this.filterNode.frequency.setTargetAtTime(modCutoff, now, 0.08);

      if (this.pannerNode) {
        // Modulate stereo field based on X axis (-0.4 to 0.4)
        this.pannerNode.pan.setTargetAtTime(normX * 0.45, now, 0.08);
      }
    } catch {
      // Safe ignore
    }
  }

  private startAtmosphericSoundscape() {
    if (!this.ctx || this.rootOsc) return;

    try {
      const now = this.ctx.currentTime;
      const profile = SECTION_PROFILES[this.currentSection] || SECTION_PROFILES.hero;

      // 1. Root Sub-Bass Oscillator
      this.rootOsc = this.ctx.createOscillator();
      this.rootOsc.type = 'sine';
      this.rootOsc.frequency.setValueAtTime(profile.rootFreq, now);

      // 2. Harmonic Overtone Oscillator
      this.harmonicOsc = this.ctx.createOscillator();
      this.harmonicOsc.type = 'triangle';
      this.harmonicOsc.frequency.setValueAtTime(profile.harmonicFreq, now);

      // 3. Sub-Frequency Floor Generator
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(profile.rootFreq / 2, now);

      // 4. Low-pass Resonant Filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(profile.filterCutoff, now);
      this.filterNode.Q.setValueAtTime(profile.filterQ, now);
      this.targetFilterFreq = profile.filterCutoff;

      // 5. Stereo Panner
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.setValueAtTime(0, now);
      }

      // 6. Master Ambient Gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(profile.gainLevel, now + 2.5);

      // Routing:
      // Oscs -> Filter -> (Panner) -> Gain -> Destination
      this.rootOsc.connect(this.filterNode);
      this.harmonicOsc.connect(this.filterNode);
      this.subOsc.connect(this.filterNode);

      if (this.pannerNode) {
        this.filterNode.connect(this.pannerNode);
        this.pannerNode.connect(this.ambientGain);
      } else {
        this.filterNode.connect(this.ambientGain);
      }

      this.ambientGain.connect(this.ctx.destination);

      this.rootOsc.start(now);
      this.harmonicOsc.start(now);
      this.subOsc.start(now);
    } catch {
      // Audio might be restricted until user interaction
    }
  }

  private stopAtmosphericSoundscape() {
    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        setTimeout(() => {
          this.rootOsc?.stop();
          this.rootOsc?.disconnect();
          this.rootOsc = null;

          this.harmonicOsc?.stop();
          this.harmonicOsc?.disconnect();
          this.harmonicOsc = null;

          this.subOsc?.stop();
          this.subOsc?.disconnect();
          this.subOsc = null;

          this.filterNode?.disconnect();
          this.filterNode = null;

          this.pannerNode?.disconnect();
          this.pannerNode = null;

          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 650);
      } catch {
        this.rootOsc = null;
        this.harmonicOsc = null;
        this.subOsc = null;
      }
    }
  }

  // --- Discrete Sound Effects ---

  public playTick(pitch = 1200) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, this.ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  public playHover() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playWarp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  public playLaserPing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(340, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playChime(freq: number, duration = 0.3, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const sound = new AudioEngine();
