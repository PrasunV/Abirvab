# Abirvab Scholarship Foundation — NGO Website

React + Tailwind CSS + GSAP. Built with Vite.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Before you ship

1. **Images** — drop real photos into `public/assets/images/`:
   - `story-1.jpg` … `story-4.jpg` for the story cards
   - `hero.jpg` for the hero panel (kids/classroom, full-bleed) — currently
     a striped placeholder with the logo watermarked on top; swap the
     placeholder background in `Hero.jsx` for this image once you have it
   Compress to WebP or optimized JPEG, ~1200px on the long edge — this is
   the single biggest lever on load speed.
2. **Domain** — `index.html` has `og:url`, `og:image`, and `twitter:image`
   pointing at `https://YOUR_DOMAIN.org/...`. Replace with your real domain
   once you have one — social platforms need an absolute URL to fetch the
   share image, a relative path won't work.
3. **Links** — swap every `YOUR_FORM_ID` placeholder in `Header.jsx`,
   `Hero.jsx`, and `Community.jsx` with your real Google Form URLs, and the
   `YOUR_PAGE` / `YOUR_HANDLE` placeholders in `Footer.jsx` with your real
   social URLs.
4. **Footer** — add your actual nonprofit registration / tax-exemption
   number. This is a trust signal for anyone about to donate.
5. **Privacy Policy / Terms / Contact** — currently link to `/privacy-policy`,
   `/terms-of-service`, `/contact`. Add real pages or point them at where
   those live.
6. **Domain + hosting** — this is a static build (`npm run build` → `dist/`),
   so it deploys as-is to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
   No server needed. `public/404.html` is picked up automatically by all
   of those for unmatched URLs.

## Design tokens

Colors and type live in `tailwind.config.js`. Gold and black are sampled
directly from your logo, not eyeballed:
- `paper` (#F4F3EF) — base background
- `ink` (#0E0E10) — text / dark sections, matched to the logo's black ring
- `marigold` (#FDC601) — primary accent / CTA, matched to the logo's amber
- `marigold-dark` (#E08A00) — hover state, matched to the logo's sunburst
  center orange
- `forest` — unused secondary accent, available for tags or stat highlights
  if you add an impact/stats section later.

Fonts: Fraunces (display, hero headline only) + Inter (everything else),
loaded via Google Fonts in `index.html`.

## Favicon

`public/assets/images/logo-mark.png` and the `favicon*` / `apple-touch-icon`
/ `icon-512` files in `public/` are your logo cropped to a transparent
circle from the uploaded artwork, since no standalone logo file was
provided. It's a bit soft at very small sizes (16px) because it's a raster
crop, not vector — if you have the original logo file (AI/EPS/SVG or a
clean transparent PNG), swap it in for a sharper result, especially at the
16×16 favicon size.

## Notes

- Respects `prefers-reduced-motion` — GSAP animations are skipped/instant
  for anyone with that OS setting on.
- Story cards use scroll-snap + tap-to-reveal, not a carousel library —
  lighter and works the same on touch and mouse.
- Consider adding: an About/Mission section, an impact-stats strip, and
  a proper contact page — see the analysis in your conversation with Claude
  for why.
