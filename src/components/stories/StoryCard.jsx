import { forwardRef } from 'react'
import ImageWithFallback from '../ui/ImageWithFallback.jsx'

/**
 * Dark photo card in the carousel. Clicking it opens the story modal;
 * the card element itself is the origin the modal zooms out of.
 */
const StoryCard = forwardRef(function StoryCard({ story, onOpen }, ref) {
  const { title, cardLabel, image } = story

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(story.id)}
      aria-haspopup="dialog"
      className="story-card group relative aspect-[3/4] w-[74vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink text-left sm:w-[45vw] md:w-[300px]"
    >
      <ImageWithFallback
        src={image}
        alt={title}
        loading="lazy"
        width="600"
        height="800"
        className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl font-medium leading-snug text-paper">{cardLabel}</h3>
        <span className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-marigold/60 px-4 text-sm font-semibold text-marigold transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
          Read Story
        </span>
      </div>
    </button>
  )
})

export default StoryCard
