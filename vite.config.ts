import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
  build: {
    target: 'es2022',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.ts'],
    setupFiles: './src/tests/setup.ts',
    css: true,
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
  },
})
