import { create } from 'zustand';

export type CursorVariant = 'default' | 'hover' | 'view';

type UIState = {
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
