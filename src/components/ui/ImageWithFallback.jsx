import { useEffect, useRef, useState } from 'react'
import { RefreshIcon } from './icons.jsx'

// On a genuinely slow/flaky connection the browser's own request can sit
// in-flight far longer than a person will patiently stare at a pulsing box
// before assuming the site is broken — and no onError ever fires for that
// case, so without this timeout the pulse can spin forever. After this many
// ms of still loading, we treat it the same as an error: show the retry
// affordance so the person has something to act on instead of just waiting.
const LOAD_TIMEOUT_MS = 10000

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
 * This matters most for things like the donation QR, where a silent blank
 * box on a weak connection reads as broken and costs trust — but it's the
 * same fix for every image on the site, since they all render through here.
 */
export default function ImageWithFallback({ src, alt, className = '', ...rest }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const [attempt, setAttempt] = useState(0)
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
    // Changing the <img>'s key forces a fresh element/request instead of
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

  return (
    <img
      key={attempt}
      src={src}
      alt={alt}
      draggable="false"
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={`${className}${status === 'loading' ? ' animate-pulse bg-ink/5' : ''}`}
      {...rest}
    />
  )
}
