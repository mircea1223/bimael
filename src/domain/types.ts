export type Role = 'member' | 'author' | 'editor' | 'administrator'

export type AuthorSection =
  | 'biografie'
  | 'articole'
  | 'webinarii'
  | 'evenimente'
  | 'proiecte'
  | 'shop'
  | 'arhiva'
  | 'contact'

export interface Author {
  id: string
  slug: string
  name: string
  academicTitle: string
  affiliation: string
  orcid?: string
  fields: string[]
  quote: string
  cartouche: string
  bio: string
  portrait: 'ink' | 'monogram'
  monogram: string
  counts: Partial<Record<AuthorSection, number>>
}

export type ContentKind = 'Eseu' | 'Articol editorial' | 'Studiu' | 'Preprint' | 'Recenzie'

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  abstract: string
  body: string[]
  kind: ContentKind
  authorId: string
  domain: string
  publishedAt: string
  readMinutes: number
  keywords: string[]
  status: 'publicat' | 'in_review' | 'draft'
  doi?: string
  bibliography: string[]
}

export type EventStatus = 'open' | 'few' | 'sold-out' | 'soon' | 'ended' | 'replay'

export interface CulturalEvent {
  id: string
  slug: string
  type: 'Webinar' | 'Dezbatere' | 'Conferință' | 'Atelier' | 'Lansare'
  title: string
  description: string
  startsAt: string
  timezone: 'Europe/Bucharest'
  mode: 'Online' | 'Fizic' | 'Hibrid'
  location: string
  status: EventStatus
  priceMinor: number
  seatsLeft?: number
  authorIds: string[]
  productSlug?: string
}

export interface Product {
  id: string
  slug: string
  title: string
  type: 'Carte' | 'Ebook' | 'Webinar' | 'Curs'
  description: string
  priceMinor: number
  currency: 'RON'
  stock: number | null
  eventId?: string
}

export interface Sponsor {
  id: string
  name: string
  tier: 'instituțional' | 'partener' | 'colaborator'
}

export interface DemoUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface DemoOrder {
  id: string
  status: 'paid' | 'pending' | 'failed'
  totalMinor: number
  createdAt: string
  lines: CartLine[]
}
