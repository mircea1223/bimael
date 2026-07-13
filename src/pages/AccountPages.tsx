import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import { ArticleTeaser } from '../components/Editorial'
import { DemoCallout, EmptyState, PageIntro, Seo, StatusBadge } from '../components/Primitives'
import { articles, events, products } from '../data/seed'
import { formatEventDate, formatMoney } from '../domain/services'

const demos = [
  { label: 'Membru', email: 'membru@bimael.demo', description: 'Salvare, înscriere și checkout' },
  { label: 'Autor', email: 'autor@bimael.demo', description: 'Studio și drafturi proprii' },
  { label: 'Editor', email: 'editor@bimael.demo', description: 'Revizuire și aprobare' },
  { label: 'Administrator', email: 'admin@bimael.demo', description: 'Sponsori și audit' },
]

export function LoginPage() {
  const { login, user } = useDemo()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/cont'
  const [email, setEmail] = useState('membru@bimael.demo')
  const [password, setPassword] = useState('BimaelDemo!')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to={from} replace />
  return <><Seo title="Autentificare demo" description="Intră într-un rol demonstrativ Bimael." /><section className="auth-page shell"><div className="auth-intro"><span className="kicker">Cont demonstrativ</span><h1>Intră în atelier</h1><p>Alege un rol pentru a verifica permisiunile și fluxurile protejate de server. Toate conturile folosesc aceeași parolă demonstrativă.</p><DemoCallout>Sesiunea este semnată pe server și păstrată într-un cookie HttpOnly. Utilizatorii și acțiunile sunt totuși date volatile demo, nu conturi reale.</DemoCallout></div><form className="auth-form" onSubmit={async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await login(email, password); navigate(from, { replace: true }) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Autentificarea nu a reușit.') } finally { setBusy(false) } }}><h2>Autentificare</h2><label htmlFor="login-email">Email<input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label htmlFor="login-password">Parolă<input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-action" type="submit" disabled={busy}>{busy ? 'Se verifică…' : 'Intră în cont'}</button><details><summary>Alege un rol demo</summary><div className="demo-accounts">{demos.map((demo) => <button type="button" key={demo.email} onClick={() => { setEmail(demo.email); setPassword('BimaelDemo!') }}><strong>{demo.label}</strong><span>{demo.email}</span><small>{demo.description}</small></button>)}</div></details></form></section></>
}

export function AccountPage() {
  const { section } = useParams()
  const active = section ?? 'profil'
  const { user, logout, bookmarks, registrations, orders } = useDemo()
  const navigate = useNavigate()
  if (!user) return null
  const saved = articles.filter((article) => bookmarks.includes(article.id))
  const registeredEvents = events.filter((event) => registrations.includes(event.id))
  const tabs = [['profil', 'Profil'], ['salvate', 'Salvate'], ['bilete', 'Bilete'], ['webinarii', 'Webinarii'], ['comenzi', 'Comenzi']] as const
  return <><Seo title="Cont" description="Profilul și activitatea demonstrativă Bimael." /><PageIntro eyebrow={`Rol · ${user.role}`} title={`Bun venit, ${user.name}`}><p>Datele de mai jos sunt păstrate local și pot fi resetate din bara de sus.</p></PageIntro><div className="shell account-layout"><nav className="account-nav" aria-label="Secțiuni cont">{tabs.map(([id, label]) => <Link key={id} to={id === 'profil' ? '/cont' : `/cont/${id}`} aria-current={active === id ? 'page' : undefined}>{label}</Link>)}{user.role === 'author' && <Link to="/studio">Studio autor</Link>}{user.role === 'editor' && <Link to="/editorial">Flux editorial</Link>}{user.role === 'administrator' && <Link to="/admin/sponsori">Administrare</Link>}</nav><section className="account-panel">{active === 'profil' && <><span className="kicker">Identitate</span><h2>Profil demonstrativ</h2><dl className="profile-facts"><div><dt>Nume</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Rol</dt><dd>{user.role}</dd></div><div><dt>Sesiune</dt><dd>Cookie HttpOnly · maximum 8 ore</dd></div></dl><button type="button" onClick={async () => { await logout(); navigate('/') }}>Ieși din cont</button></>}{active === 'salvate' && <><span className="kicker">Bibliotecă personală</span><h2>Materiale salvate</h2>{saved.length ? <div className="author-articles">{saved.map((article) => <ArticleTeaser key={article.id} article={article} />)}</div> : <EmptyState title="Nimic salvat">Folosește butonul „Salvează” de pe o pagină de articol.<Link to="/articole">Descoperă articole</Link></EmptyState>}</>}{active === 'bilete' && <><span className="kicker">Participare</span><h2>Bilete</h2>{registeredEvents.length ? <div className="ticket-list">{registeredEvents.map((event) => { const date = formatEventDate(event.startsAt); return <article key={event.id}><span className="ticket-stub">B</span><div><small>{event.type}</small><h3><Link to={`/evenimente/${event.slug}`}>{event.title}</Link></h3><p>{date.full}</p></div><strong>DEMO</strong></article> })}</div> : <EmptyState title="Niciun bilet">Înscrie-te la un eveniment gratuit deschis.<Link to="/evenimente">Vezi agenda</Link></EmptyState>}</>}{active === 'webinarii' && <><span className="kicker">Acces digital</span><h2>Webinarii achiziționate</h2>{orders.some((order) => order.status === 'paid' && order.lines.some((line) => products.find((product) => product.id === line.productId)?.type === 'Webinar')) ? <div className="access-panel"><strong>Acces demo activ</strong><p>Providerul video nu este configurat. În producție, aici apare replay-ul securizat.</p><StatusBadge status="paid" /></div> : <EmptyState title="Niciun acces activ">Doar comenzile demo aprobate acordă acces.<Link to="/webinarii">Explorează webinarii</Link></EmptyState>}</>}{active === 'comenzi' && <><span className="kicker">Istoric</span><h2>Comenzi</h2>{orders.length ? <div className="order-list">{orders.map((order) => <article key={order.id}><div><strong>{order.id}</strong><time dateTime={order.createdAt}>{new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.createdAt))}</time></div><StatusBadge status={order.status} /><strong>{formatMoney(order.totalMinor)}</strong></article>)}</div> : <EmptyState title="Nicio comandă">Checkout-ul demonstrativ va crea aici un istoric local.<Link to="/shop">Mergi la shop</Link></EmptyState>}</>}</section></div></>
}

