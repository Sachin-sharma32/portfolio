import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Marquee } from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import { marqueeWords, profile } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const { cursorProps } = useCursor();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from('[data-hero-line] .char', {
        yPercent: 120,
        duration: 0.9,
        stagger: 0.025,
      })
        .from('[data-hero-meta]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from('[data-hero-tag]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from('[data-hero-cta] > *', { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, '-=0.35')
        .from('[data-hero-corner]', { opacity: 0, duration: 0.8 }, '-=0.5');
    }, root);

    return () => ctx.revert();
  }, []);

  // Split a word into per-character spans so GSAP can stagger them.
  const splitChars = (word: string) =>
    word.split('').map((ch, i) => (
      <span key={i} className="inline-block overflow-hidden">
        <span className="char inline-block">{ch}</span>
      </span>
    ));

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-16"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        {/* Top meta row */}
        <div
          data-hero-meta
          className="text-muted-bright mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-widest uppercase"
        >
          <span className="flex items-center gap-2">
            <span className="bg-accent size-2 animate-pulse" />
            Available for work
          </span>
          <span className="bg-line hidden h-3 w-px sm:block" />
          <span>{profile.location}</span>
          <span className="bg-line hidden h-3 w-px sm:block" />
          <span>26.9° N, 75.8° E</span>
        </div>

        {/* Name */}
        <h1 className="font-sans leading-[0.82] font-bold tracking-tight">
          <span data-hero-line className="text-foreground block text-[clamp(3rem,13vw,11rem)]">
            {splitChars('SACHIN')}
          </span>
          <span
            data-hero-line
            className="block text-[clamp(3rem,13vw,11rem)] text-transparent"
            style={{ WebkitTextStroke: '1.5px var(--color-accent)' }}
          >
            {splitChars('SHARMA')}
          </span>
        </h1>

        {/* Tagline + role */}
        <div
          data-hero-tag
          className="mt-10 flex max-w-4xl flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p className="text-muted-bright max-w-xl font-sans text-lg leading-snug text-balance sm:text-xl">
            {profile.role} based in Jaipur. {profile.tagline}
          </p>
          <div data-hero-cta className="flex shrink-0 flex-wrap gap-3">
            <Button asChild>
              <a href="#work" {...cursorProps('hover')}>
                View work
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#contact" {...cursorProps('hover')}>
                Get in touch
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Corner readout — gives the page a built, instrument-panel feel. */}
      <div
        data-hero-corner
        className="text-muted pointer-events-none absolute right-5 bottom-28 hidden text-right font-mono text-[10px] leading-relaxed tracking-widest uppercase lg:block"
      >
        <div>[ {profile.yearsExperience}y exp ]</div>
        <div>react · ts · node</div>
        <div>self-taught / shipping</div>
      </div>

      {/* Scroll cue */}
      <div className="text-muted mb-3 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase">
        <ArrowDown size={12} className="text-accent animate-bounce" />
        Scroll
      </div>

      <Marquee items={marqueeWords} />
    </section>
  );
}
