import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stories = [
  {
    image: '/assets/images/story-1.jpg',
    title: "Aarav's Path to School",
  },
  {
    image: '/assets/images/story-2.jpg',
    title: 'Books in Rural Classrooms',
  },
  {
    image: '/assets/images/story-3.jpg',
    title: 'Bridging the Tech Divide',
  },
  {
    image: '/assets/images/story-4.jpg',
    title: 'Mentorship That Matters',
  },
]

export default function StoriesCarousel() {
  const scope = useRef(null)
  const rowRef = useRef(null)

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
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 75%',
        },
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  // Desktop mouse-drag scrolling for the rail (touch already scrolls natively)
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    let isDown = false
    let startX = 0
    let startScroll = 0

    const onDown = (e) => {
      isDown = true
      row.classList.add('cursor-grabbing')
      startX = e.pageX
      startScroll = row.scrollLeft
    }
    const onUp = () => {
      isDown = false
      row.classList.remove('cursor-grabbing')
    }
    const onMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      row.scrollLeft = startScroll - (e.pageX - startX)
    }

    row.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    row.addEventListener('pointermove', onMove)
    return () => {
      row.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      row.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <section ref={scope} className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
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
            <StoryCard key={story.title} {...story} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryCard({ image, title }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className="story-card group relative aspect-[3/4] w-[74vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink text-left sm:w-[45vw] md:w-[300px]"
      aria-expanded={revealed}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        width="600"
        height="800"
        className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl font-medium leading-snug text-paper">
          {title}
        </h3>
        <span
          className={`mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-marigold/60 px-4 text-sm font-semibold text-marigold transition-opacity duration-200 ${
            revealed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          Read Story
        </span>
      </div>
    </button>
  )
}
