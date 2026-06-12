import { create } from 'zustand';

/** Ids of everything that can be aimed at / focused in the museum. */
export type ExhibitId =
  | 'intro'
  | 'about'
  | 'skills'
  | 'project-01'
  | 'project-02'
  | 'project-03'
  | 'project-04'
  | 'project-05'
  | 'experience'
  | 'contact';

type MuseumState = {
  /** Visitor clicked "enter" on the door screen at least once. */
  entered: boolean;
  setEntered: () => void;

  /** Pointer lock currently engaged (mouse-look active). */
  locked: boolean;
  setLocked: (locked: boolean) => void;

  /** Exhibit currently under the crosshair, if any. */
  hovered: ExhibitId | null;
  hoveredLabel: string;
  setHovered: (id: ExhibitId | null, label?: string) => void;

  /** Exhibit the camera is parked at, with its detail panel open. */
  focused: ExhibitId | null;
  setFocused: (id: ExhibitId | null) => void;
};

export const useMuseumStore = create<MuseumState>((set) => ({
  entered: false,
  setEntered: () => set({ entered: true }),

  locked: false,
  setLocked: (locked) => set({ locked }),

  hovered: null,
  hoveredLabel: '',
  setHovered: (hovered, hoveredLabel = '') => set({ hovered, hoveredLabel }),

  focused: null,
  setFocused: (focused) => set({ focused, hovered: null, hoveredLabel: '' }),
}));

// Dev-only handle so the store can be inspected from the browser console.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__museumStore = useMuseumStore;
}
