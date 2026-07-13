import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['/', '/autori/marian-bituics/biografie', '/articole/ce-stie-creierul-despre-liberul-arbitru', '/evenimente/liberul-arbitru-dupa-libet', '/shop', '/autentificare']

for (const route of routes) {
  test(`fără încălcări axe critice sau serioase: ${route}`, async ({ page }) => {
    await page.goto(route)
    await page.locator('main').waitFor()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
    const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
    expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  })
}
