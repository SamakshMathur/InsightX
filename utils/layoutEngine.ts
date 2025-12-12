
/**
 * Collision Detection & Layout Fixer
 * Scans critical UI elements for overlap and adjusts spacing dynamically.
 */

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const getRect = (el: Element): Rect => el.getBoundingClientRect();

const isOverlapping = (a: Rect, b: Rect): boolean => {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
};

export const checkCollisionAndFix = (containerSelector: string) => {
  if (typeof window === 'undefined') return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // 1. Check Hero Text vs CTA overlapping
  const textContainer = container.querySelector('.grid'); // The placeholder grid in hero
  const ctaContainer = container.querySelector('.hero-cta-row');

  if (textContainer && ctaContainer) {
    const textRect = getRect(textContainer);
    const ctaRect = getRect(ctaContainer);
    
    // Add buffer
    const buffer = 20;

    // Check vertical overlap in flow (if they are visually touching or crossed)
    if (textRect.bottom + buffer > ctaRect.top) {
      console.warn("Layout Collision Detected: Adjusting Hero Spacing");
      (ctaContainer as HTMLElement).style.marginTop = `${(textRect.bottom - ctaRect.top) + 32}px`;
    }
  }

  // 2. Global Safety Check for Safe Zones
  const safeZones = document.querySelectorAll('.safe-zone');
  safeZones.forEach((zone, index) => {
    if (index === 0) return;
    const prev = safeZones[index - 1].getBoundingClientRect();
    const curr = zone.getBoundingClientRect();
    
    if (prev.bottom > curr.top) {
        // Force spacing
        (zone as HTMLElement).style.marginTop = '32px';
    }
  });
};
