import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Magnetic } from '@/components/Magnetic';
import { ScrambleText } from '@/components/ScrambleText';
import { VelocityMarquee } from '@/components/VelocityMarquee';
import { Button } from '@/components/ui/button';
import { marqueeWords, profile } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';
import { scrollToSection } from '@/lib/scroll';
import { useUIStore } from '@/store/useUIStore';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const { cursorProps } = useCursor();
  const loaderDone = useUIStore((s) => s.loaderDone);

  // Intro timeline — fires once the preloader curtain lifts.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // No theatrics: just make sure nothing stays hidden.
      root.current
        ?.querySelectorAll<HTMLElement>('[data-hero-meta],[data-hero-tag],[data-hero-corner]')
        .forEach((el) => (el.style.opacity = '1'));
      return;
    }
    if (!loaderDone) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        '[data-hero-line] .char',
        { yPercent: 120, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.03 }
      )
        .fromTo(
          '[data-hero-meta]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.6'
        )
        .fromTo(
          '[data-hero-tag]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          '[data-hero-cta] > *',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
          '-=0.35'
        )
        .fromTo('[data-hero-corner]', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.5');
    }, root);

    return () => ctx.revert();
  }, [loaderDone]);

  // Scroll choreography: the two name lines shear apart and the block sinks
  // with a velocity-reactive skew — kinetic type, not a static heading.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-hero-first]', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      gsap.to('[data-hero-last]', {
        xPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      gsap.to('[data-hero-inner]', {
        yPercent: 18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });

      // Velocity skew on the headline — the page feels like it has inertia.
      const skew = gsap.quickTo('[data-hero-title]', 'skewY', {
        duration: 0.4,
        ease: 'power3',
      });
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          skew(gsap.utils.clamp(-4, 4, self.getVelocity() / -400));
        },
      });

      return () => st.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  // Split a word into per-character spans so GSAP can stagger them.
  const splitChars = (word: string) =>
    word.split('').map((ch, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span className="char inline-block will-change-transform">{ch}</span>
      </span>
    ));

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-16"
    >
      <div
        data-hero-inner
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 sm:px-8"
      >
        {/* Top meta row */}
        <div
          data-hero-meta
          className="text-muted-bright mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-widest uppercase opacity-0"
        >
          <span className="flex items-center gap-2">
            <span className="bg-accent size-2 animate-pulse" />
            <ScrambleText text="Available for work" start={loaderDone} delay={400} />
          </span>
          <span className="bg-line hidden h-3 w-px sm:block" />
          <ScrambleText text={profile.location} start={loaderDone} delay={600} />
          <span className="bg-line hidden h-3 w-px sm:block" />
          <ScrambleText text="26.9° N, 75.8° E" start={loaderDone} delay={800} />
        </div>

        {/* Name — two lines that shear apart on scroll */}
        <h1 data-hero-title className="font-sans leading-[0.82] font-bold tracking-tight">
          <span
            data-hero-line
            data-hero-first
            className="text-foreground block text-[clamp(3rem,13vw,11rem)]"
          >
            {splitChars('SACHIN')}
          </span>
          <span
            data-hero-line
            data-hero-last
            className="text-stroke-accent block text-[clamp(3rem,13vw,11rem)]"
          >
            {splitChars('SHARMA')}
          </span>
        </h1>

        {/* Tagline + role */}
        <div
          data-hero-tag
          className="mt-10 flex max-w-4xl flex-col gap-6 opacity-0 md:flex-row md:items-end md:justify-between"
        >
          <p className="text-muted-bright max-w-xl font-sans text-lg leading-snug text-balance sm:text-xl">
            {profile.role} based in Jaipur. {profile.tagline}
          </p>
          <div data-hero-cta className="flex shrink-0 flex-wrap gap-3">
            <Magnetic>
              <Button asChild>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('work');
                  }}
                  {...cursorProps('hover')}
                >
                  View work
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  {...cursorProps('hover')}
                >
                  Get in touch
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Corner readout — gives the page a built, instrument-panel feel. */}
      <div
        data-hero-corner
        className="text-muted pointer-events-none absolute right-5 bottom-28 hidden text-right font-mono text-[10px] leading-relaxed tracking-widest uppercase opacity-0 lg:block"
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

      <VelocityMarquee items={marqueeWords} />
    </section>
  );
}
