import { useEffect, useRef, useState } from 'react'
import { RefreshIcon } from './icons.jsx'
import { maxImageWidthForConnection } from '../../lib/network.js'
// Written by scripts/generate-image-variants.mjs (git-ignored, rebuilt on
// every dev start / build):
//   { '/assets/images/x.jpg': { width, height, lqip, variants: [...] } }
import imageManifest from '../../generated/imageManifest.json'

// If a photo is still not here after this long, stop waiting silently and
// offer a retry. The blurred preview stays on screen the whole time, so the
// wait never looks like a blank or broken box.
const LOAD_TIMEOUT_MS = 15000
// A photo that arrives faster than this was effectively instant (cache hit /
// fast network): skip the blur-to-sharp reveal so it doesn't flash.
const INSTANT_MS = 150

const toSrcSet = (variants, format) => variants.map((v) => `${v[format]} ${v.w}w`).join(', ')

const lqipStyle = (lqip) => ({
  backgroundImage: `url(${lqip})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

/**
 * <img> with a graceful loading story:
 *
 *  1. Instantly: a tiny blurred version of the photo (inlined, no request)
 *     fills the slot, so there is never an empty box or a layout jump.
 *  2. Good connection: the full-quality photo — the largest size the slot
 *     needs on this screen — loads over it and sharpens in.
 *  3. Slow connection (2G / 3G / data-saver on Chromium, or simply slow
 *     anywhere): the smaller sizes are requested and the blurred preview
 *     stays up until the photo arrives.
 *  4. Stuck for LOAD_TIMEOUT_MS, or failed: the blurred preview stays and a
 *     "Tap to retry" button appears on top of it.
 *
 * Photos the build pipeline processed come with WebP + JPEG candidates at
 * several widths (<picture>/srcset). Pass `sizes` describing how wide the
 * WHOLE photo renders — not the slot. With object-cover the photo is scaled
 * until it covers the slot, so a landscape photo in a portrait card renders
 * ~1.8x wider than the card; hinting the card's own width would pick a file
 * that looks soft. Without `sizes` the browser assumes full viewport width. Images not in the manifest (QR code, logo)
 * render as a plain <img src> with a pulse while loading.
 *
 * `priority` marks the main above-the-fold image (fetched first). Lowercase
 * `fetchpriority` on purpose — React 18 doesn't know the camelCase prop.
 *
 * `onLoaded` / `onFailed` report the outcome to a parent that needs to know
 * (e.g. the hero slider only advances to a photo that has actually arrived).
 * `style` is merged with the blurred-preview background, not replacing it.
 */
export default function ImageWithFallback({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  style,
  onLoaded,
  onFailed,
  ...rest
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const [attempt, setAttempt] = useState(0)
  const [maxWidth] = useState(maxImageWidthForConnection)
  const [revealed, setRevealed] = useState(false)
  const startedAt = useRef(0)
  const callbacks = useRef({})
  callbacks.current = { onLoaded, onFailed }

  const entry = src ? imageManifest[src] : undefined

  useEffect(() => {
    if (status !== 'loading') return undefined
    startedAt.current = performance.now()
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current))
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [status, attempt])

  // Report the outcome (also after a retry).
  useEffect(() => {
    if (status === 'loaded') callbacks.current.onLoaded?.()
    else if (status === 'error') callbacks.current.onFailed?.()
  }, [status])

  const retry = (e) => {
    e.stopPropagation()
    setRevealed(false)
    setStatus('loading')
    // New key => a brand-new element and request, not the one the browser
    // already marked as failed or left hanging.
    setAttempt((n) => n + 1)
  }

  const handleLoad = () => {
    setRevealed(performance.now() - startedAt.current > INSTANT_MS)
    setStatus('loaded')
  }

  if (status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        style={entry?.lqip ? { ...lqipStyle(entry.lqip), ...style } : style}
        className={`${entry?.lqip ? '' : 'stripe-placeholder '}relative overflow-hidden ${className}`}
      >
        {src && (
          <button
            type="button"
            onClick={retry}
            className={`absolute inset-0 flex flex-col items-center justify-center gap-1 px-1 text-center transition-colors ${
              entry?.lqip ? 'bg-ink/35 text-paper hover:bg-ink/50' : 'text-ink/60 hover:text-ink'
            }`}
          >
            <RefreshIcon className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">Tap to retry</span>
          </button>
        )}
      </div>
    )
  }

  const loading = status === 'loading'
  const imgProps = {
    alt,
    draggable: 'false',
    onLoad: handleLoad,
    onError: () => setStatus('error'),
    className: [className, loading && !entry && 'animate-pulse bg-ink/5', !loading && revealed && 'img-reveal']
      .filter(Boolean)
      .join(' '),
    // While loading, the blurred preview is the element's own background:
    // it needs no extra wrapper, so every caller's layout stays untouched.
    style: loading && entry?.lqip ? { ...lqipStyle(entry.lqip), ...style } : style,
    ...(priority ? { fetchpriority: 'high' } : {}),
    ...rest,
  }

  if (!entry) return <img key={attempt} src={src} {...imgProps} />

  // Natural size lets the browser reserve the right box before the photo
  // arrives (matters for auto-sized images such as the lightbox).
  imgProps.width ??= entry.width
  imgProps.height ??= entry.height

  // Keep every candidate the connection allows; if the cap would remove all
  // of them, keep the smallest rather than falling back to the original.
  const allowed = entry.variants.filter((v) => v.w <= maxWidth)
  const variants = allowed.length ? allowed : entry.variants.slice(0, 1)
  // Only seen by browsers without srcset support.
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
