# Bimael — ghid responsive

## Scop

Responsive-ul Bimael este o reorganizare intenționată a informației, nu o micșorare a desktopului. Ierarhia rămâne:

1. orientare globală;
2. identitatea și conținutul autorului;
3. navigația secțiunilor autorului;
4. agenda;
5. sponsori și parteneri.

Acest ghid este normativ pentru toate vertical slice-urile. Regulile de contrast, focus, touch și motion sunt definite în DESIGN_SYSTEM.md și ACCESSIBILITY.md.

## Rolurile referințelor

- **Imaginea 1** furnizează numai atmosfera: hârtie caldă, cerneală, tipografie editorială, linii fine, ilustrație și ritm. Nu furnizează grila responsive.
- **Imaginea 2** furnizează relațiile: logo Home, navigație globală, rail stâng, centru, rail drept, agendă, switcher și sponsori. Nu furnizează proporții.

La orice conflict, ordinea de decizie este: claritate, accesibilitate, ierarhie editorială, coerență vizuală, apoi asemănare cu referința.

## Breakpoints și moduri de compoziție

Breakpoints sunt determinate de momentul în care conținutul nu mai încape confortabil. Nu se adaugă breakpoint pentru a repara o singură valoare arbitrară.

| Mod | Interval | Compoziție principală |
| --- | --- | --- |
| telefon mic | 0–359 px | o coloană, control compact, fără scroll orizontal |
| telefon | 360–767 px | o coloană, drawer global, disclosure pentru secțiuni |
| tabletă | 768–1023 px | centru dominant, rails transformate în grupuri de taburi/linkuri, agenda dedesubt |
| desktop compact | 1024–1279 px | trei coloane autor, agenda pe rând separat |
| desktop | 1280–1439 px | patru zone: rail stâng, centru, rail drept, agendă |
| desktop mare | minimum 1440 px | aceleași patru zone, spațiu negativ mai generos; nu se lărgește nelimitat textul |

Valorile de test obligatorii sunt 320 × 568, 390 × 844, 768 × 1024, 1024 × 768, 1280 × 800 și 1440 × 900.

## Containere și gutters

- container editorial standard: maximum 1312 px;
- container profil autor: maximum 1440 px;
- măsură text lung: 68ch;
- gutter: clamp(16 px, 3vw, 64 px);
- spațiere verticală de secțiune: clamp(48 px, 7vw, 96 px);
- niciun element informativ nu este poziționat față de viewport cu coordonate fixe.

La ecrane foarte mari, marginile cresc. Coloana de lectură și agenda nu devin excesiv de late.

## Ordinea DOM

Ordinea DOM trebuie să rămână logică fără CSS:

1. skip link;
2. header;
3. breadcrumb sau indicator de secțiune;
4. main;
5. identitate autor și cartuș;
6. navigația autorului;
7. conținutul secțiunii active;
8. agenda;
9. sponsori;
10. footer.

Pe desktop, grid-ul poate așeza rails lateral. Nu se folosește order pentru a crea o ordine vizuală diferită de cea de citire. Numele și afilierea autorului nu trebuie să ajungă după agendă pe tabletă sau mobil.

## Header

### Desktop

- masthead-ul inițial poate avea logo central și brand metadata lateral;
- navigația globală stă pe un rând separat, cu delimitare capilară;
- masthead-ul amplu nu este sticky;
- dacă este necesară persistența, după scroll apare o bară compactă de maximum 72 px cu logo simplificat, navigație esențială, search și account;
- focusul pe ancore nu este ascuns sub bara compactă; se folosește scroll-margin-top.

### Tabletă și mobil

- logo-ul rămâne Home și are dimensiune vizuală aproximativă 80–96 px;
- headerul compact are maximum 72 px, exceptând safe-area;
- un buton „Meniu” deschide drawer-ul; iconul singur este permis numai cu nume accesibil;
- search și account pot fi în drawer, dar funcțiile critice nu dispar;
- lista globală nu se împachetează pe două sau trei rânduri în header;
- drawer-ul folosește 100dvh, safe-area-inset și poate derula independent.

## Pagina autorului

### Desktop — minimum 1280 px

Compoziția este în patru zone:

| Zonă | Lățime orientativă | Conținut |
| --- | --- | --- |
| rail stâng | minmax(160 px, .7fr) | Biografie, Articole, Webinarii, Evenimente |
| centru | minmax(448 px, 2.2fr) | cartuș, portret, identitate, acțiuni, secțiune activă |
| rail drept | minmax(160 px, .7fr) | Proiecte, Shop, Arhivă, Contact |
| agendă | minmax(288 px, 1fr) | evenimente și webinarii |

Recomandare de grid:

~~~css
.author-layout {
  display: grid;
  grid-template-columns:
    minmax(10rem, .7fr)
    minmax(28rem, 2.2fr)
    minmax(10rem, .7fr)
    minmax(18rem, 1fr);
  gap: clamp(1rem, 2vw, 2rem);
  align-items: start;
}
~~~

Reguli:

