import { Canvas } from '@react-three/fiber';
import { Component, Suspense, type ReactNode } from 'react';

import { INK } from '@/components/museum/constants';
import {
  AboutWall,
  ContactKiosk,
  ExperienceWall,
  IntroMonolith,
  ProjectGallery,
  SkillsPillars,
} from '@/components/museum/Exhibits';
import { MuseumHud } from '@/components/museum/Hud';
import { Player } from '@/components/museum/Player';
import { Room } from '@/components/museum/Room';
import { useUIStore } from '@/store/useUIStore';

/** A GPU failure mid-visit should fall back to the classic site, not a black screen. */
class MuseumErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    useUIStore.getState().setMode('classic');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The whole immersive experience: first-person gallery + DOM HUD. */
export default function MuseumApp() {
  const loaderDone = useUIStore((s) => s.loaderDone);

  return (
    <MuseumErrorBoundary>
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          loaderDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Canvas
          dpr={[1, 1.75]}
          camera={{ fov: 72, near: 0.1, far: 90 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[INK]} />
          <Suspense fallback={null}>
            <Room />
            <IntroMonolith />
            <ProjectGallery />
            <AboutWall />
            <ExperienceWall />
            <SkillsPillars />
            <ContactKiosk />
          </Suspense>
          <Player />
        </Canvas>
      </div>
      <MuseumHud />
    </MuseumErrorBoundary>
  );
}
