# Bimael — specificație de produs

## Statut și scop

Bimael este o platformă editorial-academică premium pentru autori, cercetători și publicul interesat de idei, evenimente și produse culturale. Bimael este marca principală; „Sinapsă & Sens” poate funcționa ca o colecție editorială demonstrativă.

Prima livrare este un **demo integrat și persistent local**, nu un sistem pregătit pentru producție. Demo-ul trebuie să dovedească fluxurile principale cap-coadă, cu adaptoare mock vizibile pentru serviciile externe. Nu se declară finalizat doar pentru că homepage-ul sau aspectul vizual sunt gata.

## Obiective

1. Să prezinte autori și conținut academic într-o experiență editorială memorabilă și accesibilă.
2. Să permită descoperirea, filtrarea, citirea și salvarea conținutului.
3. Să demonstreze înscrierea la evenimente și cumpărarea accesului la webinarii.
4. Să ofere un workflow editorial minim: draft, trimitere la revizie și publicare.
5. Să demonstreze administrarea sponsorilor și controlul accesului pe roluri.
6. Să păstreze integritatea academică: tipul și statutul fiecărui material sunt explicite.
7. Să transpună estetica imaginii 1 și arhitectura funcțională a imaginii 2 fără copiere mecanică.

## Utilizatori

- **Vizitatorul** descoperă autori, articole, domenii, evenimente și produse.
- **Membrul / clientul** salvează materiale, se înscrie la evenimente și obține acces la webinarii.
- **Autorul** își gestionează profilul și propriile drafturi.
- **Recenzorul academic** evaluează doar materialele care îi sunt alocate.
- **Editorul** revizuiește și publică materiale editoriale.
- **Organizatorul** gestionează evenimente, webinarii și înscrieri.
- **Managerul de magazin** gestionează produse și comenzi.
- **Administratorul** gestionează utilizatori, sponsori, parteneri și auditul.

## Sitemap

### P0 — fluxuri obligatorii

| Rută | Scop |
| --- | --- |
| `/` | Copertă editorială: feature, autor, selecție, domenii, agendă, shop, newsletter și parteneri. |
| `/autori` | Index de autori. |
| `/autori/:autorSlug/:sectiune?` | Profil cu secțiunile `biografie`, `articole`, `webinarii`, `evenimente`, `proiecte`, `shop`, `arhiva`, `contact`. |
| `/articole` și `/articole/:slug` | Listă și detaliu pentru eseu, opinie, editorial, preprint, studiu, traducere sau recenzie. |
| `/domenii` și `/domenii/:slug` | Taxonomie și colecții tematice. |
| `/cautare?q=&tip=&domeniu=` | Căutare și filtrare sincronizate în URL. |
| `/evenimente` și `/evenimente/:slug` | Agendă, detaliu și înscriere. |
| `/webinarii` și `/webinarii/:slug` | Catalog, detaliu și acces/replay. |
| `/shop`, `/produse/:slug`, `/cos` | Catalog, produs și coș persistent. |
| `/checkout`, `/checkout/confirmare/:orderId` | Checkout cu plată mock explicită și confirmare. |
| `/autentificare` | Alegerea unei identități demo și revenire la ruta inițială. |
| `/cont`, `/cont/salvate`, `/cont/bilete`, `/cont/webinarii`, `/cont/comenzi` | Contul membrului. |
| `/studio`, `/studio/articole/nou`, `/studio/articole/:id` | Spațiul autorului. |
| `/editorial/revizuire/:id` | Revizie editorială. |
| `/admin/sponsori` | Administrarea sponsorilor. |
| `/403` și ruta wildcard | Acces interzis și 404. |

Secțiunea profilului este parte din URL. Back/forward, reload și deep linking trebuie să păstreze autorul și secțiunea activă.

### P1 — acoperire editorială reprezentativă

Rutele `/prezentare`, `/stiri`, `/dezbateri`, `/povesti`, `/proiecte`, `/arhiva`, `/institutii`, `/contact` și `/politici/:slug` folosesc template-uri comune, dar afișează conținut real și stări relevante. Navigația globală rămâne: Prezentare, Știri, Dezbateri, Domenii, Povești, Contact. Logo-ul central trimite întotdeauna la `/`.

### P2 — după validarea demo-ului

- lucrări academice cu exporturi BibTeX, RIS, APA, MLA și Chicago complete;
- localizare engleză și flux editorial multilingv;
- colaborare multi-autor, certificate și abonamente;
- reduceri, refund, facturare și taxe reale;
- administrare completă pentru utilizatori, taxonomii, homepage și feature flags;
- integrări reale pentru autentificare, plăți, e-mail, video, stocare și căutare.

Funcțiile P2 nu apar ca butoane sau promisiuni dacă nu au un comportament real.

## User journeys critice

