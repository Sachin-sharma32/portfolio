import type Lenis from 'lenis';

/**
 * Module-level handle to the Lenis instance so any component can drive
 * programmatic scrolls (nav links, back-to-top) through the smooth scroller
 * instead of fighting it with native scrollTo.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a section id, falling back to native behavior. */
export function scrollToSection(id: string) {
  const target = id === 'home' ? 0 : `#${id}`;
  if (lenis) {
    lenis.scrollTo(target, { offset: id === 'home' ? 0 : -64, duration: 1.4 });
    return;
  }
  if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
