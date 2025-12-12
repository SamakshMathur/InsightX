
export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

/**
 * Returns bounding rectangles for all elements marked as protected zones.
 */
export const getProtectedZones = (selector: string = '.protected-zone'): Rect[] => {
  if (typeof window === 'undefined') return [];
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map(el => {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    };
  });
};

/**
 * Checks if a point lies within any of the provided zones.
 */
export const checkCollision = (x: number, y: number, zones: Rect[]): boolean => {
  return zones.some(zone => 
    x >= zone.left && x <= zone.right &&
    y >= zone.top && y <= zone.bottom
  );
};
