import { useEffect } from 'react';

import { useUIStore } from '@/store/useUIStore';

/**
 * Tracks which <section id> is currently dominating the viewport and pushes it
 * into the UI store so the nav can highlight the active anchor.
 */
export function useSectionObserver(ids: string[]) {
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, setActiveSection]);
}
