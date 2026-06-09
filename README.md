# Sachin Sharma — Portfolio

A hand-coded, brutalist/mono personal portfolio. Near-black canvas, structural grid lines,
one loud accent (electric cyan), kinetic type and motion. No template, no page builder.

**Live sections:** Index → About → Toolkit → Selected Work → Track Record → Contact.

## Tech stack

| Concern         | Choice                                                 |
| --------------- | ------------------------------------------------------ |
| Build tool      | [Vite](https://vite.dev) (SPA — no backend/SSR needed) |
| Framework       | React 18 + TypeScript                                  |
| Styling         | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)   |
| Animation       | GSAP (hero kinetic intro) + Framer Motion (scroll/UI)  |
| State           | Zustand (cursor, nav, active section)                  |
| Icons           | lucide-react                                           |
| Fonts           | Space Grotesk (display) + JetBrains Mono (technical)   |
| Tooling         | ESLint, Prettier, Husky, lint-staged                   |
| Package manager | pnpm                                                   |

## Getting started

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server (http://localhost:5173)
```

## Scripts

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start Vite dev server with HMR       |
| `pnpm build`        | Type-check then build to `dist/`     |
| `pnpm preview`      | Preview the production build locally |
| `pnpm lint`         | Run ESLint                           |
| `pnpm lint:fix`     | Run ESLint with autofix              |
| `pnpm format`       | Format with Prettier                 |
| `pnpm format:check` | Check formatting without writing     |
| `pnpm typecheck`    | Type-check only                      |

## Project structure

```
src/
├─ components/
│  ├─ sections/      # Hero, About, Skills, Projects, Experience, Contact
│  ├─ ui/            # shadcn primitives (button, badge)
│  └─ *.tsx          # Navbar, Footer, CustomCursor, Reveal, Marquee, …
├─ data/content.ts   # single source of truth for all copy + résumé data
├─ hooks/            # useCursor, useSectionObserver
├─ store/            # Zustand UI store
├─ lib/utils.ts      # cn() class merge helper
├─ index.css         # Tailwind v4 theme + brutalist design tokens
├─ App.tsx
└─ main.tsx
```

## Editing content

All résumé-driven copy (profile, stats, skills, experience, projects, education) lives in
[`src/data/content.ts`](src/data/content.ts). Update there — the sections render from it.

## Code quality

Husky runs `lint-staged` on every commit: ESLint `--fix` + Prettier on staged `.ts/.tsx`,
Prettier on staged `.css/.md/.json`. Keeps the tree clean without thinking about it.

## Accessibility & motion

- Respects `prefers-reduced-motion` (animations collapse to near-instant).
- Custom cursor only mounts on fine-pointer devices; touch keeps native behavior.
- Semantic landmarks, focus-visible rings, ARIA labels on interactive controls.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds with pnpm and publishes `dist/` to **GitHub Pages**. The workflow passes
`VITE_BASE=/<repo>/` so asset URLs resolve correctly on a project Pages site — no manual
config when the repo is renamed.

One-time setup: in **Settings → Pages**, set the source to **GitHub Actions**.

---

Built in Jaipur. © Sachin Sharma.
