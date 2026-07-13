# ADR 0001 — Modular monolith într-un singur deployment

- Statut: Acceptat
- Data: 2026-07-12
- Decidenți: echipa Bimael

## Context

Bimael combină domenii care vor evolua împreună: identitate, editorial, autori, evenimente, webinarii, commerce, engagement și administrare. Produsul are nevoie de limite clare și autorizare server-side, dar nu are încă volum, echipe autonome sau cerințe de scalare care să justifice microservicii.

Implementarea existentă este un singur repository cu React/Vite/TypeScript, Express și o schemă PostgreSQL pregătită. Datele runtime sunt încă volatile sau locale.

## Decizie

Adoptăm un modular monolith livrat ca un singur proces/aplicație Node și un singur artifact client. Separarea este logică, prin dependențe și contracte, nu prin rețea.

Straturile curente sunt:

1. `src/pages` și `src/components`: prezentare și interacțiune;
2. `src/app`: orchestrare client, apeluri API și proiecții locale;
3. `src/domain`: tipuri, reguli și servicii pure, fără React sau Express;
4. `server`: sesiuni, validare, autorizare și use cases HTTP;
5. `db`: schema și seed-ul PostgreSQL, fără cuplare încă la runtime;
6. adaptoare externe: demo implicit, cu porturi explicite înaintea unei integrări reale.

Regula de dependență dorită este:

```text
UI → application → domain/ports ← adapters
                     ↑
                 server use cases
```

Modulele de business sunt `identity`, `editorial`, `authors`, `program`, `commerce`, `engagement` și `administration`. În această etapă directoarele sunt organizate mai ales pe strat; pe măsură ce use case-urile cresc, ele se grupează și pe modul fără a duplica modelele.

## Reguli

- UI-ul nu reprezintă o limită de securitate; fiecare mutație verifică sesiunea și rolul pe server.
- Domeniul nu importă React, router, Express, browser APIs sau un provider extern.
- Totalurile, statusurile și drepturile de acces nu sunt acceptate ca adevăr din request-ul clientului.
- Un modul nu modifică direct stocarea altui modul; folosește un use case sau un port.
- Integrarea externă intră printr-un adaptor separat și are o implementare demo testabilă.
- Evenimentele interne sunt introduse numai când decuplează un efect real; nu adăugăm un bus distribuit preventiv.
- PostgreSQL devine sursa de adevăr numai după conectarea adaptorului și a migrărilor la server.

## Consecințe pozitive

- un singur setup, deployment și traseu de debugging;
- tranzacții locale între module după activarea PostgreSQL;
- tipuri și reguli reutilizabile fără apeluri de rețea interne;
- cost operațional redus pentru stadiul produsului;
- limite suficient de clare pentru extracție ulterioară dacă apar motive măsurabile.

## Costuri și riscuri

- limitele sunt disciplină de cod și pot fi încălcate fără teste de arhitectură;
- un deployment defect poate afecta toate modulele;
- runtime-ul TypeScript prin `tsx` păstrează devDependencies în imaginea curentă;
- stocarea volatilă nu oferă tranzacții, concurență sigură sau recuperare după restart;
- clientul este încă SPA, fără rendering hibrid sau Server Components.

## Alternative respinse

### Microservicii de la început

Respinse: ar introduce autentificare între servicii, observability distribuită, contracte de rețea și consistență eventuală înainte ca produsul să aibă nevoie de ele.

### SPA static fără server

Respinsă ca arhitectură țintă: nu poate impune RBAC, calcula sigur checkout-ul sau proteja accesul la materiale.

### CMS/commerce complet externalizat

Amânat: furnizorii și politicile editoriale/comerciale nu sunt încă decise. Porturile păstrează opțiunea deschisă.

## Criterii de reevaluare

Reanalizăm decizia când există cel puțin una dintre situațiile următoare:

- un modul necesită scalare sau disponibilitate independentă demonstrată prin măsurători;
- echipe diferite au cicluri de release realmente independente;
- procesarea media sau indexarea consumă resurse care afectează request-urile interactive;
- cerințe de izolare/reglementare nu pot fi satisfăcute într-un singur deployment.

Până atunci, search indexing și media processing sunt primii candidați pentru workers, nu identity, editorial sau commerce core.

