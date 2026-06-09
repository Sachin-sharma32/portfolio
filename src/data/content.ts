/**
 * Single source of truth for everything the site renders.
 * Pulled straight from the résumé so copy stays consistent and editable in one place.
 */

export const profile = {
  name: 'Sachin Sharma',
  initials: 'SS',
  role: 'Full-Stack Developer',
  location: 'Jaipur, Rajasthan',
  email: 'sachin2sharma001@gmail.com',
  phone: '+91 6367212438',
  github: 'https://github.com/Sachin-sharma32',
  linkedin: 'https://www.linkedin.com/in/sachin-sharma-38418a210/',
  yearsExperience: 4,
  // Short, human, specific — no "passionate about leveraging synergies".
  tagline: 'I build the parts of SaaS products people actually click on.',
  blurb:
    'Full-stack developer, three years in, mostly living in React + TypeScript on the front and Node.js + MongoDB on the back. I like the unglamorous middle: the rule engine that quietly turns a UI toggle into a 13-step video pipeline, the auth that has to survive five roles and a refresh-token rotation, the timeline editor that has to feel like an instrument.',
} as const;

export const stats = [
  { value: '70+', label: 'React components shipped' },
  { value: '27', label: 'backend domain modules' },
  { value: '90+', label: 'API endpoints secured' },
  { value: '15+', label: 'third-party integrations' },
] as const;

export type SkillGroup = {
  title: string;
  tag: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    title: 'Frontend',
    tag: 'client',
    items: [
      'React 18',
      'TypeScript',
      'Redux Toolkit',
      'RxJS (Observable Epics)',
      'Next.js (App Router)',
      'Tailwind CSS',
      'HTML5 / CSS3',
      'Accessibility (ARIA)',
    ],
  },
  {
    title: 'Backend',
    tag: 'server',
    items: [
      'Node.js',
      'Hapi.js',
      'Express',
      'Fastify',
      'REST APIs',
      'JWT Auth',
      'SAML / SSO',
      'WebSockets (Socket.io)',
    ],
  },
  {
    title: 'Data & Cloud',
    tag: 'infra',
    items: [
      'MongoDB / Mongoose',
      'Redis',
      'PostgreSQL',
      'AWS SNS / SQS',
      'AWS S3 / MediaLive',
      'Docker',
    ],
  },
  {
    title: 'Tooling & Testing',
    tag: 'craft',
    items: ['Git', 'Playwright', 'Jest', 'Datadog (APM + RUM)', 'CI/CD', 'Docker Multi-Stage'],
  },
];

export type Experience = {
  company: string;
  role: string;
  context: string;
  start: string;
  end: string;
  period: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    company: 'Reddhr',
    role: 'Freelance Full-Stack Developer',
    context: 'HR recruitment platform — contract engagement on new product features and API work.',
    start: '2025-02',
    end: '2026-03',
    period: 'Feb 2025 — Mar 2026',
    highlights: [
      'Built responsive React 18 + TypeScript interfaces and a reusable component library for recruitment dashboards, candidate tracking, and reporting.',
      'Managed complex client state with Redux Toolkit and RxJS epics — debounced search, request cancellation, async flows across multi-step forms.',
      'Extended REST APIs in Node.js + MongoDB/Mongoose for candidate, job-posting and pipeline data, with JWT auth and role-based access.',
      'Added live recruitment-pipeline updates over Socket.io so multiple recruiters see candidate status change in real time.',
    ],
  },
  {
    company: 'Magnifi',
    role: 'Full-Stack Developer',
    context:
      'Multi-tenant video SaaS for sports content automation, highlight generation and publishing.',
    start: '2023-10',
    end: '2025-02',
    period: 'Oct 2023 — Feb 2025',
    highlights: [
      'Designed a cross-repo rule engine: React UI → Hapi.js API (bidirectional transform) → TypeScript event processor (SNS → SQS → 13-step StepFactory) for automated highlight generation.',
      'Built 70+ reusable React components and 60+ Redux slices with RxJS Observable epics — debouncing, cancellation, retry logic.',
      'Architected 27 backend domain modules on clean architecture (Domain → Repository → Service → Controller → Route) with MongoDB/Mongoose.',
      'Implemented multi-strategy auth (JWT + SAML/SSO + Basic) with refresh-token rotation, HttpOnly cookies and 5-level RBAC across 90+ endpoints.',
      'Built a Fastify v4 TypeScript microservice with factory + adapter patterns, 90%+ test coverage under CI-enforced thresholds.',
      'Integrated 15+ services: Stripe (subscriptions + marketplace metering), YouTube/Facebook/Twitter publishing, Brightcove, Akamai CDN, AWS MediaLive.',
      'Built a custom video editor: HLS audio timeline, WaveSurfer.js waveform rendering, Slate.js rich-text overlay editor.',
      'Shipped Docker multi-stage deploys across 5 environments with Datadog APM + Browser RUM monitoring.',
    ],
  },
  {
    company: 'Reddhr',
    role: 'Web Developer',
    context: 'Internal HR management platform for recruitment operations and candidate tracking.',
    start: '2022-05',
    end: '2023-09',
    period: 'May 2022 — Sep 2023',
    highlights: [
      'Developed responsive React frontends on a component-based architecture for HR management workflows.',
      'Built RESTful endpoints in Node.js + Express for employee data and recruitment-pipeline operations.',
      'Designed and maintained MongoDB collections and Mongoose schemas for candidate profiles, job postings and org data.',
      'Helped build the application from the ground up, across both frontend pages and backend APIs.',
    ],
  },
];

