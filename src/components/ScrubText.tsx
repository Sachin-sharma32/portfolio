import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type Segment = { text: string; bright: boolean };

type ScrubTextProps = {
  /** Plain string, or mark phrases bright with segments. */
  children: string | Segment[];
  className?: string;
};

/**
 * Word-by-word scroll-scrubbed reveal: every word starts dim and brightens as
 * it crosses the viewport, tied to scroll position (scrub) rather than time.
 * The signature "reading light" effect from award-winning editorial sites.
 */
export function ScrubText({ children, className }: ScrubTextProps) {
  const root = useRef<HTMLParagraphElement>(null);

  const words = useMemo<{ word: string; bright: boolean }[]>(() => {
    const segments: Segment[] =
      typeof children === 'string' ? [{ text: children, bright: false }] : children;
    return segments.flatMap((seg) =>
      seg.text
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ({ word, bright: seg.bright }))
    );
  }, [children]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 82%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [words]);

  const nodes: ReactNode[] = words.map(({ word, bright }, i) => (
    <span key={i} data-word className={cn('inline', bright && 'text-foreground')}>
      {word}{' '}
    </span>
  ));

  return (
    <p ref={root} className={className}>
      {nodes}
    </p>
  );
}
