import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useDemo } from '../app/DemoContext'
import type { EventStatus, Role } from '../domain/types'

export function Seo({ title, description, type = 'website', jsonLd }: { title: string; description: string; type?: string; jsonLd?: object }) {
  useEffect(() => {
    document.title = `${title} — Bimael`
    const upsert = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
      }
      const [name, content] = attribute.split('=')
      element.setAttribute(name, content)
      element.setAttribute('content', value)
    }
    upsert('meta[name="description"]', 'name=description', description)
    upsert('meta[property="og:title"]', 'property=og:title', title)
    upsert('meta[property="og:description"]', 'property=og:description', description)
    upsert('meta[property="og:type"]', 'property=og:type', type)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = window.location.href.split('?')[0]
    let script = document.head.querySelector<HTMLScriptElement>('script[data-bimael-jsonld]')
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.dataset.bimaelJsonld = 'true'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else {
      script?.remove()
    }
  }, [title, description, type, jsonLd])
  return null
}

export function PageIntro({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className="page-intro shell">
      <div>
        <span className="kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <div className="intro-copy">{children}</div>
      </div>
      {actions && <div className="intro-actions">{actions}</div>}
    </header>
  )
}

const eventLabels: Record<EventStatus, string> = {
  open: 'Înscrieri deschise', few: 'Ultimele locuri', 'sold-out': 'Locuri epuizate', soon: 'În curând', ended: 'Încheiat', replay: 'Acces în arhivă',
}

export function StatusBadge({ status }: { status: EventStatus | 'publicat' | 'draft' | 'in_review' | 'approved' | 'paid' | 'pending' | 'failed' }) {
  const label = status in eventLabels ? eventLabels[status as EventStatus] : ({ publicat: 'Publicat', draft: 'Draft', in_review: 'În revizuire', approved: 'Aprobat editorial', paid: 'Aprobat', pending: 'În așteptare', failed: 'Refuzat' } as const)[status as 'publicat'] ?? status
  return <span className={`status status-${status}`}>{label}</span>
}

export function EmptyState({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="empty-state"><span aria-hidden="true">∅</span><h2>{title}</h2><p>{children}</p>{action}</div>
}

export function DemoCallout({ children }: { children: React.ReactNode }) {
  return <aside className="demo-callout"><strong>Mediu demo</strong><p>{children}</p></aside>
}

export function ProtectedRoute({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, sessionLoading } = useDemo()
  const location = useLocation()
  if (sessionLoading) return <div className="route-state" role="status"><div className="skeleton-line" /><p>Verificăm sesiunea…</p></div>
  if (!user) return <Navigate to="/autentificare" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />
  return children
}

export function BackLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link className="back-link" to={to}><span aria-hidden="true">←</span>{children}</Link>
}
