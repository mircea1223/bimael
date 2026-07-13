import { expect, test } from '@playwright/test'

test('profilul autorului schimbă secțiunea, autorul și URL-ul', async ({ page }) => {
  await page.goto('/autori/marian-bituics/biografie')
  await expect(page.getByRole('heading', { name: 'Marian Bituics', level: 1 })).toBeVisible()
  const layout = page.getByRole('region', { name: 'Profilul Marian Bituics' })
  await page.locator('.author-layout > nav[aria-label="Conținut"] a[href="/autori/marian-bituics/articole"]').click()
  await expect(page).toHaveURL(/\/autori\/marian-bituics\/articole$/)
  await expect(layout.getByRole('heading', { name: 'Articole', level: 2 })).toBeVisible()
  await page.getByRole('link', { name: 'Autorul următor: Ana-Maria Ilinca' }).click()
  await expect(page).toHaveURL(/\/autori\/ana-maria-ilinca\/articole$/)
  await expect(page.getByRole('heading', { name: 'Ana-Maria Ilinca', level: 1 })).toBeVisible()
})

test('căutarea tipizată are rezultate și empty state', async ({ page }) => {
  await page.goto('/cautare?q=emoție')
  await expect(page.getByRole('link', { name: /Emoția ca formă de cunoaștere/ })).toBeVisible()
  await page.getByLabel('Termen de căutare').fill('termen imposibil')
  await page.getByRole('button', { name: 'Caută', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Niciun rezultat' })).toBeVisible()
})

test('un membru se înscrie la un eveniment gratuit', async ({ page }) => {
  await page.goto('/evenimente/liberul-arbitru-dupa-libet')
  await page.getByRole('button', { name: 'Înscrie-te gratuit' }).click()
  await expect(page).toHaveURL(/\/autentificare$/)
  await page.getByRole('button', { name: 'Intră în cont' }).click()
  await expect(page).toHaveURL(/\/evenimente\/liberul-arbitru-dupa-libet$/)
  await page.getByRole('button', { name: 'Înscrie-te gratuit' }).click()
  await expect(page.getByText('Ești înscris', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Vezi biletul' })).toBeVisible()
})

test('checkout-ul aprobat creează o comandă fără date de card', async ({ page }) => {
  await page.goto('/produse/atlasul-intrebarilor')
  await page.getByRole('button', { name: 'Adaugă în coș' }).click()
  await expect(page).toHaveURL(/\/cos$/)
  await page.getByRole('link', { name: 'Continuă la checkout' }).click()
  await expect(page).toHaveURL(/\/autentificare$/)
  await page.getByRole('button', { name: 'Intră în cont' }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await page.getByLabel('Nume complet').fill('Irina Cititor')
  await page.getByLabel('Email').fill('membru@bimael.demo')
  await page.getByLabel(/Înțeleg că aceasta este o simulare/).check()
  await page.getByRole('button', { name: 'Rulează plata demo' }).click()
  await expect(page.getByRole('heading', { name: 'Comandă demo aprobată' })).toBeVisible()
  await expect(page.getByText('Adapter demo explicit')).toBeVisible()
})

test('mobilul folosește drawer și nu are overflow orizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Ce știe creierul despre liberul arbitru' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true)
  await page.getByRole('button', { name: 'Meniu' }).click()
  const drawer = page.getByRole('dialog', { name: 'Meniu' })
  await expect(drawer).toBeVisible()
  await drawer.getByRole('link', { name: 'Autori' }).click()
  await expect(page).toHaveURL(/\/autori$/)
  await expect(page.getByRole('heading', { name: 'Autori', level: 1 })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true)
})

test('desktop-ul wide și scund păstrează coperta și identitatea autorului în primul ecran', async ({ page }) => {
  await page.setViewportSize({ width: 1716, height: 760 })
  await page.goto('/')

  const header = page.locator('.site-header')
  const brand = header.getByRole('link', { name: 'Bimael — Acasă' })
  const navigation = header.getByRole('navigation', { name: 'Navigație principală' })
  const cover = page.locator('.cover')
  const title = cover.getByRole('heading', { name: 'Ce știe creierul despre liberul arbitru', level: 1 })
  const cta = cover.getByRole('link', { name: 'Citește eseul', exact: true })
  const authorName = cover.getByRole('heading', { name: 'Marian Bituics', level: 2 })
  const portrait = cover.locator('.cover-author .portrait')

  await expect(title).toBeVisible()
  await expect(brand).toBeVisible()
  await expect(navigation).toBeVisible()
  await expect(cover.getByRole('heading', { name: 'Următoarele întâlniri', level: 2 })).toBeVisible()

  const [headerBox, coverBox, titleBox, ctaBox, authorBox, coverPortraitBox] = await Promise.all([
    header.boundingBox(), cover.boundingBox(), title.boundingBox(), cta.boundingBox(), authorName.boundingBox(), portrait.boundingBox(),
  ])
  for (const box of [headerBox, coverBox, titleBox, ctaBox, authorBox, coverPortraitBox]) expect(box).not.toBeNull()

  const viewportHeight = page.viewportSize()!.height
  const headerBottom = headerBox!.y + headerBox!.height
  expect(headerBox!.y).toBeGreaterThanOrEqual(0)
  expect(headerBottom).toBeLessThan(viewportHeight * .35)
  expect(coverBox!.y).toBeGreaterThanOrEqual(headerBottom - 2)
  for (const box of [titleBox!, ctaBox!, authorBox!]) {
    expect.soft(box.y).toBeGreaterThanOrEqual(headerBottom)
    expect.soft(box.y + box.height).toBeLessThanOrEqual(viewportHeight - 12)
  }
  const coverCenter = coverBox!.x + coverBox!.width / 2
  const portraitCenter = coverPortraitBox!.x + coverPortraitBox!.width / 2
  expect(Math.abs(portraitCenter - coverCenter)).toBeLessThanOrEqual(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true)

  await page.mouse.wheel(0, 420)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300)
  await expect(header).toBeVisible()
  await expect(navigation).toBeVisible()
  const stickyHeader = await header.boundingBox()
  expect(stickyHeader).not.toBeNull()
  expect(Math.abs(stickyHeader!.y)).toBeLessThanOrEqual(1)

  await page.goto('/autori/marian-bituics/biografie')
  const profile = page.getByRole('region', { name: 'Profilul Marian Bituics' })
  const profileTitle = profile.getByRole('heading', { name: 'Marian Bituics', level: 1 })
  await expect(profileTitle).toBeVisible()
  const [portraitBox, profileTitleBox, affiliationBox] = await Promise.all([
    profile.locator('.author-center > .portrait').boundingBox(),
    profileTitle.boundingBox(),
    profile.locator('.author-affiliation').boundingBox(),
  ])
  for (const box of [portraitBox, profileTitleBox, affiliationBox]) {
    expect(box).not.toBeNull()
    expect.soft(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight - 12)
  }
})

test('coperta rămâne compactă și când zoom-out-ul mărește viewport-ul CSS', async ({ page }) => {
  await page.setViewportSize({ width: 2152, height: 1092 })
  await page.goto('/')

  const cover = page.locator('.cover')
  const title = cover.getByRole('heading', { name: 'Ce știe creierul despre liberul arbitru', level: 1 })
  await expect(title).toBeVisible()
  const [coverBox, titleBox, ctaBox, authorBox, portraitBox] = await Promise.all([
    cover.boundingBox(),
    title.boundingBox(),
    cover.getByRole('link', { name: 'Citește eseul', exact: true }).boundingBox(),
    cover.getByRole('heading', { name: 'Marian Bituics', level: 2 }).boundingBox(),
    cover.locator('.cover-author .portrait').boundingBox(),
  ])
  for (const box of [coverBox, titleBox, ctaBox, authorBox, portraitBox]) expect(box).not.toBeNull()

  expect(titleBox!.height).toBeLessThan(260)
  for (const box of [titleBox!, ctaBox!, authorBox!]) {
    expect.soft(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height - 12)
  }
  expect(Math.abs(
    (portraitBox!.x + portraitBox!.width / 2) - (coverBox!.x + coverBox!.width / 2),
  )).toBeLessThanOrEqual(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true)
})

test('rutele invalide au stare 404 coerentă', async ({ page }) => {
  await page.goto('/fila-care-nu-exista')
  await expect(page.getByRole('heading', { name: 'Fila lipsește din arhivă' })).toBeVisible()
  await expect(page.locator('.error-page').getByRole('link', { name: 'Caută în Bimael' })).toBeVisible()
})
