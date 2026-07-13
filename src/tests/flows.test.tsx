// @vitest-environment jsdom
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { DemoProvider } from '../app/DemoContext'

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><DemoProvider><App /></DemoProvider></MemoryRouter>)
}

describe('fluxuri publice reprezentative', () => {
  it('schimbă secțiunea autorului și păstrează scena coerentă', async () => {
    const user = userEvent.setup()
    renderRoute('/autori/marian-bituics/biografie')
    const profile = await screen.findByRole('region', { name: 'Profilul Marian Bituics' })
    expect(within(profile).getByRole('heading', { name: 'Marian Bituics', level: 1 })).toBeInTheDocument()
    await user.click(within(profile).getByRole('link', { name: /Articole4/ }))
    expect(await within(profile).findByRole('heading', { name: 'Articole', level: 2 })).toBeInTheDocument()
    expect(within(profile).getByRole('link', { name: /Articole4/ })).toHaveAttribute('aria-current', 'page')
  })

  it('caută cu diacritice și deschide rezultate tipizate', async () => {
    renderRoute('/cautare?q=emoție')
    expect(await screen.findByRole('heading', { name: /pentru „emoție”/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Emoția ca formă de cunoaștere/ })).toHaveAttribute('href', '/articole/emotia-ca-forma-de-cunoastere')
  })

  it('adaugă un produs în coș și actualizează indicatorul global', async () => {
    const user = userEvent.setup()
    renderRoute('/produse/atlasul-intrebarilor')
    await screen.findByRole('heading', { name: 'Atlasul întrebărilor — ebook', level: 1 })
    await user.click(screen.getByRole('button', { name: 'Adaugă în coș' }))
    await waitFor(() => expect(screen.getByRole('link', { name: 'Coș, 1 produse' })).toBeInTheDocument())
  })

  it('afișează o stare explicită pentru căutare fără rezultate', async () => {
    renderRoute('/cautare?q=termen-imposibil')
    expect(await screen.findByRole('heading', { name: 'Niciun rezultat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resetează' })).toBeInTheDocument()
  })
})
