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
 *  images        array of /public paths; source photos are landscape —
 *                the card crops the first one to fit its portrait frame,
 *                the modal shows all of them in a gallery grid (see
 *                StoryImageGrid) with a full-screen lightbox on tap
 *  body          array of paragraph strings — the article text from the
 *                project doc, rendered as-is under the photo
 *  fullStoryUrl  link for "Read full story"; null hides the button
 *                (currently unused — no full-story pages yet)
 *
 * TEMPORARILY REMOVED from this shape: tag, summary, highlights, stat.
 * Those were placeholder-only fields with no real content; the actual
 * doc text lives in `body` instead. StoryModalContent renders without
 * the old summary/highlights/stat sections for now (see the comment
 * there).
 */
export const stories = [
  {
    id: 'anukhal-birthday-study-materials',
    title: 'Making a Birthday Meaningful — A Study Material Distribution Initiative at Anukhal',
    cardLabel: 'A Birthday Gift',
    date: '25 August 2026',
    location: 'Anukhal, Kalna, West Bengal',
    images: [
      '/assets/images/story-p1.jpg',
      '/assets/images/story-p1-2.jpg',
      '/assets/images/story-p1-3.jpg',
      '/assets/images/story-p1-4.jpg',
      '/assets/images/story-p1-5.jpg',
    ],
    body: [
      'A birthday is often celebrated as a personal milestone, but it becomes truly meaningful when the occasion brings a smile to someone else\u2019s face. On 25 August 2026, Tabasmi (C/o: Hirak Ghosh) reached out to Abirvab Scholarship Foundation with a heartfelt intention to make her birthday more meaningful by extending support to students in need.',
      'As part of her birthday initiative, Tabasmi contributed an amount to Abirvab Scholarship Foundation. We proposed that her contribution be transformed into a meaningful educational initiative for students from economically disadvantaged backgrounds, in keeping with the Foundation\u2019s commitment to supporting meritorious students from the margins of society.',
      'With this intention, a Study Material Distribution Project was organised at Anukhal High School, Kalna. Through the initiative, essential study materials and some tiffin packets were distributed among 23 students of Anukhal High School and 2 girl students of Balia Primary School, representing Anukhal and the neighbouring villages.',
      'The programme was held on the premises of Anukhal High School in the presence of the school\u2019s T.I.C., Shri Subrata Koley. We sincerely express our gratitude to the school authorities for their valuable cooperation and for standing beside the meritorious students of the institution who come from financially disadvantaged backgrounds.',
      'We also extend our heartfelt wishes for the continued growth, success and prosperity of Anukhal High School.',
      'The joy on the faces of the students as they received their new study materials was truly heartwarming. While the materials may seem modest, we believe that they can contribute, even in a small way, towards their education and help them move a little further on their journey of learning. For us, that is the most meaningful outcome of the initiative.',
      'Tabasmi chose not to limit her birthday celebration to herself. Instead, she turned her special day into an opportunity to support the education of children who need encouragement and assistance. Abirvab Scholarship Foundation extends its warmest birthday wishes and heartfelt gratitude to her for this thoughtful initiative.',
      'At Abirvab, we believe that education is not merely about books and classrooms\u2014it is also about creating opportunities, nurturing hope and ensuring that financial limitations do not become a barrier to a student\u2019s aspirations.',
      'Abirvab was there, is there, and will continue to stand beside students in need. May this journey of standing beside people and contributing to their education and well-being continue with the same spirit and sincerity.',
    ],
    fullStoryUrl: null,
  },
  {
    id: 'sharing-the-joy-of-puja',
    title: 'Sharing the Joy of Puja — Puja Is for Everyone',
    cardLabel: 'Sharing Puja Joy',
    date: '29 September 2025',
    location: 'Dhatrigram & Dule Para, near P.N.H.S.',
    images: [
      '/assets/images/story-p2.jpg',
      '/assets/images/story-p2-2.jpg',
      '/assets/images/story-p2-3.jpg',
      '/assets/images/story-p2-4.jpg',
    ],
    body: [
      'Festivals are not merely about celebration; they are also about sharing happiness, spreading smiles and making sure that the joy of the occasion reaches everyone, irrespective of their circumstances.',
      'With this spirit, Abirvab Scholarship Foundation came forward to share the festive joy with children from economically disadvantaged communities during the Puja season.',
      'As part of this initiative, 50 children from the area adjoining Dhatrigram Railway Station and Dule Para, near Paruldanga Nasratpur High School (P.N.H.S.), were provided with new clothes, including shirts and trousers. The initiative was undertaken with the simple objective of bringing a little more happiness to the festive days of these children.',
      'The happiness and excitement on their faces as they received their new clothes made the initiative truly special. For us, the essence of Puja lies not only in our own celebrations but also in ensuring that the festive spirit reaches those who may otherwise remain deprived of such simple joys.',
      'This project was made possible through the support and contributions of all those who have stood beside Abirvab Scholarship Foundation and continued to believe in its work. We extend our heartfelt gratitude to each and every person who has supported us in this journey.',
      'At Abirvab, we believe that the joy of a festival becomes more meaningful when it is shared. May the spirit of compassion, togetherness and service continue to inspire us\u2014not only during Puja, but throughout the year.',
      'Pujo is for everyone. The joy of Puja is for everyone. And Abirvab will continue to share that joy.',
    ],
    fullStoryUrl: null,
  },
  {
    id: 'keeping-our-promises',
    title: 'Keeping Our Promises — Distribution of Educational Tools',
    cardLabel: 'Keeping Our Promises',
    date: '16 February 2025',
    location: 'Barasat M.S. Kendra, Kali Bele, Purba Bardhaman',
    images: [
      '/assets/images/story-p3.jpg',
      '/assets/images/story-p3-2.jpg',
      '/assets/images/story-p3-3.jpg',
      '/assets/images/story-p3-4.jpg',
    ],
    body: [
      'Abirvab Scholarship Foundation organised an Educational Tools Distribution Project at Barasat M.S. Kendra, where educational tools were distributed among 74 students from Classes V to VIII.',
      'The initiative aimed to provide essential educational support and encourage students in their academic journey. The happiness of the students made the project truly meaningful for us.',
      'This project was possible because of the continued support and helping hands of our donors and well-wishers. We sincerely thank everyone who has stood beside Abirvab.',
      'With your continued support, Abirvab will keep moving forward towards bigger and more meaningful projects.',
      'Abirvab was there, is there, and will continue to stand beside students.',
    ],
    fullStoryUrl: null,
  },
  {
    id: 'when-puja-became-a-little-brighter',
    title: 'When Puja Became a Little Brighter — Durga Puja 2024',
    cardLabel: 'A Brighter Puja',
    date: '8 October 2024',
    location: 'Dhatrigram Railway Station Area',
    images: [
      '/assets/images/story-p4.jpg',
      '/assets/images/story-p4-2.jpg',
      '/assets/images/story-p4-3.jpg',
      '/assets/images/story-p4-4.jpg',
      '/assets/images/story-p4-5.jpg',
      '/assets/images/story-p4-6.jpg',
    ],
    body: [
      'Puja is a time of joy, celebration and togetherness. But for some children, the festive season can pass without the simple happiness of wearing new clothes.',
      'On 8 October 2024, Abirvab Scholarship Foundation stepped forward to make Puja a little brighter for some needy students living in the area surrounding Dhatrigram Railway Station.',
      'As part of the initiative, new clothes were handed over to the children so that they could celebrate the festival with happiness and dignity. Their smiles and excitement made the initiative truly special.',
      'For Abirvab, this was more than just a distribution programme. It was a small effort to become a part of their Puja and to remind them that they are not alone.',
      'A small gesture, a new dress, and a brighter Puja\u2014this is how Abirvab kept its promise.',
      'The journey continues, with the hope of reaching more children and bringing more smiles in the days ahead.',
    ],
    fullStoryUrl: null,
  },
]

export const getStoryById = (id) => stories.find((s) => s.id === id) ?? null
