import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import { AgendaList, ArticleTeaser, EditorialCartouche, Portrait, ProductCard } from '../components/Editorial'
import { EmptyState, Seo } from '../components/Primitives'
import { articles, authors, events, products, projects } from '../data/seed'
import type { Author, AuthorSection } from '../domain/types'

const leftSections: Array<{ id: AuthorSection; label: string }> = [
  { id: 'biografie', label: 'Biografie' }, { id: 'articole', label: 'Articole' }, { id: 'webinarii', label: 'Webinarii' }, { id: 'evenimente', label: 'Evenimente' },
]
const rightSections: Array<{ id: AuthorSection; label: string }> = [
  { id: 'proiecte', label: 'Proiecte' }, { id: 'shop', label: 'Shop' }, { id: 'arhiva', label: 'Arhivă' }, { id: 'contact', label: 'Contact' },
]
const allSections = [...leftSections, ...rightSections]

function AuthorRail({ author, sections, active, label }: { author: Author; sections: typeof leftSections; active: AuthorSection; label: string }) {
  return (
    <nav className="author-rail" aria-label={label}>
      <span className="kicker">{label}</span>
      {sections.map((section) => (
        <Link key={section.id} to={`/autori/${author.slug}/${section.id}`} aria-current={active === section.id ? 'page' : undefined}>
          <span>{section.label}</span><small>{author.counts[section.id] ?? '—'}</small>
        </Link>
      ))}
    </nav>
  )
}

