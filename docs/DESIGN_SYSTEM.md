# Bimael — design system

## Statut

Acest document este normativ pentru toate suprafețele Bimael: public, cont, studio de autor și administrare. O componentă nouă trebuie să reutilizeze tokenurile și contractele de stare de aici. Excepțiile se documentează înainte de implementare.

Design system-ul urmărește patru obiective:

1. autoritate intelectuală fără rigiditate instituțională;
2. lizibilitate pentru conținut editorial și academic lung;
3. o identitate tactilă, coerentă, care nu devine decor peste funcție;
4. comportament previzibil și accesibil pe orice rută reprezentativă.

## Delimitarea strictă a referințelor

### Imaginea 1 — numai direcție artistică

Din Imaginea 1 se extrag:

- atmosfera de hârtie caldă și cerneală;
- contrastul dintre titlu serif, text de lectură, italic și metadate utilitare;
- liniile capilare, spațiul negativ și ritmul de revistă culturală;
- portretul monocrom în tuș sau gravură;
- cartușul editorial, brush stroke-ul controlat și caracterul de ex-libris;
- cromatica restrânsă și densitatea asimetrică, dar echilibrată.

Nu se extrag din Imaginea 1:

- grila exactă;
- dimensiunile sau pozițiile exacte;
- ordinea responsive;
- o obligație de a avea coloana de citat, aceleași asset-uri ori același raport între zone;
- conținutul demonstrativ.

Reproducerea aproape identică a compoziției Imaginii 1 este o încălcare a brief-ului, chiar dacă rezultatul este elegant.

### Imaginea 2 — numai arhitectură și comportament

Din Imaginea 2 se extrag:

- logo central care trimite întotdeauna la Home;
- navigația globală;
- pagina de autor în patru zone: rail stâng, centru dominant, rail drept și agendă;
- schimbarea conținutului central din navigația autorului;
- cartușul contextual, schimbarea autorului și zona de sponsori;
- continuitatea vizuală în timpul schimbării de stare.

Nu se extrag din Imaginea 2:

- aspectul de schiță;
- chenarele, proporțiile, forma cercului sau scrisul de mână;
- o compoziție desktop comprimată pe mobil;
- cerința ca toate elementele să rămână simultan vizibile.

Regula de control este simplă: **Imaginea 1 răspunde la „cum arată?”, Imaginea 2 răspunde la „cum este organizat și cum funcționează?”**.

## Principii vizuale

- **Editorial, nu template:** ierarhia se construiește prin scară, ritm, aliniere și linii fine, nu printr-o succesiune de carduri identice.
- **Centrul are prioritate:** pe profilul autorului, identitatea și secțiunea activă sunt mai importante decât rails, agenda sau comerțul.
- **Materialitate discretă:** textura trebuie percepută la a doua privire. Nu reduce contrastul și nu produce zgomot sub text.
- **Comerț subordonat:** produsele și CTA-urile comerciale folosesc aceeași gramatică, fără culori sau umbre de marketplace.
- **Funcția este vizibilă:** elementele interactive au stare, focus și destinație reală. Niciun element decorativ nu imită un control.
- **Variație controlată:** paginile pot avea ritmuri diferite, dar folosesc aceleași tokenuri, forme, focus și motion.

## Tokenuri de culoare

Valorile de mai jos sunt punctul de plecare pentru tema luminoasă. Raporturile au fost calculate față de fundalul indicat și trebuie reverificate după orice schimbare.

| Token semantic | Valoare | Utilizare | Contrast |
| --- | --- | --- | --- |
| **--color-canvas** | #EFE8D8 | fundalul principal, hârtie caldă | — |
| **--color-surface** | #F7F2E8 | panouri editoriale și formulare | — |
| **--color-surface-muted** | #E7DFCF | zone secundare, skeleton | — |
| **--color-ink** | #17130E | text principal, titluri | 15.15:1 pe canvas |
| **--color-text-muted** | #5F5649 | text secundar | 5.90:1 pe canvas |
| **--color-text-subtle** | #6C6254 | metadate mici | 4.90:1 pe canvas |
| **--color-accent** | #6F5126 | stare activă, link, focus | 5.97:1 pe canvas |
| **--color-accent-soft** | #D8C59D | fundal selectat, nu text | — |
| **--color-burgundy** | #702F36 | accent rar și statut special | 8.01:1 pe canvas |
| **--color-border** | rgba(23, 19, 14, .22) | separatoare decorative | — |
| **--color-border-control** | #766F63 | contur de control | minimum 3:1 |
| **--color-inverse-bg** | #17130E | CTA primar, suprafață inversă | — |
| **--color-inverse-ink** | #F7F2E8 | text pe inverse-bg | 16.57:1 |
| **--color-disabled-ink** | #766F63 | control dezactivat, neesențial | 3.64:1 pe disabled-bg |
| **--color-disabled-bg** | #E2DCCF | control dezactivat | — |

