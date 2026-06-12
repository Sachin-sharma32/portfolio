import type { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

/**
 * Module-level handle to the pointer-lock controls so DOM overlays (which live
 * outside the Canvas) can engage the lock synchronously from a click gesture —
 * browsers reject requestPointerLock calls that aren't user-initiated.
 */
let controls: PointerLockControls | null = null;

export function setLockControls(instance: PointerLockControls | null) {
  controls = instance;
}

export function requestLock() {
  controls?.lock();
}

export function releaseLock() {
  controls?.unlock();
}
