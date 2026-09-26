import Section from './ui/Section.jsx'

const social = [
  { label: 'Facebook', href: 'https://facebook.com/YOUR_PAGE' },
  { label: 'Instagram', href: 'https://instagram.com/YOUR_HANDLE' },
  { label: 'WhatsApp Community', href: 'https://chat.whatsapp.com/JrlKCjcYSjMHzRIq95aHBK' },
]

const utility = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <Section
      as="footer"
      className="border-t border-paper/10 bg-ink py-12 text-paper"
      innerClassName="flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
    >
      <div>
        <p className="font-display text-lg font-medium text-paper">
          Abirvab Scholarship Foundation
        </p>
        <p className="mt-2 max-w-xs text-sm text-paper/50">
          Registered nonprofit — Reg. / tax-exemption no. [placeholder].
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {social.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-paper/70 underline decoration-paper/25 underline-offset-4 hover:text-paper hover:decoration-paper/60"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-paper/70">
          {utility.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:text-paper">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-paper/50">
          © {new Date().getFullYear()} Abirvab Scholarship Foundation. All
          rights reserved.
        </p>
      </div>
    </Section>
  )
}
