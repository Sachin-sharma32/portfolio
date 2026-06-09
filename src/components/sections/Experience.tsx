import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { education, experiences } from '@/data/content';

export function Experience() {
  return (
    <section id="experience" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="04 / TRACK RECORD" title="Where I've been putting in reps." />

        <div className="relative">
          {/* Spine */}
          <span className="bg-line absolute top-2 left-0 hidden h-full w-px md:block" />

          <ol className="space-y-px">
            {experiences.map((exp, i) => (
              <Reveal key={`${exp.company}-${exp.start}`} index={i}>
                <li className="group border-line bg-ink hover:bg-ink-soft relative grid gap-6 border p-6 transition-colors md:grid-cols-[260px_1fr] md:p-8">
                  {/* Node dot */}
                  <span className="bg-line group-hover:bg-accent absolute top-9 -left-[5px] hidden size-2.5 rounded-full transition-colors md:block" />

                  <div className="space-y-2">
                    <span className="mono-label text-accent">{exp.period}</span>
                    <h3 className="font-sans text-2xl font-bold tracking-tight">{exp.company}</h3>
                    <p className="text-foreground font-mono text-sm">{exp.role}</p>
                    <p className="text-muted font-mono text-xs leading-relaxed">{exp.context}</p>
                  </div>

                  <ul className="space-y-3 self-center">
                    {exp.highlights.map((h) => (
                      <li key={h} className="text-muted-bright flex gap-3 text-sm leading-relaxed">
                        <span className="bg-accent mt-1.5 size-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Education */}
        <div className="mt-16">
          <Reveal>
            <h3 className="mono-label text-muted-bright mb-6">// Education</h3>
          </Reveal>
          <div className="border-line bg-line grid gap-px border md:grid-cols-2">
            {education.map((edu, i) => (
              <Reveal key={edu.degree} index={i} className="contents">
                <div className="bg-ink space-y-2 p-6">
                  <span className="mono-label text-accent">{edu.year}</span>
                  <h4 className="font-sans text-lg leading-tight font-bold">{edu.degree}</h4>
                  <p className="text-muted-bright font-mono text-sm">{edu.school}</p>
                  {edu.note && (
                    <p className="text-muted pt-1 font-mono text-xs leading-relaxed">{edu.note}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
