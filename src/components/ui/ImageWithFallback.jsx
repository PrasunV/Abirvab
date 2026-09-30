import { useState } from 'react'
import { RefreshIcon } from './icons.jsx'

/**
 * <img> that gives feedback through its whole lifecycle instead of a silent
 * blank box or a broken-image icon:
 *  - while loading, it pulses gently in place (its own size/classes are
 *    unchanged, so callers' layout never shifts)
 *  - on error (including a stall/timeout on a slow connection), it swaps to
 *    the site's striped placeholder with a "tap to retry" affordance
 *
 * This matters most for things like the donation QR, where a silent blank
 * box on a weak connection reads as broken and costs trust — but it's the
 * same fix for every image on the site, since they all render through here.
 */
export default function ImageWithFallback({ src, alt, className = '', ...rest }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const [attempt, setAttempt] = useState(0)

  const retry = (e) => {
    e.stopPropagation()
    setStatus('loading')
    // Changing the <img>'s key forces a fresh element/request instead of
    // reusing one the browser already marked as failed.
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
