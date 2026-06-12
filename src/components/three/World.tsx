import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { scrollToSection } from '@/lib/scroll';
import { useUIStore } from '@/store/useUIStore';

/* Palette mirrors the CSS tokens in index.css — keep both in sync. */
const ACCENT = '#22d3ee';
const ACCENT_DIM = '#0e7490';
const INK = '#0a0a0a';
const BLOCK = '#262626';

/* The camera travels from z=6 (hero) to z=PATH_END (footer) over one full page scroll. */
const PATH_END = -64;

/** Page scroll progress 0..1 — reads the live DOM so it tracks Lenis exactly. */
function pageProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/**
 * Scroll-driven dolly: the camera flies down a corridor as the page scrolls,
 * swaying gently along a sine path, while the pointer adds a free-look offset —
 * the same "you are moving through a space" feel as a first-person walkthrough,
 * but steered by the scrollbar instead of WASD.
 */
function CameraRig() {
  const light = useRef<THREE.PointLight>(null);
  const scroll = useRef(0);
  const look = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    // Damped, not snapped — gives the dolly physical inertia.
    scroll.current = THREE.MathUtils.damp(scroll.current, pageProgress(), 4, delta);
    look.current.x = THREE.MathUtils.damp(look.current.x, state.pointer.x, 5, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, state.pointer.y, 5, delta);

    const p = scroll.current;
    const z = THREE.MathUtils.lerp(6, PATH_END, p);
    const sway = Math.sin(p * Math.PI * 2.5) * 1.3;

    state.camera.position.set(sway + look.current.x * 0.5, 0.2 + look.current.y * 0.35, z);
    state.camera.lookAt(sway * 0.4 + look.current.x * 2.2, look.current.y * 1.4, z - 10);

    // Headlamp travels with the camera so nearby blocks catch the light.
    light.current?.position.set(state.camera.position.x, state.camera.position.y + 1.2, z + 1.5);
  });

  return <pointLight ref={light} color="#9beef9" intensity={90} distance={30} decay={1.9} />;
}

/**
 * The hero centerpiece: a wireframe icosahedron with a faceted core.
 * Hover charges it (accent color, faster spin), click kicks an angular impulse.
 */
function HeroShape() {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const spin = useRef(0);
  const setCursor = useUIStore((s) => s.setCursor);
  const wide = useThree((s) => s.viewport.aspect > 1);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    spin.current = THREE.MathUtils.damp(spin.current, 0, 1.4, delta);
    g.rotation.y += delta * (hover ? 0.9 : 0.22) + spin.current * delta;
    g.rotation.x += delta * 0.1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, hover ? 1.12 : 1, 6, delta));
    g.position.y = (wide ? 0.1 : 1.4) + Math.sin(state.clock.elapsedTime * 0.7) * 0.18;
  });

  return (
    <group
      ref={group}
      position={[wide ? 3 : 0, 0.1, -0.5]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        setCursor('view', 'spin');
      }}
      onPointerOut={() => {
        setHover(false);
        setCursor('default');
      }}
      onClick={(e) => {
        e.stopPropagation();
        spin.current += 16;
      }}
    >
      <mesh>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial
          color={hover ? ACCENT : ACCENT_DIM}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1.7, 0]} />
        <meshStandardMaterial
          color="#10181b"
          flatShading
          metalness={0.5}
          roughness={0.35}
          emissive={hover ? ACCENT_DIM : '#062229'}
        />
      </mesh>
    </group>
  );
}

/*
 * One wireframe solid per section, staged along the camera path so they drift
 * past as you scroll. Hover names the section on the cursor; click travels there
 * — the 3D world doubles as navigation.
 */
const LANDMARKS = [
  { id: 'about', label: 'about', z: -13, x: -3.6, geo: 'torus' },
  { id: 'work', label: 'work', z: -27, x: 3.5, geo: 'octa' },
  { id: 'experience', label: 'experience', z: -41, x: -3.4, geo: 'box' },
  { id: 'contact', label: 'contact', z: -55, x: 3.6, geo: 'tetra' },
] as const;

