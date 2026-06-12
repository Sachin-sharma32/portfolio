import { Canvas } from '@react-three/fiber';
import { Component, useEffect, useState, type ReactNode } from 'react';

import { World } from '@/components/three/World';
import { useUIStore } from '@/store/useUIStore';

/** A broken GPU/driver should degrade to the flat site, never a white screen. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Fixed full-viewport WebGL layer behind the page. The canvas itself ignores
 * the pointer; raycasting is fed from events bubbling up to #root, so 3D
 * objects stay hoverable/clickable straight through the DOM content above.
 */
export function Scene3D() {
  const loaderDone = useUIStore((s) => s.loaderDone);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      supportsWebGL() &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    // Raycast from body, not #root — some viewport points (section gaps) hit
    // the body directly, and events there would never bubble through #root.
    setRoot(document.body);
  }, []);

  if (!enabled || !root) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 -z-10 transition-opacity duration-1000 ${
        loaderDone ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <SceneErrorBoundary>
        <Canvas
          eventSource={root}
          eventPrefix="client"
          dpr={[1, 1.75]}
          camera={{ fov: 62, near: 0.1, far: 120, position: [0, 0.2, 6] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <World mobile={mobile} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

export default Scene3D;
