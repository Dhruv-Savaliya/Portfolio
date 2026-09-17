import { useState, useEffect } from 'react';
import { CoreMorphTarget } from '../types';
import { soundEngine } from './audio';

type Listener = () => void;

export type AppTheme = 'dark' | 'light';

interface AppState {
  currentSection: CoreMorphTarget;
  soundMuted: boolean;
  preloaderComplete: boolean;
  cursorHovered: boolean;
  cursorLabel: string;
  mousePos: { x: number; y: number };
  theme: AppTheme;
}

const initialTheme: AppTheme = (typeof window !== 'undefined' && localStorage.getItem('dhruv_theme') === 'light') ? 'light' : 'dark';

const state: AppState = {
  currentSection: 'hero',
  soundMuted: true,
  preloaderComplete: false,
  cursorHovered: false,
  cursorLabel: '',
  mousePos: { x: 0, y: 0 },
  theme: initialTheme,
};

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export const store = {
  getState: () => state,
  setSection: (section: CoreMorphTarget) => {
    if (state.currentSection !== section) {
      state.currentSection = section;
      soundEngine.playTransition();
      notify();
    }
  },
  toggleSound: () => {
    const isMuted = soundEngine.toggleMute();
    state.soundMuted = isMuted;
    notify();
    return isMuted;
  },
  toggleTheme: () => {
    const nextTheme: AppTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dhruv_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
    notify();
    return nextTheme;
  },
  setTheme: (theme: AppTheme) => {
    state.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dhruv_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
    notify();
  },
  setPreloaderComplete: (complete: boolean) => {
    state.preloaderComplete = complete;
    notify();
  },
  setCursorHovered: (hovered: boolean, label: string = '') => {
    state.cursorHovered = hovered;
    state.cursorLabel = label;
    notify();
  },
  setMousePos: (pos: { x: number; y: number }) => {
    state.mousePos = pos;
    notify();
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useStore<T>(selector: (state: AppState) => T): T {
  const [value, setValue] = useState(() => selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setValue(selector(store.getState()));
    });
    return unsubscribe;
  }, [selector]);

  return value;
}
