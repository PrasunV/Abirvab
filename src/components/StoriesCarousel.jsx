import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stories } from '../data/stories.js'
import useDragScroll from '../hooks/useDragScroll.js'
import Section from './ui/Section.jsx'
import Modal from './ui/Modal.jsx'
import StoryCard from './stories/StoryCard.jsx'
import StoryModalContent, { STORY_MODAL_TITLE_ID } from './stories/StoryModalContent.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function StoriesCarousel() {
  const scope = useRef(null)
  const rowRef = useDragScroll()
  const cardRefs = useRef(new Map())

  const [activeId, setActiveId] = useState(null)
  const [swapped, setSwapped] = useState(false)
  const activeStory = stories.find((s) => s.id === activeId) ?? null

  // Scroll-in reveal for the cards (unchanged behaviour).
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.story-card', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope.current, start: 'top 75%' },
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  const setCardRef = useCallback(
    (id) => (el) => {
      if (el) cardRefs.current.set(id, el)
      else cardRefs.current.delete(id)
    },
    [],
  )

  const openStory = useCallback((id) => {
    setSwapped(false)
    setActiveId(id)
  }, [])

  // Swap stories from inside the modal. Bring that card into view in the rail
  // (behind the modal) so closing zooms back into the right card.
  const selectStory = useCallback(
    (id) => {
      const card = cardRefs.current.get(id)
      const rail = rowRef.current
      if (card && rail) rail.scrollLeft = card.offsetLeft - rail.offsetLeft
      setSwapped(true)
      setActiveId(id)
    },
    [rowRef],
  )

  const closeStory = useCallback(() => setActiveId(null), [])
  const getOriginElement = useCallback(() => cardRefs.current.get(activeId) ?? null, [activeId])

  return (
    <Section
      as="section"
      ref={scope}
      id="stories"
      className="bg-paper py-24 md:py-32"
      afterContent={
        <Modal
          open={!!activeStory}
          onClose={closeStory}
          getOriginElement={getOriginElement}
          contentKey={activeId}
          labelledBy={STORY_MODAL_TITLE_ID}
          closeLabel="Close story"
        >
          {activeStory && (
            <StoryModalContent
              key={activeStory.id}
              story={activeStory}
              otherStories={stories.filter((s) => s.id !== activeStory.id)}
              onSelectStory={selectStory}
              animateOnMount={swapped}
            />
          )}
        </Modal>
      }
    >
      <div className="flex items-center gap-6">
        <h2 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Stories to Read
        </h2>
        <span className="hidden h-px flex-1 bg-ink/15 md:block" aria-hidden="true" />
      </div>

      <div
        ref={rowRef}
        className="snap-row mt-10 flex cursor-grab gap-5 overflow-x-auto pb-4 md:mt-14"
      >
        {stories.map((story) => (
          <StoryCard key={story.id} ref={setCardRef(story.id)} story={story} onOpen={openStory} />
        ))}
      </div>
    </Section>
  )
}
