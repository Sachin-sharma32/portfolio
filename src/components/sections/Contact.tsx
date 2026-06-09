import { Copy, Check, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';

import { Reveal } from '@/components/Reveal';
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

  return (
    <section id="contact" className="border-line border-t py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <span className="mono-label text-accent">05 / CONTACT</span>
        </Reveal>

        <Reveal index={1}>
          <p className="text-muted-bright mt-8 max-w-2xl font-sans text-xl leading-snug text-balance sm:text-2xl">
            Got something worth building — or a team that needs another pair of hands on the stack?
            Let&apos;s talk.
          </p>
        </Reveal>

        {/* Giant mailto */}
        <Reveal index={2}>
          <a
            href={`mailto:${profile.email}`}
            className="group border-line hover:text-accent mt-12 block w-full border-y py-8 font-sans text-3xl font-bold tracking-tight break-all transition-colors sm:text-5xl md:text-6xl"
            {...cursorProps('hover')}
          >
            <span className="link-wipe">{profile.email}</span>
            <span className="text-accent ml-3 inline-block transition-transform group-hover:translate-x-2">
              ↗
            </span>
          </a>
        </Reveal>

        {/* Action row */}
        <Reveal index={3}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="border-line text-muted-bright hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors"
              {...cursorProps('hover')}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy email'}
            </button>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="border-line text-muted-bright hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors"
              {...cursorProps('hover')}
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="border-line text-muted-bright hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors"
              {...cursorProps('hover')}
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              className="border-line text-muted-bright hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors"
              {...cursorProps('hover')}
            >
              <Mail size={14} /> {profile.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
