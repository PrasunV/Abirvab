import { useCallback, useRef, useState } from 'react'
import Modal from './ui/Modal.jsx'
import DonationModalContent, { DONATION_MODAL_TITLE_ID } from './DonationModalContent.jsx'

/**
 * A button that opens the donation QR/UPI modal (shared-element zoom,
 * same Modal used by the story cards). Styled entirely by the className
 * passed in, so it can match either the Hero's primary button or
 * Community's white button — each instance owns its own modal, which is
 * simpler than threading state through App.jsx for two independent CTAs.
 */
export default function DonationCTA({ className, children }) {
  const btnRef = useRef(null)
  const [open, setOpen] = useState(false)

  const getOriginElement = useCallback(() => btnRef.current, [])
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  return (
    <>
      <button ref={btnRef} type="button" onClick={openModal} className={className}>
        {children}
      </button>

      <Modal
        open={open}
        onClose={closeModal}
        getOriginElement={getOriginElement}
        contentKey="donation"
        labelledBy={DONATION_MODAL_TITLE_ID}
        closeLabel="Close donation dialog"
        panelClassName="!max-w-md"
      >
        <DonationModalContent />
      </Modal>
    </>
  )
}