export type Project = {
  index: string;
  title: string;
  blurb: string;
  role: string;
  stack: string[];
  highlights: string[];
  /** Optional links — present for open-source / live projects. */
  repo?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    index: '01',
    title: 'Marginalia',
    blurb:
      'A web highlighter I built end-to-end: select text on any page — or clip a moment on YouTube — from a Chrome extension, and it lands in a real-time dashboard. The video-clip instinct from Magnifi, rebuilt solo as a product.',
    role: 'Solo build · live product',
    stack: ['Next.js', 'React 19', 'TypeScript', 'Convex', 'Chrome MV3', 'pnpm'],
    highlights: [
      'Two surfaces over one backend: a Manifest V3 Chrome extension for capture and a Next.js dashboard for everything saved.',
      'Convex keeps highlights, notes, collections, whiteboards and to-dos in sync live — highlight in the browser, it appears in the dashboard with no refresh.',
      'Capture text on any site or mark start/end of a YouTube moment as a replayable clip, all color-coded with notes and tags.',
    ],
    repo: 'https://github.com/Sachin-sharma32/highlighter',
    live: 'https://highlighter-web.vercel.app',
  },
  {
    index: '02',
    title: 'Cross-Repo Rule Engine',
    blurb:
      'A toggle in a React UI becomes a 13-step automated video-highlight pipeline. Three repos, one mental model.',
    role: 'Architecture & full-stack',
    stack: ['React', 'Hapi.js', 'TypeScript', 'AWS SNS', 'AWS SQS'],
    highlights: [
      'Bidirectional transform between UI rule config and the event-processor schema.',
      'StepFactory pipeline with 13 composable stages, fanned out via SNS → SQS.',
      'Built to survive retries, partial failures and replays without duplicating output.',
    ],
  },
  {
    index: '03',
    title: 'Custom Video Editor',
    blurb:
      'A browser editing surface that has to feel like an instrument — scrub, waveform, overlays — not a form.',
    role: 'Frontend engineering',
    stack: ['React', 'WaveSurfer.js', 'Slate.js', 'HLS'],
    highlights: [
      'HLS audio timeline with WaveSurfer.js waveform rendering.',
      'Slate.js rich-text overlay editor layered on the video canvas.',
      'Tuned for responsiveness so scrubbing and editing never feel laggy.',
    ],
  },
  {
    index: '04',
    title: 'Multi-Strategy Auth & RBAC',
    blurb:
      'One identity layer that speaks JWT, SAML/SSO and Basic — across 90+ endpoints and five permission levels.',
    role: 'Backend & security',
    stack: ['Node.js', 'JWT', 'SAML/SSO', 'HttpOnly cookies'],
    highlights: [
      'Refresh-token rotation with HttpOnly, secure cookies.',
      '5-level RBAC enforced consistently across every endpoint.',
      'Multi-tenant isolation: Organization → Workspace → User, scoped by entityId.',
    ],
  },
  {
    index: '05',
    title: 'Realtime Status Layer',
    blurb:
      'Execution status that updates live and still works when you scale the server horizontally.',
    role: 'Full-stack & infra',
    stack: ['Socket.io', 'Redis', 'Node.js', 'Docker'],
    highlights: [
      'Socket.io with a Redis adapter for cross-instance fan-out.',
      'Horizontal scaling across multiple server instances without dropped events.',
      'Datadog APM + Browser RUM wired in for end-to-end visibility.',
    ],
  },
];

export type Education = {
  degree: string;
  school: string;
  year: string;
  note?: string;
};

export const education: Education[] = [
  {
    degree: 'M.Sc. Data Science & Artificial Intelligence',
    school: 'BITS Pilani (Online)',
    year: 'May 2026',
  },
  {
    degree: 'B.PES — Physical Education & Sports Science',
    school: 'Manipal University Jaipur',
    year: '2021',
    note: 'Self-taught developer — moved into software through independent study and shipping real projects.',
  },
];

/** Words for the hero marquee — a quick read of what I work with. */
export const marqueeWords = [
  'React',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'AWS',
  'Redux',
  'RxJS',
  'Socket.io',
  'Docker',
  'Fastify',
  'Hapi.js',
  'Redis',
] as const;