- centrul este cea mai contrastantă și mai stabilă zonă;
- cartușul nu iese din container și nu acoperă portretul;
- rails nu comprimă centrul sub 448 px;
- agenda are scroll intern numai dacă există o limită de înălțime justificată și un affordance clar; preferința este flux natural;
- sponsorii ocupă un rând separat sub toate cele patru zone.

### Desktop compact — 1024–1279 px

- se folosesc trei coloane: rail stâng, centru, rail drept;
- agenda trece sub ele, pe toată lățimea sau într-un grid de maximum trei evenimente;
- centrul păstrează minimum 420 px;
- un citat decorativ exterior se elimină înainte de a comprima informația;
- acțiunile autorului pot trece pe două rânduri, păstrând 44 px per control.

### Tabletă — 768–1023 px

Ordinea vizuală:

1. cartuș;
2. portret și identitate;
3. acțiuni;
4. navigația autorului;
5. secțiunea activă;
6. agenda;
7. sponsori.

Rails devin două grupuri compacte:

- „Conținut”: Biografie, Articole, Webinarii, Evenimente;
- „Resurse”: Proiecte, Shop, Arhivă, Contact.

Grupurile pot fi taburi cu wrapping controlat sau un selector de secțiune. Nu se comprimă opt etichete într-un singur rând și nu se cere swipe pentru a descoperi destinații esențiale.

Agenda este listă sau grid cu două coloane. Nu rulează automat.

### Telefon — sub 768 px

Ordinea este strictă:

1. indicator autor / breadcrumb;
2. cartuș contextual;
3. portret fără crop;
4. H1, titlu academic, afiliere și domenii;
5. acțiunile primare;
6. switcher autori;
7. selectorul secțiunii;
8. conținutul central;
9. agenda cronologică;
10. sponsori.

Navigația autorului recomandată este un disclosure „Secțiune: Biografie” care deschide două liste semantice. Dacă se folosesc taburi, ele trebuie să încapă pe maximum două coloane și să respecte modelul de tastatură documentat.

Pe mobil:

- portretul folosește object-fit contain și raport stabil;
- cartușul nu are width fix; maximum 32ch;
- H1 și rolul apar în primul ecran de conținut, nu după rails sau agendă;
- CTA-urile principale sunt full-width ori două pe rând numai dacă fiecare păstrează minimum 44 × 44 px;
- agenda nu este ticker și nu dublează evenimentele;
- sponsori se împachetează în două coloane sau listă;
- nu există hover-only;
- nu există overflow ascuns pentru a masca probleme de layout.

## AuthorSectionPanel

- schimbarea secțiunii actualizează URL-ul;
- pending-ul păstrează heading-ul și o înălțime minimă rezonabilă;
- layout-ul nu sare când apar counts, badge-uri sau erori;
- la back/forward se restaurează secțiunea și poziția de scroll în mod previzibil;
- pe telefon, după selectarea unei secțiuni din drawer/disclosure, focusul revine pe trigger sau merge la heading conform tipului de navigație;
- conținutul lung trece la măsura de lectură, chiar dacă centrul este mai lat.

## Portret și cartuș

- rezervă aspect-ratio înainte de încărcare;
- portretul are contain, nu cover, dacă decuparea ar elimina mâinile, părul sau brush stroke-ul intenționat;
- pentru fotografia editorială se poate folosi cover numai cu focal point salvat în metadata;
- cartușul folosește flux normal sau ancorare în centrul propriu, nu coordonate față de pagină;
- la 320 px, un titlu de trei rânduri nu iese din viewport și nu împinge portretul peste H1;
- ilustrația și textura nu trebuie să producă peste 0,1 CLS.

## Agenda

### Desktop

- titlul și numărul de întâlniri sunt vizibile;
- fiecare rând afișează data, tipul, titlul, ora, timezone-ul, locul/online, starea și CTA;
- titlurile de două sau trei rânduri cresc înălțimea rândului; nu sunt tăiate implicit;
- agenda poate fi sticky numai în interiorul coloanei și numai dacă nu depășește viewport-ul.

### Tabletă și mobil

- ordinea este cronologică;
- evenimentele trecute sunt separate de cele viitoare;
- se afișează inițial o listă scurtă și un link real „Toată agenda”;
- un carousel este permis numai dacă are previous/next, indicator, Pause și alternativă listă. Lista simplă este preferată;
- stările sold out, gratuit, închis și replay sunt textuale.

## Articole și lucrări

- textul principal are 60–75 caractere pe rând;
- cuprinsul sticky devine disclosure pe ecrane înguste;
- tabelele pot avea container scrollabil etichetat; pagina nu produce scroll orizontal;
- formulele și figurile au strategie de overflow local;
- note de subsol și bibliografie nu coboară sub text-caption;
- acțiunile Salvare, Citare și Distribuire devin un toolbar compact, nu un overlay peste text;
- print stylesheet elimină navigația, textura, CTA-urile și păstrează citările.

## Search, filtre și liste

