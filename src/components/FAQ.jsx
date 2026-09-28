import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { faqs } from '../data/faq.js'
import Section from './ui/Section.jsx'
import { ChevronIcon } from './ui/icons.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Donation-trust FAQ. Ordered by when a donor's doubt shows up (see
 * src/data/faq.js) — the first question ("are you registered?") starts
 * open since it answers the biggest doubt immediately, and only one
 * answer stays open at a time so the section stays scannable.
 *
 * Built by hand in Tailwind (Material 3-styled: rounded tonal surface,
 * state-layer hover, single accent color for the expanded item) rather
 * than pulling in @mui/material, to avoid adding MUI + Emotion next to
 * an already-Tailwind site.
 */
export default function FAQ() {
  const scope = useRef(null)
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope.current, start: 'top 80%' },
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <Section
      ref={scope}
      className="bg-paper py-24 md:py-32"
      innerClassName="mx-auto max-w-3xl"
    >
      <div className="text-center">
        <h2 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-lg text-ink/60">
          Everything donors usually ask before, and after, giving.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-3">
        {faqs.map((item, index) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
          />
        ))}
      </div>
    </Section>
  )
}

function FAQItem({ question, answer, isOpen, onToggle }) {
  const panelId = useId()

  return (
    <div
      className={`faq-item overflow-hidden rounded-2xl border bg-white transition-colors ${
        isOpen ? 'border-marigold/50' : 'border-ink/10'
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/[0.03] focus-visible:bg-ink/[0.03] sm:px-6"
        >
          <span className={`font-medium ${isOpen ? 'text-ink' : 'text-ink/85'}`}>
            {question}
          </span>
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              isOpen ? 'bg-marigold/20 text-ink' : 'bg-ink/5 text-ink/50'
            }`}
          >
            <ChevronIcon
              className={`h-4 w-4 transition-transform duration-300 ${
                isOpen ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </span>
        </button>
      </h3>

      <div id={panelId} role="region" className={`faq-panel ${isOpen ? 'is-open' : ''}`}>
        <div>
          <p className="px-5 pb-5 text-ink/65 sm:px-6">{answer}</p>
        </div>
      </div>
    </div>
  )
}
