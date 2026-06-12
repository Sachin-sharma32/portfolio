import { lazy, Suspense, useState } from 'react';

import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navbar, navItems } from '@/components/Navbar';
import { Preloader } from '@/components/Preloader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { canHostMuseum } from '@/lib/capabilities';
import { useUIStore } from '@/store/useUIStore';

// Three.js is heavy — both 3D experiences load in their own chunks after first paint.
const Scene3D = lazy(() => import('@/components/three/Scene3D'));
const MuseumApp = lazy(() => import('@/components/museum/MuseumApp'));

const sectionIds = navItems.map((n) => n.id);

/** Offered only on hardware that could run the museum (desktop, fine pointer). */
function MuseumInvite() {
  const setMode = useUIStore((s) => s.setMode);
  return (
    <button
      onClick={() => setMode('museum')}
      className="border-line bg-ink/80 text-muted-bright hover:border-accent hover:text-accent fixed bottom-5 left-5 z-50 border px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase backdrop-blur-md transition-colors"
    >
      ◆ Enter 3D mode
    </button>
  );
}

/** The scrollable 2D site. On desktop it keeps the 3D backdrop; mobile stays flat. */
function ClassicSite({ desktop }: { desktop: boolean }) {
  useSectionObserver(sectionIds);

  return (
    <SmoothScroll>
      <div className="noise-overlay" aria-hidden />
      {desktop && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}
      <CustomCursor />
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
      {desktop && <MuseumInvite />}
    </SmoothScroll>
  );
}

export default function App() {
  const mode = useUIStore((s) => s.mode);
  // Hardware gate is stable for the session; evaluated once.
  const [desktop] = useState(() => canHostMuseum());

  return (
    <>
      <Preloader />
      {mode === 'museum' ? (
        <Suspense fallback={null}>
          <MuseumApp />
        </Suspense>
      ) : (
        <ClassicSite desktop={desktop} />
      )}
    </>
  );
}
