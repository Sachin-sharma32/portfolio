import { useCallback } from 'react';

import { useUIStore, type CursorVariant } from '@/store/useUIStore';

/**
 * Returns hover handlers that morph the custom cursor while pointing at an element.
 * Spread the result onto any interactive node: {...cursorProps('hover', 'open')}
 */
export function useCursor() {
  const setCursor = useUIStore((s) => s.setCursor);

  const cursorProps = useCallback(
    (variant: CursorVariant = 'hover', label = '') => ({
      onMouseEnter: () => setCursor(variant, label),
      onMouseLeave: () => setCursor('default'),
    }),
    [setCursor]
  );

  return { cursorProps, setCursor };
}
