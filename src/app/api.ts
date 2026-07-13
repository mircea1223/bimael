import { z } from 'zod'
import type { DemoUser } from '../domain/types'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['member', 'author', 'editor', 'administrator']),
})

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Bimael-Request': '1',
      ...init?.headers,
    },
  })
  const payload = (await response.json().catch(() => ({ message: 'Răspuns invalid de la server.' }))) as {
    message?: string
  } & T
  if (!response.ok) throw new Error(payload.message ?? 'Operațiunea nu a putut fi finalizată.')
  return payload
}

export async function getSession(): Promise<DemoUser | null> {
  const payload = await request<{ user: unknown }>('/session')
  return payload.user ? userSchema.parse(payload.user) : null
}

export async function loginRequest(email: string, password: string): Promise<DemoUser> {
  const payload = await request<{ user: unknown }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return userSchema.parse(payload.user)
}

export async function logoutRequest(): Promise<void> {
  await request('/auth/logout', { method: 'POST', body: '{}' })
}

export async function bookmarkRequest(articleId: string): Promise<{ saved: boolean }> {
  return request('/bookmarks', { method: 'POST', body: JSON.stringify({ articleId }) })
}

export async function registerRequest(eventId: string): Promise<{ ticketId: string; status: string }> {
  return request('/registrations', { method: 'POST', body: JSON.stringify({ eventId }) })
}

export async function checkoutRequest(input: {
  lines: Array<{ productId: string; quantity: number }>
  paymentScenario: 'approved' | 'pending' | 'failed'
}): Promise<{ order: { id: string; status: 'paid' | 'pending' | 'failed'; totalMinor: number; createdAt: string } }> {
  return request('/checkout', { method: 'POST', body: JSON.stringify(input) })
}

export async function newsletterRequest(email: string): Promise<{ duplicate: boolean; message: string }> {
  return request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function createDraftRequest(title: string, abstract: string): Promise<{ draftId: string; status: string }> {
  return request('/author/drafts', { method: 'POST', body: JSON.stringify({ title, abstract }) })
}

export async function reviewDraftRequest(draftId: string): Promise<{ status: string }> {
  return request(`/editorial/reviews/${draftId}`, { method: 'POST', body: JSON.stringify({ decision: 'approve' }) })
}

export async function addSponsorRequest(name: string): Promise<{ sponsor: { id: string; name: string; tier: 'colaborator' } }> {
  return request('/admin/sponsors', { method: 'POST', body: JSON.stringify({ name }) })
}
