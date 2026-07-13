# Limitări cunoscute

Stare documentată la 12 iulie 2026.

## Produs și arhitectură

- Implementarea curentă rămâne o experiență React/Vite cu un server Node de suport, nu platforma full-stack completă descrisă în brief.
- Serverul nu oferă încă baza de date, migrations sau persistență multi-user de producție.
- Rutele editoriale, profilurile detaliate, căutarea, conturile, dashboard-urile și stările de eroare nu sunt implementate complet.
- Serverul Node este încă un runtime de dezvoltare/demo și nu reprezintă implementarea finală pentru auth, commerce sau API-uri.

## Adaptoare externe

- `PAYMENT_PROVIDER=demo` nu taxează carduri, nu capturează plăți și nu procesează rambursări.
- `EMAIL_PROVIDER=demo` nu livrează mesaje și nu dovedește confirmarea unei adrese de e-mail.
- `VIDEO_PROVIDER=demo` nu creează întâlniri reale, nu controlează accesul și nu păstrează înregistrări.
- Fără `DATABASE_URL`, datele demo/statice nu sunt persistente și nu trebuie prezentate ca înregistrări reale.
- Adaptoarele reale și validarea credentialelor sunt un contract de arhitectură documentat, nu o integrare activă în codul curent.
- Selectarea unui provider real cu credențiale incomplete trebuie să activeze adaptorul demo și un avertisment vizibil; nu confirmă conectarea la provider.

## Identitate, autentificare și securitate

- Nu există autentificare server-side, verificare e-mail, resetare de parolă, 2FA, RBAC sau management de sesiuni.
- Nu sunt implementate încă rate limiting, audit log, validare server-side, CSRF, politici de upload ori managementul complet al security headers.
- Fluxurile GDPR pentru export, retenție și ștergerea contului lipsesc.
- Nicio interfață actuală nu trebuie folosită pentru date personale sensibile sau operațiuni financiare reale.

## Commerce, evenimente și conținut academic

- Coșul, checkout-ul, taxele, facturarea, inventarul, cupoanele, biletele și refund-urile nu sunt funcționale.
- Webinariile și evenimentele nu oferă încă înregistrare, waitlist, QR check-in, calendar export sau acces securizat.
- Workflow-ul editorial, versionarea, peer review-ul, DOI/ORCID, citările și exporturile bibliografice nu sunt implementate.
- Conținutul și indicatorii existenți sunt demo; nu certifică peer review, afiliere, disponibilitate sau vânzări reale.

## Calitate și operare

- CI presupune existența scripturilor `lint`, `typecheck`, `test` și `build`; lipsa oricăruia blochează workflow-ul în mod intenționat.
- Acoperirea unit, integration, end-to-end, accesibilitate și performanță trebuie extinsă înainte de o lansare publică.
- Nu sunt configurate încă error monitoring, uptime monitoring, tracing, backup automat ori o procedură testată de restore.
- Obiectivele Core Web Vitals și WCAG 2.2 AA nu sunt încă demonstrate prin verificări automate și manuale complete.

## SEO și distribuție

- Livrarea curentă este client-side și are metadata globală limitată; nu oferă încă metadata per rută, structured data, sitemap, RSS sau canonical URLs complete.
- Nu există încă strategie de localizare completă pentru conținut română/engleză.

Aceste limitări trebuie afișate clar în mediile demo și reevaluate la fiecare vertical slice. O funcție nu poate fi declarată activă doar pentru că interfața ei este prezentă.
