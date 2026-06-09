import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { projects, type Project } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';
import { cn } from '@/lib/utils';

function ProjectRow({
  project,
  active,
  onHover,
}: {
  project: Project;
  active: boolean;
  onHover: () => void;
}) {
  const { setCursor } = useCursor();

  return (
    <div
      className={cn(
        'group border-line relative border-b transition-colors',
        active ? 'bg-ink-soft' : 'bg-transparent'
      )}
      onMouseEnter={() => {
        onHover();
        setCursor('view', 'open');
      }}
      onMouseLeave={() => setCursor('default')}
      onClick={onHover}
    >
      <div className="mx-auto flex max-w-7xl cursor-pointer items-center gap-6 px-5 py-7 sm:px-8 md:py-9">
        <span className="text-accent font-mono text-sm">{project.index}</span>
        <div className="flex-1">
          <h3
            className={cn(
              'font-sans text-2xl font-bold tracking-tight transition-colors sm:text-4xl md:text-5xl',
              active ? 'text-accent' : 'text-foreground'
            )}
          >
            {project.title}
          </h3>
        </div>
        <span className="text-muted-bright hidden max-w-xs text-right font-mono text-xs tracking-wider uppercase lg:block">
          {project.role}
        </span>
        <ArrowUpRight
          size={28}
          className={cn(
            'shrink-0 transition-all duration-300',
            active ? 'text-accent translate-x-1 -translate-y-1' : 'text-muted'
          )}
        />
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-9 sm:px-8 md:grid-cols-[1fr_1.2fr]">
              <p className="text-muted-bright font-sans text-lg leading-snug text-balance">
                {project.blurb}
              </p>
              <div className="space-y-4">
                <ul className="space-y-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="text-muted-bright flex gap-3 font-mono text-sm">
                      <span className="text-accent">→</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
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
                  <div className="flex flex-wrap gap-3 pt-2">
                    {project.live && (
                      <Button asChild size="sm">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => setCursor('hover')}
                        >
                          <ExternalLink /> Live demo
                        </a>
                      </Button>
                    )}
                    {project.repo && (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => setCursor('hover')}
                        >
                          <Github /> Source
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Projects() {
  const [active, setActive] = useState<string>(projects[0].index);

  return (
    <section id="work" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto mb-12 max-w-7xl px-5 sm:px-8 md:mb-20">
        <SectionHeading
          index="03 / SELECTED WORK"
          title="Things I designed, broke, and shipped."
          description="A product I built solo, plus systems from the Magnifi video platform. Open a row for details and links."
          className="mb-0"
        />
      </div>

      <div className="border-line border-t">
        {projects.map((project) => (
          <Reveal key={project.index} className="contents">
            <ProjectRow
              project={project}
              active={active === project.index}
              onHover={() => setActive(project.index)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
