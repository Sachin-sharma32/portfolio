import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { profile, stats } from '@/data/content';

export function About() {
  return (
    <section id="about" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="01 / ABOUT" title="From the sports field to the stack." />

        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          {/* Narrative */}
          <div className="text-muted-bright space-y-6 text-lg leading-relaxed">
            <Reveal>
              <p>
                I didn&apos;t come to engineering the usual way. My degree is in{' '}
                <span className="text-foreground">Physical Education &amp; Sports Science</span> — I
                spent years learning how repetition, feedback and small daily margins turn into
                performance. Turns out that&apos;s most of what writing software is too.
              </p>
            </Reveal>
            <Reveal index={1}>
              <p>I taught myself to code, shipped real things, and kept going. {profile.blurb}</p>
            </Reveal>
            <Reveal index={2}>
              <p>
                These days I&apos;m finishing an{' '}
                <span className="text-foreground">
                  M.Sc. in Data Science &amp; AI at BITS Pilani
                </span>{' '}
                while building production SaaS — because the fastest way I know to learn something
                is to ship it and watch what breaks.
              </p>
            </Reveal>
          </div>

          {/* Stat block */}
          <div className="border-line bg-line grid grid-cols-2 gap-px border">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} index={i} className="contents">
                <div className="bg-ink hover:bg-ink-soft flex flex-col justify-between gap-6 p-6 transition-colors">
                  <span className="text-accent font-sans text-4xl font-bold md:text-5xl">
                    {stat.value}
                  </span>
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
