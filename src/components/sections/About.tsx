import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Reveal } from '@/components/Reveal';
import { ScrubText } from '@/components/ScrubText';
import { SectionHeading } from '@/components/SectionHeading';
import { profile, stats } from '@/data/content';

/** Counts up from 0 when scrolled into view; keeps any non-numeric suffix. */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const target = parseInt(value, 10);
  const suffix = value.replace(String(target), '');
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref} className="text-accent font-sans text-4xl font-bold tabular-nums md:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="01 / ABOUT" title="From the sports field to the stack." />

        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          {/* Narrative — every word brightens as the reader scrolls past it. */}
          <div className="text-muted-bright space-y-6 text-lg leading-relaxed">
            <ScrubText>
              {[
                {
                  text: "I didn't come to engineering the usual way. My degree is in",
                  bright: false,
                },
                { text: 'Physical Education & Sports Science', bright: true },
                {
                  text: "— I spent years learning how repetition, feedback and small daily margins turn into performance. Turns out that's most of what writing software is too.",
                  bright: false,
                },
              ]}
            </ScrubText>
            <ScrubText>
              {`I taught myself to code, shipped real things, and kept going. ${profile.blurb}`}
            </ScrubText>
            <ScrubText>
              {[
                { text: "These days I'm finishing an", bright: false },
                { text: 'M.Sc. in Data Science & AI at BITS Pilani', bright: true },
                {
                  text: 'while building production SaaS — because the fastest way I know to learn something is to ship it and watch what breaks.',
                  bright: false,
                },
              ]}
            </ScrubText>
          </div>

          {/* Stat block — counters tick up on entry. */}
          <div className="border-line bg-line grid grid-cols-2 gap-px border">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} index={i} className="contents">
                <div className="bg-ink hover:bg-ink-soft flex flex-col justify-between gap-6 p-6 transition-colors">
                  <StatValue value={stat.value} />
                  <span className="text-muted-bright font-mono text-xs leading-relaxed tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Pull quote — a personal line that no template would write. */}
        <Reveal>
          <blockquote className="border-accent text-foreground mt-20 max-w-4xl border-l-2 pl-6 font-sans text-2xl leading-snug font-medium text-balance md:text-3xl">
            “Same as training: show up, fix the weak link, ship the rep. The codebase keeps score.”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
