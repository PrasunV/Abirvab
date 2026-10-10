/**
 * Largest image width (px) worth downloading on the visitor's current
 * connection, from the Network Information API.
 *
 *   data-saver on, or slow-2g / 2g  ->  480  (smallest, softest variant)
 *   3g                              ->  800
 *   anything else, or API missing   ->  Infinity (no cap; srcset decides
 *                                       purely from the on-screen size)
 *
 * navigator.connection exists only in Chromium browsers (Chrome / Edge /
 * Android). Safari and Firefox don't implement it, so this is a
 * progressive enhancement layered on top of normal srcset behaviour — never
 * something the page depends on.
 */
export const maxImageWidthForConnection = () => {
  if (typeof navigator === 'undefined') return Infinity
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!connection) return Infinity

  const { saveData, effectiveType } = connection
  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') return 480
  if (effectiveType === '3g') return 800
  return Infinity
}

/**
 * True on devices/connections where decorative motion and eager prefetching
 * should be dialled down: data-saver, 2G, or a low-end phone (<= 2 GB RAM or
 * <= 2 CPU cores, where the browser reports them). Best-effort only — each
 * signal is Chromium-only, so a `false` just means "no reason to hold back".
 */
export const isConstrainedDevice = () => {
  if (typeof navigator === 'undefined') return false
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType))) return true
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
  return false
}
