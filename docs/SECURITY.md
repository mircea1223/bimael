# Securitate

## Scop și nivel de încredere

Implementarea curentă este un demo cu controale server-side reale pentru fluxurile reprezentative, dar nu este pregătită pentru utilizatori, date personale sau tranzacții reale. Datele seed sunt fictive. Nu introduce parole personale, date de card, informații medicale sau documente confidențiale.

## Controale implementate

| Zonă | Implementare actuală | Limită |
| --- | --- | --- |
| Sesiune | token semnat HMAC-SHA256, expirare la 8 ore | fără store, revocare sau rotație; payload-ul este semnat, nu criptat |
| Cookie | `HttpOnly`, `SameSite=Lax`, `Secure` în production, `Path=/` | depinde de HTTPS și de un `SESSION_SECRET` sigur |
| RBAC | `requireRole` pe endpoint-urile pentru bookmark, înscriere, checkout, draft, review și sponsori | numai patru roluri runtime; schema SQL pregătește roluri suplimentare |
| Validare | Zod pentru toate body-urile mutate; JSON limitat la 64 KB | nu există încă validare de upload sau antivirus |
| CSRF | mutațiile `/api` cer header-ul `X-Bimael-Request: 1`; fetch folosește same-origin | header-ul custom nu înlocuiește complet tokenul/validarea Origin pentru toate scenariile viitoare |
| Headers | Helmet, CSP, `x-powered-by` dezactivat | CSP permite inline styles; development relaxează script/connect; COEP este dezactivat |
| Parole demo | hash scrypt și comparație timing-safe | aceeași parolă și același salt fix pentru toate conturile; exclusiv demo |
| Preț checkout | recalculat pe server din catalog | catalogul și comenzile sunt volatile |

Guard-urile React ascund sau redirecționează rutele pentru UX. Ele nu acordă autoritate. Serverul verifică separat actorul și rolul pentru fiecare mutație protejată.

## Sesiuni

Cookie-ul se numește `bimael_session`. Tokenul conține `sub` și `exp`, apoi este semnat. Logout-ul șterge cookie-ul, însă serverul nu păstrează o listă de sesiuni și nu poate revoca central un token furat înaintea expirării.

`SESSION_SECRET` trebuie să fie aleator, unic per mediu și injectat prin secret manager. Fallback-ul `bimael-local-demo-secret-change-me` există numai pentru dezvoltare. Un deployment public nu trebuie pornit cu acest fallback.

Exemplu de generare:

```sh
openssl rand -base64 48
```

Înainte de producție sunt obligatorii store de sesiuni, token hash la rest, rotație/revocare, managementul sesiunilor utilizatorului și o politică de expirare testată.

## Autentificare și RBAC

Rolurile runtime sunt `member`, `author`, `editor` și `administrator`:

- `member`: bookmark, înscriere și checkout;
- `author`: aceleași operații plus creare de draft;
- `editor`: creare și aprobare editorială;
- `administrator`: operațiile anterioare și administrarea sponsorilor.

Nu există creare cont, verificare e-mail, resetare parolă, MFA, lockout sau rate limiting. Endpoint-ul de login poate fi supus brute force și nu trebuie expus public în forma actuală. Rolurile extinse din schema PostgreSQL nu sunt active până când adaptorul de identitate nu este conectat.

## CSRF, CORS și request validation

API-ul este same-origin și nu configurează CORS pentru origini terțe. Orice request mutabil necesită `X-Bimael-Request: 1`. Pentru producție trebuie adăugate:

- validarea strictă a `Origin`/`Referer` sau token CSRF legat de sesiune;
- allowlist explicit dacă apare un client pe alt origin;
- rate limiting diferențiat pentru login, newsletter, checkout și operații administrative;
- limite de request și timeout la reverse proxy;
- mesaje de eroare care nu dezvăluie existența contului.

## CSP și conținut

În production, CSP limitează implicit resursele la `'self'`, imaginile la `'self'`/`data:` și conexiunile la `'self'`. Orice provider nou trebuie adăugat minimal, pe directiva corectă, după analiză. Nu relaxa `script-src` global pentru un widget extern; preferă redirect sau iframe izolat și documentează originea.

React encodează textul implicit. Conținutul editorial bogat nu trebuie introdus ulterior prin `dangerouslySetInnerHTML` fără sanitizare server-side și o politică pentru linkuri, embeds și formule.

## Secrete și date

- nu prefixa secretele cu `VITE_`;
- nu comite `.env`, tokenuri, webhook secrets sau dump-uri de producție;
- nu loga cookie-uri, parole, date de card sau conținut academic confidențial;
- `DATABASE_URL` și cheile providerilor aparțin exclusiv runtime-ului server;
- datele de card trebuie găzduite de providerul de plată; Bimael nu le stochează;
- upload-urile viitoare necesită MIME allowlist, limită, scan hook, nume opace și signed URLs.

## Limitări care blochează producția

- secret fallback și conturi/parolă demo publice;
- lipsă rate limiting, MFA, resetare și verificare e-mail;
- sesiuni fără store și revocare;
- stocare volatilă și fără audit persistent;
- protecție CSRF simplificată;
- fără management de consimțământ, retenție, export și ștergere GDPR;
- fără dependency scanning/SAST/secrets scanning obligatorii în CI;
- fără backup/restore, incident response sau observability de securitate.

## Raportarea unei vulnerabilități

Raportează vulnerabilitățile privat către maintainerii repository-ului, cu ruta, impactul și pași minimali de reproducere. Nu include date reale și nu deschide public un exploit funcțional înainte ca echipa să confirme canalul de remediere.

