import { forwardRef } from 'react'

/**
 * Shared horizontal rhythm for every full-width section (Header, Stories,
 * Community, Footer). Before this component, some sections put their
 * gutter padding *inside* a centered max-w-6xl box and some put it
 * *outside* it — on wide screens that produced two different left edges
 * across the page. This component is now the one place that decides
 * "gutter" and "content width," so every section that uses it lines up
 * with every other one automatically.
 *
 * - Gutter: 24px on mobile, 40px from md up. Kept in sync with the
 *   --gutter CSS variable in src/index.css, which Hero.jsx reads
 *   directly — Hero can't use this component because its image needs
 *   to bleed to the true edge of the screen (see the comment there).
 * - Content width: capped at Tailwind's max-w-6xl (1152px), centered.
 *
 * Padding lives on the outer tag; the inner box is unpadded and only
 * caps + centers. Anything that needs to bleed to the section's true
 * edge (a background image, a modal/overlay) is passed as
 * `beforeContent` / `afterContent` — a sibling of the inner box, not a
 * child of it — instead of being squeezed inside `children`.
 */
const Section = forwardRef(function Section(
  {
    as: Tag = 'section',
    className = '',
    innerClassName = '',
    beforeContent = null,
    afterContent = null,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Tag ref={ref} className={`px-6 md:px-10 ${className}`} {...rest}>
      {beforeContent}
      <div className={`mx-auto max-w-6xl ${innerClassName}`}>{children}</div>
      {afterContent}
    </Tag>
  )
})

export default Section
