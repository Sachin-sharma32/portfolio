import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Magnetic } from '@/components/Magnetic';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { projects, type Project } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';

function ProjectCard({
  project,
  index,
  total,
  progress,
  reduce,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const { setCursor, cursorProps } = useCursor();

  // As the deck scrolls, finished cards sink back and dim under the next one.
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const brightness = useTransform(progress, [index / total, 1], [1, 0.55]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div
      className="sticky mb-[12vh] flex justify-center px-5 sm:px-8"
      style={{ top: `calc(14vh + ${index * 26}px)` }}
    >
      <motion.article
        style={reduce ? undefined : { scale, filter }}
        className="border-line bg-ink-soft relative w-full max-w-6xl origin-top border will-change-transform"
        onMouseEnter={() => setCursor('view', project.live ? 'visit' : 'work')}
        onMouseLeave={() => setCursor('default')}
      >
        {/* Ghost index, oversized and outlined */}
        <span
          aria-hidden
          className="text-stroke-faint pointer-events-none absolute -top-4 right-4 font-sans text-[7rem] leading-none font-bold select-none sm:text-[10rem]"
        >
          {project.index}
        </span>

        <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] md:gap-12 md:p-14">
          <div>
            <span className="mono-label text-accent">
              {project.index} / {project.role}
            </span>
            <h3 className="text-foreground mt-4 font-sans text-3xl font-bold tracking-tight sm:text-5xl">
              {project.title}
            </h3>
            <p className="text-muted-bright mt-6 max-w-md font-sans text-lg leading-snug text-balance">
              {project.blurb}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="border-accent/40 bg-accent/5 text-accent border px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase"
                >
                  {s}
                </span>
              ))}
            </div>

            {(project.repo || project.live) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.live && (
                  <Magnetic strength={0.25}>
                    <Button asChild size="sm">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        {...cursorProps('hover')}
                      >
                        <ExternalLink /> Live demo
                      </a>
                    </Button>
                  </Magnetic>
                )}
                {project.repo && (
                  <Magnetic strength={0.25}>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        {...cursorProps('hover')}
                      >
                        <Github /> Source
                      </a>
                    </Button>
                  </Magnetic>
                )}
              </div>
            )}
          </div>

          <div className="border-line flex flex-col justify-between gap-8 md:border-l md:pl-12">
            <ul className="space-y-4">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="text-muted-bright flex gap-3 font-mono text-sm leading-relaxed"
                >
                  <ArrowUpRight size={14} className="text-accent mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="text-muted flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
              <span>
                {String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
              </span>
              <span>[ case study ]</span>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects() {
  const deck = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: deck,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="work" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto mb-8 max-w-7xl px-5 sm:px-8 md:mb-12">
        <SectionHeading
          index="03 / SELECTED WORK"
          title="Things I designed, broke, and shipped."
          description="A product I built solo, plus systems from the Magnifi video platform. The deck stacks as you scroll."
          className="mb-0"
        />
      </div>

      {/* Stacking deck — cards are direct children of the deck so each one
          stays pinned (sticky) until the entire deck has scrolled past. */}
      <div ref={deck} className="relative">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.index}
            project={project}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}
