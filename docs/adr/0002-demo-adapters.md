# ADR 0002 — Adaptoare demo explicite pentru serviciile externe

- Statut: Acceptat; implementare parțială
- Data: 2026-07-12
- Decidenți: echipa Bimael

## Context

Fluxurile Bimael depind în viitor de PostgreSQL, procesare de plăți, e-mail tranzacțional și un provider video. Furnizorii, jurisdicția, contractele și credentialele nu sunt încă alese. Demo-ul trebuie totuși să demonstreze tranzițiile de business fără să pretindă că produce efecte externe.

## Decizie

Fiecare integrare externă va avea un port și cel puțin două adaptoare: `demo` și provider real. Modul demo este implicit și trebuie să fie vizibil în UI, health/loguri și răspunsurile relevante.

Contractul de configurare este:

- `DATABASE_URL` pentru PostgreSQL;
- `PAYMENT_PROVIDER`, `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`;
- `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`;
- `VIDEO_PROVIDER`, `VIDEO_API_KEY`, `VIDEO_WEBHOOK_SECRET`.

Un provider absent, setat la `demo` sau selectat fără credentialele obligatorii nu produce apeluri externe. În runtime-ul actual, serverul observă un selector non-demo, emite un warning structurat `provider_fallback` și păstrează comportamentul demo. Credentialele rămân un contract documentat până la implementarea resolverului și a adaptoarelor reale.

## Comportamentul curent

### Plată

- clientul trimite produsele/cantitățile și scenariul `approved`, `pending` sau `failed`;
- serverul recalculează totalul din catalogul seed, nu acceptă prețul clientului;
- numai rezultatul `paid` acordă `accessGranted`;
- răspunsul declară `provider: demo`;
- nu se cer și nu se stochează date de card.

### E-mail

- abonarea validează și normalizează adresa;
- adresa intră într-un `Set` volatil și este deduplicată;
- nu se trimite mesaj și interfața nu trebuie să pretindă livrarea unuia.

### Video

- UI-ul poate afișa eligibilitatea/replay-ul demo;
- nu se creează camere, linkuri semnate, înregistrări sau transcripturi;
- accesul real nu este protejat de un provider.

### Persistență

- schema PostgreSQL este pregătită în `db/migrations`;
- serverul folosește `Map`/`Set`, iar clientul folosește `localStorage` pentru proiecții;
- `DATABASE_URL` nu este citit de un adaptor runtime și restartul pierde starea serverului.

## Cerințe pentru un adaptor real

- validarea configurației la pornire;
- secret exclusiv server-side;
- timeout, retry limitat și circuit/open-state observabil;
- idempotency pentru mutații și webhook-uri;
- verificarea criptografică a webhook-urilor înainte de procesare;
- mapare explicită între statusurile providerului și statusurile domeniului;
- loguri fără credentiale, date de card sau conținut sensibil;
- contract tests comune cu adaptorul demo;
- health/readiness care diferențiază `demo`, `configured`, `degraded` și `unavailable`.

## Guardrails

- modul demo este etichetat în toate fluxurile comerciale și de comunicare;
- un ID `ORD-`, `TKT-` sau `audit-` demo nu este dovadă a unui efect extern;
- fallback-ul demo nu poate fi folosit pentru a raporta fals succesul unui provider real;
- în producție, activarea demo trebuie să fie vizibilă și alertată;
- nu se introduce un adaptor real înainte de teste sandbox și procedură de rollback.

## Consecințe

Demo-ul rămâne determinist, ieftin și sigur pentru evaluare. Dezavantajul este că o interfață completă poate părea mai matură decât infrastructura; de aceea etichetele, documentația și telemetry trebuie să spună mereu ce este simulat.
