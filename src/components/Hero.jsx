import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import DonationCTA from './DonationCTA.jsx'
import ImageWithFallback from './ui/ImageWithFallback.jsx'

// Words that rotate after "to ". Lowercase a-z only: the script font is
// subset to those glyphs (public/assets/fonts). The first word is what shows
// on load, with reduced motion, and to crawlers.
const VERBS = ['study', 'flourish', 'smile']

// Per-word rhythm (seconds): ~3s total. Writing is the slow, readable part.
const ERASE_S = 0.45
const WRITE_S = 0.95
const HOLD_S = 1.6
// Extra wait before the first swap so the intro reveal finishes and the
// original message ("to study.") has been read.
const FIRST_DELAY_S = 1.8
// clip-path insets (top right bottom left): hidden -> written -> erased.
const HIDDEN = 'inset(0% 100% 0% 0%)'
const SHOWN = 'inset(0% 0% 0% 0%)'
const GONE = 'inset(0% 0% 0% 100%)'

export default function Hero() {
  const scope = useRef(null)
  const panelRef = useRef(null)
  const verbsRef = useRef(null)

  // Rotating headline verb. Only animates clip-path on three tiny elements
  // (compositor-friendly, no layout), pauses when off-screen or in a
  // background tab, and does nothing at all under reduced motion.
  useEffect(() => {
    const words = gsap.utils.toArray('.hero-verb', verbsRef.current)
    if (words.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let cancelled = false
    let timeline = null
    let observer = null
    let inView = true
    const sync = () => {
      if (!timeline) return
      if (inView && !document.hidden) timeline.play()
      else timeline.pause()
    }
    const onVisibility = () => sync()

    // Start once the (tiny) script font is ready so the wipe never plays on
    // fallback text; on a very slow network don't wait longer than 2.5s.
    const fontReady = document.fonts?.load
      ? document.fonts.load('1em "Seaweed Script"').catch(() => {})
      : Promise.resolve()
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 2500))

    Promise.race([fontReady, timeout]).then(() => {
      if (cancelled) return
      timeline = gsap.timeline({ repeat: -1, delay: FIRST_DELAY_S })
      words.forEach((word, i) => {
        const next = words[(i + 1) % words.length]
        timeline
          .to({}, { duration: HOLD_S })
          .to(word, { clipPath: GONE, duration: ERASE_S, ease: 'power2.in' })
          .fromTo(
            next,
            { clipPath: HIDDEN },
            { clipPath: SHOWN, duration: WRITE_S, ease: 'power1.inOut', immediateRender: false },
          )
      })
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        sync()
      })
      observer.observe(verbsRef.current)
      document.addEventListener('visibilitychange', onVisibility)
      sync()
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      timeline?.kill()
      gsap.set(words, { clearProps: 'clipPath' })
    }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(['.hero-line', '.hero-sub', '.hero-cta'], { opacity: 1, y: 0 })
        gsap.set(panelRef.current, { clipPath: 'inset(0 0% 0 0)' })
        return
      }

      gsap.set(panelRef.current, { clipPath: 'inset(0 100% 0 0)' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-line', {
        // 130% (not 110%): the verb line's clip box is padded below for
        // script descenders, so it needs to travel further to start hidden.
        y: '130%',
        duration: 0.9,
        stagger: 0.08,
      })
        .to(
          panelRef.current,
          { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.out' },
          '-=0.7',
        )
        .from('.hero-sub', { opacity: 0, y: 14, duration: 0.6 }, '-=0.6')
        .from('.hero-cta', { opacity: 0, y: 10, duration: 0.5 }, '-=0.3')
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={scope}
      className="grid min-h-[92vh] bg-ink pt-16 text-paper md:grid-cols-2 md:pt-[4.5rem]"
    >
      {/*
        Hero can't use the shared <Section> component (src/components/ui/Section.jsx):
        its image panel must bleed all the way to the true right edge of the
        screen, which rules out Section's centered "mx-auto max-w-6xl" box.
        So instead of that box, this text column computes the identical
        left inset by hand, from the same --gutter / --content-max CSS
        variables (defined once in src/index.css) that <Section> is built
        from — same numbers, one shared source, so this can't drift out of
        alignment with the header, stories, community and footer sections
        the way it did before.
      */}
      <div className="flex flex-col justify-center px-6 py-14 md:py-0 md:pl-[calc(var(--gutter)+max(0px,(100vw-var(--content-max)-2*var(--gutter))/2))] md:pr-10">
        <h1 className="font-display text-[13vw] font-medium leading-[0.98] tracking-tight md:text-[4.4vw]">
          <span className="block overflow-hidden">
            <span className="hero-line block">Every kid deserves</span>
          </span>
          {/* pb/-mb: room for script descenders (y, f) without moving layout. */}
          <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em]">
            <span className="hero-line block text-marigold">
              <span className="sr-only">to study, flourish and smile.</span>
              <span aria-hidden="true">
                to{' '}
                <span ref={verbsRef} className="inline-grid align-baseline">
                  {VERBS.map((verb, i) => (
                    <span
                      key={verb}
                      className="hero-verb font-script text-[1.2em] font-normal leading-none"
                      style={{ gridArea: '1 / 1', clipPath: i === 0 ? SHOWN : HIDDEN }}
                    >
                      {verb}.
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-prose text-lg text-paper/75 md:text-xl">
          Empowering underprivileged children with access to quality
          education, books, and safe learning spaces.
        </p>

        <div className="hero-cta mt-10">
          <DonationCTA className="btn-primary">Donate Now</DonationCTA>
        </div>
      </div>

      <div
        ref={panelRef}
        className="relative min-h-[48vh] w-full overflow-hidden md:min-h-full"
      >
        {/*
          TEMPORARY: reusing the p1 story photo here until a dedicated hero
          image exists (see src/data/stories.js). object-cover center-crops
          it to fill this panel, which is a tall, narrow slot on desktop
          (half the viewport width, full viewport height) — a different,
          purpose-shot hero photo would frame better here long-term.
        */}
        <ImageWithFallback
          src="/assets/images/story-p1.jpg"
          alt=""
          aria-hidden="true"
          priority
          sizes="(min-width: 768px) 135vh, 140vw"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
