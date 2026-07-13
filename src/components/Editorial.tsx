import { Link } from 'react-router-dom'
import portrait from '../assets/portrait-central.webp'
import { useDemo } from '../app/DemoContext'
import type { Article, Author, CulturalEvent, Product } from '../domain/types'
import { formatEventDate, formatMoney } from '../domain/services'
import { StatusBadge } from './Primitives'

export function Portrait({ author, priority = false }: { author: Author; priority?: boolean }) {
  return (
    <figure className={`portrait portrait-${author.portrait}`}>
      <div className="portrait-frame" aria-hidden="true">
        <svg viewBox="0 0 420 460" focusable="false">
          <path d="M48 373C33 278 55 133 139 57M362 373c15-95-7-240-91-316" />
          <path d="M75 410c83 24 187 24 270 0M91 32c81-27 157-27 238 0" />
          <path className="ornament" d="M42 194c22 4 31 21 36 41-20-5-35-17-36-41Zm336 0c-22 4-31 21-36 41 20-5 35-17 36-41Z" />
        </svg>
      </div>
      {author.portrait === 'ink' ? (
        <img src={portrait} width="2700" height="2330" alt={`Portret în tuș al autorului demo ${author.name}`} fetchPriority={priority ? 'high' : 'auto'} />
      ) : (
        <div className="monogram-portrait" role="img" aria-label={`Monogramă-portret pentru autorul demo ${author.name}`}>
          <span>{author.monogram}</span>
          <svg viewBox="0 0 220 260" aria-hidden="true"><path d="M54 224c4-48 26-72 57-72s55 24 58 72M76 102c0-35 15-65 36-65s36 30 36 65c0 28-15 51-36 51s-36-23-36-51ZM62 89c16-6 34-21 45-45 12 25 28 38 52 48" /></svg>
        </div>
      )}
      <figcaption>{author.name} · portret demonstrativ</figcaption>
    </figure>
  )
}

export function EditorialCartouche({ children }: { children: React.ReactNode }) {
  return <div className="cartouche"><span className="kicker">Notă de margine</span><p>{children}</p></div>
}

export function ArticleTeaser({ article, index }: { article: Article; index?: number }) {
  return (
    <article className="article-teaser">
      <div className="teaser-meta"><span>{index ? String(index).padStart(2, '0') : article.kind}</span><span>{article.domain}</span></div>
      <h3><Link to={`/articole/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <footer><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long' }).format(new Date(article.publishedAt))}</time><span>{article.readMinutes} min</span></footer>
    </article>
  )
}

export function AgendaList({ items, title = 'Agenda apropiată', limit }: { items: CulturalEvent[]; title?: string; limit?: number }) {
  const visible = limit ? items.slice(0, limit) : items
  return (
    <section className="agenda-list" aria-labelledby={`agenda-${title.replace(/\s/g, '-').toLowerCase()}`}>
      <header><span className="kicker">Calendar</span><h2 id={`agenda-${title.replace(/\s/g, '-').toLowerCase()}`}>{title}</h2><span>{visible.length} întâlniri</span></header>
      <ol>
        {visible.map((event) => {
          const date = formatEventDate(event.startsAt)
          return (
            <li key={event.id}>
              <Link to={`/evenimente/${event.slug}`}>
                <time dateTime={event.startsAt} className="agenda-date"><strong>{date.day}</strong><span>{date.month}</span></time>
                <div className="agenda-copy">
                  <div><span className="kicker">{event.type}</span><time dateTime={event.startsAt}>{date.time}</time></div>
                  <h3>{event.title}</h3>
                  <p>{event.mode} · {event.location}</p>
                  <StatusBadge status={event.status} />
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
      {limit && <Link className="text-link" to="/evenimente">Vezi toată agenda <span aria-hidden="true">→</span></Link>}
    </section>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useDemo()
  return (
    <article className="product-card">
      <Link to={`/produse/${product.slug}`} className="product-plate" aria-label={`Vezi ${product.title}`}>
        <span className="kicker">{product.type}</span>
        <span className="product-mark" aria-hidden="true">{product.type === 'Carte' ? 'B' : product.type === 'Webinar' ? 'W' : 'E'}</span>
        <small>Ediție demonstrativă</small>
      </Link>
      <div className="product-copy"><h3><Link to={`/produse/${product.slug}`}>{product.title}</Link></h3><p>{product.description}</p></div>
      <footer><strong>{formatMoney(product.priceMinor)}</strong><button type="button" onClick={() => addToCart(product.id)}>Adaugă în coș</button></footer>
    </article>
  )
}
