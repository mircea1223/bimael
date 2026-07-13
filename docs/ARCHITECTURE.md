# Bimael — arhitectură

## Decizie de arhitectură

Bimael pornește ca **modular monolith**. Interfața, regulile de business și accesul la date sunt separate prin limite de module și porturi, fără microservicii premature.

Repo-ul actual folosește Vite și React. Pentru demo:

- React 19 + React Router și route-level code splitting;
- TypeScript strict și validare de schemă la limitele aplicației;
- React Context/reducers pentru sesiune și stare transversală simplă;
- repository-uri locale, versionate, peste `localStorage`;
- Vitest + Testing Library pentru unit/integration și Playwright + axe pentru E2E.

BrowserRouter este preferat pentru URL-uri curate și SEO; orice deployment trebuie să rescrie rutele necunoscute către `index.html`.

## Structură și limite de module

```text
src/
  app/                    router, layouts, providers, guards, metadata, errors
  design-system/          tokens, primitive accesibile, stări comune
  modules/
    identity/             users, sesiune demo, autori, instituții, RBAC
    editorial/            articole, versiuni, dezbateri, workflow, citări
    discovery/            domenii, taxonomii, căutare și filtrare
    programming/          evenimente, înscrieri, bilete, webinarii, acces
    commerce/             catalog, coș, checkout, plăți și comenzi
    engagement/           bookmark, follow și newsletter
    partnerships/         sponsori și parteneri
    admin/                revizie, sponsori, audit și controale administrative
  platform/
    ports/                 contracte pentru date și servicii externe
    adapters/demo/         seed, localStorage și integrări mock
  shared/                 tipuri, Money, Result, timp, ID-uri și erori
```

Fiecare modul conține `domain`, `application`, `infrastructure` și `ui` numai când complexitatea o justifică. UI-ul nu importă seed-uri sau `localStorage` direct; apelează use cases care depind de porturi.

### Responsabilități

- **identity** deține utilizatorii, rolurile, sesiunile, profilurile și instituțiile.
- **editorial** deține conținutul, versiunile și tranzițiile editoriale.
- **discovery** indexează proiecții publice, fără a deveni sursa de adevăr.
- **programming** deține capacitatea, înscrierea, biletele și eligibilitatea webinarului.
- **commerce** deține prețurile, coșul, comenzile și starea plății, dar nu date de card.
- **engagement** deține acțiunile personale fără a modifica entitățile editoriale.
- **partnerships** deține sponsorii și ordinea lor publică.
- **admin** compune use cases privilegiate; nu ocolește politicile modulelor.

Interacțiunile cross-module folosesc ID-uri și evenimente interne mici:

- `OrderPaid` → acordă `WebinarAccess` sau creează înregistrarea/biletul;
- `ArticlePublished` → actualizează indexul de căutare;
- `SponsorChanged` → invalidează proiecția publică.

Nu se introduce un event bus distribuit. În demo, evenimentele rulează sincron și idempotent în același proces.

## Porturi și adaptoare

### Porturi de repository

`UserRepository`, `AuthorRepository`, `ArticleRepository`, `EventRepository`, `RegistrationRepository`, `WebinarAccessRepository`, `ProductRepository`, `CartRepository`, `OrderRepository`, `SponsorRepository`, `BookmarkRepository` și `AuditRepository` expun operații orientate pe use case, nu CRUD generic nelimitat.

### Porturi pentru servicii

- `AuthPort`: sesiune și identitatea actorului;
- `PaymentPort`: inițiere și confirmare plată;
- `EmailPort`: mesaje tranzacționale;
- `VideoPort`: link live, replay și expirarea accesului;
- `SearchPort`: indexare și query;
- `StoragePort`: asset-uri și URL-uri semnate;
- `Clock` și `IdGenerator`: timp și ID-uri deterministe în teste.

### Adaptoare demo

- `LocalStorage*Repository`, cu namespace `bimael.demo.v1`, schemă validată și seed version;
- `MockAuthAdapter`, cu identități prestabilite și banner „Mediu demo”;
- `MockPaymentAdapter`, cu rezultate explicite `approved`, `declined`, `pending`;
- `MockEmailAdapter`, care salvează într-un outbox local și nu pretinde că trimite;
- `MockVideoAdapter`, cu replay demonstrativ și verificare locală de eligibilitate;
- `InMemorySearchAdapter`, care caută în proiecții normalizate fără diacritice;
- `LocalAssetAdapter`, numai pentru asset-uri incluse în build.

