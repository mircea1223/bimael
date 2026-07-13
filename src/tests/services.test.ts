import { describe, expect, it } from 'vitest'
import { products } from '../data/seed'
import { authorize, cartTotal, normalizeSearch, searchMatches } from '../domain/services'

describe('serviciile de domeniu', () => {
  it('calculează totalul în unități monetare minore', () => {
    expect(cartTotal([{ productId: 'p-carte', quantity: 2 }, { productId: 'p-ebook', quantity: 1 }], products)).toBe(20_700)
  })

  it('ignoră cantitățile negative și produsele inexistente', () => {
    expect(cartTotal([{ productId: 'p-carte', quantity: -2 }, { productId: 'missing', quantity: 5 }], products)).toBe(0)
  })

  it('normalizează diacriticele pentru căutare', () => {
    expect(normalizeSearch('  Conștiință ȘI Emoție  ')).toBe('constiinta si emotie')
    expect(searchMatches('Emoția ca formă de cunoaștere', 'emoție')).toBe(true)
  })

  it('aplică matricea RBAC', () => {
    expect(authorize('author', 'article:create')).toBe(true)
    expect(authorize('author', 'article:review')).toBe(false)
    expect(authorize('administrator', 'sponsor:manage')).toBe(true)
    expect(authorize(undefined, 'account:read')).toBe(false)
  })
})
