/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartLine, DemoOrder, DemoUser, Sponsor } from '../domain/types'
import { sponsors as seededSponsors } from '../data/seed'
import {
  addSponsorRequest,
  bookmarkRequest,
  checkoutRequest,
  createDraftRequest,
  getSession,
  loginRequest,
  logoutRequest,
  registerRequest,
  reviewDraftRequest,
} from './api'

interface PersistedState {
  cart: CartLine[]
  bookmarks: string[]
  registrations: string[]
  orders: DemoOrder[]
  sponsors: Sponsor[]
}

interface DemoContextValue extends PersistedState {
  user: DemoUser | null
  sessionLoading: boolean
  notice: string | null
  cartCount: number
  login: (email: string, password: string) => Promise<DemoUser>
  logout: () => Promise<void>
  addToCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleBookmark: (articleId: string) => Promise<boolean>
  registerForEvent: (eventId: string) => Promise<string>
  checkout: (scenario: 'approved' | 'pending' | 'failed') => Promise<DemoOrder>
  createDraft: (title: string, abstract: string) => Promise<string>
  approveDraft: (draftId: string) => Promise<void>
  addSponsor: (name: string) => Promise<void>
  resetDemo: () => void
  announce: (message: string) => void
}

const STORAGE_KEY = 'bimael.demo.v2'
const initialState: PersistedState = { cart: [], bookmarks: [], registrations: [], orders: [], sponsors: seededSponsors }

function loadState(): PersistedState {
  if (typeof window === 'undefined') return initialState
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? { ...initialState, ...(JSON.parse(value) as Partial<PersistedState>) } : initialState
  } catch {
    return initialState
  }
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState)
  const [user, setUser] = useState<DemoUser | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    let active = true
    getSession()
      .then((session) => { if (active) setUser(session) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setSessionLoading(false) })
    return () => { active = false }
  }, [])

  const announce = useCallback((message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 3600)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await loginRequest(email, password)
    setUser(loggedIn)
    announce(`Bun venit, ${loggedIn.name}.`)
    return loggedIn
  }, [announce])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    announce('Sesiunea demonstrativă a fost închisă.')
  }, [announce])

  const addToCart = useCallback((productId: string) => {
    setState((current) => ({
      ...current,
      cart: current.cart.some((line) => line.productId === productId)
        ? current.cart.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current.cart, { productId, quantity: 1 }],
    }))
    announce('Produsul a fost adăugat în coșul demo.')
  }, [announce])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setState((current) => ({
      ...current,
      cart: quantity <= 0
        ? current.cart.filter((line) => line.productId !== productId)
        : current.cart.map((line) => line.productId === productId ? { ...line, quantity } : line),
    }))
  }, [])

  const clearCart = useCallback(() => setState((current) => ({ ...current, cart: [] })), [])

  const toggleBookmark = useCallback(async (articleId: string) => {
    const result = await bookmarkRequest(articleId)
    setState((current) => ({
      ...current,
      bookmarks: result.saved
        ? [...new Set([...current.bookmarks, articleId])]
        : current.bookmarks.filter((id) => id !== articleId),
    }))
    announce(result.saved ? 'Articol salvat.' : 'Articol eliminat din salvate.')
    return result.saved
  }, [announce])

  const registerForEvent = useCallback(async (eventId: string) => {
    const result = await registerRequest(eventId)
    setState((current) => ({ ...current, registrations: [...new Set([...current.registrations, eventId])] }))
    announce('Înscriere demo confirmată; biletul este în cont.')
    return result.ticketId
  }, [announce])

  const checkout = useCallback(async (scenario: 'approved' | 'pending' | 'failed') => {
    const result = await checkoutRequest({ lines: state.cart, paymentScenario: scenario })
    const order: DemoOrder = { ...result.order, lines: state.cart }
    setState((current) => ({
      ...current,
      orders: [order, ...current.orders],
      cart: order.status === 'paid' ? [] : current.cart,
    }))
    announce(order.status === 'paid' ? 'Comanda demo a fost aprobată.' : order.status === 'pending' ? 'Plata demo este în așteptare.' : 'Plata demo a fost refuzată.')
    return order
  }, [state.cart, announce])

  const createDraft = useCallback(async (title: string, abstract: string) => {
    const result = await createDraftRequest(title, abstract)
    announce('Draftul a fost creat și trimis în revizuire demo.')
    return result.draftId
  }, [announce])

  const approveDraft = useCallback(async (draftId: string) => {
    await reviewDraftRequest(draftId)
    announce('Draft aprobat în fluxul editorial demo.')
  }, [announce])

  const addSponsor = useCallback(async (name: string) => {
    const result = await addSponsorRequest(name)
    setState((current) => ({ ...current, sponsors: [...current.sponsors, result.sponsor] }))
    announce('Colaborator adăugat și publicat în banda demo.')
  }, [announce])

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(initialState)
    announce('Datele locale au fost resetate.')
  }, [announce])

  const value = useMemo<DemoContextValue>(() => ({
    ...state,
    user,
    sessionLoading,
    notice,
    cartCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
    login, logout, addToCart, setQuantity, clearCart, toggleBookmark, registerForEvent,
    checkout, createDraft, approveDraft, addSponsor, resetDemo, announce,
  }), [state, user, sessionLoading, notice, login, logout, addToCart, setQuantity, clearCart, toggleBookmark, registerForEvent, checkout, createDraft, approveDraft, addSponsor, resetDemo, announce])

  return (
    <DemoContext.Provider value={value}>
      {children}
      {notice && <div className="toast" role="status">{notice}</div>}
    </DemoContext.Provider>
  )
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo trebuie folosit în DemoProvider')
  return value
}
