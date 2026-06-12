import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

import { ACCENT, ACCENT_DIM, FONT_MONO, INK, X_WALL, Z_WALL } from '@/components/museum/constants';

/** Slightly raised cyan dust so the air has depth, like the babel stacks. */
function Dust({ count = 300 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * X_WALL * 2;
      arr[i * 3 + 1] = Math.random() * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * Z_WALL * 2;
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
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * The gallery shell: dark floor with the site's grid extended into 3D,
 * near-black walls for the exhibits to hang on, no ceiling — just fog
 * and dust above, so the room reads as a lit island in a void.
 */
export function Room() {
  return (
    <>
      <fog attach="fog" args={[INK, 12, 52]} />
      <ambientLight intensity={0.45} />
      {/* Key light high over the hub, cool white-cyan like the site accent. */}
      <pointLight position={[0, 9, 0]} intensity={160} distance={42} decay={1.8} color="#bdf3fa" />
      {/* Fill lights washing the gallery walls. */}
      <pointLight position={[0, 5, -13]} intensity={70} distance={26} decay={1.9} color="#9beef9" />
      <pointLight
        position={[-16, 4, 0]}
        intensity={40}
        distance={20}
        decay={1.9}
        color={ACCENT_DIM}
      />
      <pointLight
        position={[16, 4, 0]}
        intensity={40}
        distance={20}
        decay={1.9}
        color={ACCENT_DIM}
      />
      <pointLight
        position={[0, 4, 13]}
        intensity={40}
        distance={20}
        decay={1.9}
        color={ACCENT_DIM}
      />

      {/* Floor: solid slab + the brutalist grid. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}>
        <planeGeometry args={[X_WALL * 2 + 4, Z_WALL * 2 + 4]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.92} metalness={0.1} />
      </mesh>
      <gridHelper args={[X_WALL * 2 + 4, 44, '#1e2a2c', '#181818']} position={[0, 0, 0]} />

      {/* Walls — matte ink planes, fog-faded until approached. */}
      <mesh position={[0, 5, -Z_WALL]}>
        <planeGeometry args={[X_WALL * 2 + 4, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 5, Z_WALL]} rotation-y={Math.PI}>
        <planeGeometry args={[X_WALL * 2 + 4, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>
      <mesh position={[-X_WALL, 5, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[Z_WALL * 2 + 4, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>
      <mesh position={[X_WALL, 5, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[Z_WALL * 2 + 4, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>

      {/* Cyan trim where the walls meet the floor — the room's one loud line. */}
      {(
        [
          { pos: [0, 0.04, -Z_WALL + 0.02], rot: 0, len: X_WALL * 2 },
          { pos: [0, 0.04, Z_WALL - 0.02], rot: 0, len: X_WALL * 2 },
          { pos: [-X_WALL + 0.02, 0.04, 0], rot: Math.PI / 2, len: Z_WALL * 2 },
          { pos: [X_WALL - 0.02, 0.04, 0], rot: Math.PI / 2, len: Z_WALL * 2 },
        ] as const
      ).map((t, i) => (
        <mesh key={i} position={t.pos as unknown as THREE.Vector3} rotation-y={t.rot}>
          <boxGeometry args={[t.len, 0.04, 0.04]} />
          <meshBasicMaterial color={ACCENT_DIM} />
        </mesh>
      ))}

      {/* Wayfinding decal on the floor by the spawn point. */}
      <Text
        font={FONT_MONO}
        fontSize={0.22}
        color="#555555"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.02, 9.2]}
        rotation-x={-Math.PI / 2}
        letterSpacing={0.25}
      >
        WASD — MOVE · MOUSE — LOOK · CLICK — INSPECT
      </Text>

      <Dust />
    </>
  );
}