export function StudioPage() {
  const { createDraft } = useDemo()
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [draftId, setDraftId] = useState(() => localStorage.getItem('bimael.lastDraft') ?? '')
  const [error, setError] = useState('')
  return <><Seo title="Studio autor" description="Editorul demonstrativ de drafturi Bimael." /><PageIntro eyebrow="Instrument de autor" title="Studio editorial"><p>Creează un draft și trimite-l în fluxul de revizuire. Autorul nu poate publica direct.</p></PageIntro><section className="shell studio-layout"><form className="editorial-form studio-form" onSubmit={async (event) => { event.preventDefault(); setError(''); try { const id = await createDraft(title, abstract); setDraftId(id); localStorage.setItem('bimael.lastDraft', id); setTitle(''); setAbstract('') } catch (reason) { setError(reason instanceof Error ? reason.message : 'Draftul nu a putut fi creat.') } }}><label htmlFor="draft-title">Titlu<input id="draft-title" value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} required /></label><label htmlFor="draft-abstract">Rezumat<textarea id="draft-abstract" value={abstract} onChange={(event) => setAbstract(event.target.value)} minLength={20} rows={8} required /></label><div className="editor-toolbar" aria-label="Metadate draft"><label htmlFor="draft-kind">Tip<select id="draft-kind" defaultValue="eseu"><option value="eseu">Eseu</option><option value="editorial">Articol editorial</option><option value="preprint">Preprint</option></select></label><label htmlFor="draft-locale">Limbă<select id="draft-locale" defaultValue="ro"><option value="ro">Română</option><option value="en">English</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-action" type="submit">Creează și trimite la revizuire</button></form><aside className="workflow-panel"><span className="kicker">Workflow</span><ol><li className="done">Draft</li><li className={draftId ? 'current' : ''}>În revizuire</li><li>Aprobat</li><li>Programat / publicat</li></ol>{draftId && <div className="success-panel"><strong>Draft creat</strong><code>{draftId}</code><p>Intră drept editor pentru a continua.</p><Link to={`/editorial/revizuire/${draftId}`}>Deschide revizuirea</Link></div>}</aside></section></>
}

