import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  /** Monospace index like "02 / WORK". */
  index: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ index, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 md:mb-20', className)}>
      <Reveal>
        <div className="mb-5 flex items-center gap-4">
          <span className="mono-label text-accent">{index}</span>
          <span className="bg-line h-px flex-1" />
        </div>
      </Reveal>
      <Reveal index={1}>
        <h2 className="max-w-3xl font-sans text-4xl leading-[0.95] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal index={2}>
          <p className="text-muted-bright mt-6 max-w-xl font-mono text-sm leading-relaxed">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
