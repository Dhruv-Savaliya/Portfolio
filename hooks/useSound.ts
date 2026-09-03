'use client';

import { useEffect, useRef } from 'react';
import { useExperienceStore } from '@/lib/store';

// Wired sound system — silent until audio files are provided.
// Replace placeholder URLs with actual audio files when ready.
// Uses the Web Audio API oscillator for subtle placeholder tones.

type SoundName = 'click' | 'hover' | 'transition' | 'whoosh';

interface SoundEntry {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}

const SOUNDS: Record<SoundName, SoundEntry> = {
  click:      { frequency: 800,  duration: 0.08, type: 'sine',   gain: 0.15 },
  hover:      { frequency: 600,  duration: 0.05, type: 'sine',   gain: 0.06 },
  transition: { frequency: 300,  duration: 0.3,  type: 'sine',   gain: 0.1  },
  whoosh:     { frequency: 200,  duration: 0.4,  type: 'sawtooth', gain: 0.05 },
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(sound: SoundEntry) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      sound.frequency * 0.5,
      ctx.currentTime + sound.duration
    );

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(sound.gain, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  } catch {
    // Silently fail if audio context is not available
  }
}

export function useSound() {
  const soundEnabled = useExperienceStore((s) => s.soundEnabled);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  function play(name: SoundName) {
    if (!soundEnabledRef.current) return;
    const sound = SOUNDS[name];
    if (sound) playTone(sound);
  }

  return { play };
}
