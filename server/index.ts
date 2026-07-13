import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createHttpServer } from 'node:http'
import express from 'express'
import { createApp } from './app'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT ?? 4173)
const host = process.env.HOST ?? '0.0.0.0'
const app = createApp()
const server = createHttpServer(app)

for (const provider of ['PAYMENT_PROVIDER', 'EMAIL_PROVIDER', 'VIDEO_PROVIDER'] as const) {
  if (process.env[provider] && process.env[provider] !== 'demo') {
    console.warn(JSON.stringify({ level: 'warn', event: 'provider_fallback', provider, requested: process.env[provider], active: 'demo' }))
  }
}

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(root, 'dist')
  app.use(express.static(dist, { maxAge: '1h', index: false }))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || !req.accepts('html')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({ root, server: { middlewareMode: true, hmr: { server } }, appType: 'spa' })
  app.use(vite.middlewares)
}

server.listen(port, host, () => {
  console.info(JSON.stringify({ level: 'info', event: 'server_started', host, port, mode: process.env.NODE_ENV ?? 'development' }))
})
