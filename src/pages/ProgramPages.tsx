import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import { AgendaList } from '../components/Editorial'
import { BackLink, DemoCallout, PageIntro, Seo, StatusBadge } from '../components/Primitives'
import { authors, events, products } from '../data/seed'
import { formatEventDate, formatMoney } from '../domain/services'

export function EventsPage({ webinarsOnly = false }: { webinarsOnly?: boolean }) {
  const [mode, setMode] = useState('toate')
  const source = webinarsOnly ? events.filter((event) => event.type === 'Webinar') : events
  const visible = source.filter((event) => mode === 'toate' || event.mode === mode)
  return (
    <>
      <Seo title={webinarsOnly ? 'Webinarii' : 'Evenimente'} description="Agenda Bimael: webinarii, dezbateri, ateliere și întâlniri culturale demo." />
      <PageIntro eyebrow="Calendar Bimael" title={webinarsOnly ? 'Webinarii' : 'Evenimente & întâlniri'}><p>Orele sunt afișate în fusul Europe/Bucharest. Înscrierile și plățile funcționează într-un provider demonstrativ, fără tranzacții reale.</p></PageIntro>
      <section className="shell program-layout">
        <aside className="filter-panel"><label htmlFor="event-mode">Format<select id="event-mode" value={mode} onChange={(event) => setMode(event.target.value)}><option value="toate">Toate formatele</option><option value="Online">Online</option><option value="Fizic">Fizic</option><option value="Hibrid">Hibrid</option></select></label><p>{visible.length} întâlniri</p></aside>
        <AgendaList items={visible} title={webinarsOnly ? 'Programul webinariilor' : 'Agenda completă'} />
      </section>
    </>
  )
}

export function EventDetailPage() {
  const { slug } = useParams()
  const event = events.find((item) => item.slug === slug)
  const { user, registrations, registerForEvent, addToCart, announce } = useDemo()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!event) return <Navigate to="/404" replace />
  const date = formatEventDate(event.startsAt)
  const speakers = authors.filter((author) => event.authorIds.includes(author.id))
  const product = products.find((item) => item.slug === event.productSlug)
  const registered = registrations.includes(event.id)
  const canRegister = ['open', 'few'].includes(event.status)

  const register = async () => {
    if (!user) return navigate('/autentificare', { state: { from: location.pathname } })
    setBusy(true); setError('')
    try { await registerForEvent(event.id) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Înscrierea nu a reușit.') } finally { setBusy(false) }
  }

  return (
    <>
      <Seo title={event.title} description={event.description} type="event" jsonLd={{ '@context': 'https://schema.org', '@type': 'Event', name: event.title, startDate: event.startsAt, eventAttendanceMode: event.mode, location: { '@type': event.mode === 'Online' ? 'VirtualLocation' : 'Place', name: event.location }, eventStatus: event.status }} />
      <article className="event-page shell">
        <header className="event-hero">
          <BackLink to={event.type === 'Webinar' ? '/webinarii' : '/evenimente'}>Înapoi la program</BackLink>
          <div className="event-date-large"><time dateTime={event.startsAt}><strong>{date.day}</strong><span>{date.month}</span><small>{date.time}</small></time></div>
          <div className="event-heading"><span className="kicker">{event.type} · {event.mode}</span><h1>{event.title}</h1><p>{event.description}</p><StatusBadge status={event.status} /></div>
        </header>
        <div className="event-detail-grid">
          <section><span className="kicker">Despre întâlnire</span><h2>Un spațiu pentru întrebări bune</h2><p>Formatul combină o introducere argumentată, un interval de dialog și surse pentru continuarea lecturii. Programul și speakerii de aici sunt date fictive.</p><h3>Program</h3><ol className="timeline"><li><time>{date.time}</time><span>Introducere și termeni</span></li><li><time>+ 25 min</time><span>Argumentul central</span></li><li><time>+ 55 min</time><span>Întrebări și resurse</span></li></ol></section>
          <aside className="event-facts"><dl><div><dt>Data</dt><dd>{date.full}</dd></div><div><dt>Loc</dt><dd>{event.location}</dd></div><div><dt>Fus orar</dt><dd>{event.timezone}</dd></div><div><dt>Acces</dt><dd>{event.priceMinor ? formatMoney(event.priceMinor) : 'Gratuit'}</dd></div><div><dt>Locuri</dt><dd>{event.status === 'sold-out' ? 'Epuizate' : event.seatsLeft ? `${event.seatsLeft} disponibile` : 'Capacitate deschisă'}</dd></div></dl>
            {registered ? <div className="success-panel" role="status"><strong>Ești înscris</strong><p>Biletul demo este disponibil în cont.</p><Link to="/cont/bilete">Vezi biletul</Link></div> : event.priceMinor && product ? <button className="primary-action" type="button" onClick={() => { addToCart(product.id); navigate('/cos') }}>Adaugă accesul în coș</button> : <button className="primary-action" type="button" disabled={!canRegister || busy} onClick={() => void register()}>{busy ? 'Se înscrie…' : event.status === 'sold-out' ? 'Locuri epuizate' : event.status === 'soon' ? 'Înscrieri în curând' : event.status === 'replay' ? 'Vezi arhiva' : 'Înscrie-te gratuit'}</button>}
            <button className="secondary-action" type="button" onClick={() => { void navigator.clipboard?.writeText(`${event.title} — ${date.full}`); announce('Detaliile evenimentului au fost copiate.') }}>Copiază detaliile</button>{error && <p className="form-error" role="alert">{error}</p>}
          </aside>
        </div>
        <section className="speaker-list"><div className="section-rule"><div><span className="kicker">Participanți</span><h2>Speakeri</h2></div></div>{speakers.map((speaker) => <article key={speaker.id}><span className="speaker-monogram">{speaker.monogram}</span><div><h3><Link to={`/autori/${speaker.slug}/biografie`}>{speaker.name}</Link></h3><p>{speaker.academicTitle}</p></div></article>)}</section>
        <DemoCallout>Furnizorul video este setat pe <code>demo</code>. Nu se emite un link extern și nu se colectează date de plată reale.</DemoCallout>
      </article>
    </>
  )
}
