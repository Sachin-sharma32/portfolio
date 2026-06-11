import { cn } from '@/lib/utils';

type RollingTextProps = {
  text: string;
  className?: string;
};

/**
 * Hover roll: two stacked copies of the text; on hover the visible copy rolls
 * up and the duplicate rolls in from below, letter by letter. Triggered by
 * hovering this element or any ancestor carrying the `group/roll` class.
 */
export function RollingText({ text, className }: RollingTextProps) {
  return (
    <span
      className={cn('group/roll relative inline-block overflow-hidden align-bottom', className)}
      aria-label={text}
    >
      <span aria-hidden className="flex">
        {text.split('').map((ch, i) => (
          <span
            key={`a-${i}`}
            className="inline-block whitespace-pre transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/roll:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 flex">
        {text.split('').map((ch, i) => (
          <span
            key={`b-${i}`}
            className="inline-block translate-y-full whitespace-pre transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/roll:translate-y-0"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