Un buton de reset șterge namespace-ul și reaplică seed-ul determinist. Adaptorul activ trebuie afișat în interfețele sensibile și documentat.

## RBAC și autorizare

Politica centrală este `authorize(actor, permission, resource)`. Route guards controlează accesul UX, iar use cases verifică din nou permisiunea și ownership-ul. În demo, ambele verificări sunt client-side și sunt marcate ca simulare; în producție aceeași politică trebuie executată pe server.

| Rol | Permisiuni principale |
| --- | --- |
| `guest` | Citește conținut public, caută, folosește coș local, se abonează și se autentifică. |
| `member` / `customer` | Își gestionează bookmark-urile, coșul, comenzile, înscrierile și accesul. |
| `author` | Creează, editează și trimite propriile drafturi; își editează profilul. Nu publică. |
| `academic_reviewer` | Citește și revizuiește numai versiuni alocate. Nu publică. |
| `editor` | Cere modificări, aprobă, publică și arhivează conținut editorial. |
| `event_organizer` | Gestionează evenimente, webinarii și înscrieri. |
| `shop_manager` | Gestionează produse, comenzi și refund-uri simulate. |
| `administrator` | Gestionează utilizatori, roluri non-superadmin, sponsori, parteneri și audit. |
| `super_administrator` | Toate permisiunile și configurarea platformei. |

Permisiuni reprezentative: `article:create`, `article:update:own`, `article:submit:own`, `article:review:assigned`, `article:publish:any`, `event:manage:any`, `commerce:manage`, `sponsor:manage`, `audit:read`. Orice eșec produce `Unauthenticated` sau `Forbidden`, nu o eroare generică.

## Model minim de date

### Identitate

- `User(id, email, name, status, verifiedAt?)`; `email` normalizat și unic.
- `UserRole(userId, role)`; pereche unică.
- `Session(id, userId, expiresAt)`; numai simulată în demo.
- `AuthorProfile(id, userId, slug, bio, title, orcid?, portraitId?, contactVisibility)`; `userId` și `slug` unice.
- `Institution(id, slug, name)` și `Affiliation(authorId, institutionId, title, startAt, endAt?)`.
- `Field(id, slug, name, parentId?)`; slug unic.

### Editorial

- `Article(id, slug, kind, status, ownerAuthorId, publishedVersionId?, publishedAt?)`.
- `ArticleVersion(id, articleId, versionNo, title, subtitle?, abstract?, body, locale, createdBy, createdAt)`; perechea `articleId + versionNo` este unică.
- `ArticleAuthor(articleId, authorId, position)`; autorul și poziția sunt unice în articol.
- `EditorialReview(id, articleVersionId, reviewerId, status, comment, createdAt)`.
- `Debate`, `DebateParticipant` și `DebateContribution` susțin ruta reprezentativă.

`kind` este `news | essay | opinion | editorial | preprint | study | translation | review`. Statusul este `draft | in_review | changes_requested | scheduled | published | archived`. Tipul nu implică peer review.

### Program și acces

- `Event(id, slug, kind, mode, status, title, startAt, endAt, timezone, location?, capacity?, registrationClosesAt?)`.
- `Webinar(id, eventId, replayRef?, accessEndsAt?)`; `eventId` unic.
- `TicketType(id, eventId, name, priceMinor, currency, capacity?)`.
- `Registration(id, eventId, userId, ticketTypeId, status)`; cel mult o înregistrare activă per utilizator/eveniment.
- `Ticket(id, registrationId, code)`; ambele unice.
- `WebinarAccess(id, webinarId, userId, orderItemId, expiresAt?)`; pereche unică webinar/utilizator.

### Comerț

- `Product(id, slug, type, title, status, sellableRef?)`.
- `ProductVariant(id, productId, sku, priceMinor, currency, stock?)`; SKU unic.
- `Cart(id, userId?, sessionKey, status)` și `CartItem(cartId, variantId, quantity)`; pereche unică.
- `Order(id, userId, status, totalMinor, currency, createdAt)`.
- `OrderItem(id, orderId, variantId, titleSnapshot, unitPriceMinor, quantity, sellableRef?)`.
- `Payment(id, orderId, provider, status, amountMinor, providerRef)`; `providerRef` unic.

### Engagement și administrare

