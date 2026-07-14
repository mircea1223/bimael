import crypto from 'node:crypto'
import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import { z } from 'zod'
import type { DemoUser, Role } from '../src/domain/types'
import { articles, authors, events, products } from '../src/data/seed.js'
import { integrations } from './integrations.js'

interface ServerUser extends DemoUser { passwordHash: string }
interface AuthedRequest extends Request { actor?: ServerUser }

const SESSION_COOKIE = 'bimael_session'
const SESSION_MAX_AGE = 60 * 60 * 8
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET este obligatoriu în producție.')
}
const secret = process.env.SESSION_SECRET ?? 'bimael-local-demo-secret-change-me'
const salt = 'bimael-demo-v2'

function hashPassword(password: string): string {
  return crypto.scryptSync(password, salt, 32).toString('hex')
}

const demoPasswordHash = hashPassword('BimaelDemo!')
const users: ServerUser[] = [
  { id: 'u-member', name: 'Irina Cititor', email: 'membru@bimael.demo', role: 'member', passwordHash: demoPasswordHash },
  { id: 'u-author', name: 'Marian Bituics', email: 'autor@bimael.demo', role: 'author', passwordHash: demoPasswordHash },
  { id: 'u-editor', name: 'Sofia Editor', email: 'editor@bimael.demo', role: 'editor', passwordHash: demoPasswordHash },
  { id: 'u-admin', name: 'Daria Administrator', email: 'admin@bimael.demo', role: 'administrator', passwordHash: demoPasswordHash },
]

const bookmarks = new Map<string, Set<string>>()
const registrations = new Map<string, Map<string, string>>()
const newsletter = new Set<string>()
const drafts = new Map<string, { id: string; ownerId: string; title: string; abstract: string; status: string }>()
const sponsors = new Map<string, { id: string; name: string; tier: 'colaborator' }>()
const loginRate = new Map<string, { count: number; resetAt: number }>()

const eventState: Record<string, { status: string; capacity: number | null }> = {
  'ev-atentie': { status: 'open', capacity: 42 },
  'ev-libet': { status: 'few', capacity: 7 },
  'ev-qualia': { status: 'soon', capacity: null },
  'ev-arhiva': { status: 'sold-out', capacity: 0 },
  'ev-replay': { status: 'replay', capacity: null },
}

function publicUser(user: ServerUser): DemoUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

function signSession(user: ServerUser): string {
  const body = Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url')
  return `${body}.${signature}`
}

function readCookie(req: Request, name: string): string | undefined {
  const item = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return item ? decodeURIComponent(item.slice(name.length + 1)) : undefined
}

function verifySession(token: string | undefined): ServerUser | undefined {
  if (!token) return undefined
  const [body, signature] = token.split('.')
  if (!body || !signature) return undefined
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url')
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return undefined
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { sub: string; exp: number }
    if (payload.exp < Math.floor(Date.now() / 1000)) return undefined
    return users.find((user) => user.id === payload.sub)
  } catch {
    return undefined
  }
}

function actorMiddleware(req: AuthedRequest, _res: Response, next: NextFunction) {
  req.actor = verifySession(readCookie(req, SESSION_COOKIE))
  next()
}

function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.actor) return res.status(401).json({ message: 'Autentificarea este necesară.' })
    if (!roles.includes(req.actor.role)) return res.status(403).json({ message: 'Rolul curent nu permite această acțiune.' })
    next()
  }
}

function validateSameOrigin(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  if (req.header('X-Bimael-Request') !== '1') return res.status(403).json({ message: 'Cerere respinsă de protecția CSRF.' })
  next()
}

function parseBody<T>(schema: z.ZodType<T>, req: Request, res: Response): T | undefined {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? 'Date invalide.' })
    return undefined
  }
  return parsed.data
}

