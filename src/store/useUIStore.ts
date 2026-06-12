import { create } from 'zustand';

import type { ExperienceMode } from '@/lib/capabilities';

export type CursorVariant = 'default' | 'hover' | 'view';

type UIState = {
  /** Which experience is active: immersive 3D museum or the classic scroll site. */
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;

  /** Mobile nav open/closed. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  /** Drives the custom cursor's size/label. */
  cursorVariant: CursorVariant;
  cursorLabel: string;
  setCursor: (variant: CursorVariant, label?: string) => void;

  /** Section currently in view, for nav highlighting. */
  activeSection: string;
  setActiveSection: (id: string) => void;

  /** Flips true when the preloader curtain has lifted — gates the hero intro. */
  loaderDone: boolean;
  setLoaderDone: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  mode: 'classic',
  setMode: (mode) => set({ mode }),

  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  cursorVariant: 'default',
  cursorLabel: '',
  setCursor: (cursorVariant, cursorLabel = '') => set({ cursorVariant, cursorLabel }),

  activeSection: 'home',
  setActiveSection: (activeSection) => set({ activeSection }),

  loaderDone: false,
  setLoaderDone: () => set({ loaderDone: true }),
}));

// Dev-only handle so the store can be inspected from the browser console.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__uiStore = useUIStore;
}