- pe desktop, filtrele pot fi rail;
- pe tabletă și mobil, filtrele devin drawer sau disclosure cu buton „Filtre, n active”;
- query-ul și filtrele rămân în URL;
- controlul de reset este vizibil în no-results;
- rezultatele nu se transformă toate în carduri; tipul de conținut poate folosi rânduri editoriale distincte;
- loading-ul păstrează structura listei.

## Commerce și checkout

- checkout-ul este o coloană pe mobil și două coloane pe desktop;
- rezumatul poate fi sticky numai pe desktop și nu ascunde erorile;
- prețul, taxele simulate și starea providerului demo sunt vizibile fără hover;
- butonul final este după rezumat în ordinea DOM;
- mesajele payment pending/failed/approved nu schimbă complet layout-ul și au heading/focus predictibil.

## Formulare

- label-ul stă deasupra câmpului la telefon;
- câmpurile în două coloane se folosesc numai de la 768 px și numai pentru informații scurte corelate;
- butoanele primar și secundar se așază vertical la 320 px dacă nu păstrează minimum 44 px;
- eroarea se împachetează fără a suprapune help text;
- inputurile folosesc font minimum 16 px pe iOS pentru a evita zoom automat.

## Imagini, fonturi și performanță

- imaginile au width, height, aspect-ratio, sizes și srcset;
- LCP-ul primește prioritate; restul imaginilor folosesc lazy loading;
- portretele au variante potrivite, nu un PNG de mai mulți MB pentru toate viewport-urile;
- textura este comprimată și opțională pentru reduced data;
- fonturile sunt subsetate, preload numai pentru fișierul critic și font-display swap sau optional;
- blend modes și background fixed se evită pe mobil;
- breakpoint-urile nu descarcă asset-uri desktop ascunse dacă acestea pot fi omise la sursă.

## Zoom, reflow și orientare

- la 200% și 400%, conținutul se reorganizează ca la viewport îngust;
- zoom-ul nu ascunde controale sticky;
- la 320 CSS px nu există scroll orizontal al paginii;
- landscape pe telefon păstrează drawer-ul și dialogurile în viewport, cu scroll intern;
- rotația dispozitivului nu pierde secțiunea, datele de formular sau focusul logic.

## Matrice QA responsive

| Viewport | Rute minime | Ce se verifică |
| --- | --- | --- |
| 320 × 568 | Home, Autor, Articol, Checkout | header compact, H1 înaintea agendei, 44 px, fără overflow, formular o coloană |
| 390 × 844 | toate fluxurile P0 | drawer, selector autor, agendă listă, stări și CTA-uri |
| 768 × 1024 | Home, Autor, Search, Event | transformarea rails, agenda sub centru, grid două coloane |
| 1024 × 768 | Autor, Articol, Admin | centru minimum 420 px, agenda rând separat, tabele și toolbars |
| 1280 × 800 | Autor, Home, Shop | patru zone, densitate, sticky intern și focus |
| 1440 × 900 | toate rutele reprezentative | spațiu negativ, măsuri maxime, sponsor strip și coerență |

### Seturi de conținut obligatorii

La fiecare viewport se testează:

- nume autor de 35–50 caractere;
- afiliere pe două rânduri;
- cartuș de un rând și de trei rânduri;
- 0, 1, 9 și 99+ materiale;
- eveniment cu titlu lung, sold out, gratuit, trecut și cu replay;
- secțiune goală, loading, error și offline;
- text românesc cu diacritice și variantă engleză mai lungă;
- sponsor lipsă, un sponsor și minimum opt sponsori;
- zoom 200% și reflow 400%;
- prefers-reduced-motion și reduced data.

## Checklist de inspecție în browser

După fiecare vertical slice, la desktop și mobil:

1. comparați intenția cu randarea, nu doar cu CSS-ul;
2. verificați documentElement.scrollWidth egal cu clientWidth;
3. derulați cu tastatura și confirmați că headerul nu acoperă focusul;
4. folosiți numai Tab, Shift+Tab, Enter, Space, Escape și săgeți;
5. schimbați secțiunea autorului și folosiți back/forward/reload;
6. verificați că portretul, H1 și acțiunile se schimbă împreună;
7. activați fiecare stare de agendă și formular;
8. inspectați titlurile lungi, overflow-ul, truncarea și layout shift-ul;
9. activați reduced motion și tema alternativă, dacă există;
10. verificați consola, axe și metricile LCP, CLS și INP;
11. corectați diferențele înainte de următorul slice.

## Criterii de acceptare

- profilul are patru zone reale la minimum 1280 px;
- tableta nu comprimă patru coloane;
- telefonul prezintă identitatea înaintea navigației secundare și a agendei;
- navigația globală este drawer accesibil pe mobil;
- logo-ul funcționează ca Home pe orice rută;
- nu există header sticky mai înalt de 72 px;
- nu există scroll orizontal accidental la 320–1440 px sau 400% zoom;
- toate țintele tactile au minimum 44 × 44 px;
- agenda este listă accesibilă pe mobil și nu rulează automat;
- sponsorii au zonă dedicată și se împachetează coerent;
- aspectul păstrează gramatica Imaginii 1 fără să-i copieze compoziția.
