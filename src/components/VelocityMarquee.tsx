import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';
import { Fragment, useRef } from 'react';

import { cn } from '@/lib/utils';

type VelocityMarqueeProps = {
  items: readonly string[];
  /** Base speed in percent of track width per second. */
  baseVelocity?: number;
  className?: string;
};

/**
 * Infinite ticker whose speed and direction respond to scroll velocity —
 * scroll down and it accelerates, scroll up and it reverses. The track is
 * rendered four times so the ±25% wrap window never shows a seam.
 */
export function VelocityMarquee({ items, baseVelocity = 2.4, className }: VelocityMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 350 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4], {
    clamp: false,
  });

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const track = (dup: number) => (
    <Fragment key={dup}>
      {items.map((item) => (
        <span key={`${dup}-${item}`} className="flex shrink-0 items-center">
          <span className="text-muted-bright px-8 font-sans text-2xl font-medium sm:text-3xl">
            {item}
          </span>
          <span className="text-accent" aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </Fragment>
  );

  return (
    <div
      className={cn('border-line bg-ink-soft relative overflow-hidden border-y py-5', className)}
    >
      <motion.div className="flex w-max items-center whitespace-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map(track)}
      </motion.div>
    </div>
  );
}
