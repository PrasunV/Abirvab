import { CheckIcon } from '../ui/icons.jsx'

/** Checklist with marigold ticks (Stripe's right-hand bullet column). */
export default function StoryHighlights({ items = [] }) {
  if (!items.length) return null
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item} data-modal-reveal className="flex items-start gap-3 text-base text-ink/80 md:text-lg">
          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-marigold/25 text-marigold-dark">
            <CheckIcon />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
