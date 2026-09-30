import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import useBodyScrollLock from '../../hooks/useBodyScrollLock.js'
import useFocusTrap from '../../hooks/useFocusTrap.js'
import { prefersReducedMotion } from '../../lib/motion.js'
import ImageWithFallback from '../ui/ImageWithFallback.jsx'
import { CloseIcon, ChevronIcon } from '../ui/icons.jsx'

const SWIPE_THRESHOLD_PX = 50

/**
 * Full-screen photo viewer opened from <StoryImageGrid>. Sits above the
 * story modal (which is already inert-locked in the background), with its
 * own focus trap / scroll lock / Esc handling — simple fade+scale in and
 * out, no shared-element morph from the tapped tile.
 *
 * Props: images (string[]), initialIndex, title (used for alt text),
 * onClose() — called after the close animation finishes.
 */
export default function ImageLightbox({ images, initialIndex, title, onClose }) {
  return createPortal(
    <LightboxInner images={images} initialIndex={initialIndex} title={title} onClose={onClose} />,
    document.body,
  )
}

function LightboxInner({ images, initialIndex, title, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const count = images.length

  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const closingRef = useRef(false)
  const dragRef = useRef({ startX: 0, dragging: false })

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useBodyScrollLock(true)
  useFocusTrap(rootRef, true)

  const goTo = useCallback((next) => setIndex(((next % count) + count) % count), [count])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  /* open animation */
  useLayoutEffect(() => {
    const reduce = prefersReducedMotion()
    const tl = gsap.timeline()
    tl.fromTo(
      backdropRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: reduce ? 0.01 : 0.25, ease: 'power2.out' },
      0,
    ).fromTo(
      panelRef.current,
      { autoAlpha: 0, scale: reduce ? 1 : 0.96 },
      { autoAlpha: 1, scale: 1, duration: reduce ? 0.01 : 0.3, ease: 'power2.out' },
      0,
    )
    requestAnimationFrame(() => closeBtnRef.current?.focus({ preventScroll: true }))
    return () => tl.kill()
  }, [])

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    const reduce = prefersReducedMotion()
    gsap
      .timeline({ onComplete: () => onCloseRef.current?.() })
      .to(
        panelRef.current,
        { autoAlpha: 0, scale: reduce ? 1 : 0.97, duration: reduce ? 0.01 : 0.2, ease: 'power2.in' },
        0,
      )
      .to(backdropRef.current, { autoAlpha: 0, duration: reduce ? 0.01 : 0.2 }, 0)
  }, [])

  /* keyboard: Esc closes, arrows navigate */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose()
      else if (e.key === 'ArrowLeft' && count > 1) goPrev()
      else if (e.key === 'ArrowRight' && count > 1) goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose, goPrev, goNext, count])

  // A direct click on the panel's own empty space (not something inside it)
  // closes, same convention as the story modal's backdrop click.
  const onPanelPointerDown = (e) => {
    if (e.target === e.currentTarget) requestClose()
  }

  /* swipe left/right on the image to navigate */
  const onImagePointerDown = (e) => {
    dragRef.current = { startX: e.clientX, dragging: true }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onImagePointerUp = (e) => {
    const drag = dragRef.current
    if (!drag.dragging) return
    drag.dragging = false
    if (count < 2) return
    const deltaX = e.clientX - drag.startX
    if (deltaX <= -SWIPE_THRESHOLD_PX) goNext()
    else if (deltaX >= SWIPE_THRESHOLD_PX) goPrev()
  }

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80]">
      <div ref={backdropRef} className="invisible absolute inset-0 bg-ink/95 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={count > 1 ? `${title} — photo ${index + 1} of ${count}` : title}
        className="invisible absolute inset-0 flex flex-col items-center justify-center p-4"
        onPointerDown={onPanelPointerDown}
      >
        <div
          className="relative touch-pan-y"
          onPointerDown={onImagePointerDown}
          onPointerUp={onImagePointerUp}
        >
          <ImageWithFallback
            src={images[index]}
            alt={count > 1 ? `${title} — photo ${index + 1} of ${count}` : title}
            className="max-h-[80vh] max-w-[92vw] w-auto h-auto rounded-lg object-contain"
          />
        </div>

        {count > 1 && (
          <div className="mt-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper">
            {index + 1} / {count}
          </div>
        )}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20 md:left-6"
          >
            <ChevronIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6"
          >
            <ChevronIcon className="h-5 w-5" />
          </button>
        </>
      )}

      <button
        ref={closeBtnRef}
        type="button"
        onClick={requestClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6 md:top-6"
      >
        <CloseIcon />
      </button>
    </div>
  )
}
