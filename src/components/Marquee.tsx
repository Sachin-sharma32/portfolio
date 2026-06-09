import { Fragment } from 'react';

import { cn } from '@/lib/utils';

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

/**
 * Infinite horizontal ticker of tech keywords. The track is duplicated so the
 * CSS translateX(-50%) loop reads as seamless.
 */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group border-line bg-ink-soft relative flex overflow-hidden border-y py-5',
        className
      )}
    >
      <div className="animate-marquee flex shrink-0 items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((item, i) => (
              <span key={`${dup}-${item}`} className="flex items-center">
                <span className="text-muted-bright px-8 font-sans text-2xl font-medium sm:text-3xl">
                  {item}
                </span>
                {i < items.length && (
                  <span className="text-accent" aria-hidden>
                    ◆
                  </span>
                )}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
