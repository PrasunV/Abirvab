/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F3EF',
        ink: '#0E0E10',
        marigold: {
          DEFAULT: '#FDC601',
          dark: '#E08A00',
        },
        forest: '#3F6650',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        // Hero rotating verbs only. Self-hosted, subset to a-z + "." (see
        // public/assets/fonts) — add glyphs there if you use other characters.
        script: ['"Seaweed Script"', '"Segoe Script"', 'cursive'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
