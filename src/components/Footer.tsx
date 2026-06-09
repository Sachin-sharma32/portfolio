import type { MouseEvent } from 'react';

import { profile } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';

export function Footer() {
  const { cursorProps } = useCursor();
  const year = new Date().getFullYear();

  // Drive the scroll explicitly: a native `#home` hash jump across this very
  // tall page gets interrupted by layout shifts and stalls partway (near Work).
  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="text-muted flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
          <span className="border-line text-accent grid size-6 place-items-center border">S</span>
          <span>
            © {year} {profile.name}
          </span>
        </div>

        <p className="text-muted max-w-md font-mono text-xs leading-relaxed">
          Built from scratch with React, TypeScript, Vite, Tailwind, GSAP &amp; Framer Motion. No
          template — hand-coded in Jaipur.
        </p>

        <a
          href="#home"
          onClick={scrollToTop}
          className="link-wipe text-muted-bright self-start font-mono text-xs tracking-widest uppercase md:self-auto"
          {...cursorProps('hover')}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
