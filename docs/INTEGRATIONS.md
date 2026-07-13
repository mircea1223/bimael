# Integrări și contracte externe

## Stare curentă

Runtime-ul actual nu contactează servicii externe. Plata, e-mailul și video sunt comportamente demo implementate local, iar PostgreSQL este numai o schemă pregătită. Health check-ul răspunde întotdeauna cu `mode: demo`.

Setarea `PAYMENT_PROVIDER`, `EMAIL_PROVIDER` sau `VIDEO_PROVIDER` la altă valoare decât `demo` produce un warning `provider_fallback`, dar nu activează un provider real. `DATABASE_URL` nu este conectată. Resolverele și adaptoarele reale trebuie implementate și testate înainte ca aceste valori să producă efecte externe.

## Configurație

| Variabilă | Stare actuală | Contract viitor |
| --- | --- | --- |
| `PORT` | folosită; implicit `4173` | portul serverului Node |
| `HOST` | folosită; implicit `0.0.0.0` | interfața de rețea pe care ascultă serverul |
| `NODE_ENV` | folosită | secure cookie, CSP și serving production |
| `SESSION_SECRET` | fallback doar în development; obligatorie în production | secret unic din secret manager |
| `APP_BASE_URL` | rezervată | linkuri absolute și callback URLs |
| `LOG_LEVEL` | rezervată | nivel pentru loggerul structurat |
| `DATABASE_URL` | nefolosită de runtime | conexiune PostgreSQL server-side |
| `PAYMENT_PROVIDER` și credentialele asociate | selectorul este citit numai pentru warning; checkout-ul rămâne demo | selectarea adaptorului de plată |
| `EMAIL_PROVIDER` și credentialele asociate | selectorul este citit numai pentru warning; registrul rămâne demo | selectarea adaptorului de e-mail |
| `VIDEO_PROVIDER` și credentialele asociate | selectorul este citit numai pentru warning; UI-ul rămâne placeholder | selectarea adaptorului video |

Secretele nu primesc prefix `VITE_` și nu intră în bundle-ul clientului.

## API intern actual

Toate request-urile mutate necesită header-ul `X-Bimael-Request: 1`. Sesiunea este trimisă prin cookie same-origin.

| Metodă și rută | Acces | Efect demo |
| --- | --- | --- |
| `GET /api/health` | public | status și timestamp; `mode: demo` |
| `GET /api/session` | public | utilizatorul curent sau `null` |
| `POST /api/auth/login` | public | setează cookie-ul HttpOnly pentru un cont demo |
| `POST /api/auth/logout` | sesiune opțională | șterge cookie-ul |
| `POST /api/newsletter` | public | validează/deduplică într-un `Set` volatil |
| `POST /api/bookmarks` | membru, autor, editor, administrator | toggle într-un `Map` volatil |
| `POST /api/registrations` | membru, autor, editor, administrator | verifică status/capacitate și emite un ID `TKT-` demo |
| `POST /api/checkout` | membru, autor, editor, administrator | recalculează totalul și simulează statusul plății |
| `POST /api/author/drafts` | autor, editor, administrator | creează draft volatil `in_review` |
| `POST /api/editorial/reviews/:id` | editor, administrator | aprobă draftul și emite un audit ID demo |
| `POST /api/admin/sponsors` | administrator | adaugă un sponsor volatil |

Endpoint-urile necunoscute sub `/api` întorc JSON 404.

## PostgreSQL

`db/migrations/0001_initial.sql` pregătește identitate/sesiuni/RBAC, autori, instituții, taxonomii, articole și versiuni, review, dezbateri, evenimente, webinarii, ticketing, commerce, acces, engagement, sponsori și audit. Folosește UUID-uri, constrângeri, indexuri și full-text GIN.

Schema cere PostgreSQL 15+ și extensia `pgcrypto`. Instrucțiunile sunt în `db/README.md`. Aplicarea migrării nu schimbă comportamentul aplicației până când un `PersistencePort` server-side nu înlocuiește `Map`/`Set` și proiecțiile locale.

Adaptorul trebuie să includă pool, tranzacții, migrations tracking, timeouts, health/readiness și maparea erorilor de constrângere. Backup-ul și restore-ul trebuie testate înainte de producție.

## Plăți

Checkout-ul demo acceptă numai scenariile `approved`, `pending`, `failed`. Serverul ignoră orice preț trimis în plus de client și calculează totalul din seed. Numai `paid` acordă acces în răspuns.

Un adaptor real trebuie să ofere:

- payment intent/session găzduit de provider;
- idempotency key per operație;
- webhook semnat și replay protection;
- mapare `pending_payment → paid | payment_failed | cancelled`;
- acordarea accesului numai după confirmare idempotentă;
- refund separat și auditat;
- nicio dată completă de card în Bimael.

TVA, facturarea, transportul, refund policy și providerul nu sunt încă decise.

## E-mail

Newsletter-ul actual normalizează adresa și o păstrează în memorie; nu trimite confirmare. Un adaptor real necesită double opt-in, template versioning, unsubscribe, bounce/complaint handling, rate limits și retenție conformă.

Trimiterile tranzacționale trebuie declanșate după commit, cu idempotency și outbox/job retry. Request-ul utilizatorului nu trebuie blocat de un provider lent.

## Video și webinarii

Nu există creare de meeting, link securizat, replay, subtitrări sau transcript. Un adaptor real trebuie să separe referința providerului de URL-ul temporar oferit utilizatorului și să verifice eligibilitatea pe server la fiecare acces.

Sunt obligatorii webhook verification, expirare, revocare, timezone, materiale post-eveniment și o politică explicită pentru înregistrare/consimțământ.

## Alte porturi viitoare

- `SearchPort`: PostgreSQL full-text înaintea unui motor dedicat;
- `StoragePort`: S3-compatible, scan hook, transformări și signed URLs;
- `TelemetryPort`: loguri structurate, erori, metrics și traces;
- `CalendarPort`: fișiere ICS înaintea integrării cu calendare externe.

## Activarea unui provider real

1. definește portul și maparea statusurilor de domeniu;
2. implementează adaptorul sandbox și contract tests;
3. validează toate credentialele la startup;
4. păstrează adaptorul demo ca fallback vizibil, fără succes fals;
5. testează timeout, retry, duplicate webhook și outage;
6. documentează secretele, originea CSP și datele transmise;
7. rulează smoke test în preview;
8. activează gradual și monitorizează statusul providerului.
