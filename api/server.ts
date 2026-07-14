import type { IncomingMessage, ServerResponse } from 'node:http'
import { createApp } from '../server/app'

const app = createApp()

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const incoming = new URL(req.url ?? '/', 'http://vercel.local')
  const route = incoming.searchParams.get('__route') ?? '/api/unknown'
  incoming.searchParams.delete('__route')
  const query = incoming.searchParams.toString()

  req.url = `${route}${query ? `?${query}` : ''}`
  return app(req, res)
}
