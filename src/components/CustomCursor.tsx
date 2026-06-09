import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useUIStore } from '@/store/useUIStore';

/**
 * A brutalist cyan ring that trails the pointer and morphs on interactive elements.
 * Only mounts on fine-pointer devices; touch users keep their native experience.
 */
export function CustomCursor() {
  const variant = useUIStore((s) => s.cursorVariant);
  const label = useUIStore((s) => s.cursorLabel);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-none-fine');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.classList.remove('cursor-none-fine');
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = variant === 'default' ? 16 : variant === 'view' ? 84 : 52;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] flex items-center justify-center rounded-full mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="border-accent bg-accent/10 text-accent flex items-center justify-center rounded-full border font-mono text-[10px] tracking-widest uppercase"
        animate={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {variant === 'view' ? label || 'view' : ''}
      </motion.div>
    </motion.div>
  );
}
