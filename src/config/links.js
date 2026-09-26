/**
 * Central place for outbound links.
 * Replace the YOUR_* placeholders once the real Google Forms exist.
 */
export const FORM_LINKS = {
  donate: 'https://forms.google.com/YOUR_DONATE_FORM_ID',
  sponsor: 'https://forms.google.com/YOUR_DONATE_FORM_ID',
}

/**
 * Temporary donation flow (no payment gateway yet): the "Donate Now" /
 * "Contribute" buttons open a modal with a UPI QR code + copyable UPI ID,
 * since there's no way to confirm payment or issue a receipt until a real
 * gateway is wired up. Replace these placeholders with the real values.
 */
export const DONATION_INFO = {
  upiId: 'abirvab@upi', // placeholder — replace with the real UPI ID
  whatsappNumber: 'XXXXX-XXXXX', // placeholder — replace with the real WhatsApp number
  qrImage: '/assets/images/upi-qr-placeholder.png', // placeholder — swap for the real UPI QR export
}
