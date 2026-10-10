// Photos for the hero slider, in display order.
//
//  src    path under /public. hero-N.jpg are pre-cropped 4:5 portrait masters;
//         the build pipeline (scripts/generate-image-variants.mjs) makes the
//         responsive WebP/JPEG sizes and blurred previews from them.
//  alt    what is in the photo (read by screen readers).
//  focus  CSS object-position: the point of the photo that must stay in frame
//         when the slot is a slightly different shape than the photo. Also
//         the origin of the slow zoom.
//
// To reorder, add or remove slides, edit this list only. New photos should be
// cropped to 4:5 and dropped in public/assets/images as .jpg.
export const HERO_SLIDES = [
  {
    src: '/assets/images/hero-1.jpg',
    alt: 'Two Abirvab volunteers smiling with a young boy in a blue shirt',
    focus: '50% 35%',
  },
  {
    // Reuses the story photo that was the hero's single image before.
    src: '/assets/images/story-p1.jpg',
    alt: 'Children holding thank-you signs with Abirvab volunteers outside their school',
    focus: '50% 45%',
  },
  {
    src: '/assets/images/hero-2.jpg',
    alt: 'A student receiving a trophy and certificate in front of a school building',
    focus: '50% 45%',
  },
  {
    src: '/assets/images/hero-3.jpg',
    alt: 'A student receiving a stack of books in a school library',
    focus: '50% 40%',
  },
  {
    src: '/assets/images/hero-4.jpg',
    alt: 'An envelope marked Abirvab Scholarship Foundation being handed over',
    focus: '50% 50%',
  },
  {
    src: '/assets/images/hero-5.jpg',
    alt: 'A volunteer giving study books to a girl and an elder at their home',
    focus: '50% 35%',
  },
  {
    src: '/assets/images/hero-6.jpg',
    alt: 'A girl in a yellow dress receiving school supplies while other children watch',
    focus: '50% 50%',
  },
  {
    src: '/assets/images/hero-7.jpg',
    alt: 'A volunteer handing a trophy to a student on stage at a prize ceremony',
    focus: '50% 35%',
  },
  {
    src: '/assets/images/hero-8.jpg',
    alt: 'A volunteer presenting a bouquet to a student on stage at a prize ceremony',
    focus: '50% 35%',
  },
  {
    src: '/assets/images/hero-9.jpg',
    alt: 'Children holding Thank you, Study materials and Abirvab Scholarship Foundation signs',
    focus: '50% 55%',
  },
]
