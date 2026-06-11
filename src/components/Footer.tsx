import type { CSSProperties, MouseEvent } from 'react';

import { LocalTime } from '@/components/LocalTime';
import { RollingText } from '@/components/RollingText';
import { profile } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';
import { scrollToSection } from '@/lib/scroll';

/**
 * Parallax footer: the page appears to lift off the footer as you reach the
 * end (clip-path + sticky reveal — no JS, works with Lenis and reduced motion).
 */
export function Footer() {
  const { cursorProps } = useCursor();
  const year = new Date().getFullYear();

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection('home');
  };

  return (
    <div
      className="relative h-[var(--fh)]"
      style={
        {
          '--fh': 'clamp(340px, 50vh, 430px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        } as CSSProperties
      }
    >
      <div className="relative -top-[100vh] h-[calc(100vh+var(--fh))]">
        <footer className="sticky top-[calc(100vh-var(--fh))] h-[var(--fh)]">
          <div className="border-line bg-ink flex h-full flex-col justify-between border-t">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 pt-10 sm:px-8 md:flex-row md:items-start md:justify-between">
              <div className="text-muted flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
                <span className="border-line text-accent grid size-6 place-items-center border">
                  S
                </span>
                <span>
                  © {year} {profile.name}
                </span>
              </div>

              <p className="text-muted max-w-md font-mono text-xs leading-relaxed">
                Built from scratch with React, TypeScript, Vite, Tailwind, GSAP, Lenis &amp; Framer
                Motion. No template — hand-coded in Jaipur.
              </p>

              <div className="flex flex-col gap-2 md:items-end">
                <a
                  href="#home"
                  onClick={scrollToTop}
                  className="group/roll text-muted-bright hover:text-accent self-start font-mono text-xs tracking-widest uppercase transition-colors md:self-auto"
                  {...cursorProps('hover')}
                >
                  <RollingText text="Back to top ↑" />
                </a>
                <LocalTime className="text-muted font-mono text-[10px] tracking-[0.25em] uppercase" />
              </div>
            </div>

            {/* Giant sign-off — fills the footer floor edge to edge. */}
            <div className="overflow-hidden px-2 pb-2" aria-hidden {...cursorProps('view', 'fin')}>
              <div className="text-stroke-faint hover:text-foreground w-full text-center font-sans text-[12.5vw] leading-[0.78] font-bold tracking-tight whitespace-nowrap transition-colors duration-700 select-none hover:[-webkit-text-stroke-width:0px]">
                SACHIN SHARMA
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
