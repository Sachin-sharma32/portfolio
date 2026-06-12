import type { ExhibitId } from '@/store/useMuseumStore';

/* Palette mirrors the CSS tokens in index.css — keep both in sync. */
export const ACCENT = '#22d3ee';
export const ACCENT_DIM = '#0e7490';
export const INK = '#0a0a0a';
export const PAPER = '#f5f5f0';
export const MUTED = '#9a9a9a';
export const LINE = '#232323';

/* Fonts served from public/ — troika needs ttf/woff, not the CDN's woff2. */
const BASE = import.meta.env.BASE_URL;
export const FONT_BOLD = `${BASE}fonts/SpaceGrotesk-Bold.ttf`;
export const FONT_MEDIUM = `${BASE}fonts/SpaceGrotesk-Medium.ttf`;
export const FONT_MONO = `${BASE}fonts/JetBrainsMono-Regular.ttf`;

/* Room shell: walls at ±X_WALL / ±Z_WALL, player clamped a step inside. */
export const X_WALL = 20;
export const Z_WALL = 16;
export const X_BOUND = 19;
export const Z_BOUND = 15;
export const EYE = 1.7;

export const SPAWN: [number, number, number] = [0, EYE, 12];

/** Where the camera parks when an exhibit is focused. */
export type Viewpoint = {
  position: [number, number, number];
  look: [number, number, number];
};

export const VIEWPOINTS: Record<ExhibitId, Viewpoint> = {
  intro: { position: [0, EYE, 3.8], look: [0, 2.1, -1] },
  about: { position: [-13.5, EYE, 0], look: [-20, 2.4, 0] },
  skills: { position: [0, EYE, 7.5], look: [0, 2, 0] },
  'project-01': { position: [-14, EYE, -10.5], look: [-14, 2.6, -16] },
  'project-02': { position: [-7, EYE, -10.5], look: [-7, 2.6, -16] },
  'project-03': { position: [0, EYE, -10.5], look: [0, 2.6, -16] },
  'project-04': { position: [7, EYE, -10.5], look: [7, 2.6, -16] },
  'project-05': { position: [14, EYE, -10.5], look: [14, 2.6, -16] },
  experience: { position: [13.5, EYE, 0], look: [20, 2.4, 0] },
  contact: { position: [0, EYE, 10.5], look: [0, 2.2, 16] },
};

/** Attached to hitbox meshes so the player's center-raycast can identify exhibits. */
export type ExhibitTag = {
  id: ExhibitId;
  label: string;
  /** Optional override, e.g. each skill pillar parks the camera in front of itself. */
  viewpoint?: Viewpoint;
};
