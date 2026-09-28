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
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => onSelect(story.id)}
              className="group flex w-full items-center gap-4 rounded-2xl bg-paper p-3 text-left transition-colors hover:bg-marigold/15"
            >
              <ImageWithFallback
                src={story.image}
                alt=""
                loading="lazy"
                className="h-20 w-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg leading-snug text-ink">
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
