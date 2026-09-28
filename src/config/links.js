/**
 * Central place for outbound links.
 * Replace the YOUR_* placeholders once the real Google Forms exist.
 */
export const FORM_LINKS = {
  donate: 'https://forms.google.com/YOUR_DONATE_FORM_ID',
  sponsor: 'https://forms.google.com/YOUR_DONATE_FORM_ID',
}

/**
 * Donation flow (no payment gateway yet): the "Donate Now" / "Contribute" /
 * "Sponsor a student" buttons open a modal with a UPI QR code + copyable
 * UPI ID, since there's no way to confirm payment or issue a receipt until
 * a real gateway is wired up.
 */
export const DONATION_INFO = {
  upiId: 'mondalnikhilesh2002-1@oksbi',
  whatsappNumber: '+91 99329 49331', // placeholder — replace with the real WhatsApp number
  qrImage: '/assets/images/upi-qr.jpg',
}
