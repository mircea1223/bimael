import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import { ProductCard } from '../components/Editorial'
import { BackLink, DemoCallout, EmptyState, PageIntro, Seo, StatusBadge } from '../components/Primitives'
import { products } from '../data/seed'
import { cartTotal, formatMoney } from '../domain/services'

export function ShopPage() {
  const [type, setType] = useState('toate')
  const visible = products.filter((product) => type === 'toate' || product.type === type)
  return <><Seo title="Shop cultural" description="Cărți, ebook-uri și acces la webinarii în shop-ul demonstrativ Bimael." /><PageIntro eyebrow="Librărie & atelier" title="Shop cultural"><p>Commerce-ul susține programul editorial fără a domina. Checkout-ul folosește exclusiv scenarii de plată demo.</p></PageIntro><section className="shell shop-toolbar"><label htmlFor="product-type">Tip produs<select id="product-type" value={type} onChange={(event) => setType(event.target.value)}><option value="toate">Toate</option><option value="Carte">Cărți</option><option value="Ebook">Ebook-uri</option><option value="Webinar">Webinarii</option></select></label><span>{visible.length} ediții</span></section><section className="shell product-grid shop-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</section></>
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)
  const { addToCart } = useDemo()
  const navigate = useNavigate()
  if (!product) return <Navigate to="/404" replace />
  return <><Seo title={product.title} description={product.description} type="product" jsonLd={{ '@context': 'https://schema.org', '@type': 'Product', name: product.title, description: product.description, offers: { '@type': 'Offer', price: product.priceMinor / 100, priceCurrency: product.currency, availability: product.stock === 0 ? 'OutOfStock' : 'InStock' } }} /><article className="product-page shell"><BackLink to="/shop">Înapoi la shop</BackLink><div className="product-detail"><div className="product-art"><span className="kicker">Ediția Bimael · Demo</span><strong>{product.type === 'Carte' ? 'B' : product.type === 'Webinar' ? 'W' : 'E'}</strong><em>{product.type}</em><small>Arhivă · Dialog · Lectură</small></div><div className="product-info"><span className="kicker">{product.type}</span><h1>{product.title}</h1><p className="product-lead">{product.description}</p><dl><div><dt>Format</dt><dd>{product.type === 'Carte' ? 'Tipărit' : 'Digital'}</dd></div><div><dt>Disponibilitate</dt><dd>{product.stock === null ? 'Acces digital' : `${product.stock} exemplare demo`}</dd></div><div><dt>Livrare</dt><dd>{product.type === 'Carte' ? 'Calculată doar demonstrativ' : 'În contul demo'}</dd></div></dl><strong className="product-price">{formatMoney(product.priceMinor)}</strong><button className="primary-action" type="button" disabled={product.stock === 0} onClick={() => { addToCart(product.id); navigate('/cos') }}>Adaugă în coș</button><DemoCallout>Produs fictiv. Nicio comandă din acest mediu nu generează livrare, factură sau debitare.</DemoCallout></div></div></article></>
}

export function CartPage() {
  const { cart, setQuantity } = useDemo()
  const lines = cart.map((line) => ({ ...line, product: products.find((item) => item.id === line.productId) })).filter((line) => line.product)
  const total = cartTotal(cart, products)
  return <><Seo title="Coș" description="Coșul demonstrativ Bimael." /><PageIntro eyebrow="Comanda ta" title="Coș"><p>Produsele rămân local în acest browser până când finalizezi sau resetezi datele demo.</p></PageIntro><section className="shell cart-layout">{lines.length ? <><div className="cart-lines">{lines.map(({ product, quantity }) => product && <article key={product.id}><div className="mini-product-mark">{product.type.charAt(0)}</div><div><span className="kicker">{product.type}</span><h2><Link to={`/produse/${product.slug}`}>{product.title}</Link></h2><p>{formatMoney(product.priceMinor)} / unitate</p></div><label htmlFor={`qty-${product.id}`}>Cantitate<input id={`qty-${product.id}`} type="number" min="0" max="20" value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))} /></label><strong>{formatMoney(product.priceMinor * quantity)}</strong><button type="button" onClick={() => setQuantity(product.id, 0)}>Elimină</button></article>)}</div><aside className="cart-summary"><span className="kicker">Sumar</span><dl><div><dt>Subtotal</dt><dd>{formatMoney(total)}</dd></div><div><dt>Livrare</dt><dd>Calcul demo</dd></div><div className="total"><dt>Total estimat</dt><dd>{formatMoney(total)}</dd></div></dl><Link className="primary-action" to="/checkout">Continuă la checkout</Link><Link className="text-link" to="/shop">Continuă cumpărăturile</Link></aside></> : <EmptyState title="Coșul este gol">Alege o carte, un ebook sau un webinar din shop.<Link className="primary-action" to="/shop">Explorează shop-ul</Link></EmptyState>}</section></>
}

