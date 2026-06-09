import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { skills } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';

export function Skills() {
  const { cursorProps } = useCursor();

  return (
    <section id="skills" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02 / TOOLKIT"
          title="The stack I reach for."
          description="Not a wishlist — these are the tools I've shipped production features with."
        />

        <div className="border-line bg-line grid gap-px border md:grid-cols-2">
          {skills.map((group, gi) => (
            <Reveal key={group.title} index={gi} className="contents">
              <div className="group bg-ink hover:bg-ink-soft p-6 transition-colors sm:p-8">
                <div className="mb-6 flex items-baseline justify-between">
                  <h3 className="font-sans text-2xl font-bold tracking-tight">{group.title}</h3>
                  <span className="mono-label text-accent">[ {group.tag} ]</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-line text-muted-bright hover:border-accent hover:text-accent border px-3 py-1.5 font-mono text-xs transition-colors"
                      {...cursorProps('hover')}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
