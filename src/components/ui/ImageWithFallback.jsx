import { useEffect, useRef, useState } from 'react'
import { RefreshIcon } from './icons.jsx'
import { maxImageWidthForConnection } from '../../lib/network.js'
// Written by scripts/generate-image-variants.mjs (git-ignored, rebuilt on
// every dev start / build): { '/assets/images/x.jpg': { variants: [...] } }.
import imageManifest from '../../generated/imageManifest.json'

// On a genuinely slow/flaky connection the browser's own request can sit
// in-flight far longer than a person will patiently stare at a pulsing box
// before assuming the site is broken — and no onError ever fires for that
// case, so without this timeout the pulse can spin forever. After this many
// ms of still loading, we treat it the same as an error: show the retry
// affordance so the person has something to act on instead of just waiting.
const LOAD_TIMEOUT_MS = 10000

const toSrcSet = (variants, format) => variants.map((v) => `${v[format]} ${v.w}w`).join(', ')

/**
 * <img> that gives feedback through its whole lifecycle instead of a silent
 * blank box or a broken-image icon:
 *  - while loading, it pulses gently in place (its own size/classes are
 *    unchanged, so callers' layout never shifts)
 *  - on error, OR on a stall that outlasts LOAD_TIMEOUT_MS (the common
 *    low-network case, where the request never errors, it just never
 *    finishes), it swaps to the site's striped placeholder with a
 *    "tap to retry" affordance
 *
 * Responsive delivery: for photos the build pipeline has processed
 * (see the manifest), this renders <picture> with WebP + JPEG candidates at
 * several widths, so the browser fetches the smallest file that still looks
 * sharp in the slot. Pass `sizes` describing how wide the image renders
 * (e.g. "(min-width: 768px) 300px, 74vw") — without it the browser assumes
 * full viewport width and over-downloads. Images that aren't in the manifest
 * (QR code, logo, anything new before its first build) render as a plain
 * <img src>, exactly as before.
 *
 * On slow connections (Chromium only) the largest candidates are withheld
 * so the browser can't pick them — see lib/network.js.
 *
 * `priority` marks the page's main above-the-fold image: fetched ahead of
 * other images. (Lowercase `fetchpriority` on purpose — React 18 doesn't
 * know the camelCase prop; switch to `fetchPriority` on React 19.)
 */
export default function ImageWithFallback({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  ...rest
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const [attempt, setAttempt] = useState(0)
  const [maxWidth] = useState(maxImageWidthForConnection)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (status !== 'loading') return undefined
    timeoutRef.current = window.setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current))
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timeoutRef.current)
  }, [status, attempt])

  const retry = (e) => {
    e.stopPropagation()
    setStatus('loading')
    // Changing the element's key forces a fresh element/request instead of
    // reusing one the browser already marked as failed or left hanging.
    setAttempt((n) => n + 1)
  }

  if (status === 'error') {
    return (
      <div role="img" aria-label={alt} className={`stripe-placeholder relative overflow-hidden ${className}`}>
        {src && (
          <button
            type="button"
            onClick={retry}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1 text-center text-ink/60 transition-colors hover:text-ink"
          >
            <RefreshIcon className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">Tap to retry</span>
          </button>
        )}
      </div>
    )
  }

  const imgProps = {
    alt,
    draggable: 'false',
    onLoad: () => setStatus('loaded'),
    onError: () => setStatus('error'),
    className: `${className}${status === 'loading' ? ' animate-pulse bg-ink/5' : ''}`,
    ...(priority ? { fetchpriority: 'high' } : {}),
    ...rest,
  }

  const entry = src ? imageManifest[src] : undefined
  if (!entry) return <img key={attempt} src={src} {...imgProps} />

  // Keep every candidate the connection allows; if the cap would remove all
  // of them, keep the smallest rather than falling back to the original.
  const allowed = entry.variants.filter((v) => v.w <= maxWidth)
  const variants = allowed.length ? allowed : entry.variants.slice(0, 1)
  // Only seen by browsers without srcset support; the middle size is a sane default.
  const fallback = variants[Math.floor(variants.length / 2)]

  return (
    // `contents`: the <picture> wrapper generates no box, so the <img> keeps
    // behaving like a direct child of its parent (h-full, object-cover, ...).
    <picture key={attempt} className="contents">
      <source type="image/webp" srcSet={toSrcSet(variants, 'webp')} sizes={sizes} />
      <img src={fallback.jpg} srcSet={toSrcSet(variants, 'jpg')} sizes={sizes} {...imgProps} />
    </picture>
  )
}
