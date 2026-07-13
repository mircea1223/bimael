import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import { ArticleTeaser, Portrait } from '../components/Editorial'
import { BackLink, EmptyState, PageIntro, Seo, StatusBadge } from '../components/Primitives'
import { articles, authors, domains, events, products } from '../data/seed'
import { normalizeSearch, searchMatches } from '../domain/services'

export function AuthorsPage() {
  return (
    <>
      <Seo title="Autori" description="Cunoaște autorii și cercetătorii fictivi ai colecțiilor demo Bimael." />
      <PageIntro eyebrow="Comunitate intelectuală" title="Autori"><p>Profiluri demonstrative din filosofie, neuroștiințe și istoria ideilor. Numele și afilierile sunt fictive.</p></PageIntro>
      <section className="shell author-directory" aria-label="Lista autorilor">
        {authors.map((author, index) => <article key={author.id}><span className="directory-number">{String(index + 1).padStart(2, '0')}</span><Portrait author={author} /><div><span className="kicker">{author.fields[0]}</span><h2><Link to={`/autori/${author.slug}/biografie`}>{author.name}</Link></h2><p>{author.academicTitle}</p><p>{author.bio}</p><Link className="text-link" to={`/autori/${author.slug}/biografie`}>Deschide profilul →</Link></div></article>)}
      </section>
    </>
  )
}

export function ArticlesPage({ newsOnly = false }: { newsOnly?: boolean }) {
  const [params, setParams] = useSearchParams()
  const domain = params.get('domeniu') ?? 'toate'
  const kind = params.get('tip') ?? 'toate'
  const visible = articles.filter((article) => (domain === 'toate' || normalizeSearch(article.domain) === domain) && (kind === 'toate' || normalizeSearch(article.kind) === kind))
  const domainOptions = [...new Set(articles.map((article) => normalizeSearch(article.domain)))]
  const kindOptions = [...new Set(articles.map((article) => normalizeSearch(article.kind)))]
  return (
    <>
      <Seo title={newsOnly ? 'Știri editoriale' : 'Articole'} description="Eseuri, articole editoriale și preprinturi demo publicate în Bimael." />
      <PageIntro eyebrow={newsOnly ? 'Din redacție' : 'Biblioteca de idei'} title={newsOnly ? 'Știri & însemnări' : 'Articole și studii'}><p>Fiecare material este etichetat după tip. Preprinturile și eseurile nu sunt prezentate ca lucrări evaluate peer review.</p></PageIntro>
      <section className="shell collection-layout">
        <aside className="filter-panel" aria-label="Filtre articole">
          <label htmlFor="article-domain">Domeniu<select id="article-domain" value={domain} onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value === 'toate') next.delete('domeniu'); else next.set('domeniu', event.target.value); setParams(next) }}><option value="toate">Toate domeniile</option>{domainOptions.map((option) => <option key={option} value={option}>{articles.find((article) => normalizeSearch(article.domain) === option)?.domain}</option>)}</select></label>
          <label htmlFor="article-kind">Tip<select id="article-kind" value={kind} onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value === 'toate') next.delete('tip'); else next.set('tip', event.target.value); setParams(next) }}><option value="toate">Toate tipurile</option>{kindOptions.map((option) => <option key={option} value={option}>{articles.find((article) => normalizeSearch(article.kind) === option)?.kind}</option>)}</select></label>
          <p>{visible.length} rezultate</p>
          {(domain !== 'toate' || kind !== 'toate') && <button type="button" onClick={() => setParams({})}>Resetează filtrele</button>}
        </aside>
        <div className="article-ledger">{visible.length ? visible.map((article, index) => <ArticleTeaser key={article.id} article={article} index={index + 1} />) : <EmptyState title="Niciun articol găsit">Combinația de filtre nu are rezultate.<button type="button" onClick={() => setParams({})}>Arată toate articolele</button></EmptyState>}</div>
      </section>
    </>
  )
}

