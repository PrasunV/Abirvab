import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import StoriesCarousel from './components/StoriesCarousel.jsx'
import Community from './components/Community.jsx'
import FAQ from './components/FAQ.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <StoriesCarousel />
        <Community />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
