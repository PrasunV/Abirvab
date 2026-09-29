import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import useBodyScrollLock from '../../hooks/useBodyScrollLock.js'
import useFocusTrap from '../../hooks/useFocusTrap.js'
import { getVisibleRect, isMobileViewport, isRectInViewport, prefersReducedMotion } from '../../lib/motion.js'
import { CloseIcon } from './icons.jsx'

const OPEN_DURATION = 0.6
const CLOSE_DURATION = 0.5
const EASE = 'power3.inOut'

/**
 * Accessible modal with a "shared element" zoom: the panel grows out of the
 * element that opened it and shrinks back into it on close (Stripe-style).
 *
 * Reusable: nothing in here knows about stories.
 *
 * Props
 *  - open              render the modal when true
 *  - onClose()         called AFTER the close animation finishes; set open=false here
 *  - getOriginElement  () => HTMLElement | null, the element to zoom from/to.
 *                      Called on open, on close and whenever contentKey changes,
 *                      so the origin can change while the modal is open.
 *  - contentKey        change it to swap content: the panel scrolls to top and
 *                      the new origin element is tracked
 *  - labelledBy        id of the heading inside children (aria-labelledby)
 *  - closeLabel        accessible label for the X button
 *  - panelClassName    extra classes for the white panel
 *  - mobileBottomSheet below the md breakpoint, render as a near-full-height
 *                      bottom sheet (drag handle, plain slide up/down, swipe
 *                      to dismiss) instead of the centered zoom dialog. The
 *                      centered zoom dialog is unchanged at md and up, and
 *                      unchanged everywhere when this is left false (default).
 *
 * Elements inside children marked with `data-modal-reveal` fade up in sequence
 * once the zoom finishes.
 */
export default function Modal({
  open,
  onClose,
  getOriginElement,
  contentKey,
  labelledBy,
  closeLabel = 'Close',
  panelClassName = '',
  mobileBottomSheet = false,
  children,
}) {
  if (!open) return null
  return createPortal(
    <ModalInner
      onClose={onClose}
      getOriginElement={getOriginElement}
      contentKey={contentKey}
      labelledBy={labelledBy}
      closeLabel={closeLabel}
      panelClassName={panelClassName}
      mobileBottomSheet={mobileBottomSheet}
    >
      {children}
    </ModalInner>,
    document.body,
  )
}

