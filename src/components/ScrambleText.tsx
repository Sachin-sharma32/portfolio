import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$%&@01';

type ScrambleTextProps = {
  text: string;
  /** Delay before the decode starts, ms. */
  delay?: number;
  /** Total decode duration, ms. */
  duration?: number;
  className?: string;
  /** Only start when true (e.g. after the preloader). */
  start?: boolean;
};

/**
 * Terminal-style decode effect: characters churn through glyphs and lock in
 * left to right. Used for the instrument-panel mono labels.
 */
export function ScrambleText({
  text,
  delay = 0,
  duration = 900,
  className,
  start = true,
}: ScrambleTextProps) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!start) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setOutput(text);
      return;
    }

    let begin: number | null = null;
    let raf = 0;

    const timeout = setTimeout(() => {
      const step = (now: number) => {
        if (begin === null) begin = now;
        const progress = Math.min(1, (now - begin) / duration);
        const lockCount = Math.floor(progress * text.length);

        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < lockCount || ch === ' ') out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOutput(out);

        if (progress < 1) raf = requestAnimationFrame(step);
        else setOutput(text);
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration, start]);

  return <span className={className}>{output}</span>;
}