- `Bookmark(userId, articleId)`; pereche unică.
- `NewsletterSubscription(emailNormalized, status, consentedAt)`; email unic.
- `Sponsor(id, slug, name, tier, url, status, sortOrder)` și `Partner`.
- `AuditLog(id, actorId, action, entityType, entityId, at, summary)`; fără secrete sau date sensibile.

ID-urile sunt opace; banii sunt întregi în unități minore cu monedă; momentele sunt ISO UTC și păstrează timezone-ul sursă. Datele structurale nu sunt ascunse în JSON arbitrar. Soft delete se folosește doar pentru entități care cer restaurare sau retenție; în rest se folosesc statusuri.

## Strategia de căutare

Demo-ul construiește un index local din proiecții publicate pentru autori, articole, domenii, evenimente, webinarii, produse și instituții. Query-ul este normalizat case-insensitive și fără diacritice; filtrele și sortarea sunt deterministe, iar termenii/filtrele se păstrează în URL.

În producție, `SearchPort` poate primi un adaptor PostgreSQL full-text sau un motor dedicat. Indexarea pornește din evenimente de domeniu; comercialul nu poate suprascrie relevanța editorială, iar rezultatele sponsorizate sunt marcate.

## Strategia media

În demo, asset-urile sunt locale, cu dimensiuni explicite, `srcset`, lazy loading pentru non-LCP și formate WebP/AVIF. Textura este un enhancement subtil și poate fi eliminată pentru reduced data; portretele au fallback cu monogramă și alt text contextual.

În producție, `StoragePort` primește un adaptor S3-compatible cu upload validat, MIME allowlist, limite de dimensiune, scan hook, transformări, CDN și signed URLs. Metadata asset-ului și drepturile/licența rămân în baza de date; binarul nu este stocat în DB.

## Strategia de commerce

Catalogul, coșul și comenzile sunt interne; procesarea plății aparține exclusiv `PaymentPort`. Comanda păstrează snapshot-uri de titlu și preț. Starea validă urmează `draft -> pending_payment -> paid | payment_failed | cancelled`, iar acordarea accesului este idempotentă și are loc numai după confirmarea plății.

Demo-ul nu cere date de card și folosește selectorul explicit de rezultat mock. În producție, un provider consacrat găzduiește datele de plată; webhook-urile sunt verificate, idempotente și auditate. TVA, facturarea, refund-urile, transportul și politicile legale rămân neimplementate până la alegerea furnizorilor și jurisdicției.

## Strategie de deployment și operare

### Demo

- build static Vite, servit prin CDN/host cu fallback la `index.html`;
- config publică minimă și fără secrete;
- CI: install reproducibil, typecheck, lint, unit/integration, build, E2E, axe și bugete de performanță;
- preview deployment per schimbare;
- localStorage versionat, fără garanții de backup sau sincronizare între dispozitive.

### Producție

Evoluția recomandată păstrează modulele și înlocuiește adaptoarele:

- runtime full-stack React cu rendering hibrid;
- API/server actions cu autorizare server-side;
- PostgreSQL cu migrations, constrângeri și backup/restore verificat;
- Redis/rate limiting numai dacă traficul justifică;
- object storage + CDN, provider de e-mail, plăți și video;
- secret manager, CSP și security headers;
- structured logs, error monitoring, health checks, uptime și audit;
- deployment gradual și rollback automat la health-check eșuat.

Nu se extrage niciun microserviciu înainte ca măsurătorile sau autonomia echipelor să indice o limită reală. Candidați ulteriori pot fi search indexing și procesarea media, nu nucleul editorial.

## Securitate și integritate

- Validarea are loc la intrarea în use case și la adaptor; output-ul este encodat de framework.
- Ownership-ul și permisiunile nu sunt deduse din elemente UI ascunse.
- Auditul înregistrează schimbările privilegiate fără tokenuri, parole sau date de plată.
- Demo-ul nu colectează date reale sensibile și afișează limitarea RBAC client-side.
- Producția necesită sesiuni securizate, CSRF unde este relevant, rate limiting, cookies Secure/HttpOnly/SameSite, CSP, revocare de sesiune, politici GDPR și retenție.

## Reguli de dependență

1. UI → application use cases → domain/ports → adapters.
2. Domain nu importă React, router, browser APIs sau adaptoare.
3. Modulele nu scriu direct în datele altui modul.
4. Orice integrare externă are contract, adaptor mock și adaptor real separat.
5. Erorile sunt tipizate și transformate în stări accesibile: loading, empty, error, offline, unauthorized, forbidden, not found, rate limited și stări de business.
