import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Articles from './components/Articles.jsx'
import Domains from './components/Domains.jsx'
import Manifesto from './components/Manifesto.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Articles />
      <Domains />
      <Manifesto />
      <Newsletter />
      <Footer />
    </>
  )
}
