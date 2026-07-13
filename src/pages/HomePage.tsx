import { useState } from 'react'
import { Link } from 'react-router-dom'
import { newsletterRequest } from '../app/api'
import { AgendaList, ArticleTeaser, Portrait, ProductCard } from '../components/Editorial'
import { Seo } from '../components/Primitives'
import { articles, authors, domains, events, products, projects } from '../data/seed'

export default function HomePage() {
  const featured = articles[0]
  const featuredAuthor = authors[0]
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <>
      <Seo
        title="Coperta"
        description="Bimael reunește eseuri, cercetare, autori, dezbateri și întâlniri într-o platformă culturală demonstrativă."
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Bimael', description: 'Platformă editorial-academică demonstrativă' }}
      />
      <section className="cover shell" aria-labelledby="cover-title">
        <div className="cover-index">
          <span className="kicker">Dosar 02 · Vara 2026</span>
          <p>Filosofie · Neuroștiințe · Istoria ideilor</p>
        </div>
        <article className="cover-story">
          <span className="kicker">Eseul copertei</span>
          <h1 id="cover-title">{featured.title}</h1>
          <p className="cover-dek">{featured.subtitle}. {featured.excerpt}</p>
          <div className="cover-byline"><span>de {featuredAuthor.name}</span><span>{featured.readMinutes} minute de lectură</span></div>
          <Link className="primary-action" to={`/articole/${featured.slug}`}>Citește eseul <span aria-hidden="true">↗</span></Link>
        </article>
        <aside className="cover-author" aria-label="Autor evidențiat">
          <span className="cover-figure-no" aria-hidden="true">I</span>
          <Portrait author={featuredAuthor} priority />
          <div><span className="kicker">Autor evidențiat</span><h2>{featuredAuthor.name}</h2><p>{featuredAuthor.academicTitle}</p><Link to={`/autori/${featuredAuthor.slug}/biografie`}>Deschide profilul</Link></div>
        </aside>
        <div className="cover-agenda"><AgendaList items={events} title="Următoarele întâlniri" limit={3} /></div>
      </section>

      <section className="editorial-statement">
        <div className="shell statement-grid">
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>O idee nu devine mai mică atunci când este făcută accesibilă. Devine discutabilă.</blockquote>
          <p>Bimael construiește punți între rigoarea academică și curiozitatea publică, fără a confunda popularizarea cu simplificarea.</p>
          <Link to="/prezentare">Citește manifestul</Link>
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="selection-title">
        <div className="section-rule"><div><span className="kicker">Selecția redacției</span><h2 id="selection-title">Idei pentru o lectură lentă</h2></div><Link to="/articole">Toate articolele</Link></div>
        <div className="editorial-grid">
          {articles.slice(1, 4).map((article, index) => <ArticleTeaser key={article.id} article={article} index={index + 1} />)}
        </div>
      </section>

      <section className="page-section domain-section" aria-labelledby="domains-title">
        <div className="shell">
          <div className="section-rule"><div><span className="kicker">Atlas tematic</span><h2 id="domains-title">Domenii care se întâlnesc</h2></div><Link to="/domenii">Explorează atlasul</Link></div>
          <ol className="domain-index">
            {domains.map((domain, index) => (
              <li key={domain.slug}><Link to={`/domenii/${domain.slug}`}><span>{String(index + 1).padStart(2, '0')}</span><h3>{domain.name}</h3><p>{domain.description}</p><small>{domain.count} materiale</small></Link></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section shell debate-feature" aria-labelledby="debate-title">
        <div className="debate-label"><span className="kicker">Dezbatere deschisă</span><span>Teză / antiteză</span></div>
        <div className="debate-main"><h2 id="debate-title">Poate o mașină să aibă o perspectivă?</h2><p>Două poziții, argumente explicite și o bibliografie comună. Comentariile sunt moderate, iar miza nu este câștigarea unei dispute, ci clarificarea termenilor.</p><Link className="primary-action" to="/dezbateri">Urmărește dezbaterea</Link></div>
        <div className="debate-sides"><article><small>Poziția A</small><h3>Perspectiva cere un corp situat</h3><p>Ana-Maria Ilinca</p></article><article><small>Poziția B</small><h3>Funcția poate preceda experiența</h3><p>Tudor Vlas</p></article></div>
      </section>

      <section className="page-section shell" aria-labelledby="projects-title">
        <div className="section-rule"><div><span className="kicker">Lucru în desfășurare</span><h2 id="projects-title">Proiecte și arhive vii</h2></div><Link to="/proiecte">Toate proiectele</Link></div>
        <div className="project-ledger">{projects.slice(0, 3).map((project, index) => <article key={project.id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{project.status}</small><h3>{project.title}</h3><p>{project.description}</p></div></article>)}</div>
      </section>

      <section className="page-section shop-feature" aria-labelledby="shop-title">
        <div className="shell">
          <div className="section-rule"><div><span className="kicker">Edituri &amp; obiecte culturale</span><h2 id="shop-title">Din atelierul Bimael</h2></div><Link to="/shop">Deschide shop-ul</Link></div>
          <div className="product-grid">{products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="newsletter-section shell" aria-labelledby="newsletter-title">
        <div><span className="kicker">Scrisoarea Bimael</span><h2 id="newsletter-title">Un eseu, o agendă, o întrebare.</h2><p>La două săptămâni. Fără flux comercial ascuns.</p></div>
        <form onSubmit={async (event) => {
          event.preventDefault(); setSubmitting(true); setMessage('')
          try { const result = await newsletterRequest(email); setMessage(result.message); setEmail('') } catch (error) { setMessage(error instanceof Error ? error.message : 'Adresa nu a putut fi salvată.') } finally { setSubmitting(false) }
        }}>
          <label htmlFor="newsletter-email">Adresa de email</label>
          <div><input id="newsletter-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nume@exemplu.ro" /><button type="submit" disabled={submitting}>{submitting ? 'Se salvează…' : 'Abonează-te'}</button></div>
          <small>În această versiune, adresa este păstrată doar în memoria serverului demo.</small>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
      </section>
    </>
  )
}
