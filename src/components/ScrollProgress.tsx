import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin cyan bar pinned under the navbar that tracks page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="bg-accent fixed inset-x-0 top-16 z-50 h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}
