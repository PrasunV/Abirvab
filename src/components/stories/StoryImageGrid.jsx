import ImageWithFallback from '../ui/ImageWithFallback.jsx'

/**
 * Photo grid at the top of the story modal.
 *  - 1 image:  full-width single photo (the old single-photo look)
 *  - 2 images: large left + one full-height tile on the right
 *  - 3 images: large left + two tiles stacked on the right
 *  - 4+:       same as 3, with the bottom-right tile dimmed and a
 *              "+N" pill showing how many more photos aren't shown
 *
 * Every tile is a button — clicking any of them (including the "+N"
 * one) opens the full-screen lightbox at that photo's index.
 */
export default function StoryImageGrid({ images, title, onOpen }) {
  if (!images.length) return null

  const Tile = ({ index, className = '', children }) => (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${images.length}`}
      className={`group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold focus-visible:ring-offset-2 ${className}`}
    >
      <ImageWithFallback
        src={images[index]}
        alt={images.length > 1 ? `${title} — photo ${index + 1}` : title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {children}
    </button>
  )

  if (images.length === 1) {
    return (
      <div className="aspect-[16/9] w-full md:aspect-[21/9]">
        <Tile index={0} className="h-full w-full" />
      </div>
    )
  }

  // 2 photos: right column is one tile. 3+: right column is two stacked
  // tiles, and with more than 3 the last one carries the "+N" overlay.
  const hiddenCount = images.length - 3

  return (
    <div className="flex aspect-[16/9] w-full gap-1 md:aspect-[21/9]">
      <Tile index={0} className="w-[58%] shrink-0" />
      {images.length === 2 ? (
        <Tile index={1} className="flex-1" />
      ) : (
        <div className="flex flex-1 flex-col gap-1">
          <Tile index={1} className="flex-1" />
          <Tile index={2} className="flex-1">
            {hiddenCount > 0 && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-ink/60 px-4 py-1.5 text-base font-semibold text-paper backdrop-blur-[1px]">
                  +{hiddenCount}
                </span>
              </span>
            )}
          </Tile>
        </div>
      )}
    </div>
  )
}