Nu se folosește opacitate pe text pentru a crea ierarhie. Se alege un token opac cu contrast cunoscut.

### Tokenuri de stare

| Stare | Text | Fundal | Contrast |
| --- | --- | --- | --- |
| succes / deschis | #275134 | #DFE8DD | 7.23:1 |
| avertizare / puține locuri | #68440D | #F3E5C8 | 6.96:1 |
| eroare / sold out | #7A2929 | #F1DDDD | 7.41:1 |
| informație / online | #264E63 | #DCE8ED | 7.15:1 |

Starea include întotdeauna un text sau un simbol cu nume accesibil. Culoarea nu este singurul semnal.

### Tema întunecată

Tema întunecată este un enhancement, nu un criteriu pentru prima livrare. Se activează numai dacă toate rutele și asset-urile trec aceleași verificări.

| Token | Valoare propusă | Contrast pe #17130E |
| --- | --- | --- |
| canvas | #17130E | — |
| surface | #201B14 | — |
| ink | #F3ECD9 | 15.68:1 |
| text-muted | #C3B9A4 | 9.50:1 |
| text-subtle | #A79D8A | 6.90:1 |
| accent | #D2B171 | 9.04:1 |
| burgundy | #E0A1AA | 8.67:1 |

Nu se inversează automat logo-uri, fotografii sau portrete cu filter. Fiecare asset primește o variantă aprobată ori rămâne pe o suprafață luminoasă dedicată.

## Tipografie

### Familii

- **--font-serif:** o serif variabilă editorială, cu diacritice românești complete, optical sizing și lizibilitate bună la text lung; fallback Georgia, serif.
- **--font-sans:** o sans variabilă neutră pentru navigație, controale, tabele și metadate; fallback system-ui, sans-serif.
- Nu se bazează identitatea pe fonturi disponibile doar pe macOS precum Bodoni 72, Hoefler Text sau Iowan Old Style.
- Se livrează maximum două familii variabile, subsetate pentru limbile suportate.

### Roluri

| Rol | Familie | Greutate | Line-height | Utilizare |
| --- | --- | --- | --- | --- |
| display | serif | 550–650 | .95–1.05 | H1, feature editorial |
| heading | serif | 550–650 | 1.08–1.2 | H2–H4, titluri de card |
| reading | serif | 400–500 | 1.58–1.72 | articol, biografie |
| quote | serif italic | 400–500 | 1.4–1.6 | citate și cartuș |
| utility | sans | 500–650 | 1.2–1.45 | navigație, butoane |
| metadata | sans | 500–650 | 1.25–1.5 | date, categorii, status |

Small caps se folosesc numai când fontul oferă glyph-uri reale. În lipsă, se folosește text normal cu tracking moderat; nu se simulează prin uppercase pentru pasaje lungi.

### Scară fluidă

| Token | Valoare recomandată |
| --- | --- |
| **--text-caption** | clamp(.75rem, .72rem + .12vw, .8125rem) |
| **--text-meta** | clamp(.8125rem, .78rem + .16vw, .9rem) |
| **--text-body** | clamp(1rem, .96rem + .18vw, 1.125rem) |
| **--text-body-lg** | clamp(1.0625rem, 1rem + .28vw, 1.25rem) |
| **--text-title-sm** | clamp(1.25rem, 1.1rem + .65vw, 1.625rem) |
| **--text-title-md** | clamp(1.625rem, 1.3rem + 1.2vw, 2.25rem) |
| **--text-title-lg** | clamp(2.125rem, 1.55rem + 2.4vw, 3.75rem) |
| **--text-display** | clamp(2.75rem, 1.8rem + 4vw, 5.5rem) |

Textul de lectură are 60–75 caractere pe rând. Abstractul poate ajunge la 80ch; metadatele și notele nu coboară sub 12 px echivalent.

## Spațiere, dimensiuni și geometrie

### Spațiere

Scara este 4, 8, 12, 16, 24, 32, 48, 64 și 96 px. Valorile fluide interpolează numai între două trepte ale scării.

| Token | Valoare |
| --- | --- |
| **--space-1** | .25rem |
| **--space-2** | .5rem |
| **--space-3** | .75rem |
| **--space-4** | 1rem |
| **--space-6** | 1.5rem |
| **--space-8** | 2rem |
| **--space-12** | 3rem |
| **--space-16** | 4rem |
| **--space-24** | 6rem |

### Containere

- **--measure-reading:** 68ch;
- **--measure-abstract:** 80ch;
- **--container-page:** 82rem / 1312 px;
- **--container-author:** 90rem / 1440 px;
- **--gutter:** clamp(1rem, 3vw, 4rem);
- **--control-min:** 2.75rem / 44 px.

