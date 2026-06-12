/**
 * Decides which experience the visitor gets:
 *  - "classic" — the scrollable 2D site; always the default.
 *  - "museum"  — the immersive first-person 3D site, opt-in via the
 *                "Enter 3D mode" button (desktop, fine pointer, WebGL only).
 */

export type ExperienceMode = 'museum' | 'classic';

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Hardware/viewport gate — can this device host the museum at all? */
export function canHostMuseum(): boolean {
  if (typeof window === 'undefined') return false;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = window.innerWidth >= 1024;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return finePointer && wide && !reduce && supportsWebGL();
}
