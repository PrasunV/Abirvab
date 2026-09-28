import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Carousel pagination: a pill of progress dots on the left (the active one
 * stretches into a bar) and prev / next buttons on the right.
 *
 * Reusable and presentational — all state comes from props, so it pairs with
 * `useCarouselPagination` or any other source.
 *
 * Props
 *  - count        number of pages
 *  - activeIndex  page currently in view
 *  - onSelect(i)  jump to a page
 *  - onPrev/onNext
 *  - atStart / atEnd   disable the matching button
 *  - labelFor(i)  accessible label for dot i
 *  - label        accessible name for the whole control
 */
export default function CarouselPagination({
  count,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  atStart = false,
  atEnd = false,
  labelFor = (i, total) => `Go to page ${i + 1} of ${total}`,
  label = 'Carousel pagination',
  className = '',
}) {
  if (count <= 1) return null

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-2 rounded-xl bg-ink/5 px-4 py-3">
        {Array.from({ length: count }, (_, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={labelFor(i, count)}
              aria-current={isActive ? 'true' : undefined}
              className="group grid h-4 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-ink'
                    : 'w-1.5 bg-ink/25 group-hover:bg-marigold-dark'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <PagerButton onClick={onPrev} disabled={atStart} label="Previous">
          <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </PagerButton>
        <PagerButton onClick={onNext} disabled={atEnd} label="Next">
          <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </PagerButton>
      </div>
    </div>
  )
}

function PagerButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink/5 text-ink transition-colors hover:bg-marigold/30 disabled:cursor-not-allowed disabled:bg-ink/5 disabled:text-ink/25 disabled:hover:bg-ink/5"
    >
      {children}
    </button>
  )
}
