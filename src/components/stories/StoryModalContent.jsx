import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../lib/motion.js'
import ImageWithFallback from '../ui/ImageWithFallback.jsx'
import DonationCTA from '../DonationCTA.jsx'
import StoryMetaChips from './StoryMetaChips.jsx'
import MoreStories from './MoreStories.jsx'

export const STORY_MODAL_TITLE_ID = 'story-modal-title'

/**
 * Body of the story modal. Pure layout: gets a story, renders it.
 * Render with key={story.id}; pass animateOnMount when swapping stories
 * so the new content fades in (first open is animated by <Modal>).
 *
 * TEMPORARILY SIMPLIFIED: real stories currently only supply
 * title/date/location/image (no summary, highlights or impact stat
 * yet), so this renders headline, date/location chips, photo and a
 * "Sponsor a student" CTA. Once a story has real summary / highlights /
 * stat copy, those sections (StoryHighlights, ImpactStatCard — still in
 * src/components/stories/) can come back in.
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

  const { title, date, location, image } = story

  return (
    <div ref={scope} className="px-6 pb-10 pt-16 sm:px-10 md:px-16 md:pb-16 md:pt-20">
      <h2
        id={STORY_MODAL_TITLE_ID}
        data-modal-reveal
        className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-5xl"
      >
        {title}
      </h2>

      <div className="mt-5">
        <StoryMetaChips date={date} location={location} />
      </div>

      <div data-modal-reveal className="mt-10 overflow-hidden rounded-2xl bg-paper">
        <ImageWithFallback
          src={image}
          alt={title}
          className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      </div>

      <div data-modal-reveal className="mt-10 flex flex-col items-center gap-4 text-center md:mt-14">
        <p className="max-w-sm text-base text-ink/70">
          Your support helps us reach more students like these.
        </p>
        <DonationCTA className="btn-primary">Sponsor a student</DonationCTA>
      </div>

      <div className="mt-14 md:mt-20">
        <MoreStories stories={otherStories} onSelect={onSelectStory} />
      </div>
    </div>
  )
}
