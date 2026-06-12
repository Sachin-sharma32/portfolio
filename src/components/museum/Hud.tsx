import { ArrowLeft, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { requestLock } from '@/components/museum/lockBridge';
import { education, experiences, profile, projects, skills, stats } from '@/data/content';
import { useMuseumStore, type ExhibitId } from '@/store/useMuseumStore';
import { useUIStore } from '@/store/useUIStore';

/* ------------------------------------------------------------------ */
/* Focus panel content — the full résumé detail behind each exhibit    */
/* ------------------------------------------------------------------ */

function PanelShell({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <span className="mono-label text-accent">{label}</span>
      <h2 className="text-foreground mt-3 font-sans text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-8">{children}</div>
    </div>
  );
}

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border-line text-foreground hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors"
    >
      {children}
    </a>
  );
}

function ExhibitPanel({ id }: { id: ExhibitId }) {
  const setFocused = useMuseumStore((s) => s.setFocused);

  if (id === 'intro') {
    return (
      <PanelShell label="00 / INDEX" title={profile.name}>
        <p className="text-accent font-mono text-xs tracking-widest uppercase">
          {profile.role} — {profile.location}
        </p>
        <p className="text-foreground text-lg leading-snug">{profile.tagline}</p>
        <p className="text-muted-bright leading-relaxed">{profile.blurb}</p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={profile.github}>
            <Github size={14} /> GitHub
          </LinkButton>
          <LinkButton href={profile.linkedin}>
            <Linkedin size={14} /> LinkedIn
          </LinkButton>
        </div>
        <button
          onClick={() => setFocused('project-01')}
          className="bg-accent text-ink hover:bg-paper inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Tour the work →
        </button>
      </PanelShell>
    );
  }

  if (id === 'about') {
    return (
      <PanelShell label="01 / ABOUT" title="From the sports field to the stack.">
        <p className="text-muted-bright leading-relaxed">
          I didn't come to engineering the usual way. My degree is in{' '}
          <span className="text-foreground">Physical Education & Sports Science</span> — years of
          learning how repetition, feedback and small daily margins turn into performance. Turns out
          that's most of what writing software is too.
        </p>
        <p className="text-muted-bright leading-relaxed">{profile.blurb}</p>
        <div className="border-line bg-line grid grid-cols-2 gap-px border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink flex flex-col gap-2 p-4">
              <span className="text-accent font-sans text-2xl font-bold">{stat.value}</span>
              <span className="text-muted-bright font-mono text-[10px] tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {education.map((ed) => (
            <div key={ed.degree} className="border-line border-l-2 pl-4">
              <p className="text-foreground text-sm font-medium">{ed.degree}</p>
              <p className="text-muted font-mono text-xs">
                {ed.school} · {ed.year}
              </p>
            </div>
          ))}
        </div>
      </PanelShell>
    );
  }

  if (id === 'skills') {
    return (
      <PanelShell label="02 / TOOLKIT" title="What the work gets built with.">
        {skills.map((group) => (
          <div key={group.title}>
            <p className="text-foreground font-sans font-semibold">
              {group.title} <span className="text-accent-dim font-mono text-xs">[{group.tag}]</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="border-line text-muted-bright border px-2 py-0.5 font-mono text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </PanelShell>
    );
  }

  if (id === 'experience') {
    return (
      <PanelShell label="04 / TRACK RECORD" title="Where the reps happened.">
        {experiences.map((exp) => (
          <div key={`${exp.company}-${exp.start}`} className="border-line border-b pb-5">
            <p className="text-foreground font-sans text-xl font-bold">{exp.company}</p>
            <p className="text-accent mt-1 font-mono text-xs tracking-wider uppercase">
              {exp.role} · {exp.period}
            </p>
            <p className="text-muted mt-2 text-sm">{exp.context}</p>
            <ul className="text-muted-bright mt-3 space-y-2 text-sm leading-relaxed">
              {exp.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-accent shrink-0">↗</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PanelShell>
    );
  }

  if (id === 'contact') {
    return (
      <PanelShell label="05 / CONTACT" title="Got something worth building?">
        <p className="text-muted-bright leading-relaxed">
          Or a team that needs another pair of hands on the stack — my inbox is open.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="text-accent hover:text-paper inline-flex items-center gap-2 font-sans text-xl font-bold break-all transition-colors"
        >
          <Mail size={18} className="shrink-0" /> {profile.email}
        </a>
        <p className="text-muted font-mono text-xs tracking-widest">{profile.phone}</p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={profile.github}>
            <Github size={14} /> GitHub
          </LinkButton>
          <LinkButton href={profile.linkedin}>
            <Linkedin size={14} /> LinkedIn
          </LinkButton>
        </div>
      </PanelShell>
    );
  }

  // project-XX
  const project = projects.find((p) => `project-${p.index}` === id);
  if (!project) return null;
  return (
    <PanelShell label={`${project.index} / ${project.role.toUpperCase()}`} title={project.title}>
      <p className="text-muted-bright leading-relaxed">{project.blurb}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="border-accent/40 bg-accent/5 text-accent border px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase"
          >
            {s}
          </span>
        ))}
      </div>
      <ul className="text-muted-bright space-y-2 text-sm leading-relaxed">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-accent shrink-0">↗</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      {(project.live || project.repo) && (
        <div className="flex flex-wrap gap-3">
          {project.live && (
            <LinkButton href={project.live}>
              <ExternalLink size={14} /> Live demo
            </LinkButton>
          )}
          {project.repo && (
            <LinkButton href={project.repo}>
              <Github size={14} /> Source
            </LinkButton>
          )}
        </div>
      )}
    </PanelShell>
  );
}

/* ------------------------------------------------------------------ */
/* HUD                                                                 */
/* ------------------------------------------------------------------ */

export function MuseumHud() {
  const loaderDone = useUIStore((s) => s.loaderDone);
  const setMode = useUIStore((s) => s.setMode);
  const { entered, setEntered, locked, hovered, hoveredLabel, focused, setFocused } =
    useMuseumStore();

  // First successful pointer lock counts as "entering" the museum.
  useEffect(() => {
    if (locked && !entered) setEntered();
  }, [locked, entered, setEntered]);

  const resume = () => {
    setFocused(null);
    requestLock();
  };

  return (
    <>
      {/* Top chrome — above every overlay so the exit is always within reach. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-5">
        <span className="text-foreground font-mono text-sm font-bold tracking-widest">
          SHARMA_<span className="text-accent">3D</span>
        </span>
        <button
          onClick={() => setMode('classic')}
          className="border-line text-muted-bright hover:border-accent hover:text-accent pointer-events-auto border px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors"
        >
          Classic site
        </button>
      </div>

      {/* Crosshair — grows and names the exhibit under aim. */}
      {locked && (
        <div className="pointer-events-none fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`border transition-all duration-150 ${
              hovered
                ? 'border-accent size-10 rounded-full bg-cyan-400/10'
                : 'border-paper/60 size-1.5 rounded-full bg-white/80'
            }`}
          />
          {hovered && (
            <div className="absolute top-1/2 left-12 -translate-y-1/2 whitespace-nowrap">
              <span className="text-accent font-mono text-xs tracking-[0.25em] uppercase">
                {hoveredLabel}
              </span>
              <span className="text-muted ml-3 font-mono text-[10px] tracking-widest uppercase">
                click to inspect
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom hint while walking */}
      {locked && (
        <div className="text-muted pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] uppercase">
          WASD — move · shift — run · esc — pause
        </div>
      )}

      {/* Door screen / pause screen */}
      {loaderDone && !locked && !focused && (
        <div
          className="bg-ink/85 fixed inset-0 z-40 grid place-items-center backdrop-blur-sm"
          style={{ animation: 'overlay-fade 0.3s ease 0.5s both' }}
        >
          <div className="max-w-xl px-8 text-center">
            {!entered ? (
              <>
                <p className="mono-label text-accent mb-6">PORTFOLIO — IMMERSIVE MODE</p>
                <h1 className="text-foreground font-sans text-5xl font-bold tracking-tight">
                  SACHIN<span className="text-stroke-accent">SHARMA</span>
                </h1>
                <p className="text-muted-bright mt-4 leading-relaxed">
                  A small museum of things I designed, broke, and shipped. Walk around, aim at an
                  exhibit, click to inspect it.
                </p>
                <div className="text-muted mt-8 grid grid-cols-3 gap-px font-mono text-[10px] tracking-widest uppercase">
                  <div className="border-line border p-3">WASD / arrows — move</div>
                  <div className="border-line border p-3">Mouse — look around</div>
                  <div className="border-line border p-3">Click — inspect</div>
                </div>
              </>
            ) : (
              <p className="mono-label">PAUSED</p>
            )}
            <button
              onClick={() => requestLock()}
              className="bg-accent text-ink hover:bg-paper mt-10 px-8 py-3 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-colors"
            >
              {entered ? 'Click to resume' : 'Click to enter'}
            </button>
            <p className="text-muted mt-6 font-mono text-[10px] tracking-widest uppercase">
              {entered ? 'done walking?' : 'prefer scrolling?'}{' '}
              <button
                onClick={() => setMode('classic')}
                className="text-muted-bright hover:text-accent underline underline-offset-4"
              >
                back to the classic site
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Focused exhibit detail panel */}
      {focused && (
        <aside className="border-line bg-ink/95 fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col border-l p-8 backdrop-blur-md">
          <button
            onClick={resume}
            className="text-muted-bright hover:text-accent mb-6 inline-flex w-fit items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors"
          >
            <ArrowLeft size={12} /> Back to museum
          </button>
          <div className="min-h-0 flex-1">
            <ExhibitPanel id={focused} />
          </div>
        </aside>
      )}
    </>
  );
}
