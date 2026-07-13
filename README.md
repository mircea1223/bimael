# Bimael

Bimael este un demo integrat pentru o platformă editorială, academică și culturală. Interfața combină o revistă, o arhivă de autori, o agendă de evenimente și un shop cultural. Implementarea actuală dovedește fluxuri reprezentative, dar nu este un serviciu pregătit pentru date sau tranzacții reale.

## Ce este implementat

- client React 19, Vite și TypeScript strict;
- routing client-side cu pagini încărcate lazy;
- server Express 5 care livrează aplicația și API-ul demo;
- sesiuni semnate în cookie `HttpOnly` și verificări RBAC pe endpoint-urile protejate;
- fluxuri demo pentru bookmark, înscriere, checkout, draft editorial, aprobare și sponsori;
- coș și proiecții UI persistate în `localStorage`;
- schemă PostgreSQL și seed pregătite, dar neconectate la runtime;
- adaptoare conceptuale pentru plată, e-mail și video, toate în mod demo;
- asset-uri WebP optimizate, responsive CSS, reduced motion/data și print stylesheet;
- teste de domeniu, integrare API și fluxuri UI în jsdom.

## Cerințe

- Node.js 22;
- npm 10 sau versiunea livrată cu Node 22;
- opțional: PostgreSQL 15+ pentru inspectarea schemei pregătite;
- opțional: Docker pentru imaginea de deployment.

## Setup local

```sh
npm ci
cp .env.example .env
set -a
. ./.env
set +a
export SESSION_SECRET='secret-local-lung-si-aleator'
npm run dev
```