function ModalInner({
  onClose,
  getOriginElement,
  contentKey,
  labelledBy,
  closeLabel,
  panelClassName,
  mobileBottomSheet,
  children,
}) {
  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const scrollerRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const timelineRef = useRef(null)
  const closingRef = useRef(false)
  const hiddenOriginRef = useRef(null)
  const openGhostRef = useRef(null)
  const dragRef = useRef({ dragging: false, startY: 0, deltaY: 0 })

  // Latest callbacks without re-running effects.
  const onCloseRef = useRef(onClose)
  const getOriginRef = useRef(getOriginElement)
  onCloseRef.current = onClose
  getOriginRef.current = getOriginElement

  useBodyScrollLock(true)
  useFocusTrap(rootRef, true)

  // True only while this modal is both configured for it and actually below
  // the md breakpoint right now (checked fresh each time, since the viewport
  // can change between mount, open, swap and close).
  const inSheetMode = useCallback(
    () => mobileBottomSheet && isMobileViewport(),
    [mobileBottomSheet],
  )

  /* ---------- origin element visibility (true shared-element feel) ---------- */
  const hideOrigin = useCallback((el) => {
    if (hiddenOriginRef.current && hiddenOriginRef.current !== el) {
      hiddenOriginRef.current.style.visibility = ''
    }
    if (el) el.style.visibility = 'hidden'
    hiddenOriginRef.current = el || null
  }, [])

  const showOrigin = useCallback(() => {
    if (hiddenOriginRef.current) hiddenOriginRef.current.style.visibility = ''
    hiddenOriginRef.current = null
  }, [])

  /* ---------- page isolation + focus restore ---------- */
  useEffect(() => {
    const appRoot = document.getElementById('root')
    if (appRoot) appRoot.inert = true

    return () => {
      if (appRoot) appRoot.inert = false
      showOrigin()
      getOriginRef.current?.()?.focus({ preventScroll: true })
    }
  }, [showOrigin])

  /* ---------- open animation ---------- */
  useLayoutEffect(() => {
    const panel = panelRef.current
    const backdrop = backdropRef.current
    const reveals = panel.querySelectorAll('[data-modal-reveal]')
    const origin = getOriginRef.current?.()
    const originRect = origin?.getBoundingClientRect()
    const reduce = prefersReducedMotion()
    const sheetMode = inSheetMode()
    const canZoom = !reduce && !sheetMode && isRectInViewport(originRect)

    let ghost = null
    // The panel is visibility:hidden until revealed, so focus can only move in afterwards.
    // One frame of delay: the site's reduced-motion CSS gives every element a tiny
    // transition, which keeps `visibility` hidden for the frame it flips.
    const focusClose = () =>
      requestAnimationFrame(() => closeBtnRef.current?.focus({ preventScroll: true }))
    const tl = gsap.timeline()
    timelineRef.current = tl

    tl.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0.01 : 0.4, ease: 'power2.out' }, 0)

    if (canZoom) {
      hideOrigin(origin)
      ghost = createGhost(origin, originRect)
      rootRef.current.appendChild(ghost)
      openGhostRef.current = ghost
      gsap.set(panel, { autoAlpha: 0 })

      const target = getVisibleRect(panel)
      tl.to(
        ghost,
        {
          ...target,
          borderRadius: getComputedStyle(panel).borderRadius,
          duration: OPEN_DURATION,
          ease: EASE,
        },
        0,
      )
        .to(ghost.firstChild, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 0.1)
        .set(panel, { autoAlpha: 1 })
        .add(focusClose)
        .set(ghost, { autoAlpha: 0 })
        .fromTo(
          reveals,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' },
          '-=0.05',
        )
    } else if (sheetMode) {
      // Plain slide up from off-screen bottom — no shared-element morph.
      gsap.set(panel, { y: '100%' })
      tl.fromTo(
        panel,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        0,
      )
        .to(panel, { y: '0%', duration: reduce ? 0.01 : 0.4, ease: 'power3.out' }, 0)
        .add(focusClose)
    } else {
      tl.fromTo(
        panel,
        { autoAlpha: 0, y: reduce ? 0 : 24 },
        { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.35, ease: 'power2.out' },
        0,
      ).add(focusClose)
    }

    return () => {
      tl.kill()
      ghost?.remove()
    }
  }, [hideOrigin, inSheetMode])

  /* ---------- content swap (e.g. "More stories") ---------- */
  const firstKeyRef = useRef(contentKey)
  useEffect(() => {
    if (contentKey === firstKeyRef.current) return
    firstKeyRef.current = contentKey
    scrollerRef.current?.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    // Track the newly-shown item's origin so close zooms back into the right card.
    const next = getOriginRef.current?.()
    if (next && hiddenOriginRef.current) hideOrigin(next)
  }, [contentKey, hideOrigin])

  /* ---------- close animation ---------- */
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    timelineRef.current?.kill()
    openGhostRef.current?.remove() // in case the user closes mid-open

    const panel = panelRef.current
    const backdrop = backdropRef.current
    const origin = getOriginRef.current?.()
    const originRect = origin?.getBoundingClientRect()
    const reduce = prefersReducedMotion()
    const sheetMode = inSheetMode()
    const canZoom = !reduce && !sheetMode && isRectInViewport(originRect)
    const finish = () => onCloseRef.current?.()

    const tl = gsap.timeline({ onComplete: finish })
    timelineRef.current = tl

    if (canZoom) {
      hideOrigin(origin)
      const from = getVisibleRect(panel)
      const ghost = createGhost(origin, from, getComputedStyle(panel).borderRadius)
      gsap.set(ghost.firstChild, { autoAlpha: 0 })
      rootRef.current.appendChild(ghost)
      gsap.set(panel, { autoAlpha: 0 })

      tl.to(
        ghost,
        {
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderRadius: getComputedStyle(origin).borderRadius,
          duration: CLOSE_DURATION,
          ease: EASE,
        },
        0,
      )
        .to(ghost.firstChild, { autoAlpha: 1, duration: 0.3, ease: 'power1.in' }, 0.15)
        .to(backdrop, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 0.1)
        .add(showOrigin)
    } else if (sheetMode) {
      // Plain slide back down — continues smoothly from wherever a swipe left it.
      tl.to(panel, { y: '100%', duration: reduce ? 0.01 : 0.3, ease: 'power2.in' }, 0)
        .to(backdrop, { autoAlpha: 0, duration: reduce ? 0.01 : 0.25 }, 0)
    } else {
      tl.to(panel, { autoAlpha: 0, y: reduce ? 0 : 16, duration: reduce ? 0.01 : 0.25, ease: 'power2.in' }, 0)
        .to(backdrop, { autoAlpha: 0, duration: reduce ? 0.01 : 0.25 }, 0)
    }
  }, [hideOrigin, showOrigin, inSheetMode])

  /* ---------- Esc to close ---------- */
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && requestClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  // Click on the empty area around the panel closes (not clicks inside it).
  const onBackdropPointerDown = (e) => {
    if (e.target === e.currentTarget) requestClose()
  }

  /* ---------- swipe-down-to-dismiss (bottom sheet only) ---------- */
  const onHandlePointerDown = (e) => {
    if (!inSheetMode() || closingRef.current) return
    dragRef.current = { dragging: true, startY: e.clientY, deltaY: 0 }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onHandlePointerMove = (e) => {
    const drag = dragRef.current
    if (!drag.dragging) return
    const deltaY = Math.max(0, e.clientY - drag.startY)
    drag.deltaY = deltaY
    gsap.set(panelRef.current, { y: deltaY })
  }

  const onHandlePointerEnd = () => {
    const drag = dragRef.current
    if (!drag.dragging) return
    drag.dragging = false
    const panel = panelRef.current
    const threshold = panel.getBoundingClientRect().height * 0.22
    if (drag.deltaY > threshold) {
      requestClose()
    } else {
      gsap.to(panel, { y: '0%', duration: 0.3, ease: 'power2.out' })
    }
    drag.deltaY = 0
  }

  return (
    <div ref={rootRef} className="fixed inset-0 z-[70]">
      <div
        ref={backdropRef}
        className="invisible absolute inset-0 bg-ink/45 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain"
      >
        <div
          className={
            mobileBottomSheet
              ? 'flex min-h-full items-end justify-center md:items-start md:px-6 md:py-16'
              : 'flex min-h-full items-start justify-center px-3 py-6 sm:px-6 md:py-16'
          }
          onPointerDown={onBackdropPointerDown}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={`invisible relative w-full bg-white shadow-[0_30px_80px_-20px_rgba(14,14,16,0.45)] ${
              mobileBottomSheet
                ? 'min-h-[90vh] rounded-t-3xl md:min-h-0 md:max-w-6xl md:rounded-3xl'
                : 'max-w-6xl rounded-3xl'
            } ${panelClassName}`}
          >
            {mobileBottomSheet && (
              <div
                className="flex touch-none justify-center pb-4 pt-5 md:hidden"
                onPointerDown={onHandlePointerDown}
                onPointerMove={onHandlePointerMove}
                onPointerUp={onHandlePointerEnd}
                onPointerCancel={onHandlePointerEnd}
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-9 rounded-full bg-ink/20"
                />
              </div>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={requestClose}
              aria-label={closeLabel}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-marigold/20 text-ink transition-colors hover:bg-marigold/40 md:right-6 md:top-6"
            >
              <CloseIcon />
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * A fixed-position stand-in that morphs between the origin element and the
 * panel. It carries a visual clone of the origin (e.g. the story photo) that
 * cross-fades into a white surface matching the panel.
 */
function createGhost(origin, rect, radius) {
  const ghost = document.createElement('div')
  ghost.setAttribute('aria-hidden', 'true')
  Object.assign(ghost.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: radius || getComputedStyle(origin).borderRadius,
    overflow: 'hidden',
    background: '#fff',
    pointerEvents: 'none',
    zIndex: '1',
    willChange: 'top, left, width, height, border-radius',
  })

  const clone = origin.cloneNode(true)
  clone.removeAttribute('id')
  clone.style.cssText +=
    ';position:absolute;inset:0;width:100%;height:100%;margin:0;visibility:visible;opacity:1;transform:none;'
  ghost.appendChild(clone)
  return ghost
}
