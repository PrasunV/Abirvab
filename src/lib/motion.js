/** Shared motion helpers so every component respects the same rules. */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True below the site's `md` breakpoint (768px) — matches the Tailwind config. */
export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

/** True when any part of the rect is inside the viewport. */
export const isRectInViewport = (rect) =>
  !!rect &&
  rect.width > 0 &&
  rect.height > 0 &&
  rect.bottom > 0 &&
  rect.right > 0 &&
  rect.top < window.innerHeight &&
  rect.left < window.innerWidth

/**
 * The part of an element's box that is currently on screen.
 * Used so a tall modal animates to/from what the user can actually see.
 */
export const getVisibleRect = (el) => {
  const r = el.getBoundingClientRect()
  const top = Math.max(r.top, 0)
  const bottom = Math.min(r.bottom, window.innerHeight)
  return { top, left: r.left, width: r.width, height: Math.max(bottom - top, 0) }
}
