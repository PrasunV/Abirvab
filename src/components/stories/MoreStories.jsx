import ImageWithFallback from '../ui/ImageWithFallback.jsx'
import { ArrowRightIcon } from '../ui/icons.jsx'

/** "More stories" row at the bottom of the modal. Selecting one swaps content in place. */
export default function MoreStories({ stories, onSelect }) {
  if (!stories.length) return null
  return (
    <section aria-labelledby="more-stories-heading" data-modal-reveal>
      <h3
        id="more-stories-heading"
        className="font-display text-2xl font-medium tracking-tight text-ink md:text-3xl"
      >
        More stories
      </h3>
      {/*
        grid-cols-1 (not just the sm:/lg: overrides) is required here: a bare
        `grid` with no column count set for the base breakpoint lets grid
        items size to their content's min-content width instead of the
        container — with a non-wrapping title that silently overflows the
        card, and the card overflows the sheet. `grid-cols-1` (and the
        sm/lg variants) compile to `minmax(0, 1fr)` tracks, which is what
        actually constrains each card to the available width.
      */}
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(story.id)}
              className="group flex w-full items-center gap-4 rounded-2xl bg-paper p-3 text-left transition-colors hover:bg-marigold/15"
            >
              <ImageWithFallback
                src={story.images[0]}
                alt=""
                sizes="64px"
                loading="lazy"
                className="h-20 w-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 font-display text-lg leading-snug text-ink">
                  {story.title}
                </span>
              </span>
              <ArrowRightIcon
                className="h-8 w-8 shrink-0 text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                strokeWidth={2.5}
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
