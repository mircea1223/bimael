import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import console from 'node:console'
import { URL } from 'node:url'
import { gzipSync } from 'node:zlib'

const dist = new URL('../dist/', import.meta.url)
const assets = new URL('./assets/', dist)

if (!existsSync(dist) || !existsSync(assets)) {
  throw new Error('Rulează `npm run build` înaintea bugetului de performanță.')
}

const index = readFileSync(new URL('./index.html', dist), 'utf8')
const files = readdirSync(assets)
const entryName = index.match(/assets\/(index-[^"']+\.js)/)?.[1]
const cssName = index.match(/assets\/(index-[^"']+\.css)/)?.[1]

if (!entryName || !cssName) throw new Error('Nu am putut identifica bundle-urile de intrare.')

const gzipSize = (name) => gzipSync(readFileSync(new URL(`./assets/${name}`, dist))).byteLength
const mediaBytes = files.filter((name) => /\.(webp|avif)$/.test(name)).reduce((sum, name) => sum + statSync(join(assets.pathname, name)).size, 0)
const routeChunkGzip = Math.max(...files.filter((name) => name.endsWith('.js') && name !== entryName).map(gzipSize), 0)

const report = {
  entryJsGzip: gzipSize(entryName),
  cssGzip: gzipSize(cssName),
  criticalMedia: mediaBytes,
  largestRouteChunkGzip: routeChunkGzip,
}
const limits = { entryJsGzip: 130_000, cssGzip: 20_000, criticalMedia: 450_000, largestRouteChunkGzip: 20_000 }

for (const [metric, value] of Object.entries(report)) {
  const limit = limits[metric]
  console.info(`${metric}: ${value} B / ${limit} B`)
  if (value > limit) throw new Error(`Buget depășit: ${metric}`)
}
