import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useUIStore } from '@/store/useUIStore';

const GREETINGS = ['Hello', 'नमस्ते', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', 'Olá', 'Hallo'];

const PANELS = 5;

/**
 * Boot sequence: a percentage counter climbs to 100 while greetings cycle,
 * then five vertical panels peel up to reveal the hero. Runs once per visit.
 */
export function Preloader() {
  const setLoaderDone = useUIStore((s) => s.setLoaderDone);
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // Skip the whole act for reduced-motion users.
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce) {
      setGone(true);
      setLoaderDone();
      return;
    }

    document.body.style.overflow = 'hidden';

    // Drive everything off elapsed time so background-tab timer throttling
    // can't stall the boot sequence — it always lands in ~1.7s of wall clock.
    const DURATION = 1700;
    const start = performance.now();
    let done = false;

    const interval = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / DURATION);
      // Ease-out so the counter sprints early and settles near the end.
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      setGreeting(Math.floor((performance.now() - start) / 240) % GREETINGS.length);
      if (t >= 1 && !done) {
        done = true;
        clearInterval(interval);
        setTimeout(() => setExiting(true), 350);
      }
    }, 60);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [reduce, setLoaderDone]);

  useEffect(() => {
    if (!exiting) return;
    document.body.style.overflow = '';
    // Hand off to the hero slightly before the curtain finishes lifting.
    const t = setTimeout(() => setLoaderDone(), 420);
    return () => clearTimeout(t);
  }, [exiting, setLoaderDone]);

  if (gone) return null;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {!exiting && (
        <motion.div className="fixed inset-0 z-[80]" exit={{ transition: { duration: 0 } }}>
          {/* Curtain panels */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-ink-soft border-line h-full flex-1 border-r last:border-r-0"
                exit={{
                  scaleY: 0,
                  transition: {
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
                style={{ originY: 0 }}
              />
            ))}
          </div>

          {/* Center greeting */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            exit={{ opacity: 0, y: -40, transition: { duration: 0.3 } }}
          >
            <div className="flex items-center gap-4">
              <span className="bg-accent size-2.5 animate-pulse" />
              <span className="text-foreground font-sans text-3xl font-medium sm:text-5xl">
                {GREETINGS[greeting]}
              </span>
            </div>
          </motion.div>

          {/* Counter, bottom-right like a build readout */}
          <motion.div
            className="absolute right-6 bottom-6 sm:right-10 sm:bottom-8"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <span className="text-foreground font-sans text-7xl font-bold tracking-tight tabular-nums sm:text-9xl">
              {progress}
            </span>
            <span className="text-accent font-mono text-2xl">%</span>
          </motion.div>

          {/* Top-left boot label */}
          <motion.div
            className="text-muted absolute top-6 left-6 font-mono text-[10px] tracking-[0.25em] uppercase sm:top-8 sm:left-10"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            SACHIN SHARMA — PORTFOLIO v2 · LOADING ASSETS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
