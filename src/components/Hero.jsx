import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import DonationCTA from './DonationCTA.jsx'
import ImageWithFallback from './ui/ImageWithFallback.jsx'

export default function Hero() {
  const scope = useRef(null)
  const panelRef = useRef(null)

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
        y: '110%',
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
          <span className="block overflow-hidden">
            <span className="hero-line block text-marigold">to study.</span>
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
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
