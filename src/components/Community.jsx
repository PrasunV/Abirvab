import Section from './ui/Section.jsx'
import DonationCTA from './DonationCTA.jsx'

export default function Community() {
  return (
    <Section
      className="relative overflow-hidden py-24 md:py-32"
      innerClassName="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
      beforeContent={
        <>
          {/* Sharp banner image, full bleed */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/community-banner.jpg')" }}
            aria-hidden="true"
          />

          {/* Progressive blur: strong on the left (behind text), fading to sharp by the right */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/assets/images/community-banner.jpg')",
              filter: 'blur(28px)',
              WebkitMaskImage:
                'linear-gradient(to right, black 0%, black 35%, transparent 80%)',
              maskImage:
                'linear-gradient(to right, black 0%, black 35%, transparent 80%)',
            }}
            aria-hidden="true"
          />

          {/* Darkening wash for text contrast, matching the blur emphasis */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10"
            aria-hidden="true"
          />
        </>
      }
    >
      <div className="max-w-xl">
        <h2 className="font-display text-4xl font-medium tracking-tight text-paper md:text-5xl">
          May this Puja bring smiles to every face.
        </h2>
        <p className="mt-6 text-lg text-paper/80">
          Let this Puja be a shared joy for all of us and for the
          helpless children. Please support with your generous donation.
        </p>
      </div>

      <DonationCTA className="btn-fill-white shrink-0">Contribute</DonationCTA>
    </Section>
  )
}
