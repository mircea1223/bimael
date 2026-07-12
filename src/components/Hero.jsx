import { useEffect, useRef, useState } from 'react'
import { authors, articleTitles } from '../data.js'
import Medallion from './Medallion.jsx'
import Agenda from './Agenda.jsx'
import Fragment from './Fragment.jsx'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const leftRail = [
  { label: 'Biografie', num: 'i' },
  { label: 'Articole', num: '24' },
  { label: 'Webinarii', num: '6' },
  { label: 'Evenimente', num: '3' },
]
const rightRail = ['Proiecte', 'Shop', 'Arhivă', 'Contact']

export default function Hero() {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const author = authors[cur]

  // Titlu de articol care se rotește în „nota de margine”.
  const [title, setTitle] = useState(articleTitles[0])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const swap = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setTitle(articleTitles[Math.floor(Math.random() * articleTitles.length)])
        setFading(false)
      }, 550)
    }, 4200)
    return () => clearInterval(swap)
  }, [])

  // Rotația autorilor.
  const paused_ref = useRef(paused)
  paused_ref.current = paused
  useEffect(() => {
    if (prefersReduced) return
    const id = setInterval(() => {
      if (!paused_ref.current) setCur((c) => (c + 1) % authors.length)
    }, 9500)
    return () => clearInterval(id)
  }, [])

  const go = (i) => setCur((i + authors.length) % authors.length)

  return (
    <main className="hero" id="home">
      <div className="wrap">
        <div
          className="herotop"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Fragment — echilibrează compoziția în stânga medalionului */}
          <Fragment />

          {/* Rail stânga — rubricile autorului */}
          <nav className="rail left" aria-label="Rubrici autor">
            <span className="eyebrow lbl">Autor</span>
            {leftRail.map((b) => (
              <button className="railbtn" type="button" key={b.label}>
                {b.label}
                <span className="num">{b.num}</span>
              </button>
            ))}
          </nav>

          {/* Medalion + notă de margine */}
          <div className="mediacol">
            <div className="stage">
              <div className="bubble" role="status" aria-live="polite">
                <div className={`title ${fading ? 'out' : ''}`}>{title}</div>
                <svg className="bubble-tail" viewBox="0 0 36 22" aria-hidden="true">
                  <path className="tail-fill" d="M0 0 C8 3 12 11 14 20 C19 12 25 5 36 0 Z" />
                  <path className="tail-line" d="M0 0 C8 3 12 11 14 20 C19 12 25 5 36 0" />
                </svg>
              </div>
              <Medallion />
            </div>
          </div>

          {/* Rail dreapta — platforma */}
          <nav className="rail right" aria-label="Platformă">
            <span className="eyebrow lbl">Platformă</span>
            {rightRail.map((label) => (
              <button className="railbtn" type="button" key={label}>
                {label}
                <span className="num" aria-hidden="true">↗</span>
              </button>
            ))}
          </nav>

          {/* Agenda derulantă */}
          <Agenda />
        </div>

        {/* Identitatea autorului */}
        <div className="heromast">
          <h1>{author.name}</h1>
          <div className="role">{author.role}</div>
          <p className="epigraph">{author.epigraph}</p>
          <p className="bio">{author.bio}</p>
          <div className="field">
            {author.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="dots" role="tablist" aria-label="Schimbă autorul">
            {authors.map((a, i) => (
              <button
                key={a.id}
                className="dot"
                role="tab"
                aria-selected={i === cur}
                aria-label={a.name}
                onClick={() => go(i)}
              />
            ))}
            <span className="nav-arrows">
              <button type="button" onClick={() => go(cur - 1)} aria-label="Autorul anterior">
                ‹
              </button>
              <button type="button" onClick={() => go(cur + 1)} aria-label="Autorul următor">
                ›
              </button>
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