export function CheckoutPage() {
  const { cart, checkout } = useDemo()
  const [scenario, setScenario] = useState<'approved' | 'pending' | 'failed'>('approved')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submissionStarted, setSubmissionStarted] = useState(false)
  const navigate = useNavigate()
  const total = cartTotal(cart, products)
  if (!cart.length && !submissionStarted) return <Navigate to="/cos" replace />
  return <><Seo title="Checkout demo" description="Finalizează o comandă demonstrativă Bimael, fără plată reală." /><PageIntro eyebrow="Pas final" title="Checkout demonstrativ"><p>Alegi explicit rezultatul providerului. Nu introduci și nu transmiți date de card.</p></PageIntro><form className="shell checkout-grid" onSubmit={async (event) => { event.preventDefault(); setSubmissionStarted(true); setBusy(true); setError(''); try { const order = await checkout(scenario); navigate(`/checkout/confirmare/${order.id}`, { replace: true }) } catch (reason) { setSubmissionStarted(false); setError(reason instanceof Error ? reason.message : 'Checkout-ul nu a reușit.') } finally { setBusy(false) } }}><div className="checkout-fields"><section><span className="kicker">01 · Identitate</span><h2>Date de facturare demo</h2><div className="form-grid"><label htmlFor="billing-name">Nume complet<input id="billing-name" autoComplete="name" required /></label><label htmlFor="billing-email">Email<input id="billing-email" type="email" autoComplete="email" required /></label><label htmlFor="billing-country">Țară<select id="billing-country" defaultValue="RO"><option value="RO">România</option><option value="EU">Alt stat UE</option></select></label></div></section><section><span className="kicker">02 · Provider mock</span><h2>Scenariu de plată</h2><fieldset><legend>Alege răspunsul controlat al adapterului demo</legend>{([{ id: 'approved', title: 'Aprobat', text: 'Creează comanda și acordă accesul digital demo.' }, { id: 'pending', title: 'În așteptare', text: 'Păstrează coșul și nu acordă acces.' }, { id: 'failed', title: 'Refuzat', text: 'Simulează un eșec fără debitare.' }] as const).map((option) => <label className="scenario-option" key={option.id}><input type="radio" name="scenario" value={option.id} checked={scenario === option.id} onChange={() => setScenario(option.id)} /><span><strong>{option.title}</strong><small>{option.text}</small></span></label>)}</fieldset></section><label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Înțeleg că aceasta este o simulare și accept termenii mediului demo.</span></label>{error && <p className="form-error" role="alert">{error}</p>}</div><aside className="checkout-summary"><span className="kicker">Comandă</span>{cart.map((line) => { const product = products.find((item) => item.id === line.productId); return product ? <div key={line.productId}><span>{product.title} × {line.quantity}</span><strong>{formatMoney(product.priceMinor * line.quantity)}</strong></div> : null })}<div className="checkout-total"><span>Total</span><strong>{formatMoney(total)}</strong></div><button className="primary-action" type="submit" disabled={!consent || busy}>{busy ? 'Se procesează…' : 'Rulează plata demo'}</button><small>Provider: <code>demo</code> · 0 date de card</small></aside></form></>
}

export function CheckoutConfirmationPage() {
  const { orderId } = useParams()
  const { orders } = useDemo()
  const order = orders.find((item) => item.id === orderId)
  if (!order) return <Navigate to="/cont/comenzi" replace />
  return <><Seo title="Rezultat checkout" description="Starea comenzii demonstrative Bimael." /><section className="shell confirmation-page"><span className="confirmation-mark" aria-hidden="true">{order.status === 'paid' ? '✓' : order.status === 'pending' ? '…' : '×'}</span><StatusBadge status={order.status} /><h1>{order.status === 'paid' ? 'Comandă demo aprobată' : order.status === 'pending' ? 'Plată demo în așteptare' : 'Plată demo refuzată'}</h1><p>{order.status === 'paid' ? 'Accesul digital eligibil a fost adăugat în contul local.' : 'Nu s-a acordat acces și nu a avut loc nicio debitare.'}</p><dl><div><dt>Număr</dt><dd>{order.id}</dd></div><div><dt>Total</dt><dd>{formatMoney(order.totalMinor)}</dd></div><div><dt>Provider</dt><dd>Adapter demo explicit</dd></div></dl><div><Link className="primary-action" to="/cont/comenzi">Vezi comenzile</Link>{order.status !== 'paid' && <Link className="secondary-action" to="/checkout">Încearcă alt scenariu</Link>}<Link className="text-link" to="/">Înapoi la copertă</Link></div></section></>
}
