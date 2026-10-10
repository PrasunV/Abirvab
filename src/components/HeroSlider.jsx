import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ui/ImageWithFallback.jsx'
import { HERO_SLIDES } from '../data/heroSlides.js'
import { isConstrainedDevice } from '../lib/network.js'

// ---- Tuning -------------------------------------------------------------
const INTERVAL_S = 4 // time each photo stays before the next one starts fading in
const FADE_S = 0.9 // crossfade duration
const FADE_CONSTRAINED_S = 0.5 // shorter/cheaper fade on weak devices and reduced motion
const ZOOM_TO = 1.07 // slow "Ken Burns" push-in over the time a photo is shown
const SWIPE_PX = 40 // horizontal drag needed to count as a swipe
// How wide the whole photo renders (see ImageWithFallback): half the viewport
// on desktop, full width on mobile, +7% for the zoom.
const SIZES = '(min-width: 768px) 56vw, 108vw'

const isHeld = (holds) => Object.values(holds).some(Boolean)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z" />
  </svg>
)

/**
 * Auto-advancing photo carousel that fills its (relatively positioned)
 * parent. Built so a weak phone or a bad connection never sees a broken or
 * janky hero:
 *
 *  - Only photo 1 is requested at first (and marked high priority). Once it
 *    has arrived, the NEXT photo is fetched quietly in the background; at most
 *    three photos are ever mounted. Weak devices skip the previous-photo
 *    prefetch.
 *  - The slider only advances to a photo that has actually loaded. If the next
 *    one is late, the current photo simply stays up until it arrives; one that
 *    fails (or stalls for 15s) is skipped and retried on a later lap.
 *  - Each photo comes through <ImageWithFallback>: responsive WebP/JPEG sizes,
 *    a blurred preview, retry button, smaller files on 2G/3G/data-saver.
 *  - Motion is opacity (crossfade) plus one slow transform (zoom) — both
 *    compositor-only. The zoom is dropped on weak devices; with
 *    prefers-reduced-motion nothing auto-plays at all.
 *  - Auto-play pauses on hover, touch, keyboard focus, a hidden tab, when the
 *    slider is scrolled out of view, and via an explicit pause button.
 */
