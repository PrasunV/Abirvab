/**
 * Story content for the "Stories to Read" section and its modal.
 *
 * PLACEHOLDER COPY — every summary, highlight, stat and URL below is
 * sample text. Replace with real, verified details before launch.
 *
 * Shape
 *  id            unique slug (also used for the future full-story URL)
 *  title         card + modal headline
 *  tag           short category pill
 *  location      shown next to the tag
 *  image         /public path; missing files fall back to a striped placeholder
 *  summary       1–2 sentence intro under the headline
 *  highlights    3–4 short bullet points (right column)
 *  stat          { value, label } for the big impact tile
 *  fullStoryUrl  link for "Read full story"; set to null to hide the button
 */
export const stories = [
  {
    id: 'aarav-path-to-school',
    title: "Aarav's Path to School",
    tag: 'Scholarship',
    location: 'West Bengal',
    image: '/assets/images/story-1.jpg',
    summary:
      'Aarav used to walk two hours each way to reach the nearest school. A scholarship covering his fees, uniform and a bicycle turned that walk into a short ride — and his attendance into a habit.',
    highlights: [
      'Full-year tuition and exam fees covered',
      'Bicycle, uniform and school bag provided',
      'Monthly check-ins with a volunteer mentor',
      'Now in the top five of his class',
    ],
    stat: { value: '96%', label: 'attendance this academic year, up from under half' },
    fullStoryUrl: '/stories/aarav-path-to-school',
  },
  {
    id: 'books-in-rural-classrooms',
    title: 'Books in Rural Classrooms',
    tag: 'Library drive',
    location: 'Village schools',
    image: '/assets/images/story-2.jpg',
    summary:
      'Many village classrooms had one textbook shared between five children. Our library drive stocked shelves with textbooks and storybooks in Bengali and English.',
    highlights: [
      'Textbooks for every child in participating classes',
      'Storybook corners set up in each school',
      'Weekly reading hour led by local volunteers',
      'Books chosen with teachers, not for them',
    ],
    stat: { value: '1,200+', label: 'books delivered to rural classrooms' },
    fullStoryUrl: '/stories/books-in-rural-classrooms',
  },
  {
    id: 'bridging-the-tech-divide',
    title: 'Bridging the Tech Divide',
    tag: 'Digital learning',
    location: 'Community centre',
    image: '/assets/images/story-3.jpg',
    summary:
      'Most of our students had never used a computer. A small learning lab with refurbished laptops now gives them weekly, hands-on digital lessons.',
    highlights: [
      'Refurbished laptops donated by supporters',
      'Weekly basic computing and typing classes',
      'Safe internet use taught from day one',
      'Older students help teach the younger ones',
    ],
    stat: { value: '80', label: 'students learning on a computer for the first time' },
    fullStoryUrl: '/stories/bridging-the-tech-divide',
  },
  {
    id: 'mentorship-that-matters',
    title: 'Mentorship That Matters',
    tag: 'Mentorship',
    location: 'Across our programmes',
    image: '/assets/images/story-4.jpg',
    summary:
      'A scholarship opens the door; a mentor helps a child walk through it. Volunteers meet students regularly to help with studies, goals and confidence.',
    highlights: [
      'One mentor paired with every scholarship student',
      'Help with homework, exams and career choices',
      'Parents kept in the loop every term',
      'Former scholars now returning as mentors',
    ],
    stat: { value: '1:1', label: 'mentor for every scholarship student' },
    fullStoryUrl: '/stories/mentorship-that-matters',
  },
]

export const getStoryById = (id) => stories.find((s) => s.id === id) ?? null