### Formă

- **--radius-none:** 0;
- **--radius-xs:** 2 px;
- **--radius-sm:** 6 px;
- **--radius-pill:** 999 px, numai pentru badge și status;
- **--border-hairline:** 1 px;
- **--focus-width:** 2 px;
- **--focus-offset:** 3 px.

Geometria de bază este aproape rectangulară. Radius mare, glassmorphism și umbre de dashboard sunt interzise.

### Umbre

- **--shadow-raised:** 0 1px 0 rgba(23, 19, 14, .05), 0 18px 40px -32px rgba(23, 19, 14, .45);
- **--shadow-overlay:** 0 24px 72px -24px rgba(23, 19, 14, .45).

Componentele editoriale preferă borduri și contrast de suprafață. Umbra este rezervată drawer-ului, dialogului și cartușului desprins de plan.

## Motion

| Token | Valoare | Utilizare |
| --- | --- | --- |
| **--motion-fast** | 120 ms | focus, hover, icon |
| **--motion-base** | 180 ms | control, panel mic |
| **--motion-slow** | 260 ms | drawer, schimbare de secțiune |
| **--ease-editorial** | cubic-bezier(.2, .7, .2, 1) | tranziție standard |

Reguli:

- niciun conținut editorial nu pornește automat prin rotație sau ticker;
- tranzițiile nu depășesc 300 ms pentru schimbarea secțiunii;
- skeleton-ul nu pulsează agresiv;
- la prefers-reduced-motion duratele devin 0 ms, iar scroll-ul programatic nu este animat;
- View Transitions API este enhancement cu fallback, nu dependență.

## Textură

- Textura este un layer decorativ cu contrast foarte mic, nu o imagine de fundal opacă.
- Opacitatea vizuală recomandată este 2–5% pe canvas și 0% sub formulare, tabele sau pasaje dense dacă afectează lizibilitatea.
- Se livrează comprimat, fără layout shift, și poate fi dezactivat pentru reduced data.
- Nu se folosește background-attachment fixed pe mobil.
- Textura nu este dublată independent pe body și header; continuitatea trebuie să fie calmă, fără cost de repaint inutil.

## Inventarul componentelor

### Shell global

- Header și GlobalNavigation;
- LogoHomeLink;
- MobileNavigationDrawer;
- ThemeControl, numai dacă tema întunecată este completă;
- SearchDialog;
- AccountMenu;
- Breadcrumbs;
- Footer.

### Autor

- AuthorLayout;
- AuthorRail;
- AuthorIdentity;
- AuthorPortrait;
- AuthorSectionPanel;
- EditorialCartouche;
- AuthorSwitcher;
- AuthorActions;
- Agenda și EventRow;
- SponsorStrip și PartnerGrid.

### Editorial și descoperire

- ArticleFeature și ArticleTeaser;
- ScholarlyMetadata;
- TableOfContents;
- CitationBlock;
- DomainRow;
- DebatePreview;
- ProjectCard;
- SearchField, FilterGroup și ResultsList;
- Pagination.

### Program și commerce

- EventCard, WebinarCard;
- AvailabilityBadge;
- ProductCard;
- Price;
- CartLine;
- CheckoutSummary;
- PaymentState.

### Primitive și feedback

- Button, Link, IconButton;
- Tabs, Accordion, Dialog, Drawer, Popover și Tooltip;
- Field, Label, Input, Select, Checkbox, Radio și ErrorMessage;
- Alert, StatusMessage, Toast;
- Skeleton, EmptyState, ErrorState și OfflineState.

## Contracte de componentă

### LogoHomeLink

- este link real către ruta /;
- are aria-label „Bimael — Acasă” și imagine decorativă cu alt gol, sau imagine cu alt „Bimael” fără etichetă redundantă;
- ținta are minimum 44 × 44 px;
- nu folosește anchor local de tip #home;
- pe mobil rămâne vizibil, dar nu obligă masthead-ul complet să fie sticky.

### Header

- masthead-ul editorial amplu poate exista la începutul paginii;
- numai o bară compactă de maximum 72 px poate deveni sticky;
- include navigație reală, search și account atunci când funcțiile există;
- aria-current este derivat din rută;
- pe mobil navigația globală devine drawer, nu două rânduri de linkuri strânse.

### AuthorRail

- folosește linkuri de rută când secțiunea este deep-linkable;
- stările sunt default, hover, focus-visible, current, pending și disabled;
- current are cel puțin două indicii: contrast + marcaj/linie/greutate;
- count-ul nu intră în numele linkului dacă nu adaugă valoare; dacă intră, se anunță natural;
- un rail nu se ascunde fără un înlocuitor mobil.

### AuthorSectionPanel