function LandmarkGeometry({ geo }: { geo: (typeof LANDMARKS)[number]['geo'] }) {
  switch (geo) {
    case 'torus':
      return <torusGeometry args={[1.1, 0.38, 8, 20]} />;
    case 'octa':
      return <octahedronGeometry args={[1.3, 0]} />;
    case 'box':
      return <boxGeometry args={[1.7, 1.7, 1.7]} />;
    case 'tetra':
      return <tetrahedronGeometry args={[1.5, 0]} />;
  }
}

function Landmark({ id, label, z, x, geo }: (typeof LANDMARKS)[number]) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const spin = useRef(0);
  const setCursor = useUIStore((s) => s.setCursor);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    spin.current = THREE.MathUtils.damp(spin.current, 0, 1.4, delta);
    m.rotation.y += delta * (hover ? 1 : 0.3) + spin.current * delta;
    m.rotation.x += delta * 0.14;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, hover ? 1.25 : 1, 6, delta));
    m.position.y = Math.sin(state.clock.elapsedTime * 0.6 + z) * 0.35;
  });

  return (
    <mesh
      ref={mesh}
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        setCursor('view', label);
      }}
      onPointerOut={() => {
        setHover(false);
        setCursor('default');
      }}
      onClick={(e) => {
        e.stopPropagation();
        spin.current += 12;
        scrollToSection(id);
      }}
    >
      <LandmarkGeometry geo={geo} />
      <meshBasicMaterial color={hover ? ACCENT : '#3a3a3a'} wireframe transparent opacity={0.9} />
    </mesh>
  );
}

/**
 * The corridor itself: a few hundred instanced blocks scattered in a tube
 * around the camera path, slowly tumbling. Fog swallows the far ones, so
 * scrolling continually reveals new geometry — the Babel trick.
 */
function BlockField({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const items = useMemo(
    () =>
      Array.from({ length: count }, () => {
        // Annulus around the path axis so the corridor center stays clear.
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 8.5;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.55,
          z: 10 - Math.random() * 86,
          scale: 0.1 + Math.random() ** 2 * 0.55,
          speed: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
        };
      }),
    [count]
  );

  // Instance tints: mostly dark concrete, roughly one in eight glows cyan.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dark = new THREE.Color(BLOCK);
    const glow = new THREE.Color(ACCENT_DIM);
    for (let i = 0; i < count; i++) m.setColorAt(i, Math.random() < 0.12 ? glow : dark);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      dummy.position.set(it.x, it.y + Math.sin(t * 0.4 + it.phase) * 0.3, it.z);
      dummy.rotation.set(t * it.speed, t * it.speed * 1.4 + it.phase, 0);
      dummy.scale.setScalar(it.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial flatShading metalness={0.3} roughness={0.55} />
    </instancedMesh>
  );
}

/** Static cyan dust — barely-there depth cue between the blocks. */
function Dust({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = 10 - Math.random() * 86;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function World({ mobile }: { mobile: boolean }) {
  const get = useThree((s) => s.get);
  useLayoutEffect(() => {
    // Dev-only handle for inspecting the live R3F state from the console.
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__three = get;
    }
  }, [get]);

  return (
    <>
      {/* Fog relative to the camera — the world reveals itself as you travel. */}
      <fog attach="fog" args={[INK, 7, 30]} />
      <ambientLight intensity={0.5} />
      <CameraRig />

      <HeroShape />
      {LANDMARKS.map((l) => (
        <Landmark key={l.id} {...l} />
      ))}
      <BlockField count={mobile ? 130 : 320} />
      <Dust count={mobile ? 200 : 500} />

      {/* Floor + ceiling wireframe planes — extends the page's grid texture into depth. */}
      <gridHelper args={[240, 110, '#1c2629', '#161616']} position={[0, -3.6, -30]} />
      <gridHelper args={[240, 110, '#1c2629', '#141414']} position={[0, 4.2, -30]} />
    </>
  );
}
