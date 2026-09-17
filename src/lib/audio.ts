// Zero-dependency cinematic ambient synthesizer & UI audio engine via Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  constructor() {
    // AudioContext is initialized on user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbient();
      this.playChime(660, 0.08, 'sine');
    } else {
      this.stopAmbient();
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startAmbient() {
    if (!this.ctx || this.isMuted) return;

    try {
      this.stopAmbient();

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // Gentle fade in
      this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3.0);

      // Low pass filter for soft, warm cosmic texture
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Cinematic ambient chord (F - C - G - D ambient cluster: 87.31Hz, 130.81Hz, 196.00Hz, 293.66Hz)
      const freqs = [87.31, 130.81, 196.0, 293.66];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Slow subtle detune drift
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(2.0, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
        this.oscillators.push(lfo);

        oscGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.ambientGain);

        osc.start();
        this.oscillators.push(osc);
      });
    } catch {
      // Graceful fallback
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      } catch {
        // Safe catch
      }
    }
    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.oscillators = [];
    }, 900);
  }

  public playClick() {
    if (this.isMuted) return;
    this.playChime(880, 0.03, 'sine');
  }

  public playTransition() {
    if (this.isMuted) return;
    this.playChime(440, 0.25, 'triangle');
  }

  private playChime(freq: number, duration: number, type: OscillatorType) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
