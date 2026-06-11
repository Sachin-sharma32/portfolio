import { Check, Copy, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';

import { LocalTime } from '@/components/LocalTime';
import { Magnetic } from '@/components/Magnetic';
import { Reveal } from '@/components/Reveal';
import { RollingText } from '@/components/RollingText';
import { profile } from '@/data/content';
import { useCursor } from '@/hooks/useCursor';

export function Contact() {
  const { cursorProps } = useCursor();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the mailto link below still works */
    }
  };

  const pill =
    'group/roll border-line text-muted-bright hover:border-foreground hover:text-foreground inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors';

  return (
    // The lights come on: the only light section on the page, so the final
    // call-to-action lands like a scene change.
    <section id="contact" className="theme-paper relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal>
            <span className="text-accent-dim font-mono text-[0.7rem] tracking-[0.25em] uppercase">
              05 / CONTACT
            </span>
          </Reveal>
          <Reveal index={1}>
            <LocalTime className="text-muted font-mono text-[10px] tracking-[0.25em] uppercase" />
          </Reveal>
        </div>

        <Reveal index={1}>
          <h2 className="mt-10 max-w-4xl font-sans text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-7xl md:text-8xl">
            Let&apos;s build
            <br />
            something <span className="text-accent-dim">real.</span>
          </h2>
        </Reveal>

        <Reveal index={2}>
          <p className="text-muted-bright mt-8 max-w-2xl font-sans text-xl leading-snug text-balance sm:text-2xl">
            Got something worth building — or a team that needs another pair of hands on the stack?
          </p>
        </Reveal>

        {/* Giant mailto */}
        <Reveal index={3}>
          <a
            href={`mailto:${profile.email}`}
            className="group border-line hover:text-accent-dim mt-12 block w-full border-y py-8 font-sans text-2xl font-bold tracking-tight break-all transition-colors sm:text-5xl md:text-6xl"
            {...cursorProps('view', 'email')}
          >
            <span className="link-wipe">{profile.email}</span>
            <span className="text-accent-dim ml-3 inline-block transition-transform group-hover:translate-x-2 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        </Reveal>

        {/* Action row */}
        <Reveal index={4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <button type="button" onClick={copyEmail} className={pill} {...cursorProps('hover')}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <RollingText text={copied ? 'Copied' : 'Copy email'} />
              </button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className={pill}
                {...cursorProps('hover')}
              >
                <Github size={14} /> <RollingText text="GitHub" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className={pill}
                {...cursorProps('hover')}
              >
                <Linkedin size={14} /> <RollingText text="LinkedIn" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className={pill}
                {...cursorProps('hover')}
              >
                <Mail size={14} /> {profile.phone}
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
