/**
 * Story content for the "Stories to Read" section and its modal.
 *
 * Real project write-ups, sent one at a time (p1, p2, p3, ...) and added
 * here in that order.
 *
 * Shape
 *  id            unique slug (also used for the future full-story URL)
 *  title         full headline, shown as the modal's <h2>
 *  cardLabel     short, hand-written label (2-3 words) shown on the
 *                carousel card instead of the full title — written
 *                deliberately per story, not auto-truncated, so it never
 *                reads as a cut-off fragment
 *  date          display string, e.g. "25 August 2026"
 *  location      display string, e.g. "Anukhal, Kalna, West Bengal"
 *  image         /public path; source photo is landscape — the card
 *                crops it to fit its portrait frame, the modal shows it
 *                in full landscape
 *  fullStoryUrl  link for "Read full story"; null hides the button
 *                (currently unused — no full-story pages yet)
 *
 * TEMPORARILY REMOVED from this shape: tag, summary, highlights, stat.
 * Real stories don't have this copy yet, so StoryModalContent renders
 * without those sections for now (see the comment there).
 */
export const stories = [
  {
    id: 'anukhal-birthday-study-materials',
    title: 'Making a Birthday Meaningful — A Study Material Distribution Initiative at Anukhal',
    cardLabel: 'A Birthday Gift',
    date: '25 August 2026',
    location: 'Anukhal, Kalna, West Bengal',
    image: '/assets/images/story-p1.jpg',
    fullStoryUrl: null,
  },
  {
    id: 'sharing-the-joy-of-puja',
    title: 'Sharing the Joy of Puja — Puja Is for Everyone',
    cardLabel: 'Sharing Puja Joy',
    date: '29 September 2025',
    location: 'Dhatrigram & Dule Para, near P.N.H.S.',
    image: '/assets/images/story-p2.jpg',
    fullStoryUrl: null,
  },
]

export const getStoryById = (id) => stories.find((s) => s.id === id) ?? null
