import { useEffect } from 'react'

/**
 * Locks page scroll while `active` is true.
 * Compensates for the disappearing scrollbar so the layout doesn't jump.
 */
export default function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const { documentElement: html, body } = document
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const prev = { overflow: html.style.overflow, paddingRight: body.style.paddingRight }

    html.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      html.style.overflow = prev.overflow
      body.style.paddingRight = prev.paddingRight
    }
  }, [active])
}
