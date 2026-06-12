import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import {
  ACCENT,
  ACCENT_DIM,
  EYE,
  FONT_BOLD,
  FONT_MEDIUM,
  FONT_MONO,
  LINE,
  MUTED,
  PAPER,
  X_WALL,
  Z_WALL,
  type ExhibitTag,
} from '@/components/museum/constants';
import { experiences, profile, projects, skills, stats } from '@/data/content';
import { useMuseumStore, type ExhibitId } from '@/store/useMuseumStore';

/** Invisible volume the player's crosshair raycast can hit. */
function Hitbox({
  tag,
  size,
  position = [0, 0, 0],
}: {
  tag: ExhibitTag;
  size: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <mesh position={position} visible={false} userData={{ exhibit: tag }}>
      <boxGeometry args={size} />
      <meshBasicMaterial />
    </mesh>
  );
}

function useHovered(id: ExhibitId) {
  return useMuseumStore((s) => s.hovered === id);
}

/* ------------------------------------------------------------------ */
/* Intro — the hub monolith                                            */
/* ------------------------------------------------------------------ */

export function IntroMonolith() {
  const ico = useRef<THREE.Group>(null);
  const hovered = useHovered('intro');

  useFrame((state, delta) => {
    const g = ico.current;
    if (!g) return;
    g.rotation.y += delta * (hovered ? 0.9 : 0.25);
    g.rotation.x += delta * 0.08;
    g.position.y = 2.4 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial color="#121212" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.7, 0.05, 1.7]} />
        <meshBasicMaterial color={hovered ? ACCENT : ACCENT_DIM} />
      </mesh>

      {/* The centerpiece */}
      <group ref={ico}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={hovered ? ACCENT : ACCENT_DIM}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh scale={0.55}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#10181b"
            flatShading
            metalness={0.5}
            roughness={0.35}
            emissive={hovered ? ACCENT_DIM : '#062229'}
          />
        </mesh>
      </group>

      {/* Name plate floating above, facing the spawn point. */}
      <Text
        font={FONT_BOLD}
        fontSize={0.62}
        color={PAPER}
        position={[0, 4.35, 0]}
        anchorX="center"
        letterSpacing={0.02}
      >
        SACHIN
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.62}
        color={PAPER}
        fillOpacity={0}
        outlineWidth={0.014}
        outlineColor={ACCENT}
        position={[0, 3.72, 0]}
        anchorX="center"
        letterSpacing={0.02}
      >
        SHARMA
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.16}
        color={MUTED}
        position={[0, 3.25, 0]}
        anchorX="center"
        letterSpacing={0.3}
      >
        {profile.role.toUpperCase()} — {profile.location.toUpperCase()}
      </Text>

      <Hitbox tag={{ id: 'intro', label: 'index' }} size={[2.4, 5, 2.4]} position={[0, 2.4, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Projects — five framed works on the north wall                      */
/* ------------------------------------------------------------------ */

const FRAME_W = 5.6;
const FRAME_H = 3.7;
const FRAME_XS = [-14, -7, 0, 7, 14];

function ProjectFrame({ index }: { index: number }) {
  const project = projects[index];
  const id = `project-${project.index}` as ExhibitId;
  const hovered = useHovered(id);
  const x = FRAME_XS[index];
  const borderColor = hovered ? ACCENT : LINE;

  return (
    <group position={[x, 2.6, -Z_WALL + 0.08]}>
      {/* Backing panel */}
      <mesh>
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshStandardMaterial color={hovered ? '#121518' : '#101010'} roughness={0.85} />
      </mesh>

      {/* Frame border */}
      <mesh position={[0, FRAME_H / 2, 0.02]}>
        <boxGeometry args={[FRAME_W + 0.08, 0.06, 0.06]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[0, -FRAME_H / 2, 0.02]}>
        <boxGeometry args={[FRAME_W + 0.08, 0.06, 0.06]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[-FRAME_W / 2, 0, 0.02]}>
        <boxGeometry args={[0.06, FRAME_H + 0.08, 0.06]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[FRAME_W / 2, 0, 0.02]}>
        <boxGeometry args={[0.06, FRAME_H + 0.08, 0.06]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>

      {/* Ghost index, oversized like the 2D cards */}
      <Text
        font={FONT_BOLD}
        fontSize={1.6}
        color={hovered ? '#15282c' : '#161616'}
        position={[FRAME_W / 2 - 1.2, FRAME_H / 2 - 0.9, 0.01]}
        anchorX="center"
      >
        {project.index}
      </Text>

      <Text
        font={FONT_MONO}
        fontSize={0.14}
        color={ACCENT}
        position={[-FRAME_W / 2 + 0.35, FRAME_H / 2 - 0.45, 0.02]}
        anchorX="left"
        letterSpacing={0.2}
        maxWidth={FRAME_W - 0.7}
      >
        {`${project.index} / ${project.role.toUpperCase()}`}
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.46}
        color={PAPER}
        position={[-FRAME_W / 2 + 0.35, FRAME_H / 2 - 0.8, 0.02]}
        anchorX="left"
        anchorY="top"
        maxWidth={FRAME_W - 0.7}
        lineHeight={1.05}
      >
        {project.title}
      </Text>
      <Text
        font={FONT_MEDIUM}
        fontSize={0.17}
        color={MUTED}
        position={[-FRAME_W / 2 + 0.35, -0.25, 0.02]}
        anchorX="left"
        anchorY="top"
        maxWidth={FRAME_W - 1.4}
        lineHeight={1.35}
      >
        {project.blurb.length > 150 ? project.blurb.slice(0, 147).trimEnd() + '…' : project.blurb}
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.13}
        color={ACCENT_DIM}
        position={[-FRAME_W / 2 + 0.35, -FRAME_H / 2 + 0.32, 0.02]}
        anchorX="left"
        letterSpacing={0.12}
      >
        {project.stack.join(' · ').toUpperCase()}
      </Text>

      <Hitbox tag={{ id, label: project.title.toLowerCase() }} size={[FRAME_W, FRAME_H, 0.5]} />
    </group>
  );
}

export function ProjectGallery() {
  return (
    <group>
      <Text
        font={FONT_MONO}
        fontSize={0.2}
        color={MUTED}
        position={[-X_WALL + 2.5, 5.4, -Z_WALL + 0.08]}
        anchorX="left"
        letterSpacing={0.3}
      >
        03 / SELECTED WORK
      </Text>
      {projects.map((_, i) => (
        <ProjectFrame key={i} index={i} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* About — west wall                                                   */
/* ------------------------------------------------------------------ */

export function AboutWall() {
  const hovered = useHovered('about');

  return (
    <group position={[-X_WALL + 0.08, 0, 0]} rotation-y={Math.PI / 2}>
      <Text
        font={FONT_MONO}
        fontSize={0.18}
        color={ACCENT}
        position={[-5, 4.6, 0]}
        anchorX="left"
        letterSpacing={0.3}
      >
        01 / ABOUT
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.62}
        color={hovered ? ACCENT : PAPER}
        position={[-5, 3.9, 0]}
        anchorX="left"
        maxWidth={10.5}
        lineHeight={1.05}
      >
        From the sports field to the stack.
      </Text>
      <Text
        font={FONT_MEDIUM}
        fontSize={0.24}
        color={MUTED}
        position={[-5, 2.7, 0]}
        anchorX="left"
        anchorY="top"
        maxWidth={10}
        lineHeight={1.4}
      >
        {`Degree in Physical Education & Sports Science. Self-taught developer — ${profile.yearsExperience} years of shipping production SaaS. Now finishing an M.Sc. in Data Science & AI at BITS Pilani.`}
      </Text>

      {/* Stat blocks along the base of the wall */}
      {stats.map((stat, i) => (
        <group key={stat.label} position={[-5 + i * 2.7, 1.1, 0]}>
          <Text font={FONT_BOLD} fontSize={0.44} color={ACCENT} anchorX="left">
            {stat.value}
          </Text>
          <Text
            font={FONT_MONO}
            fontSize={0.11}
            color={MUTED}
            position={[0, -0.38, 0]}
            anchorX="left"
            maxWidth={2.3}
            lineHeight={1.4}
            letterSpacing={0.12}
          >
            {stat.label.toUpperCase()}
          </Text>
        </group>
      ))}

      <Hitbox
        tag={{ id: 'about', label: 'about' }}
        size={[11, 4.6, 0.5]}
        position={[0.3, 2.8, 0]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Experience — east wall timeline                                     */
/* ------------------------------------------------------------------ */

export function ExperienceWall() {
  const hovered = useHovered('experience');

  return (
    <group position={[X_WALL - 0.08, 0, 0]} rotation-y={-Math.PI / 2}>
      <Text
        font={FONT_MONO}
        fontSize={0.18}
        color={ACCENT}
        position={[-5, 4.6, 0]}
        anchorX="left"
        letterSpacing={0.3}
      >
        04 / TRACK RECORD
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.62}
        color={hovered ? ACCENT : PAPER}
        position={[-5, 3.9, 0]}
        anchorX="left"
      >
        Where the reps happened.
      </Text>

      {/* Timeline spine */}
      <mesh position={[-5.4, 2.05, 0]}>
        <boxGeometry args={[0.03, 3.1, 0.03]} />
        <meshBasicMaterial color={ACCENT_DIM} />
      </mesh>

      {experiences.map((exp, i) => (
        <group key={`${exp.company}-${exp.start}`} position={[-5, 3.1 - i * 1.05, 0]}>
          <mesh position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshBasicMaterial color={ACCENT} />
          </mesh>
          <Text font={FONT_BOLD} fontSize={0.34} color={PAPER} anchorX="left">
            {exp.company}
          </Text>
          <Text
            font={FONT_MONO}
            fontSize={0.14}
            color={MUTED}
            position={[0, -0.34, 0]}
            anchorX="left"
            letterSpacing={0.08}
          >
            {`${exp.role.toUpperCase()} · ${exp.period.toUpperCase()}`}
          </Text>
        </group>
      ))}

      <Hitbox
        tag={{ id: 'experience', label: 'experience' }}
        size={[11, 4.6, 0.5]}
        position={[0.3, 2.8, 0]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Skills — four pillars flanking the hub                              */
/* ------------------------------------------------------------------ */

const PILLARS: Array<{ x: number; z: number }> = [
  { x: -10, z: 6.5 },
  { x: -13, z: 1.5 },
  { x: 10, z: 6.5 },
  { x: 13, z: 1.5 },
];

function SkillPillar({ index }: { index: number }) {
  const group = skills[index];
  const { x, z } = PILLARS[index];
  const hovered = useHovered('skills');
  // Face the center of the room.
  const yaw = Math.atan2(-x, -z) + Math.PI;

  // Park the camera a few steps toward the room center from this pillar.
  const len = Math.hypot(x, z);
  const vx = x - (x / len) * 3.6;
  const vz = z - (z / len) * 3.6;

  return (
    <group position={[x, 0, z]} rotation-y={yaw}>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[1.1, 3.4, 1.1]} />
        <meshStandardMaterial
          color={hovered ? '#15191c' : '#131313'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>
      {/* Cap light */}
      <mesh position={[0, 3.43, 0]}>
        <boxGeometry args={[1.15, 0.05, 1.15]} />
        <meshBasicMaterial color={hovered ? ACCENT : ACCENT_DIM} />
      </mesh>

      <Text
        font={FONT_BOLD}
        fontSize={0.26}
        color={hovered ? ACCENT : PAPER}
        position={[0, 2.85, -0.58]}
        anchorX="center"
        rotation-y={Math.PI}
      >
        {group.title}
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.12}
        color={ACCENT_DIM}
        position={[0, 2.55, -0.58]}
        anchorX="center"
        rotation-y={Math.PI}
        letterSpacing={0.25}
      >
        [{group.tag.toUpperCase()}]
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.115}
        color={MUTED}
        position={[0, 2.25, -0.58]}
        anchorX="center"
        anchorY="top"
        rotation-y={Math.PI}
        maxWidth={1}
        lineHeight={1.5}
      >
        {group.items.slice(0, 5).join('\n')}
      </Text>

      <Hitbox
        tag={{
          id: 'skills',
          label: 'skills',
          viewpoint: { position: [vx, EYE, vz], look: [x, 2.2, z] },
        }}
        size={[1.3, 3.6, 1.3]}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}

export function SkillsPillars() {
  return (
    <group>
      {skills.map((_, i) => (
        <SkillPillar key={i} index={i} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Contact — kiosk on the south wall                                   */
/* ------------------------------------------------------------------ */

export function ContactKiosk() {
  const hovered = useHovered('contact');

  return (
    <group position={[0, 0, Z_WALL - 0.08]} rotation-y={Math.PI}>
      <Text
        font={FONT_MONO}
        fontSize={0.18}
        color={ACCENT}
        position={[-5, 4.4, 0]}
        anchorX="left"
        letterSpacing={0.3}
      >
        05 / CONTACT
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.56}
        color={PAPER}
        position={[-5, 3.7, 0]}
        anchorX="left"
        maxWidth={10.5}
        lineHeight={1.1}
      >
        Got something worth building?
      </Text>
      <Text
        font={FONT_BOLD}
        fontSize={0.4}
        color={hovered ? ACCENT : ACCENT_DIM}
        position={[-5, 2.6, 0]}
        anchorX="left"
      >
        {profile.email}
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.15}
        color={MUTED}
        position={[-5, 2, 0]}
        anchorX="left"
        letterSpacing={0.2}
      >
        GITHUB · LINKEDIN · {profile.phone}
      </Text>

      <Hitbox
        tag={{ id: 'contact', label: 'contact' }}
        size={[11, 4, 0.5]}
        position={[0, 2.8, 0]}
      />
    </group>
  );
}
