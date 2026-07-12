import { featuredArticles } from '../data.js'

export default function Articles() {
  return (
    <section className="section" id="stiri">
      <div className="wrap">
        <div className="shead">
          <div className="lead">
            <span className="eyebrow">Scrieri</span>
            <h2>Articole recente</h2>
          </div>
          <a className="more" href="#articole">Toate articolele →</a>
        </div>
        <div className="arts">
          {featuredArticles.map((a) => (
            <article className="art" key={a.title}>
              <span className="dom">{a.domain}</span>
              <h3>{a.title}</h3>
              <p className="dek">{a.dek}</p>
              <div className="meta">
                <span>{a.author}</span>
                <span className="sep" aria-hidden="true" />
                <span>{a.read} lectură</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
