import type { CartLine, Product, Role } from './types'

export const permissions = {
  'article:create': ['author', 'editor', 'administrator'],
  'article:review': ['editor', 'administrator'],
  'sponsor:manage': ['administrator'],
  'account:read': ['member', 'author', 'editor', 'administrator'],
} as const satisfies Record<string, readonly Role[]>

export type Permission = keyof typeof permissions

export function authorize(role: Role | undefined, permission: Permission): boolean {
  return role ? permissions[permission].includes(role as never) : false
}

export function cartTotal(lines: CartLine[], catalog: Product[]): number {
  return lines.reduce((sum, line) => {
    const product = catalog.find((item) => item.id === line.productId)
    return sum + (product?.priceMinor ?? 0) * Math.max(0, line.quantity)
  }, 0)
}

export function formatMoney(minor: number, currency = 'RON'): string {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency }).format(minor / 100)
}

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('ro-RO')
    .trim()
}

export function searchMatches(value: string, query: string): boolean {
  const haystack = normalizeSearch(value)
  const needle = normalizeSearch(query)
  if (!needle) return true
  if (haystack.includes(needle)) return true
  const words = haystack.split(/\s+/)
  return needle.split(/\s+/).every((token) => {
    const stem = token.slice(0, Math.max(4, token.length - 1))
    return words.some((word) => word.startsWith(stem))
  })
}

export function formatEventDate(iso: string): { day: string; month: string; time: string; full: string } {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat('ro-RO', { day: '2-digit', timeZone: 'Europe/Bucharest' }).format(date)
  const month = new Intl.DateTimeFormat('ro-RO', { month: 'short', timeZone: 'Europe/Bucharest' }).format(date).replace('.', '')
  const time = new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' }).format(date)
  const full = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Bucharest' }).format(date)
  return { day, month, time, full }
}
