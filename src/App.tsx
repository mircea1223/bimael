import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteShell from './components/SiteShell'
import { ProtectedRoute } from './components/Primitives'

const HomePage = lazy(() => import('./pages/HomePage'))
const AuthorPage = lazy(() => import('./pages/AuthorPage'))
const editorial = () => import('./pages/EditorialPages')
const program = () => import('./pages/ProgramPages')
const commerce = () => import('./pages/CommercePages')
const account = () => import('./pages/AccountPages')
const information = () => import('./pages/InformationPages')

const AuthorsPage = lazy(() => editorial().then((module) => ({ default: module.AuthorsPage })))
const ArticlesPage = lazy(() => editorial().then((module) => ({ default: module.ArticlesPage })))
const ArticleDetailPage = lazy(() => editorial().then((module) => ({ default: module.ArticleDetailPage })))
const DomainsPage = lazy(() => editorial().then((module) => ({ default: module.DomainsPage })))
const DomainDetailPage = lazy(() => editorial().then((module) => ({ default: module.DomainDetailPage })))
const SearchPage = lazy(() => editorial().then((module) => ({ default: module.SearchPage })))
const EventsPage = lazy(() => program().then((module) => ({ default: module.EventsPage })))
const EventDetailPage = lazy(() => program().then((module) => ({ default: module.EventDetailPage })))
const ShopPage = lazy(() => commerce().then((module) => ({ default: module.ShopPage })))
const ProductDetailPage = lazy(() => commerce().then((module) => ({ default: module.ProductDetailPage })))
const CartPage = lazy(() => commerce().then((module) => ({ default: module.CartPage })))
const CheckoutPage = lazy(() => commerce().then((module) => ({ default: module.CheckoutPage })))
const CheckoutConfirmationPage = lazy(() => commerce().then((module) => ({ default: module.CheckoutConfirmationPage })))
const LoginPage = lazy(() => account().then((module) => ({ default: module.LoginPage })))
const AccountPage = lazy(() => account().then((module) => ({ default: module.AccountPage })))
const StudioPage = lazy(() => account().then((module) => ({ default: module.StudioPage })))
const EditorialQueuePage = lazy(() => account().then((module) => ({ default: module.EditorialQueuePage })))
const ReviewPage = lazy(() => account().then((module) => ({ default: module.ReviewPage })))
const AdminSponsorsPage = lazy(() => account().then((module) => ({ default: module.AdminSponsorsPage })))
const PresentationPage = lazy(() => information().then((module) => ({ default: module.PresentationPage })))
const DebatesPage = lazy(() => information().then((module) => ({ default: module.DebatesPage })))
const StoriesPage = lazy(() => information().then((module) => ({ default: module.StoriesPage })))
const ProjectsPage = lazy(() => information().then((module) => ({ default: module.ProjectsPage })))
const ArchivePage = lazy(() => information().then((module) => ({ default: module.ArchivePage })))
const InstitutionsPage = lazy(() => information().then((module) => ({ default: module.InstitutionsPage })))
const ContactPage = lazy(() => information().then((module) => ({ default: module.ContactPage })))
const PolicyPage = lazy(() => information().then((module) => ({ default: module.PolicyPage })))
const ForbiddenPage = lazy(() => information().then((module) => ({ default: module.ForbiddenPage })))
const NotFoundPage = lazy(() => information().then((module) => ({ default: module.NotFoundPage })))

function NewsRoute() { return <ArticlesPage newsOnly /> }
function WebinarsRoute() { return <EventsPage webinarsOnly /> }

function RouteLoading() {
  return <div className="route-state" role="status" aria-live="polite"><span className="kicker">Se deschide fila</span><div className="skeleton-line" /><div className="skeleton-line short" /><p>Pregătim conținutul…</p></div>
}

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Bimael route error', error, info.componentStack) }
  render() {
    if (this.state.error) return <section className="shell error-page" role="alert"><span>!</span><h1>Fila nu a putut fi deschisă</h1><p>Reîncarcă pagina. Dacă problema persistă, resetează datele demo.</p><button className="primary-action" type="button" onClick={() => window.location.reload()}>Reîncarcă</button></section>
    return this.props.children
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ScrollManager />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route element={<SiteShell />}>
            <Route index element={<HomePage />} />
            <Route path="prezentare" element={<PresentationPage />} />
            <Route path="stiri" element={<NewsRoute />} />
            <Route path="dezbateri" element={<DebatesPage />} />
            <Route path="domenii" element={<DomainsPage />} />
            <Route path="domenii/:slug" element={<DomainDetailPage />} />
            <Route path="povesti" element={<StoriesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="autori" element={<AuthorsPage />} />
            <Route path="autori/:authorSlug" element={<Navigate to="biografie" replace />} />
            <Route path="autori/:authorSlug/:section" element={<AuthorPage />} />
            <Route path="articole" element={<ArticlesPage />} />
            <Route path="articole/:slug" element={<ArticleDetailPage />} />
            <Route path="studii" element={<ArticlesPage />} />
            <Route path="studii/:slug" element={<ArticleDetailPage />} />
            <Route path="evenimente" element={<EventsPage />} />
            <Route path="evenimente/:slug" element={<EventDetailPage />} />
            <Route path="webinarii" element={<WebinarsRoute />} />
            <Route path="webinarii/:slug" element={<EventDetailPage />} />
            <Route path="proiecte" element={<ProjectsPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="produse/:slug" element={<ProductDetailPage />} />
            <Route path="cos" element={<CartPage />} />
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="checkout/confirmare/:orderId" element={<ProtectedRoute><CheckoutConfirmationPage /></ProtectedRoute>} />
            <Route path="arhiva" element={<ArchivePage />} />
            <Route path="cautare" element={<SearchPage />} />
            <Route path="institutii" element={<InstitutionsPage />} />
            <Route path="politici/:slug" element={<PolicyPage />} />
            <Route path="autentificare" element={<LoginPage />} />
            <Route path="cont" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="cont/:section" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="studio" element={<ProtectedRoute roles={['author', 'editor', 'administrator']}><StudioPage /></ProtectedRoute>} />
            <Route path="studio/articole/nou" element={<ProtectedRoute roles={['author', 'editor', 'administrator']}><StudioPage /></ProtectedRoute>} />
            <Route path="editorial" element={<ProtectedRoute roles={['editor', 'administrator']}><EditorialQueuePage /></ProtectedRoute>} />
            <Route path="editorial/revizuire/:draftId" element={<ProtectedRoute roles={['editor', 'administrator']}><ReviewPage /></ProtectedRoute>} />
            <Route path="admin/sponsori" element={<ProtectedRoute roles={['administrator']}><AdminSponsorsPage /></ProtectedRoute>} />
            <Route path="403" element={<ForbiddenPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  )
}
