import { CalendarIcon, PinIcon } from '../ui/icons.jsx'

/**
 * Location + date shown as icon chips instead of plain labelled text —
 * e.g. [pin] Kolkata, West Bengal   [calendar] March 2025
 */
export default function StoryMetaChips({ date, location }) {
  if (!date && !location) return null
  return (
    <div data-modal-reveal className="flex flex-wrap items-center gap-2">
      {location && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-sm font-medium text-ink/70">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          {location}
        </span>
      )}
      {date && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-sm font-medium text-ink/70">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          {date}
        </span>
      )}
    </div>
  )
}