export function ArticleDetailPage() {
  const { slug } = useParams()
  const article = articles.find((item) => item.slug === slug)
  const author = authors.find((item) => item.id === article?.authorId)
  const { bookmarks, toggleBookmark, user, announce } = useDemo()
  const navigate = useNavigate()
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const articleElement = document.querySelector('.article-body')
      if (!articleElement) return
      const rect = articleElement.getBoundingClientRect()
      const total = Math.max(1, articleElement.clientHeight - window.innerHeight)
      setProgress(Math.max(0, Math.min(100, ((-rect.top + 160) / total) * 100)))
    }
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [article?.id])

  if (!article || !author) return <Navigate to="/404" replace />

  const reference = `${author.name} (${new Date(article.publishedAt).getFullYear()}). ${article.title}. Bimael.`
  const copy = async (text: string, label: string) => {
    await navigator.clipboard?.writeText(text)
    announce(`${label} a fost copiată.`)
  }
  const saved = bookmarks.includes(article.id)

  return (
    <>
      <Seo title={article.title} description={article.excerpt} type="article" jsonLd={{ '@context': 'https://schema.org', '@type': article.kind === 'Studiu' ? 'ScholarlyArticle' : 'Article', headline: article.title, datePublished: article.publishedAt, author: { '@type': 'Person', name: author.name }, articleSection: article.domain }} />
      <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <article className="article-page">
        <header className="article-header shell">
          <BackLink to="/articole">Înapoi la articole</BackLink>
          <div className="article-classification"><span>{article.kind}</span><span>{article.domain}</span><StatusBadge status={article.status} /></div>
          <h1>{article.title}</h1><p className="article-subtitle">{article.subtitle}</p>
          <div className="article-authorship"><Link to={`/autori/${author.slug}/biografie`}>{author.name}</Link><span>{author.affiliation}</span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long' }).format(new Date(article.publishedAt))}</time><span>{article.readMinutes} min lectură</span></div>
          <div className="article-actions"><button type="button" aria-pressed={saved} onClick={() => user ? void toggleBookmark(article.id) : navigate('/autentificare', { state: { from: location.pathname } })}>{saved ? 'Salvat' : 'Salvează'}</button><button type="button" onClick={() => void copy(reference, 'Referința')}>Copiază referința</button><button type="button" onClick={() => window.print()}>Tipărește</button></div>
        </header>
        <div className="article-content shell">
          <aside className="article-toc"><span className="kicker">Cuprins</span><a href="#rezumat">Rezumat</a><a href="#text">Text</a><a href="#bibliografie">Bibliografie</a><details><summary>Export citare</summary><button type="button" onClick={() => void copy(reference, 'Citarea APA')}>APA</button><button type="button" onClick={() => void copy(`@article{${article.id}, title={${article.title}}, author={${author.name}}, year={2026}}`, 'Citarea BibTeX')}>BibTeX</button><button type="button" onClick={() => void copy(`TY  - JOUR\nTI  - ${article.title}\nAU  - ${author.name}\nER  -`, 'Citarea RIS')}>RIS</button></details></aside>
          <div className="article-body">
            <section id="rezumat"><span className="kicker">Rezumat</span><h2>Abstract editorial</h2><p className="abstract">{article.abstract}</p><ul className="keyword-list">{article.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>{article.doi && <p><strong>DOI:</strong> {article.doi}</p>}</section>
            <section id="text"><span className="kicker">Text integral</span>{article.body.map((paragraph, index) => <div key={paragraph}><h2>{index === 0 ? 'Întrebarea de pornire' : index === article.body.length - 1 ? 'O concluzie prudentă' : 'Între măsură și sens'}</h2><p>{paragraph}</p>{index === 0 && <blockquote>„Dovada nu vorbește singură; interpretarea îi dă o scară.”</blockquote>}</div>)}</section>
            <section id="bibliografie"><span className="kicker">Surse</span><h2>Bibliografie selectivă</h2><ol>{article.bibliography.map((entry) => <li key={entry}>{entry}</li>)}</ol><div className="academic-disclosure"><strong>Statut editorial</strong><p>{article.kind === 'Preprint' ? 'Material demonstrativ ne-evaluat peer review.' : 'Material editorial demonstrativ; publicarea pe această platformă nu certifică evaluarea academică.'}</p></div></section>
          </div>
          <aside className="margin-author"><Portrait author={author} /><Link to={`/autori/${author.slug}/articole`}>Mai multe de {author.name}</Link></aside>
        </div>
      </article>
      <section className="page-section shell related"><div className="section-rule"><div><span className="kicker">Continuă lectura</span><h2>Din același dosar</h2></div></div><div className="editorial-grid">{articles.filter((item) => item.id !== article.id).slice(0, 3).map((item) => <ArticleTeaser key={item.id} article={item} />)}</div></section>
    </>
  )
}

export function DomainsPage() {
  return (
    <><Seo title="Domenii" description="Atlasul interdisciplinar Bimael." /><PageIntro eyebrow="Taxonomie deschisă" title="Domenii"><p>Un atlas extensibil, construit pentru filtrare fără a reduce ideile la etichete.</p></PageIntro><section className="shell domain-directory">{domains.map((domain, index) => <article key={domain.slug}><span>{String(index + 1).padStart(2, '0')}</span><div><h2><Link to={`/domenii/${domain.slug}`}>{domain.name}</Link></h2><p>{domain.description}</p></div><strong>{domain.count}<small> materiale</small></strong></article>)}</section></>
  )
}