export function EditorialQueuePage() {
  const lastDraft = localStorage.getItem('bimael.lastDraft')
  return <><Seo title="Flux editorial" description="Coada de revizuire demonstrativă Bimael." /><PageIntro eyebrow="Redacție" title="Flux editorial"><p>Editorul poate aproba, dar eticheta conținutului nu se transformă automat în „peer reviewed”.</p></PageIntro><section className="shell queue-list">{lastDraft ? <article><span className="kicker">În revizuire</span><h2>Draft din sesiunea curentă</h2><code>{lastDraft}</code><Link to={`/editorial/revizuire/${lastDraft}`}>Revizuiește →</Link></article> : <EmptyState title="Coada este goală">Creează mai întâi un draft din contul de autor.</EmptyState>}</section></>
}

export function ReviewPage() {
  const { draftId } = useParams()
  const { approveDraft } = useDemo()
  const [status, setStatus] = useState<'in_review' | 'approved'>('in_review')
  const [error, setError] = useState('')
  return <><Seo title="Revizuire draft" description="Decizie editorială demonstrativă." /><PageIntro eyebrow="Decizie editorială" title="Revizuire"><p>Verifică statutul și păstrează afirmațiile academice la nivelul dovezilor.</p></PageIntro><section className="shell review-sheet"><div><span className="kicker">Identificator</span><code>{draftId}</code><h2>Material demonstrativ în așteptare</h2><p>Conținutul complet ar fi încărcat din repository-ul editorial. În această vertical slice verificăm autorizarea și tranziția de status pe server.</p></div><aside><StatusBadge status={status} /><label htmlFor="review-note">Notă editorială<textarea id="review-note" rows={5} defaultValue="Structura este coerentă. Publicarea nu implică peer review." /></label><button className="primary-action" type="button" disabled={status === 'approved'} onClick={async () => { if (!draftId) return; setError(''); try { await approveDraft(draftId); setStatus('approved') } catch (reason) { setError(reason instanceof Error ? reason.message : 'Decizia nu a fost salvată.') } }}>{status === 'approved' ? 'Aprobat' : 'Aprobă editorial'}</button>{error && <p className="form-error" role="alert">{error}</p>}</aside></section></>
}

export function AdminSponsorsPage() {
  const { sponsors, addSponsor } = useDemo()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  return <><Seo title="Administrare sponsori" description="Administrarea demonstrativă a partenerilor Bimael." /><PageIntro eyebrow="Administrare" title="Sponsori & parteneri"><p>Modificările sunt autorizate pe server și reflectate imediat în banda publică locală.</p></PageIntro><section className="shell admin-grid"><div className="admin-table" role="table" aria-label="Sponsori"><div role="row" className="admin-head"><span role="columnheader">Nume</span><span role="columnheader">Nivel</span><span role="columnheader">Status</span></div>{sponsors.map((sponsor) => <div role="row" key={sponsor.id}><strong role="cell">{sponsor.name}</strong><span role="cell">{sponsor.tier}</span><span role="cell">Activ</span></div>)}</div><form className="editorial-form" onSubmit={async (event) => { event.preventDefault(); setError(''); try { await addSponsor(name); setName('') } catch (reason) { setError(reason instanceof Error ? reason.message : 'Sponsorul nu a putut fi adăugat.') } }}><h2>Adaugă un colaborator</h2><label htmlFor="sponsor-name">Nume instituție<input id="sponsor-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-action" type="submit">Adaugă și publică</button><small>Acțiunea produce un identificator de audit pe serverul demo.</small></form></section></>
}
