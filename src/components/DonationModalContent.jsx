import { useState } from 'react'
import { DONATION_INFO } from '../config/links.js'
import ImageWithFallback from './ui/ImageWithFallback.jsx'
import { CheckIcon } from './ui/icons.jsx'

export const DONATION_MODAL_TITLE_ID = 'donation-modal-title'

/**
 * Body of the donation modal: a UPI QR code + copyable UPI ID, with a note
 * to WhatsApp a screenshot for now instead of an automated receipt. This is
 * a stand-in until a real payment gateway (with proper donor records and
 * receipts) is wired up — see DONATION_INFO in config/links.js.
 */
export default function DonationModalContent() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(DONATION_INFO.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — the UPI ID is still visible to copy by hand.
    }
  }

  return (
    <div className="px-6 pb-10 pt-16 text-center sm:px-10 md:pb-12">
      <h2
        id={DONATION_MODAL_TITLE_ID}
        data-modal-reveal
        className="font-display text-3xl font-medium tracking-tight text-ink"
      >
        Scan to donate
      </h2>
      <p data-modal-reveal className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
        Use any UPI app to scan the code, or tap below to copy the ID.
      </p>

      <div data-modal-reveal className="mt-8 flex justify-center">
        <ImageWithFallback
          src={DONATION_INFO.qrImage}
          alt="UPI QR code for donations"
          width="220"
          height="220"
          className="h-56 w-56 rounded-xl border border-ink/10 object-contain"
        />
      </div>

      {/*
        The whole pill is one button — tapping anywhere in it (not just the
        "Copy" label) copies the UPI ID. The "Copy"/"Copied" pill inside is
        a plain <span>, not a nested <button>, since a button can't contain
        another button.
      */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy UPI ID ${DONATION_INFO.upiId}`}
        data-modal-reveal
        className="mx-auto mt-6 flex max-w-xs items-center justify-between gap-3 rounded-full border border-ink/10 bg-ink/[0.03] py-2 pl-5 pr-2 text-left transition-colors hover:bg-ink/[0.06]"
      >
        <span className="truncate font-mono text-sm text-ink/80">{DONATION_INFO.upiId}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper">
          {copied && <CheckIcon className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </span>
      </button>

      <p data-modal-reveal className="mx-auto mt-8 max-w-xs text-sm text-ink/60">
        Thank you! Donated? WhatsApp us a screenshot at{' '}
        <span className="font-medium text-ink">{DONATION_INFO.whatsappNumber}</span>.
      </p>
    </div>
  )
}