Aplicația este disponibilă la [http://localhost:4173](http://localhost:4173), iar health check-ul la [http://localhost:4173/api/health](http://localhost:4173/api/health).

Fișierul `.env` nu este încă încărcat automat de server; în shell trebuie exportat ca în exemplul de mai sus. În Docker se folosește `--env-file`. Runtime-ul actual citește `NODE_ENV`, `HOST`, `PORT`, `SESSION_SECRET` și selectorii providerilor. Un selector non-demo produce numai un warning de fallback; nu activează o integrare reală. `DATABASE_URL`, credentialele providerilor, `APP_BASE_URL` și `LOG_LEVEL` rămân contracte pentru adaptoarele următoare.

Pentru o rulare apropiată de producție:

```sh
npm run build
PORT=4173 NODE_ENV=production SESSION_SECRET='înlocuiește-cu-un-secret-lung' npm run start
```

Serverul de producție presupune că directorul `dist` există. Pentru Docker și configurarea mediilor, vezi [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Conturi demo

Toate conturile folosesc parola `BimaelDemo!`.

| Rol runtime | Email | Poate verifica |
| --- | --- | --- |
| Membru | `membru@bimael.demo` | bookmark, înscriere și checkout |
| Autor | `autor@bimael.demo` | studio și crearea unui draft propriu |
| Editor | `editor@bimael.demo` | coada editorială și aprobarea unui draft |
| Administrator | `admin@bimael.demo` | administrarea sponsorilor și controlul RBAC |

Aceste identități sunt definite în memoria serverului. Nu sunt conturi reale, nu au verificare e-mail și nu trebuie refolosite într-un mediu public.

## Rute

### Publice

| Rută | Conținut |
| --- | --- |
| `/` | Coperta editorială |
| `/prezentare`, `/stiri`, `/dezbateri`, `/povesti`, `/contact` | Secțiuni editoriale și informaționale |
| `/autori` | Index autori |
| `/autori/:authorSlug/:section` | Profil autor; secțiuni: `biografie`, `articole`, `webinarii`, `evenimente`, `proiecte`, `shop`, `arhiva`, `contact` |
| `/articole`, `/articole/:slug` | Listă și detaliu articol |
| `/studii`, `/studii/:slug` | Proiecție pentru studii și lucrări |
| `/domenii`, `/domenii/:slug` | Taxonomii și colecții |
| `/cautare` | Căutare locală; folosește `q`, `tip` și `domeniu` |
| `/evenimente`, `/evenimente/:slug` | Agendă, detaliu și înscriere demo |
| `/webinarii`, `/webinarii/:slug` | Catalog webinar și detaliu |
| `/proiecte`, `/arhiva`, `/institutii` | Proiecte, arhivă și parteneri |
| `/shop`, `/produse/:slug`, `/cos` | Catalog, produs și coș local |
| `/politici/:slug` | Pagini de politici demo |
| `/autentificare` | Login pentru identitățile demo |
| `/403`, `/404` | Stări explicite de acces și rută inexistentă |

### Protejate

| Rută | Roluri |
| --- | --- |
| `/checkout`, `/checkout/confirmare/:orderId` | orice utilizator autentificat |
| `/cont`, `/cont/:section` | orice utilizator autentificat |
| `/studio`, `/studio/articole/nou` | autor, editor, administrator |
| `/editorial`, `/editorial/revizuire/:draftId` | editor, administrator |
| `/admin/sponsori` | administrator |

Guard-urile din router oferă orientare UX. Autoritatea pentru mutațiile protejate rămâne endpoint-ul Express, prin sesiunea semnată și `requireRole`.

## Scripturi

| Comandă | Rol |
| --- | --- |
| `npm run dev` | pornește Express cu Vite middleware și reload |
| `npm run build` | rulează typecheck și construiește clientul Vite |
| `npm run start` | pornește serverul Express în mod production |
| `npm run preview` | alias pentru `start` |
| `npm run lint` | verifică sursele cu ESLint |
| `npm run typecheck` | rulează `tsc --noEmit` |
| `npm run test` | rulează toate testele Vitest o singură dată |
| `npm run test:watch` | Vitest în mod watch |
| `npm run test:flows` | rulează fluxurile UI rapide în jsdom |
| `npm run test:e2e` | rulează fluxurile critice în Chromium prin Playwright |
| `npm run check` | lint, typecheck, Vitest, build și Playwright E2E |

## Verificare

Quality gate-ul local complet este:

```sh
npm run check
npm run test:e2e
```

La verificarea din 12 iulie 2026, lint-ul, typecheck-ul și build-ul au trecut, iar setul Vitest conține 15 teste în 3 fișiere. Testele acoperă servicii de domeniu, sesiuni/RBAC, checkout, capacitatea evenimentelor, workflow editorial și fluxuri publice. Suite-ul Playwright adaugă 6 fluxuri în Chromium, inclusiv profil, căutare, înscriere, checkout, mobil și 404. Nu există încă audit axe automat sau Lighthouse gate în CI.

Verificare rapidă a serverului:

```sh
curl --fail http://localhost:4173/api/health
```

Răspunsul trebuie să conțină `"mode":"demo"`.

## Date și resetare

Starea demo este împărțită intenționat:

- browser: coș, proiecția bookmark-urilor, înscrieri, comenzi și sponsori, sub cheia `bimael.demo.v2`;
- server: bookmark-uri, înscrieri, newsletter, drafturi, sponsori și capacități, în `Map`/`Set` volatile;
- sesiune: cookie semnat `bimael_session`, maximum 8 ore.

Butonul „Resetează datele locale” curăță numai partea din browser. Pentru un reset determinist complet, ieși din cont, resetează datele locale și repornește serverul. PostgreSQL nu participă la runtime-ul actual.

## Structură

```text
.
├── server/                 # Express, sesiuni, RBAC și API demo
├── src/
│   ├── app/                # client API și orchestrarea stării demo
│   ├── components/         # shell și componente editoriale
│   ├── data/               # seed-uri UI fictive
│   ├── domain/             # tipuri și servicii pure
│   ├── pages/              # vertical slices de rută
│   └── tests/              # teste UI și servicii
├── db/
│   ├── migrations/         # schema PostgreSQL pregătită
│   └── seed.sql            # roluri, permisiuni și date demo
├── docs/                   # produs, arhitectură, ghiduri și ADR-uri
├── Dockerfile
└── .github/workflows/ci.yml
```

## Documentație

- [Arhitectură](docs/ARCHITECTURE.md)
- [ADR: modular monolith](docs/adr/0001-modular-monolith.md)
- [ADR: adaptoare demo](docs/adr/0002-demo-adapters.md)
- [Securitate](docs/SECURITY.md)
- [Integrări](docs/INTEGRATIONS.md)
- [Ghid editorial](docs/EDITORIAL_GUIDE.md)
- [Performanță](docs/PERFORMANCE.md)
- [Accesibilitate](docs/ACCESSIBILITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Limitări](docs/LIMITATIONS.md)

## Limită de utilizare

Nu introduce date personale sensibile sau date de card. Plata, e-mailul, video și persistența PostgreSQL nu sunt active. Un rezultat „paid”, un bilet, un audit ID sau un status „approved” demonstrează doar tranziția din mediul demo.
