import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin cyan bar pinned to the bottom edge tracking page scroll progress —
 * bottom so it stays put when the navbar tucks away on scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="bg-accent fixed inset-x-0 bottom-0 z-50 h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}