- are heading propriu și aria-labelledby;
- păstrează dimensiuni stabile la pending pentru a limita CLS;
- suportă loading, empty, error, offline, unauthorized, forbidden și success;
- schimbarea rutei păstrează istoricul și poate fi restaurată prin reload;
- conținutul nou nu este anunțat prin live region dacă navigația și heading-ul oferă deja context.

### EditorialCartouche

- este notă marginală, fragment de manuscris sau cartuș tipografic, nu balon comic;
- suportă 1–3 rânduri fără înălțime fixă;
- nu acoperă fața, numele sau controlul de schimbare;
- dacă este link, întreaga funcție este semantică și focusabilă; dacă este citat, nu primește role button;
- conținutul nu se schimbă aleator și nu produce anunțuri live automate.

### AuthorSwitcher

- folosește previous/next și indicator „n din total”;
- schimbă portretul, numele, datele și URL-ul ca o singură tranzacție;
- păstrează secțiunea curentă dacă există la autorul următor;
- butoanele au 44 × 44 px și nume accesibile;
- nu folosește role tab fără tabpanel;
- nu pornește automat. Dacă produsul aprobă autoplay, oferă Pause/Play și respectă reduced motion.

### Agenda și EventRow

- Agenda este aside etichetat cu heading;
- EventRow este link sau componentă cu CTA real, nu article cu tabindex și cursor pointer fără acțiune;
- data folosește element time cu datetime ISO;
- afișează tip, titlu, oră, timezone, locație/online, preț, disponibilitate și CTA;
- stările sunt registration-open, free, few-seats, sold-out, coming-soon, ended și replay-available;
- pe mobil lista este cronologică. Nu se dublează DOM-ul pentru un loop vizual.

### SponsorStrip

- este o regiune distinctă în pagina autorului și pe Home;
- ordinea și nivelul sponsorilor vin din date;
- logo-urile au tratament monocrom coerent și variante de contrast;
- fiecare sponsor are link real, nume accesibil și focus vizibil;
- suportă empty state fără a lăsa o bandă goală.

### Button și Link

| Stare | Cerință |
| --- | --- |
| default | contrast AA, affordance clară, țintă 44 × 44 unde este tactilă |
| hover | schimbare discretă; nu este singurul indiciu |
| focus-visible | ring de 2 px, contrast minimum 3:1, offset 3 px |
| active | feedback imediat fără deplasarea layout-ului |
| current/selected | semantică aria-current sau aria-selected corectă |
| pending | text stabil, indicator și blocarea acțiunii duplicate |
| disabled | atribut disabled când este control nativ; explicație dacă motivul nu este evident |

Nu se aplică tabindex=0 unui element non-interactiv pentru a-l face să pară control.

### FormField

- label-ul este vizibil;
- ajutorul și eroarea sunt asociate prin aria-describedby;
- required este explicat textual;
- eroarea nu șterge valoarea și mută focusul numai la submit invalid;
- placeholder-ul este exemplu, nu label;
- success nu pretinde o integrare externă care nu a avut loc.

## Stări de produs

Fiecare rută reprezentativă trebuie să demonstreze stările relevante, nu doar happy path:

- loading și skeleton;
- empty și no-results;
- error și retry;
- offline;
- unauthorized și forbidden;
- not found și rate limited;
- draft, scheduled, under-review, published și archived;
- registration-open, closed, sold-out și ended;
- access-active, expired și unavailable;
- payment-pending, approved și failed.

Textul stării explică ce s-a întâmplat, ce date s-au păstrat și ce poate face utilizatorul în continuare.

## Reguli anti-pattern

Sunt interzise:

- carduri identice pentru toate tipurile de conținut;
- albastru SaaS generic, neon, gradient comercial și glassmorphism;
- hover ca singur acces la informație;
- butoane fără acțiune și linkuri către ancore inexistente;
- ticker, carusel sau schimbare de autor fără control;
- text mic cu opacitate;
- iconuri din familii vizuale diferite;
- shadow puternic pe componente editoriale;
- dark mode realizat prin invert global;
- valori arbitrare repetate în componente;
- layout care reproduce pixel cu pixel una dintre referințe.

## Quality gate

O componentă intră în design system numai dacă:

1. folosește tokenuri semantice;
2. are toate stările relevante;
3. funcționează la 320, 390, 768, 1024, 1280 și 1440 px;
4. are exemplu cu text românesc lung și conținut gol;
5. este utilizabilă cu tastatura și la 200–400% zoom;
6. respectă prefers-reduced-motion;
7. trece contrastul și axe fără probleme critical/serious;
8. nu presupune hover, un anumit font de sistem sau un asset încărcat;
9. are contractul de rutare/focus documentat;
10. arată ca parte din Bimael pe suprafețe editoriale, comerciale și administrative.