function AuthorSectionPanel({ author, section }: { author: Author; section: AuthorSection }) {
  const { announce } = useDemo()
  const [contactSent, setContactSent] = useState(false)
  const authoredArticles = articles.filter((article) => article.authorId === author.id)
  const authoredEvents = events.filter((event) => event.authorIds.includes(author.id))
  const authoredProjects = projects.filter((project) => project.authorId === author.id)

  if (section === 'biografie') return (
    <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Parcurs</span><h2 id="panel-title">Biografie</h2><div className="long-copy"><p>{author.bio}</p><p>Lucrează între lectură apropiată, dialog interdisciplinar și formate publice de învățare. Toate afilierile și identificatorii din această pagină sunt date fictive pentru evaluarea produsului.</p><dl><div><dt>Afiliere</dt><dd>{author.affiliation}</dd></div><div><dt>ORCID</dt><dd>{author.orcid ?? 'Nedeclarat în profilul demo'}</dd></div><div><dt>Domenii</dt><dd>{author.fields.join(' · ')}</dd></div></dl></div></section>
  )
  if (section === 'articole') return (
    <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Publicații</span><h2 id="panel-title">Articole</h2>{authoredArticles.length ? <div className="author-articles">{authoredArticles.map((article) => <ArticleTeaser key={article.id} article={article} />)}</div> : <EmptyState title="Nicio publicație">Autorul nu are încă texte publicate în această colecție demo.</EmptyState>}</section>
  )
  if (section === 'webinarii') {
    const webinars = authoredEvents.filter((event) => event.type === 'Webinar')
    return <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Învățare online</span><h2 id="panel-title">Webinarii</h2>{webinars.length ? <AgendaList items={webinars} title="Webinarii cu acest autor" /> : <EmptyState title="Niciun webinar programat">Revino în agenda generală pentru alte întâlniri.</EmptyState>}</section>
  }
  if (section === 'evenimente') return <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Întâlniri</span><h2 id="panel-title">Evenimente</h2><AgendaList items={authoredEvents} title="Calendarul autorului" /></section>
  if (section === 'proiecte') return <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Cercetare deschisă</span><h2 id="panel-title">Proiecte</h2><div className="project-ledger">{authoredProjects.map((project, index) => <article key={project.id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{project.status}</small><h3>{project.title}</h3><p>{project.description}</p></div></article>)}</div></section>
  if (section === 'shop') {
    const relatedProducts = author.id === 'a-marian' ? products.slice(0, 2) : products.filter((product) => product.eventId && authoredEvents.some((event) => event.id === product.eventId))
    return <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Ediții &amp; acces</span><h2 id="panel-title">Shop</h2>{relatedProducts.length ? <div className="product-grid compact">{relatedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState title="Niciun produs asociat">Conținutul autorului rămâne disponibil gratuit în arhivă.</EmptyState>}</section>
  }
  if (section === 'arhiva') return <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Fond personal</span><h2 id="panel-title">Arhivă</h2><div className="archive-list"><Link to={`/cautare?autor=${author.slug}&tip=articol`}><span>Texte și versiuni</span><strong>{author.counts.arhiva ?? 0}</strong></Link><Link to={`/cautare?autor=${author.slug}&tip=eveniment`}><span>Înregistrări și transcripturi</span><strong>{authoredEvents.filter((event) => event.status === 'replay').length}</strong></Link><button type="button" onClick={() => announce('Exportul arhivei a fost pregătit ca demonstrație; nu s-a descărcat niciun fișier.')}>Pregătește inventarul demo</button></div></section>
  return (
    <section className="author-panel" aria-labelledby="panel-title"><span className="kicker">Corespondență</span><h2 id="panel-title">Contact</h2>{contactSent ? <div className="success-panel" role="status"><h3>Mesaj înregistrat în demo</h3><p>Nu a fost trimis niciun email extern. În producție, adapterul de email va prelua această cerere.</p><button type="button" onClick={() => setContactSent(false)}>Trimite alt mesaj</button></div> : <form className="editorial-form" onSubmit={(event) => { event.preventDefault(); setContactSent(true) }}><label htmlFor="contact-name">Nume<input id="contact-name" required /></label><label htmlFor="contact-email">Email<input id="contact-email" type="email" autoComplete="email" required /></label><label htmlFor="contact-message">Mesaj<textarea id="contact-message" minLength={20} required rows={5} /></label><button type="submit">Înregistrează mesajul demo</button><small>Mesajul nu părăsește această sesiune demonstrativă.</small></form>}</section>
  )
}

export default function AuthorPage() {
  const { authorSlug, section: routeSection } = useParams()
  const authorIndex = authors.findIndex((item) => item.slug === authorSlug)
  if (authorIndex < 0) return <Navigate to="/404" replace />
  const author = authors[authorIndex]
  const section = (routeSection ?? 'biografie') as AuthorSection
  if (!allSections.some((item) => item.id === section)) return <Navigate to={`/autori/${author.slug}/biografie`} replace />
  const previous = authors[(authorIndex - 1 + authors.length) % authors.length]
  const next = authors[(authorIndex + 1) % authors.length]

  return (
    <>
      <Seo title={`${author.name} · ${allSections.find((item) => item.id === section)?.label}`} description={author.bio} type="profile" jsonLd={{ '@context': 'https://schema.org', '@type': 'Person', name: author.name, affiliation: { '@type': 'Organization', name: author.affiliation }, description: author.bio }} />
      <div className="author-heading shell"><span className="kicker">Profil de autor · date fictive</span><div className="author-switcher"><Link to={`/autori/${previous.slug}/${section}`} aria-label={`Autorul anterior: ${previous.name}`}>← <span>{previous.name}</span></Link><span aria-live="polite">{authorIndex + 1} din {authors.length}</span><Link to={`/autori/${next.slug}/${section}`} aria-label={`Autorul următor: ${next.name}`}><span>{next.name}</span> →</Link></div></div>
      <div className="author-mobile-sections shell">
        <details><summary>Conținut · {allSections.find((item) => item.id === section)?.label}</summary><AuthorRail author={author} sections={leftSections} active={section} label="Conținut" /></details>
        <details><summary>Resurse</summary><AuthorRail author={author} sections={rightSections} active={section} label="Resurse" /></details>
      </div>
      <section className="author-layout shell" aria-label={`Profilul ${author.name}`}>
        <AuthorRail author={author} sections={leftSections} active={section} label="Conținut" />
        <div className="author-center">
          <EditorialCartouche>{author.cartouche}</EditorialCartouche>
          <Portrait author={author} priority />
          <header className="author-identity">
            <h1>{author.name}</h1><p className="author-title">{author.academicTitle}</p><p className="author-affiliation">{author.affiliation}</p>
            <blockquote>„{author.quote}”</blockquote>
            <ul>{author.fields.map((field) => <li key={field}>{field}</li>)}</ul>
            <div className="author-actions"><Link className="primary-action" to={`/autori/${author.slug}/articole`}>Vezi publicațiile</Link><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copiază profilul</button><Link to={`/autori/${author.slug}/contact`}>Contactează</Link></div>
          </header>
          <AuthorSectionPanel author={author} section={section} />
        </div>
        <AuthorRail author={author} sections={rightSections} active={section} label="Resurse" />
        <aside className="author-agenda"><AgendaList items={events.filter((event) => event.authorIds.includes(author.id))} title="Agenda autorului" limit={3} /></aside>
      </section>
    </>
  )
}
