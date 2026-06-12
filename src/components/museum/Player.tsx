import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import {
  EYE,
  SPAWN,
  VIEWPOINTS,
  X_BOUND,
  Z_BOUND,
  type ExhibitTag,
  type Viewpoint,
} from '@/components/museum/constants';
import { setLockControls } from '@/components/museum/lockBridge';
import { useMuseumStore, type ExhibitId } from '@/store/useMuseumStore';

const WALK_SPEED = 5.4;
const RUN_SPEED = 9;
const REACH = 15; // how far the crosshair can identify an exhibit

/** Solid props the player shouldn't walk through: [x, z, radius]. */
const COLLIDERS: Array<[number, number, number]> = [
  [0, -1, 2.1], // intro monolith
  [-10, 6.5, 1.1], // skill pillars
  [-13, 1.5, 1.1],
  [10, 6.5, 1.1],
  [13, 1.5, 1.1],
];

/** Walk up the object tree to the nearest ancestor tagged as an exhibit. */
function findExhibit(object: THREE.Object3D | null): ExhibitTag | null {
  let node: THREE.Object3D | null = object;
  while (node) {
    const tag = node.userData.exhibit as ExhibitTag | undefined;
    if (tag) return tag;
    node = node.parent;
  }
  return null;
}

/**
 * First-person rig: pointer-lock mouse look, WASD/arrow movement clamped to
 * the room, a center-screen raycast that identifies exhibits, and a cinematic
 * dolly to the exhibit's viewpoint while it's focused.
 */
export function Player() {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const get = useThree((s) => s.get);

  // Dev-only handle for inspecting the live R3F state from the console.
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__three = get;
    }
  }, [get]);

  const keys = useRef(new Set<string>());
  const velocity = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  // Clicked exhibits may carry a viewpoint override (e.g. the specific pillar);
  // store-driven focus (panel buttons) falls back to the exhibit's default.
  const viewOverride = useRef<{ id: ExhibitId; viewpoint: Viewpoint } | null>(null);
  const hoveredRef = useRef<ExhibitTag | null>(null);

  const setLocked = useMuseumStore((s) => s.setLocked);
  const setHovered = useMuseumStore((s) => s.setHovered);
  const setFocused = useMuseumStore((s) => s.setFocused);

  // Pointer-lock controls (mouse look). Lock/unlock is driven through the
  // lockBridge so DOM overlays can engage it from their own click gestures.
  useEffect(() => {
    camera.position.set(...SPAWN);
    camera.rotation.set(0, 0, 0);

    const controls = new PointerLockControls(camera, gl.domElement);
    setLockControls(controls);

    const onLock = () => setLocked(true);
    const onUnlock = () => setLocked(false);
    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);

    // The museum only mounts from an "Enter 3D mode" click, so that gesture's
    // transient activation usually still covers an immediate pointer lock —
    // the visitor lands straight in the walk. If the browser refuses, the
    // door overlay stays up and its button engages the lock instead.
    const autoLock = setTimeout(() => {
      if (!useMuseumStore.getState().locked) controls.lock();
    }, 150);

    return () => {
      clearTimeout(autoLock);
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      setLockControls(null);
      controls.dispose();
    };
  }, [camera, gl, setLocked]);

  // Keyboard state + interactions.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      // Esc while focused closes the panel (pointer lock is already off there).
      if (e.code === 'Escape' && useMuseumStore.getState().focused) setFocused(null);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);

    // Click while locked = inspect whatever the crosshair is on.
    const onMouseDown = () => {
      const { locked, focused } = useMuseumStore.getState();
      const hit = hoveredRef.current;
      if (!locked || focused || !hit) return;
      viewOverride.current = { id: hit.id, viewpoint: hit.viewpoint ?? VIEWPOINTS[hit.id] };
      setFocused(hit.id);
      releaseForFocus();
    };
    const releaseForFocus = () => document.exitPointerLock?.();

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [setFocused]);

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const move = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const lookMatrix = new THREE.Matrix4();
  const lookQuat = new THREE.Quaternion();

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1); // tab-switch spikes shouldn't teleport
    const { locked, focused } = useMuseumStore.getState();

    // Focus mode: glide to the exhibit's viewpoint and settle the gaze on it.
    if (focused) {
      const { position, look } =
        viewOverride.current?.id === focused ? viewOverride.current.viewpoint : VIEWPOINTS[focused];
      const t = 1 - Math.exp(-3.2 * delta);
      camera.position.lerp(new THREE.Vector3(...position), t);
      lookTarget.set(...look);
      lookMatrix.lookAt(camera.position, lookTarget, camera.up);
      lookQuat.setFromRotationMatrix(lookMatrix);
      camera.quaternion.slerp(lookQuat, t);
      return;
    }

    if (!locked) return;

    // --- Walk ---
    const k = keys.current;
    const z =
      (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    const x =
      (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) -
      (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? RUN_SPEED : WALK_SPEED;

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    move.set(0, 0, 0).addScaledVector(forward, z).addScaledVector(right, x);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed);

    const damp = 1 - Math.exp(-10 * delta);
    velocity.current.lerp(move, damp);
    camera.position.addScaledVector(velocity.current, delta);

    // Room bounds + prop collision (simple circles on the floor plan).
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -X_BOUND, X_BOUND);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -Z_BOUND, Z_BOUND);
    for (const [cx, cz, r] of COLLIDERS) {
      const dx = camera.position.x - cx;
      const dz = camera.position.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < r * r && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        camera.position.x = cx + (dx / d) * r;
        camera.position.z = cz + (dz / d) * r;
      }
    }
    camera.position.y = EYE;

    // --- Aim: what is the crosshair on? ---
    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
    raycaster.current.far = REACH;
    const hits = raycaster.current.intersectObjects(scene.children, true);
    // Lines (grids) and Points (dust) raycast with fat thresholds — meshes only.
    const meshHit = hits.find((h) => (h.object as THREE.Mesh).isMesh);
    const tag = meshHit ? findExhibit(meshHit.object) : null;
    if (tag?.id !== hoveredRef.current?.id) {
      hoveredRef.current = tag;
      setHovered(tag?.id ?? null, tag?.label ?? '');
    }
  });

  return null;
}
