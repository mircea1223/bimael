import { primaryNav } from '../data.js'
import bimaelLogo from '../assets/bimael-logo.png'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <div className="topline">
          <div className="brandmeta">
            <div className="eyebrow">Filosofie · Neuroștiințe</div>
            <div className="tag">Însemnări despre minte și conștiință</div>
          </div>
          <div className="logo">
            <a href="#home" aria-label="Acasă">
              <img src={bimaelLogo} alt="Bimael" />
            </a>
          </div>
          <div className="topright">
            <button
              className="txtlink"
              type="button"
              onClick={onToggleTheme}
              aria-label={`Comută pe tema ${theme === 'dark' ? 'luminoasă' : 'întunecată'}`}
            >
              Temă
            </button>
            <button className="btn-outline" type="button">Abonează-te</button>
          </div>
        </div>
        <nav className="main-nav" aria-label="Navigație principală">
          <ul>
            {primaryNav.map((item, i) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} aria-current={i === 0 ? 'page' : undefined}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
