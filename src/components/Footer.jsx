import { partners } from '../data.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div className="partners">
            <span className="eyebrow k">Parteneri &amp; colaboratori</span>
            {partners.map((p) => (
              <span className="p" key={p}>{p}</span>
            ))}
          </div>
          <div className="copy">© 2026 Sinapsă &amp; Sens · Marian Bituics</div>
        </div>
      </div>
    </footer>
  )
}
