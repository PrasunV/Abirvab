import { useState } from 'react'

/**
 * <img> that swaps to the site's striped placeholder when the file is
 * missing, instead of showing the browser's broken-image icon.
 */
export default function ImageWithFallback({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return <div role="img" aria-label={alt} className={`stripe-placeholder ${className}`} />
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable="false"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
