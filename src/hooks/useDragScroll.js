import { useEffect, useRef } from 'react'

const DRAG_THRESHOLD_PX = 6

/**
 * Mouse drag-to-scroll for a horizontal rail (touch already scrolls natively).
 * Also swallows the click that ends a drag, so dragging the rail
 * never accidentally opens a card.
 */
export default function useDragScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const row = ref.current
    if (!row) return

    let isDown = false
    let dragged = false
    let startX = 0
    let startScroll = 0

    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return
      isDown = true
      dragged = false
      startX = e.pageX
      startScroll = row.scrollLeft
    }
    const onMove = (e) => {
      if (!isDown) return
      const delta = e.pageX - startX
      if (!dragged && Math.abs(delta) < DRAG_THRESHOLD_PX) return
      dragged = true
      row.classList.add('cursor-grabbing')
      e.preventDefault()
      row.scrollLeft = startScroll - delta
    }
    const onUp = () => {
      isDown = false
      row.classList.remove('cursor-grabbing')
    }
    const onClickCapture = (e) => {
      if (!dragged) return
      e.preventDefault()
      e.stopPropagation()
      dragged = false
    }

    row.addEventListener('pointerdown', onDown)
    row.addEventListener('pointermove', onMove)
    row.addEventListener('click', onClickCapture, true)
    window.addEventListener('pointerup', onUp)
    return () => {
      row.removeEventListener('pointerdown', onDown)
      row.removeEventListener('pointermove', onMove)
      row.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return ref
}