1. **Descoperire autor:** Home → Autori → profil → autor anterior/următor. Numele, portretul, datele și URL-ul se schimbă, iar secțiunea curentă se păstrează.
2. **Navigare în profil:** utilizatorul schimbă între Biografie, Articole, Webinarii, Evenimente, Proiecte, Shop, Arhivă și Contact. Scena centrală, starea activă și numărul de elemente se actualizează fără pierderea orientării.
3. **Lectură și salvare:** utilizatorul deschide un articol și îl salvează. Un vizitator este trimis la autentificare cu `returnTo`, apoi revine și bookmark-ul persistă.
4. **Căutare:** utilizatorul introduce o interogare, aplică filtre și deschide un rezultat. URL-ul păstrează căutarea; un rezultat gol oferă resetarea filtrelor.
5. **Eveniment gratuit:** membrul se înscrie, primește o înregistrare și un bilet în cont. Evenimentele sold-out sau închise nu acceptă înscrieri.
6. **Webinar plătit:** membrul adaugă accesul în coș și alege explicit un scenariu mock: aprobat, refuzat sau în așteptare. Doar plata aprobată acordă acces.
7. **Newsletter:** adresa este validată și deduplicată. Interfața spune clar că înscrierea a fost salvată local în demo, fără a pretinde trimiterea unui e-mail.
8. **Autor:** autorul demo creează și editează propriul draft, apoi îl trimite la revizie. Nu își poate publica singur materialul și nu poate edita drafturile altora.
9. **Editor:** editorul cere modificări sau aprobă o versiune. Aprobarea publică versiunea și creează o intrare de audit, fără a schimba artificial statutul academic.
10. **Administrator:** un membru sau autor primește 403 la ruta de administrare; administratorul adaugă ori dezactivează un sponsor, iar zona publică se actualizează.

## Criterii de acceptare

### Funcționale și routing

- Toate rutele P0 și linkurile din navigație au conținut și comportament real; nu există linkuri false sau butoane decorative.
- Logo-ul central trimite la Home de pe orice rută; slugs invalide afișează 404.
- Reload, back/forward și deep linking funcționează pentru profil, căutare și checkout.
- Cele zece journeys trec cap-coadă, iar datele create persistă după refresh și pot fi resetate determinist.
- Plata refuzată sau în așteptare nu acordă acces; sold-out, acces expirat, draft, review și published au stări distincte.
- Adaptorul mock activ este vizibil în autentificare, checkout, webinar și newsletter.

### Design și responsive

- Imaginea 1 dictează atmosfera de hârtie, cerneală, serif/sans, linii fine și ilustrație; imaginea 2 dictează logo-ul, navigația, cele două rail-uri, scena centrală, agenda și sponsorii.
- La minimum 1280 px, profilul are patru zone structurale: rail stâng, scenă, rail drept și agendă.
- La tabletă, agenda trece sub scenă și rail-urile devin taburi; la mobil, navigația globală devine drawer, iar agenda devine listă cronologică.
- La 320, 390, 768 și 1440 px nu există scroll orizontal accidental; țintele tactile au minimum 44 × 44 px.
- Portretele nu au crop distructiv, textul lung rămâne confortabil, iar comerțul nu domină conținutul academic.

### Accesibilitate

- Există skip link, landmarks, ordine corectă a heading-urilor, focus vizibil și erori de formular asociate câmpurilor.
- Drawer-ul și dialogurile gestionează focusul și Escape; taburile, agenda și schimbarea autorului sunt utilizabile doar cu tastatura.
- `prefers-reduced-motion` oprește rotația autorilor, titlurilor și ticker-ul; informația esențială nu depinde de hover.
- axe raportează zero probleme critical/serious pe Home, Profil autor, Articol și Checkout.

### SEO și performanță

- Rutele reprezentative au title, description, canonical, Open Graph și JSON-LD adecvat pentru Person, Article, Event și Product.
- Tipul și statutul academic sunt etichetate onest.
- Imaginile au dimensiuni/aspect-ratio explicite și formate optimizate; nu produc CLS.
- Build-ul production urmărește: JavaScript inițial sub 200 KB gzip, CLS sub 0,1, Lighthouse mobile Performance minimum 85 și Accessibility minimum 95.

### Quality gate

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` și `npm run test:e2e` trec.
- Testele acoperă autorizarea, totalurile, tranzițiile de status, căutarea, capacitatea evenimentelor, accesul după plată și workflow-ul editorial.
- E2E rulează cel puțin la 390 × 844 și 1440 × 900 pentru profil/deep link, căutare, înscriere, checkout aprobat/refuzat, workflow editorial, sponsori și route guards.
- Nu există erori majore în consolă sau overflow (`scrollWidth > clientWidth`) pe viewport-urile testate.

## Limitări explicite ale demo-ului

- Datele sunt seed-uri fictive și persistă în browser, nu în PostgreSQL.
- Autentificarea și RBAC sunt simulări client-side; nu reprezintă securitate server-side.
- Plata, e-mailul, video și căutarea folosesc adaptoare mock/local; nu contactează servicii externe.
- Nu sunt stocate și nu sunt cerute date reale de card.
- Linkul de webinar și accesul la replay nu sunt protejate de un backend.
- Nu există verificare reală DOI/ORCID, peer review, facturare, TVA, refund, upload, antivirus sau signed URLs.
- Demo-ul poate fi declarat finalizat numai pentru scope-ul P0 după trecerea criteriilor de mai sus. Nu poate fi prezentat drept platformă pregătită pentru producție.