export default function HeroSlider({ slides = HERO_SLIDES }) {
  const count = slides.length
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [constrained] = useState(isConstrainedDevice)
  const fadeS = constrained || reduceMotion ? FADE_CONSTRAINED_S : FADE_S
  const zoomOn = !constrained && !reduceMotion

  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState(null) // photo that is fading out
  const [wanted, setWanted] = useState(null) // photo we are waiting to show
  const [firstLoaded, setFirstLoaded] = useState(false)
  const [userPaused, setUserPaused] = useState(reduceMotion)

  const rootRef = useRef(null)
  const slideEls = useRef([])
  const barEls = useRef([])
  const activeRef = useRef(0)
  const wantedRef = useRef(null)
  const wantedAutoRef = useRef(false)
  const loadedRef = useRef(new Set())
  const failedRef = useRef(new Set())
  const cycleRef = useRef(null)
  const cycleStartedRef = useRef(false)
  const liveRef = useRef(new Set()) // zoom tweens, paused/resumed together with the timer
  const swipeRef = useRef(null)
  const holds = useRef({ hover: false, touch: false, focus: false, hidden: false, offscreen: false, user: reduceMotion })
  const api = useRef({})

  // Which photos exist in the DOM right now.
  const mounted = new Set([active])
  if (leaving !== null) mounted.add(leaving)
  if (wanted !== null) mounted.add(wanted)
  if (firstLoaded) {
    mounted.add((active + 1) % count)
    if (!constrained) mounted.add((active - 1 + count) % count)
  }

  // ---- Core logic (re-created each render; always reached through `api`) ----
  const applyHolds = () => {
    const held = isHeld(holds.current)
    cycleRef.current?.paused(held)
    liveRef.current.forEach((tween) => tween.paused(held))
  }

  const startCycle = (index) => {
    cycleRef.current?.kill()
    cycleStartedRef.current = true
    const held = isHeld(holds.current)
    gsap.set(barEls.current.filter(Boolean), { scaleX: 0 })

    const timeline = gsap.timeline({ paused: held })
    const bar = barEls.current[index]
    if (bar) timeline.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL_S, ease: 'none' }, 0)
    timeline.call(() => api.current.onIntervalEnd(), null, INTERVAL_S)
    cycleRef.current = timeline

    const el = slideEls.current[index]
    if (zoomOn && el) {
      const zoom = gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale: ZOOM_TO,
          duration: INTERVAL_S + fadeS,
          ease: 'none',
          paused: held,
          onComplete: () => liveRef.current.delete(zoom),
        },
      )
      liveRef.current.add(zoom)
    }
  }

  const commit = (target) => {
    const from = activeRef.current
    wantedRef.current = null
    setWanted(null)
    if (target === from) return
    const incoming = slideEls.current[target]
    const outgoing = slideEls.current[from]
    if (!incoming) return

    gsap.set(incoming, { zIndex: 2 })
    if (outgoing) gsap.set(outgoing, { zIndex: 1 })
    gsap.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: fadeS, ease: 'power1.inOut', overwrite: 'auto' })
    if (outgoing) {
      gsap.to(outgoing, {
        opacity: 0,
        duration: fadeS,
        ease: 'power1.inOut',
        overwrite: 'auto',
        onComplete: () => {
          liveRef.current.forEach((tween) => {
            if (tween.targets().includes(outgoing)) {
              tween.kill()
              liveRef.current.delete(tween)
            }
          })
          setLeaving((current) => (current === from ? null : current))
        },
      })
    }
    activeRef.current = target
    setActive(target)
    setLeaving(from)
    startCycle(target)
  }

  const tryCommit = () => {
    const target = wantedRef.current
    if (target !== null && loadedRef.current.has(target)) commit(target)
  }

  const request = (target, auto) => {
    if (target === null || target === activeRef.current) return
    wantedRef.current = target
    wantedAutoRef.current = auto
    setWanted(target)
    tryCommit()
  }

  const nextCandidate = () => {
    for (let step = 1; step < count; step += 1) {
      const candidate = (activeRef.current + step) % count
      if (!failedRef.current.has(candidate)) return candidate
    }
    return null
  }

  const onIntervalEnd = () => {
    const candidate = nextCandidate()
    // Nothing else is usable right now: keep the current photo, check again later.
    if (candidate === null) startCycle(activeRef.current)
    else request(candidate, true)
  }

  const onSlideLoaded = (index) => {
    loadedRef.current.add(index)
    failedRef.current.delete(index)
    if (index === activeRef.current) {
      setFirstLoaded(true)
      if (!cycleStartedRef.current) startCycle(index)
    }
    tryCommit()
  }

  const onSlideFailed = (index) => {
    failedRef.current.add(index)
    loadedRef.current.delete(index)
    if (wantedRef.current === index) {
      wantedRef.current = null
      setWanted(null)
      if (wantedAutoRef.current) onIntervalEnd() // skip it, try the one after
    }
  }

  api.current = { applyHolds, onIntervalEnd, onSlideLoaded, onSlideFailed }

  const go = (target) => request(((target % count) + count) % count, false)

  const togglePause = () => {
    const next = !holds.current.user
    holds.current.user = next
    setUserPaused(next)
    applyHolds()
  }

  // ---- Lifecycle ----------------------------------------------------------
  useEffect(() => {
    const onVisibility = () => {
      holds.current.hidden = document.hidden
      api.current.applyHolds()
    }
    document.addEventListener('visibilitychange', onVisibility)
    onVisibility()

    const observer = new IntersectionObserver(
      ([entry]) => {
        holds.current.offscreen = !entry.isIntersecting
        api.current.applyHolds()
      },
      { threshold: 0.2 },
    )
    observer.observe(rootRef.current)

    const slides = slideEls.current
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
      cycleRef.current?.kill()
      liveRef.current.forEach((tween) => tween.kill())
      liveRef.current.clear()
      cycleStartedRef.current = false
      gsap.killTweensOf(slides.filter(Boolean))
    }
  }, [])

  // A photo that leaves the DOM must be re-confirmed (loaded again) before it
  // is shown the next time round.
  useEffect(() => {
    loadedRef.current.forEach((i) => !mounted.has(i) && loadedRef.current.delete(i))
    failedRef.current.forEach((i) => !mounted.has(i) && failedRef.current.delete(i))
  })

  const setSlideRef = (index) => (el) => {
    slideEls.current[index] = el
    if (el && !el.dataset.sliderInit) {
      el.dataset.sliderInit = '1'
      const isActive = index === activeRef.current
      gsap.set(el, { opacity: isActive ? 1 : 0, zIndex: isActive ? 2 : 0, scale: 1 })
    }
  }

  // ---- Input --------------------------------------------------------------
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    if (e.pointerType === 'touch') {
      holds.current.touch = true
      applyHolds()
    }
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerEnd = (e) => {
    if (holds.current.touch) {
      holds.current.touch = false
      applyHolds()
    }
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || e.type === 'pointercancel') return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(activeRef.current + (dx < 0 ? 1 : -1))
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(activeRef.current + 1)
    else if (e.key === 'ArrowLeft') go(activeRef.current - 1)
  }

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Abirvab's work"
      className="absolute inset-0 touch-pan-y select-none overflow-hidden bg-ink"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') {
          holds.current.hover = true
          applyHolds()
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') {
          holds.current.hover = false
          applyHolds()
        }
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onFocus={(e) => {
        holds.current.focus = e.target.matches?.(':focus-visible') ?? false
        applyHolds()
      }}
      onBlur={() => {
        holds.current.focus = false
        applyHolds()
      }}
      onKeyDown={onKeyDown}
    >
      <div aria-live={userPaused ? 'polite' : 'off'} className="absolute inset-0">
        {slides.map(
          (slide, i) =>
            mounted.has(i) && (
              <div
                key={slide.src}
                ref={setSlideRef(i)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== active}
                className="absolute inset-0"
                style={{ transformOrigin: slide.focus }}
              >
                <ImageWithFallback
                  src={slide.src}
                  alt={slide.alt}
                  sizes={SIZES}
                  priority={i === 0}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: slide.focus }}
                  onLoaded={() => api.current.onSlideLoaded(i)}
                  onFailed={() => api.current.onSlideFailed(i)}
                />
              </div>
            ),
        )}
      </div>

      {/* Controls sit on a soft gradient so they stay readable on any photo. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-14 md:px-6 md:pb-4">
        <div className="pointer-events-auto flex min-w-0 flex-1 flex-wrap items-center" role="group" aria-label="Choose a photo">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
              className="group flex h-6 items-center px-[5px]"
            >
              <span
                className={`relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                  i === active ? 'w-6 bg-paper/40' : 'w-1.5 bg-paper/60 group-hover:bg-paper'
                }`}
              >
                <span
                  ref={(el) => {
                    barEls.current[i] = el
                  }}
                  className="absolute inset-0 origin-left rounded-full bg-paper"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={togglePause}
          aria-label={userPaused ? 'Play photo slideshow' : 'Pause photo slideshow'}
          className="pointer-events-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/55 text-paper transition-colors hover:bg-ink/75"
        >
          {userPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </div>
  )
}
