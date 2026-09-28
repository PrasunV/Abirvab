import { DONATION_INFO } from '../config/links.js'

/**
 * FAQ content for the donation-trust section (src/components/FAQ.jsx).
 * Ordered by when a donor's doubt actually shows up: before paying ("is
 * this real?"), while paying ("where does my money go, how do I pay?"),
 * and after paying ("did I do the right thing, who do I ask?"). Answers
 * are deliberately short — this is scanned, not read end to end — and
 * stay honest about being an unregistered, student-run foundation rather
 * than glossing over it.
 */
export const faqs = [
  {
    question: 'Is Abirvab a registered NGO?',
    answer:
      "Not yet, and we'd rather say that upfront. Abirvab was started in 2020 by a group of students on humanitarian grounds, and we've supported 200+ children since. We're working toward formal registration — until then, we keep everything as transparent as possible.",
  },
  {
    question: 'Where does my donation go?',
    answer:
      "Straight to a child's education. We pay school fees directly to the school, and we buy books and uniforms ourselves — no money passes through anyone else's hands.",
  },
  {
    question: 'How can I donate?',
    answer: `Tap "Donate Now" for our UPI QR code, or pay directly to our UPI ID: ${DONATION_INFO.upiId}. Once you've paid, WhatsApp your payment screenshot to ${DONATION_INFO.whatsappNumber} and we'll confirm it personally.`,
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
    answer: `WhatsApp us at ${DONATION_INFO.whatsappNumber}. A real person from our team will reply, usually within a day.`,
  },
]