export function DomainDetailPage() {
  const { slug } = useParams()
  const domain = domains.find((item) => item.slug === slug)
  if (!domain) return <Navigate to="/404" replace />
  const query = normalizeSearch(domain.name.split(' ')[0])
  const related = articles.filter((article) => normalizeSearch(`${article.domain} ${article.keywords.join(' ')}`).includes(query))
  return <><Seo title={domain.name} description={domain.description} /><PageIntro eyebrow="Domeniu" title={domain.name}><p>{domain.description}</p></PageIntro><section className="shell page-section"><div className="section-rule"><div><span className="kicker">Selecție</span><h2>Materiale asociate</h2></div><Link to={`/cautare?domeniu=${domain.slug}`}>Caută în domeniu</Link></div>{related.length ? <div className="editorial-grid">{related.map((article) => <ArticleTeaser key={article.id} article={article} />)}</div> : <EmptyState title="Colecție în pregătire">Nu există încă articole asociate direct; folosește căutarea pentru teme înrudite.</EmptyState>}</section></>
}

interface SearchResult { id: string; type: 'autor' | 'articol' | 'eveniment' | 'produs' | 'domeniu'; title: string; description: string; to: string }

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const type = params.get('tip') ?? 'toate'
  const [draft, setDraft] = useState(query)
  const allResults = useMemo<SearchResult[]>(() => [
    ...authors.map((item) => ({ id: item.id, type: 'autor' as const, title: item.name, description: `${item.academicTitle}. ${item.fields.join(', ')}`, to: `/autori/${item.slug}/biografie` })),
    ...articles.map((item) => ({ id: item.id, type: 'articol' as const, title: item.title, description: item.excerpt, to: `/articole/${item.slug}` })),
    ...events.map((item) => ({ id: item.id, type: 'eveniment' as const, title: item.title, description: `${item.type}. ${item.description}`, to: `/evenimente/${item.slug}` })),
    ...products.map((item) => ({ id: item.id, type: 'produs' as const, title: item.title, description: item.description, to: `/produse/${item.slug}` })),
    ...domains.map((item) => ({ id: item.slug, type: 'domeniu' as const, title: item.name, description: item.description, to: `/domenii/${item.slug}` })),
  ], [])
  const normalized = normalizeSearch(query)
  const results = normalized ? allResults.filter((item) => (type === 'toate' || item.type === type) && searchMatches(`${item.title} ${item.description}`, normalized)) : []
  return (
    <><Seo title="Căutare" description="Caută autori, articole, evenimente, produse și domenii în Bimael." /><PageIntro eyebrow="Index general" title="Căutare"><p>Căutarea demo rulează local peste setul editorial curent; rezultatele comerciale nu primesc prioritate.</p></PageIntro><section className="shell search-workspace"><form role="search" onSubmit={(event) => { event.preventDefault(); const next = new URLSearchParams(params); if (draft.trim()) next.set('q', draft.trim()); else next.delete('q'); setParams(next) }}><label htmlFor="site-search">Termen de căutare</label><div><input id="site-search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="autor, idee, eveniment…" autoFocus /><button type="submit">Caută</button></div><label htmlFor="result-type">Tip rezultat<select id="result-type" value={type} onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value === 'toate') next.delete('tip'); else next.set('tip', event.target.value); setParams(next) }}><option value="toate">Toate</option><option value="autor">Autori</option><option value="articol">Articole</option><option value="eveniment">Evenimente</option><option value="produs">Produse</option><option value="domeniu">Domenii</option></select></label></form>{query ? <div className="search-results" aria-live="polite"><div className="section-rule"><div><span className="kicker">Rezultate</span><h2>{results.length} pentru „{query}”</h2></div>{(query || type !== 'toate') && <button type="button" onClick={() => { setDraft(''); setParams({}) }}>Resetează</button>}</div>{results.length ? <ol>{results.map((result) => <li key={`${result.type}-${result.id}`}><Link to={result.to}><span className="kicker">{result.type}</span><h3>{result.title}</h3><p>{result.description}</p><span aria-hidden="true">↗</span></Link></li>)}</ol> : <EmptyState title="Niciun rezultat">Încearcă un termen mai scurt sau elimină filtrul de tip.</EmptyState>}</div> : <div className="search-suggestions"><span className="kicker">Sugestii</span><h2>Începe cu o întrebare</h2><div>{['conștiință', 'emoție', 'măsurare', 'atenție'].map((suggestion) => <button type="button" key={suggestion} onClick={() => { setDraft(suggestion); setParams({ q: suggestion }) }}>{suggestion}</button>)}</div></div>}</section></>
  )
}
