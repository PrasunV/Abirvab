import { useCallback, useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion.js'

/**
 * Tracks a horizontal scroll rail and drives a pagination control.
 *
 * Pages are screenfuls of the rail, not individual cards, so the dot count
 * adapts to how many cards actually fit: fewer dots on a wide screen, more
 * on a phone. Reusable — it only needs a ref to the scrolling element.
 *
 * @param {object} railRef ref to the scrolling container
 */
export default function useCarouselPagination(railRef) {
  const [state, setState] = useState({ pageCount: 1, activeIndex: 0, atStart: true, atEnd: true })

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const { scrollLeft, scrollWidth, clientWidth } = rail
    const maxScroll = Math.max(scrollWidth - clientWidth, 0)
    const pageCount = clientWidth > 0 ? Math.max(1, Math.ceil(scrollWidth / clientWidth)) : 1

    const atStart = scrollLeft <= 1
    const atEnd = scrollLeft >= maxScroll - 1
    // Snap the indicator to the ends: the last screenful is often a partial
    // one (the rail scrolls less than its own width), so rounding alone would
    // never light up the final dot.
    const byScroll = Math.round(scrollLeft / Math.max(clientWidth, 1))
    const activeIndex = atEnd ? pageCount - 1 : atStart ? 0 : Math.min(byScroll, pageCount - 1)

    setState({ pageCount, activeIndex, atStart, atEnd })
  }, [railRef])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    sync()
    rail.addEventListener('scroll', onScroll, { passive: true })
    const observer = new ResizeObserver(onScroll)
    observer.observe(rail)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [railRef, sync])

  const scrollToPage = useCallback(
    (page) => {
      const rail = railRef.current
      if (!rail) return
      const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      const target = Math.min(Math.max(page, 0) * rail.clientWidth, maxScroll)
      rail.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    },
    [railRef],
  )

  const goPrev = useCallback(
    () => scrollToPage(state.activeIndex - 1),
    [scrollToPage, state.activeIndex],
  )
  const goNext = useCallback(
    () => scrollToPage(state.activeIndex + 1),
    [scrollToPage, state.activeIndex],
  )

  return { ...state, scrollToPage, goPrev, goNext }
}
