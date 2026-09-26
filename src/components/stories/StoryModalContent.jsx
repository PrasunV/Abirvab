import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { FORM_LINKS } from '../../config/links.js'
import { prefersReducedMotion } from '../../lib/motion.js'
import ImageWithFallback from '../ui/ImageWithFallback.jsx'
import { ArrowRightIcon } from '../ui/icons.jsx'
import StoryHighlights from './StoryHighlights.jsx'
import ImpactStatCard from './ImpactStatCard.jsx'
import MoreStories from './MoreStories.jsx'

export const STORY_MODAL_TITLE_ID = 'story-modal-title'

/**
 * Body of the story modal. Pure layout: gets a story, renders it.
 * Render with key={story.id}; pass animateOnMount when swapping stories
 * so the new content fades in (first open is animated by <Modal>).
 */
export default function StoryModalContent({ story, otherStories, onSelectStory, animateOnMount = false }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animateOnMount || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-modal-reveal]',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
      )
    }, scope)
    return () => ctx.revert()
  }, [animateOnMount])

  const { title, tag, location, image, summary, highlights, stat, fullStoryUrl } = story

  return (
    <div ref={scope} className="px-6 pb-10 pt-16 sm:px-10 md:px-16 md:pb-16 md:pt-20">
      {/* Row 1 — headline, summary, CTAs | highlights */}
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
        <div>
          <p data-modal-reveal className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-forest/10 px-3 py-1 font-semibold text-forest">{tag}</span>
            {location && <span className="text-ink/55">{location}</span>}
          </p>
          <h2
            id={STORY_MODAL_TITLE_ID}
            data-modal-reveal
            className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-5xl"
          >
            {title}
          </h2>
          <p data-modal-reveal className="mt-5 max-w-prose text-lg leading-relaxed text-ink/70">
            {summary}
          </p>
          <div data-modal-reveal className="mt-8 flex flex-wrap gap-3">
            <a href={FORM_LINKS.sponsor} target="_blank" rel="noreferrer" className="btn-primary">
              Sponsor a student
              <ArrowRightIcon />
            </a>
            {fullStoryUrl && (
              <a href={fullStoryUrl} className="btn-outline-ink">
                Read full story
              </a>
            )}
          </div>
        </div>

        <div className="md:pt-12">
          <StoryHighlights items={highlights} />
        </div>
      </div>

      {/* Row 2 — photo | impact stat */}
      <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-[1.45fr_1fr]">
        <div data-modal-reveal className="overflow-hidden rounded-2xl bg-paper">
          <ImageWithFallback
            src={image}
            alt={title}
            className="aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[320px]"
          />
        </div>
        <ImpactStatCard {...stat} />
      </div>

      {/* Row 3 — more stories */}
      <div className="mt-14 md:mt-20">
        <MoreStories stories={otherStories} onSelect={onSelectStory} />
      </div>
    </div>
  )
}
