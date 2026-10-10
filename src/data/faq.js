import { DONATION_INFO, CONTACT_EMAIL } from '../config/links.js'

/**
 * FAQ content for the donation-trust section (src/components/FAQ.jsx).
 * Ordered by when a donor's doubt actually shows up: while paying ("where
 * does my money go, how do I pay?") and after paying ("did I do the right
 * thing, who do I ask?"). Answers are deliberately short — this is
 * scanned, not read end to end — and stay honest about being an
 * unregistered, student-run foundation (see the receipt/tax answer)
 * rather than glossing over it. FAQ.jsx opens the first item by default.
 */
export const faqs = [
  {
    question: 'Where does my donation go?',
    answer:
      "Straight to a child's education. We pay school fees directly to the school, and we buy books and uniforms ourselves — no money passes through anyone else's hands. It's how our student-run team has supported 200+ children since 2020.",
  },
  {
    question: 'How can I donate?',
    answer: `Tap "Donate Now" for our UPI QR code, or pay directly to our UPI ID: ${DONATION_INFO.upiId}. Once you've paid, WhatsApp your payment screenshot to ${DONATION_INFO.whatsappNumber} and we'll confirm it personally.`,
  },
  {
    question: 'Is there a minimum donation amount?',
    answer:
      "There's no minimum — every rupee helps. As a rough benchmark, it costs us about ₹500 on average to cover one child's books and study materials, so that's a fair amount to aim for if you'd like a starting point.",
  },
  {
    question: 'Will I get a receipt? Is my donation tax-deductible?',
    answer: `You'll get a personal confirmation once you share your payment screenshot with us on WhatsApp at ${DONATION_INFO.whatsappNumber}. Since we're not registered yet, donations aren't tax-exempt for now — we'd rather you know that before you give than after.`,
  },
  {
    question: 'Can I donate on a special occasion, like a birthday?',
    answer: `Yes, we'd love that! We run drives for birthdays, anniversaries, and other special occasions. Message us on WhatsApp at ${DONATION_INFO.whatsappNumber} first, and we'll set it up with you.`,
  },
  {
    question: 'Have a question or concern about your donation?',
    answer: `WhatsApp us at ${DONATION_INFO.whatsappNumber}, or email ${CONTACT_EMAIL}. A real person from our team will reply, usually within a day.`,
  },
]
