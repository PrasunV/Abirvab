/** Gradient tile with one headline number (Stripe's "3.8%" tile). */
export default function ImpactStatCard({ value, label }) {
  if (!value) return null
  return (
    <div
      data-modal-reveal
      className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-marigold/25 via-marigold to-marigold-dark p-8 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/30 blur-3xl"
      />
      <p className="relative font-display text-6xl font-medium tracking-tight text-ink md:text-7xl">
        {value}
      </p>
      <p className="relative mt-4 max-w-[26ch] text-base font-medium text-ink/80">{label}</p>
    </div>
  )
}
