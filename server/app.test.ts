// @vitest-environment node
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app'

const csrf = { 'X-Bimael-Request': '1' }

async function login(email: string) {
  const agent = request.agent(createApp())
  const response = await agent.post('/api/auth/login').set(csrf).send({ email, password: 'BimaelDemo!' })
  expect(response.status).toBe(200)
  return agent
}

describe('API modular monolith', () => {
  it('expune health și headers de securitate', async () => {
    const response = await request(createApp()).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body.mode).toBe('demo')
    expect(response.headers['content-security-policy']).toContain("default-src 'self'")
  })

  it('creează o sesiune HttpOnly și o poate închide', async () => {
    const agent = await login('membru@bimael.demo')
    const session = await agent.get('/api/session')
    expect(session.body.user.role).toBe('member')
    const logout = await agent.post('/api/auth/logout').set(csrf).send({})
    expect(logout.status).toBe(200)
    expect((await agent.get('/api/session')).body.user).toBeNull()
  })

  it('blochează operațiile admin pentru membri și le permite administratorului', async () => {
    const member = await login('membru@bimael.demo')
    expect((await member.post('/api/admin/sponsors').set(csrf).send({ name: 'Institut demo' })).status).toBe(403)
    const admin = await login('admin@bimael.demo')
    const response = await admin.post('/api/admin/sponsors').set(csrf).send({ name: 'Institut demo' })
    expect(response.status).toBe(201)
    expect(response.body.sponsor.name).toBe('Institut demo')
  })

  it('calculează prețul checkout pe server și nu acordă acces pentru pending', async () => {
    const member = await login('membru@bimael.demo')
    const response = await member.post('/api/checkout').set(csrf).send({
      lines: [{ productId: 'p-carte', quantity: 2, priceMinor: 1 }],
      paymentScenario: 'pending',
    })
    expect(response.status).toBe(201)
    expect(response.body.order.totalMinor).toBe(17_800)
    expect(response.body.order.status).toBe('pending')
    expect(response.body.accessGranted).toBe(false)
  })

  it('respectă capacitatea și starea evenimentului', async () => {
    const member = await login('membru@bimael.demo')
    const soldOut = await member.post('/api/registrations').set(csrf).send({ eventId: 'ev-arhiva' })
    expect(soldOut.status).toBe(409)
    const open = await member.post('/api/registrations').set(csrf).send({ eventId: 'ev-atentie' })
    expect(open.status).toBe(201)
    expect(open.body.ticketId).toMatch(/^TKT-/)
  })

  it('separă crearea de draft de aprobarea editorială', async () => {
    const author = await login('autor@bimael.demo')
    const created = await author.post('/api/author/drafts').set(csrf).send({ title: 'Un draft demonstrativ', abstract: 'Acesta este un rezumat suficient de lung pentru validare.' })
    expect(created.status).toBe(201)
    expect((await author.post(`/api/editorial/reviews/${created.body.draftId}`).set(csrf).send({ decision: 'approve' })).status).toBe(403)

    const editor = await login('editor@bimael.demo')
    const approved = await editor.post(`/api/editorial/reviews/${created.body.draftId}`).set(csrf).send({ decision: 'approve' })
    expect(approved.status).toBe(200)
    expect(approved.body.status).toBe('approved')
  })

  it('respinge mutațiile fără header-ul anti-CSRF', async () => {
    const response = await request(createApp()).post('/api/auth/login').send({ email: 'membru@bimael.demo', password: 'BimaelDemo!' })
    expect(response.status).toBe(403)
  })
})