function xml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", ...(process.env.NODE_ENV === 'production' ? [] : ["'unsafe-inline'", "'unsafe-eval'"])],
        connectSrc: ["'self'", ...(process.env.NODE_ENV === 'production' ? [] : ['ws:', 'http:'])],
      },
    },
    crossOriginEmbedderPolicy: false,
  }))
  app.use(express.json({ limit: '64kb' }))
  app.use(actorMiddleware)
  app.use('/api', validateSameOrigin)

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', mode: 'demo', timestamp: new Date().toISOString() }))
  app.get('/api/session', (req: AuthedRequest, res) => res.json({ user: req.actor ? publicUser(req.actor) : null }))

  app.post('/api/auth/login', (req, res) => {
    const rateKey = req.ip ?? 'unknown'
    const now = Date.now()
    const currentRate = loginRate.get(rateKey)
    const rate = !currentRate || currentRate.resetAt <= now ? { count: 0, resetAt: now + 10 * 60_000 } : currentRate
    rate.count += 1
    loginRate.set(rateKey, rate)
    if (rate.count > 20) {
      res.setHeader('Retry-After', Math.ceil((rate.resetAt - now) / 1000))
      return res.status(429).json({ message: 'Prea multe încercări. Reîncearcă după expirarea ferestrei demo.' })
    }
    const body = parseBody(z.object({ email: z.string().email(), password: z.string().min(8).max(128) }), req, res)
    if (!body) return
    const user = users.find((candidate) => candidate.email === body.email.toLocaleLowerCase('ro-RO'))
    const suppliedHash = hashPassword(body.password)
    if (!user || !crypto.timingSafeEqual(Buffer.from(user.passwordHash), Buffer.from(suppliedHash))) {
      return res.status(401).json({ message: 'Email sau parolă demo incorectă.' })
    }
    res.cookie(SESSION_COOKIE, signSession(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'false' ? false : process.env.NODE_ENV === 'production',
      maxAge: SESSION_MAX_AGE * 1000,
      path: '/',
    })
    return res.json({ user: publicUser(user) })
  })

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'lax', path: '/' })
    res.json({ ok: true })
  })

  app.post('/api/newsletter', async (req, res) => {
    const body = parseBody(z.object({ email: z.string().email() }), req, res)
    if (!body) return
    const normalized = body.email.toLocaleLowerCase('ro-RO')
    const duplicate = newsletter.has(normalized)
    newsletter.add(normalized)
    await integrations.email.recordSubscription(normalized)
    res.status(duplicate ? 200 : 201).json({ duplicate, message: duplicate ? 'Adresa exista deja în registrul demo.' : 'Adresa a fost salvată numai în registrul demo local.' })
  })

  app.post('/api/bookmarks', requireRole('member', 'author', 'editor', 'administrator'), (req: AuthedRequest, res) => {
    const body = parseBody(z.object({ articleId: z.string().min(1).max(80) }), req, res)
    if (!body || !req.actor) return
    const saved = bookmarks.get(req.actor.id) ?? new Set<string>()
    const nowSaved = !saved.has(body.articleId)
    if (nowSaved) saved.add(body.articleId)
    else saved.delete(body.articleId)
    bookmarks.set(req.actor.id, saved)
    res.json({ saved: nowSaved })
  })

  app.post('/api/registrations', requireRole('member', 'author', 'editor', 'administrator'), (req: AuthedRequest, res) => {
    const body = parseBody(z.object({ eventId: z.string().min(1).max(80) }), req, res)
    if (!body || !req.actor) return
    const event = eventState[body.eventId]
    if (!event) return res.status(404).json({ message: 'Evenimentul nu există.' })
    if (['sold-out', 'ended', 'replay', 'soon'].includes(event.status) || event.capacity === 0) return res.status(409).json({ message: 'Înscrierea nu este disponibilă pentru acest eveniment.' })
    const participants = registrations.get(body.eventId) ?? new Map<string, string>()
    const existingTicket = participants.get(req.actor.id)
    if (existingTicket) return res.json({ ticketId: existingTicket, status: 'confirmed', alreadyRegistered: true })
    const ticketId = `TKT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    participants.set(req.actor.id, ticketId)
    registrations.set(body.eventId, participants)
    if (event.capacity !== null) event.capacity = Math.max(0, event.capacity - 1)
    res.status(201).json({ ticketId, status: 'confirmed', alreadyRegistered: false })
  })

  app.post('/api/checkout', requireRole('member', 'author', 'editor', 'administrator'), async (req: AuthedRequest, res) => {
    const body = parseBody(z.object({
      lines: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1),
      paymentScenario: z.enum(['approved', 'pending', 'failed']),
    }), req, res)
    if (!body) return
    const totalMinor = body.lines.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.productId)
      return sum + line.quantity * (product?.priceMinor ?? 0)
    }, 0)
    const payment = await integrations.payment.authorize({ amountMinor: totalMinor, currency: 'RON', scenario: body.paymentScenario })
    const status = payment.status
    res.status(201).json({
      order: { id: `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, status, totalMinor, createdAt: new Date().toISOString() },
      accessGranted: status === 'paid',
      provider: integrations.payment.provider,
      providerRef: payment.providerRef,
    })
  })

  app.post('/api/author/drafts', requireRole('author', 'editor', 'administrator'), (req: AuthedRequest, res) => {
    const body = parseBody(z.object({ title: z.string().min(5).max(180), abstract: z.string().min(20).max(1200) }), req, res)
    if (!body || !req.actor) return
    const id = `draft-${crypto.randomUUID().slice(0, 8)}`
    drafts.set(id, { id, ownerId: req.actor.id, title: body.title, abstract: body.abstract, status: 'in_review' })
    res.status(201).json({ draftId: id, status: 'in_review' })
  })

  app.post('/api/editorial/reviews/:id', requireRole('editor', 'administrator'), (req, res) => {
    const body = parseBody(z.object({ decision: z.literal('approve') }), req, res)
    if (!body) return
    const draft = drafts.get(String(req.params.id))
    if (!draft) return res.status(404).json({ message: 'Draftul nu a fost găsit în sesiunea serverului demo.' })
    draft.status = 'approved'
    res.json({ status: draft.status, auditId: `audit-${crypto.randomUUID().slice(0, 8)}` })
  })

  app.post('/api/admin/sponsors', requireRole('administrator'), (req, res) => {
    const body = parseBody(z.object({ name: z.string().min(2).max(120) }), req, res)
    if (!body) return
    const id = `s-${crypto.randomUUID().slice(0, 8)}`
    const sponsor = { id, name: body.name, tier: 'colaborator' as const }
    sponsors.set(id, sponsor)
    res.status(201).json({ sponsor, auditId: `audit-${crypto.randomUUID().slice(0, 8)}` })
  })

  app.use('/api', (_req, res) => res.status(404).json({ message: 'Endpoint API inexistent.' }))

  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /cont\nDisallow: /studio\nDisallow: /editorial\nDisallow: /admin\nSitemap: /sitemap.xml\n')
  })
  app.get('/sitemap.xml', (req, res) => {
    const base = (process.env.APP_BASE_URL ?? `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
    const paths = ['/', '/prezentare', '/stiri', '/dezbateri', '/domenii', '/povesti', '/contact', '/autori', '/articole', '/evenimente', '/webinarii', '/proiecte', '/shop', '/arhiva', '/institutii', ...authors.map((author) => `/autori/${author.slug}/biografie`), ...articles.map((article) => `/articole/${article.slug}`), ...events.map((event) => `/evenimente/${event.slug}`), ...products.map((product) => `/produse/${product.slug}`)]
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${xml(`${base}${path}`)}</loc></url>`).join('')}</urlset>`)
  })
  app.get('/rss.xml', (req, res) => {
    const base = (process.env.APP_BASE_URL ?? `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
    const items = articles.map((article) => `<item><title>${xml(article.title)}</title><link>${xml(`${base}/articole/${article.slug}`)}</link><description>${xml(article.excerpt)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><guid>${xml(`${base}/articole/${article.slug}`)}</guid></item>`).join('')
    res.type('application/rss+xml').send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Bimael</title><link>${xml(base)}</link><description>Eseuri și cercetare — conținut demonstrativ</description>${items}</channel></rss>`)
  })

  return app
}
