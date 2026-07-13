# Deployment

## Modelul curent de livrare

Imaginea Docker construiește clientul cu Node.js 22 și pornește serverul Node al proiectului prin `npm run start`, pe `PORT=4173`. Serverul livrează artifactul `dist` și găzduiește limitele server-side introduse de vertical slices. În producție, containerul trebuie plasat în spatele unui reverse proxy/CDN cu HTTPS.

Entry point-ul este executat momentan din TypeScript prin `tsx`, de aceea imaginea păstrează arborele complet de dependențe. După introducerea compilării serverului, runtime-ul trebuie redus la JavaScript-ul compilat, `dist` și dependențele de producție, păstrând contractul `PORT` și rularea ca utilizator non-root.

## Configurare

Copiază `.env.example` într-un fișier local neversionat și completează doar valorile necesare mediului:

```sh
cp .env.example .env
```

| Variabilă | Implicit | Rol |
| --- | --- | --- |
| `NODE_ENV` | `development` local, `production` în container | Selectează comportamentul runtime. |
| `PORT` | `4173` | Portul pe care ascultă serverul Node. |
| `HOST` | `0.0.0.0` | Interfața de rețea; necesară pentru expunerea portului Docker. |
| `SESSION_SECRET` | fără default în production | Secret lung, unic, furnizat de secret manager; serverul refuză pornirea fără el. |
| `COOKIE_SECURE` | `true` în production | Folosește `false` numai pentru HTTP local/E2E. |
| `APP_BASE_URL` | `http://localhost:4173` | URL public pentru linkuri absolute și callback-uri. |
| `DATABASE_URL` | gol | URL PostgreSQL server-side. Gol înseamnă date demo/statice, fără conexiune reală. |
| `PAYMENT_PROVIDER` | `demo` | Identificatorul adaptorului de plată. |
| `PAYMENT_API_KEY` | gol | Credential server-side pentru providerul de plată. |
| `PAYMENT_WEBHOOK_SECRET` | gol | Verificarea semnăturii webhook-urilor de plată. |
| `EMAIL_PROVIDER` | `demo` | Identificatorul adaptorului de e-mail tranzacțional. |
| `EMAIL_API_KEY` | gol | Credential server-side pentru e-mail. |
| `EMAIL_FROM` | adresă `.invalid` | Expeditorul verificat la provider. |
| `VIDEO_PROVIDER` | `demo` | Identificatorul adaptorului de webinar/video. |
| `VIDEO_API_KEY` | gol | Credential server-side pentru providerul video. |
| `VIDEO_WEBHOOK_SECRET` | gol | Verificarea webhook-urilor video. |

Nu folosi prefixuri publice precum `VITE_` pentru secrete. Variabilele providerilor trebuie citite exclusiv de server/adaptoare și injectate prin secret manager-ul platformei, nu construite în bundle-ul browserului.

## Regula adaptoarelor demo

Selecția providerilor trebuie să fie deterministă și vizibilă:

1. o variabilă `*_PROVIDER` absentă sau cu valoarea `demo` selectează adaptorul demo;
2. un provider real selectat fără toate credențialele obligatorii revine la adaptorul demo;
3. fallback-ul emite un avertisment structurat la pornire și trebuie afișat ca stare demo în instrumentele administrative;
4. adaptorul demo nu efectuează plăți, nu trimite e-mailuri și nu creează camere video reale;
5. un provider real este activat numai după validarea configurației complete.

`DATABASE_URL` urmează aceeași limită de siguranță: dacă lipsește, aplicația nu încearcă o bază de date reală și folosește sursa demo explicită. După introducerea persistenței, migrațiile trebuie rulate ca pas separat înaintea pornirii noii versiuni.

## Rulare locală

```sh
npm ci
npm run build
PORT=4173 SESSION_SECRET='înlocuiește-cu-un-secret-lung' npm run start
```

Verifică aplicația la `http://localhost:4173`.

## Docker

Construire:

```sh
docker build --tag bimael:local .
```

Rulare cu adaptoarele demo implicite:

```sh
docker run --rm --publish 4173:4173 bimael:local
```

Rulare cu un fișier de mediu local:

```sh
docker run --rm --publish 4173:4173 --env-file .env bimael:local
```

Credentialele nu trebuie copiate în imagine și nici transmise ca build arguments.

## CI

Workflow-ul `.github/workflows/ci.yml` rulează, în ordine:

1. instalare reproductibilă prin `npm ci`;
2. `npm run lint`;
3. `npm run typecheck`;
4. `npm run test`;
5. `npm run build`;
6. publicarea temporară a directorului `dist` ca artifact.

Toate cele patru scripturi de calitate sunt contracte obligatorii ale proiectului. O ramură care le elimină sau nu le implementează trebuie să eșueze în CI.

## Checklist pentru producție

- setează `NODE_ENV=production`, `PORT` și `APP_BASE_URL` corect;
- configurează HTTPS, compresie, caching și security headers la reverse proxy/CDN;
- păstrează secretele într-un secret manager și rotește-le periodic;
- confirmă în loguri și în admin dacă fiecare adaptor rulează în mod `demo` sau real;
- execută smoke tests separate pentru plată, e-mail și video înainte de activarea providerilor reali;
- rulează migrațiile înainte de rollout și verifică backup/restore pentru PostgreSQL;
- configurează health checks, error monitoring, loguri structurate și alerte;
- păstrează versiunea precedentă a imaginii pentru rollback rapid.

## Rollback

Rollback-ul aplicației se face redeployând ultima imagine cunoscută ca stabilă. Migrațiile de date trebuie proiectate backward-compatible; dacă o migrare necesită reversare, procedura și copia de siguranță trebuie validate înainte de rollout. Nu folosi schimbarea automată la adaptoarele demo pentru a masca o eroare a unui provider real: fallback-ul trebuie să fie vizibil și investigat.
