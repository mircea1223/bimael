import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/bimael-logo.webp'
import { useDemo } from '../app/DemoContext'

const navItems = [
  ['/prezentare', 'Prezentare'],
  ['/stiri', 'Știri'],
  ['/dezbateri', 'Dezbateri'],
  ['/domenii', 'Domenii'],
  ['/povesti', 'Povești'],
  ['/contact', 'Contact'],
] as const

function GlobalNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="global-nav" aria-label="Navigație principală">
      <ul>
        {navItems.map(([to, label]) => (
          <li key={to}>
            <NavLink to={to} onClick={onNavigate}>{label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Header() {
  const { cartCount, user, resetDemo } = useDemo()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (
    localStorage.getItem('bimael.theme') === 'dark' ? 'dark' : 'light'
  ))
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('bimael.theme', theme)
  }, [theme])
  useEffect(() => {
    if (!menuOpen) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.body.classList.add('drawer-active')
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('drawer-active')
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <div className="demo-bar">
        <span><strong>Mediu demo</strong><span className="demo-detail"> · autori și tranzacții fictive</span></span>
        <button type="button" onClick={resetDemo}>Resetează datele locale</button>
      </div>
      <header className="site-header">
        <div className="shell header-top">
          <div className="header-context" aria-hidden="true">
            <span className="kicker">Revistă · Salon · Arhivă</span>
            <em>Idei pentru o cultură vie</em>
          </div>
          <Link className="brand" to="/" aria-label="Bimael — Acasă">
            <img src={logo} width="600" height="600" alt="" />
            <span>Bimael</span>
          </Link>
          <div className="header-actions">
            <Link className="utility-link search-link" to="/cautare" aria-label="Caută în Bimael">Caută</Link>
            <button className="utility-link" type="button" onClick={() => setTheme((value) => value === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Noapte' : 'Zi'}
            </button>
            <Link className="utility-link account-link" to={user ? '/cont' : '/autentificare'}>{user ? user.name.split(' ')[0] : 'Cont'}</Link>
            <Link className="cart-link" to="/cos" aria-label={`Coș, ${cartCount} produse`}>Coș <span>{cartCount}</span></Link>
            <button
              ref={menuButtonRef}
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >Meniu</button>
          </div>
        </div>
        <div className="shell desktop-nav"><GlobalNav /></div>
      </header>
      {menuOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false)
        }}>
          <aside id="mobile-navigation" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Meniu">
            <div className="drawer-head">
              <span className="kicker">Cuprins Bimael</span>
              <button ref={closeRef} type="button" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus() }}>Închide</button>
            </div>
            <GlobalNav onNavigate={() => setMenuOpen(false)} />
            <div className="drawer-secondary">
              <Link to="/autori" onClick={() => setMenuOpen(false)}>Autori</Link>
              <Link to="/articole" onClick={() => setMenuOpen(false)}>Articole</Link>
              <Link to="/evenimente" onClick={() => setMenuOpen(false)}>Evenimente</Link>
              <Link to="/webinarii" onClick={() => setMenuOpen(false)}>Webinarii</Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop cultural</Link>
              <Link to="/institutii" onClick={() => setMenuOpen(false)}>Instituții</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  if (online) return null
  return <div className="offline-banner" role="alert"><strong>Ești offline.</strong> Poți citi datele deja încărcate, dar înscrierile și checkout-ul sunt indisponibile.</div>
}

function Footer() {
  const { sponsors } = useDemo()
  return (
    <footer className="site-footer">
      <section className="sponsor-strip" aria-labelledby="partners-heading">
        <div className="shell">
          <div className="section-rule">
            <div>
              <span className="kicker">Instituții asociate</span>
              <h2 id="partners-heading">Parteneri &amp; colaboratori</h2>
            </div>
            <Link to="/institutii">Despre parteneriate</Link>
          </div>
          <ul className="sponsor-list">
            {sponsors.map((sponsor) => <li key={sponsor.id}><span aria-hidden="true">✦</span>{sponsor.name}<small>{sponsor.tier}</small></li>)}
          </ul>
        </div>
      </section>
      <div className="shell footer-grid">
        <div>
          <strong className="footer-wordmark">Bimael</strong>
          <p>O platformă demonstrativă pentru idei, cercetare și întâlniri.</p>
        </div>
        <nav aria-label="Conținut">
          <h3>Explorează</h3>
          <Link to="/autori">Autori</Link><Link to="/articole">Articole</Link><Link to="/evenimente">Agenda</Link><Link to="/arhiva">Arhivă</Link>
        </nav>
        <nav aria-label="Informații legale">
          <h3>Informații</h3>
          <Link to="/prezentare">Despre Bimael</Link><Link to="/politici/confidentialitate">Confidențialitate</Link><Link to="/politici/termeni">Termeni demo</Link><Link to="/contact">Contact</Link>
        </nav>
        <div className="footer-note">
          <span className="kicker">Colecție editorială</span>
          <em>Sinapsă &amp; Sens</em>
          <small>© 2026 Bimael · Conținut demo fictiv</small>
        </div>
      </div>
    </footer>
  )
}

export default function SiteShell() {
  return (
    <>
      <a className="skip-link" href="#main-content">Sari la conținut</a>
      <Header />
      <OfflineBanner />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <Footer />
    </>
  )
}
