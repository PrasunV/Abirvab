import ImageWithFallback from '../ui/ImageWithFallback.jsx'

/**
 * Photo grid at the top of the story modal.
 *  - 1 image:  full-width single photo (the old single-photo look)
 *  - 2 images: large left + one full-height tile on the right
 *  - 3 images: large left + two tiles stacked on the right
 *  - 4+:       same as 3, with the bottom-right tile covered by a dark
 *              scrim and a "+N" count showing how many more photos
 *              aren't shown
 *
 * Every tile is a button — clicking any of them (including the "+N"
 * one) opens the full-screen lightbox at that photo's index.
 */
// Right-hand tiles take the remaining 42% of the grid (modal max ~1024px).
const RIGHT_SIZES = '(min-width: 1152px) 430px, 42vw'

export default function StoryImageGrid({ images, title, onOpen }) {
  if (!images.length) return null

  const Tile = ({ index, sizes, className = '', children }) => (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${images.length}`}
      className={`group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold focus-visible:ring-offset-2 ${className}`}
    >
      <ImageWithFallback
        src={images[index]}
        alt={images.length > 1 ? `${title} — photo ${index + 1}` : title}
        sizes={sizes}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {children}
    </button>
  )

  if (images.length === 1) {
    return (
      <div className="aspect-[16/9] w-full md:aspect-[21/9]">
        <Tile index={0} sizes="(min-width: 1152px) 1024px, 100vw" className="h-full w-full" />
      </div>
    )
  }

  // 2 photos: right column is one tile. 3+: right column is two stacked
  // tiles, and with more than 3 the last one is covered edge-to-edge by a
  // dark scrim with the remaining count on top of it.
  const hiddenCount = images.length - 3

  return (
    <div className="flex aspect-[16/9] w-full gap-1 md:aspect-[21/9]">
      <Tile index={0} sizes="(min-width: 1152px) 770px, 75vw" className="w-[58%] shrink-0" />
      {images.length === 2 ? (
        <Tile index={1} sizes={RIGHT_SIZES} className="flex-1" />
      ) : (
        <div className="flex flex-1 flex-col gap-1">
          <Tile index={1} sizes={RIGHT_SIZES} className="flex-1" />
          <Tile index={2} sizes={RIGHT_SIZES} className="flex-1">
            {hiddenCount > 0 && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/70">
                <span className="text-2xl font-semibold text-paper md:text-3xl">+{hiddenCount}</span>
              </span>
            )}
          </Tile>
        </div>
      )}
    </div>
  )
}
