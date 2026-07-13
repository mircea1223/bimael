import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/', '/prezentare', '/stiri', '/dezbateri', '/domenii', '/domenii/filosofia-mintii',
  '/povesti', '/contact', '/autori', '/autori/ana-maria-ilinca/proiecte', '/articole',
  '/articole/ce-stie-creierul-despre-liberul-arbitru', '/evenimente',
  '/evenimente/atentia-in-epoca-distragerii', '/webinarii', '/proiecte', '/shop',
  '/produse/mintea-intrupata', '/cos', '/arhiva', '/cautare', '/institutii',
  '/politici/confidentialitate', '/autentificare',
]

test('rutele publice reprezentative au H1, fără overflow sau erori de consolă', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  for (const route of publicRoutes) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), `overflow la ${route}`).toBe(true)
  }
  expect(consoleErrors).toEqual([])
})
