export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper/10 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="/assets/images/logo-mark.png"
            alt="Abirvab Scholarship Foundation"
            width="36"
            height="36"
            className="h-8 w-8 md:h-9 md:w-9"
          />
          <span className="font-display text-sm font-medium leading-tight tracking-tight text-paper md:text-base">
            Abirvab Scholarship Foundation
          </span>
        </a>

        <a
          href="https://forms.google.com/YOUR_FORM_ID"
          target="_blank"
          rel="noreferrer"
          className="btn-outline !px-4 !py-2 text-xs md:!px-6 md:!py-3 md:text-sm"
        >
          Support Now
        </a>
      </div>
    </header>
  )
}
