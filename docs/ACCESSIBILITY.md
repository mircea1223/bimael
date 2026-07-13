# Bimael — ghid de accesibilitate

## Țintă și responsabilitate

Bimael urmărește **WCAG 2.2 nivel AA** ca minimum. Accesibilitatea este criteriu de acceptare pentru fiecare vertical slice, nu o etapă de polish.

Acest ghid acoperă:

- conținut public editorial și academic;
- profilul autorului;
- căutare, evenimente, webinarii și commerce;
- autentificare, cont, studio și administrare;
- stările loading, empty, error, offline și de business.

O verificare automată fără erori nu înlocuiește testarea cu tastatura, zoom și screen reader.

## Relația cu referințele

- Imaginea 1 poate inspira materialitatea, tipografia și ilustrația numai atât timp cât contrastul, reflow-ul și lizibilitatea rămân conforme.
- Imaginea 2 poate inspira arhitectura numai atât timp cât ordinea DOM și focusul rămân logice.
- Nicio poziție, textură, animație sau formă din referințe nu are prioritate față de percepție, operare și înțelegere.

## Semantica paginii

Fiecare rută are:

1. un skip link vizibil la focus către main-content;
2. header;
3. nav global etichetat;
4. un singur main cu id main-content;
5. un singur H1 care descrie ruta;
6. heading-uri fără salturi arbitrare;
7. aside numai pentru conținut complementar real;
8. footer.

Reguli:

- secțiunile editoriale sunt în interiorul main, nu frați după închiderea lui;
- navigațiile autorului au nume distincte: „Secțiunile autorului” și „Resursele autorului”;
- agenda este aside cu heading vizibil;
- sponsorii sunt section cu heading, nu o listă fără context;
- breadcrumbs folosesc nav aria-label „Fir de navigare” și aria-current pe elementul curent;
- aria se adaugă numai când HTML-ul nativ nu exprimă relația.

## Headings și structură academică

- H1 este titlul paginii sau numele autorului;
- H2 delimitează secțiuni majore;
- H3/H4 sunt folosite în ordine, inclusiv în carduri și agendă;
- titlurile vizuale fără rol structural nu folosesc heading;
- abstract, bibliografie, note, figuri și tabele au etichete și relații explicite;
- fiecare figure folosește figcaption când legenda adaugă informație;
- tabelele au caption, th și scope; tabelele complexe explică relația anteturilor;
- formulele au reprezentare MathML sau alternativă textuală adecvată;
- DOI, ORCID și statusul academic sunt text, nu numai icon.

## Navigație și routing

### Link versus button

- link pentru schimbare de rută, secțiune deep-linkable, articol, eveniment, produs sau autor;
- button pentru acțiune locală: deschidere drawer, salvare, follow, submit, previous/next;
- elementele div, article și span nu primesc tabindex și cursor pointer în locul unui control real;
- niciun link nu indică o ancoră inexistentă;
- logo-ul este link real către / pe orice rută.

### Schimbarea rutei

După navigare client-side:

- document.title se actualizează;
- main primește focus programatic temporar sau H1 este focalizat cu tabindex -1, conform strategiei routerului;
- un mesaj discret poate anunța noul titlu o singură dată;
- focusul nu rămâne pe un element demontat;
- back/forward și reload păstrează autorul, secțiunea, query-ul și filtrele.

Schimbarea locală a unui tab păstrează focusul pe tab. Schimbarea unei rute mută orientarea către noua pagină. Cele două modele nu se amestecă.

## Skip link și focus

- skip link este primul element focusabil;
- este ascuns numai vizual până la focus;
- focus ring-ul are minimum 2 px, offset 3 px și contrast minimum 3:1;
- focusul nu este eliminat prin outline none fără înlocuitor echivalent;
- elementele sticky folosesc scroll-padding-top și secțiunile folosesc scroll-margin-top;
- focusul nu este acoperit de header, drawer, toast sau cookie banner;
- ordinea de tab urmează ordinea DOM;
- tabindex pozitiv este interzis.

## Contracte de tastatură

| Componentă | Taste | Comportament |
| --- | --- | --- |
| link | Enter | navighează |
| button | Enter, Space | activează o singură dată |
| drawer | Enter/Space pe trigger, Escape | deschide; Escape închide și întoarce focusul |
| dialog | Tab/Shift+Tab, Escape | focus prins în dialog; Escape închide dacă nu este flux ireversibil |
| tabs | Left/Right, Home/End, Enter/Space dacă manual | roving tabindex și tabpanel asociat |
| accordion | Enter/Space | deschide/închide; heading + button |
| menu | săgeți, Home/End, Escape | numai dacă este meniu de aplicație real; nav simplă rămâne listă de linkuri |
| author switcher | previous/next buttons | schimbă autorul; indicatorul anunță poziția |
| carousel aprobat | previous/next, Pause/Play | nu fură focusul și nu pornește la reduced motion |
| form | Tab, Shift+Tab, Enter | ordine logică; Enter nu declanșează acțiune distructivă accidental |
| toast | fără focus implicit | mesajul se anunță; acțiunea din toast este focusabilă în ordinea normală |

Orice comportament custom este testat și cu tastatură non-US.

## Drawer, dialog, popover și tooltip

### Drawer mobil

- trigger-ul are aria-expanded și aria-controls;
- la deschidere, focusul merge la heading sau primul control;
- fundalul devine inert;
- Tab și Shift+Tab rămân în drawer;
- Escape închide;
- la închidere, focusul revine pe trigger;
- scroll-ul paginii este blocat fără a pierde poziția;
- drawer-ul poate derula la zoom și în landscape;
- numele „Închide meniul” nu este doar un X fără etichetă.

### Dialog

- folosește element dialog nativ sau primitive testate;
- are heading, descriere opțională și acțiune de închidere;
- acțiunile distructive cer confirmare explicită;
- eroarea de submit rămâne în dialog și este asociată câmpurilor;
- dialogurile nu sunt imbricate decât dacă este absolut necesar.

### Popover și tooltip

- informația esențială nu există numai în tooltip;
- tooltip-ul apare la hover și focus și se poate închide cu Escape;
- popover-ul are focus management proporțional cu conținutul;
- titlurile academice, statusurile și prețurile nu depind de hover.

## Profilul autorului

### Rails

Model preferat: linkuri de rută cu aria-current page sau location.

Dacă produsul alege tabs:

- container role tablist cu nume;
- fiecare tab are aria-selected, aria-controls și id;
- un singur tab are tabindex 0;
- fiecare panel are role tabpanel și aria-labelledby;
- săgețile schimbă focusul; activarea automată se folosește numai dacă panelul este instantaneu;
- URL-ul și istoricul rămân sincronizate.

Un button fără handler, un tab fără tabpanel sau un rail bazat numai pe hover este neconform.

### AuthorSwitcher

- este group sau regiune etichetată, nu tablist dacă nu controlează tabpanel-uri;
- previous și next au nume care pot include autorul destinație;
- indicatorul textual este „Autorul 2 din 5”;
- schimbarea actualizează numele, portretul, afilierea, conținutul și URL-ul împreună;
- schimbarea inițiată de utilizator poate fi anunțată o singură dată;
- nu rulează automat. Dacă autoplay este aprobat, Pause/Play este primul control al regiunii și starea persistă;
- swipe este enhancement și are controale echivalente.

### Portret

- dacă portretul este informativ, alt-ul include numele și tipul imaginii: „Portret ilustrat în tuș al Anei-Maria Ilinca”;
- dacă numele și portretul nu adaugă informații distincte, imaginea poate avea alt gol;
- alt-ul nu este generic „Portret ilustrat alb-negru” când autorul se schimbă;
- brush stroke-ul, rama și granulația sunt decorative și nu intră în alt;
- fallback-ul cu monogramă are numele autorului disponibil în text adiacent.

### Cartuș editorial

- un citat folosește blockquote și cite când sursa este cunoscută;
- un titlu navigabil este link;
- un fragment pur decorativ nu primește role status;
- conținutul nu se schimbă aleator într-un live region;
- contrastul și line-height-ul rămân AA peste textura/cartuşul real.

## Agenda, evenimente și webinarii

- fiecare eveniment este article cu un heading și link real, sau list item cu CTA;
- article nu primește tabindex dacă nu este el însuși control;
- data folosește time datetime cu valoare ISO;
- ora include timezone sau context local;
- „Online”, locația, prețul și disponibilitatea sunt text;
- sold out, gratuit, curând, încheiat și replay nu sunt diferențiate doar prin culoare;
- evenimentele duplicate vizual nu sunt duplicate în accessibility tree;
- lista nu se derulează automat;
- dacă există actualizare live a locurilor, mesajul este anunțat numai după acțiunea utilizatorului;
- CTA-ul explică acțiunea: „Înscrie-te la…”, „Cumpără acces”, „Vezi înregistrarea”.

## Mișcare și conținut în schimbare

La prefers-reduced-motion:

- nu există autoplay pentru autor, titlu, ticker sau carousel;
- tranzițiile de poziție și fade sunt eliminate ori reduse la schimbare instantanee;
- smooth scroll este dezactivat;
- skeleton-ul nu pulsează;
- parallax și background fixed sunt interzise.

Chiar fără reduced motion:

- conținutul care pornește automat, durează peste cinci secunde și se află lângă alt conținut are Pause/Stop/Hide;
- hover nu este un mecanism suficient de pauză;
- animația nu blochează click, focus sau citirea;
- live region nu anunță rotații decorative.

## Contrast și culoare

Praguri:

- text normal: minimum 4.5:1;
- text mare: minimum 3:1;
- componente UI, focus și informație grafică esențială: minimum 3:1;
- disabled este exceptat normativ, dar trebuie să rămână recognoscibil;
- text peste fotografie sau textură se verifică pe pixelii reali, nu doar pe tokenul de fundal.

Tokenurile aprobate și rapoartele lor sunt în DESIGN_SYSTEM.md. Sunt interzise:

- text prin opacity;
- metadate mici cu un contrast sub 4.5:1;
- accent auriu deschis folosit ca text pe hârtie;
- status exclusiv prin verde/roșu;
- focus ring care se pierde pe accent-soft sau pe suprafață întunecată.

Se testează contrastul în light, dark dacă există, hover, focus, selected, disabled, error și high contrast/forced colors.

## Touch, pointer și target size

- ținta recomandată este minimum 44 × 44 CSS px;
- pragul minim WCAG 2.2 de 24 × 24 nu este obiectivul de produs;
- doturile de 8 px pot fi marker vizual, dar butonul invizibil din jur are 44 px;
- controalele vecine au spațiu suficient pentru a evita activarea greșită;
- drag și swipe au alternativă prin butoane;
- hover nu dezvăluie informație indispensabilă;
- pointer cancellation este păstrat: acțiunea se finalizează la up/click, nu la down.

## Formulare

Fiecare câmp are:

- label vizibil;
- name și autocomplete corecte;
- tip de input potrivit;
- instrucțiuni înaintea erorii;
- required exprimat semantic și textual;
- help și error prin aria-describedby;
- aria-invalid numai când există eroare;
- valoarea păstrată după eroare.

La submit invalid:

1. apare un rezumat de erori cu heading;
2. rezumatul primește focus;
3. fiecare eroare leagă spre câmp;
4. primul câmp invalid poate primi focus după rezumat, conform complexității;
5. mesajul explică rezolvarea, nu doar „invalid”.

Newsletter-ul nu folosește placeholder ca label și nu spune „verifică inboxul” dacă adaptorul demo nu trimite e-mail. Mesajul corect explică salvarea locală și providerul activ.

Checkout-ul:

- nu cere date reale de card în modul demo;
- numește clar providerul mock;
- confirmarea finală este distinctă de submit intermediar;
- payment pending, failed și approved au heading și status;
- nu acordă acces la pending sau failed;
- erorile nu sunt exprimate numai prin toast.

## Stări și mesaje

| Stare | Semantică recomandată | Focus / anunț |
| --- | --- | --- |
| loading inițial | heading + skeleton aria-hidden | status scurt numai dacă durează |
| pending după acțiune | button aria-disabled sau disabled + text | aria-live polite, o singură dată |
| succes | status | nu mută focusul dacă rămâne pe pagină |
| eroare recuperabilă | alert sau heading în panel | focus pe rezumat/heading dacă blochează fluxul |
| empty | heading + explicație + acțiune | fără live region la încărcare |
| offline | alert persistent | anunț la schimbarea stării |
| unauthorized | rută de autentificare | H1 și returnTo |
| forbidden | pagină 403 | H1, motiv sigur, cale de ieșire |
| not found | pagină 404 | H1 și navigație relevantă |
| rate limited | alert + retry time | countdown numai dacă este real și controlat |

Toast-ul nu este singurul loc pentru informație critică și nu dispare înainte de a putea fi citit.

## Live regions

- se folosesc rar și numai pentru schimbări care nu mută focusul;
- role status / aria-live polite pentru rezultat de salvare, count actualizat sau conectivitate;
- role alert pentru eroare urgentă ce blochează acțiunea;
- mesajul este scurt și atomic;
- conținutul inițial al paginii nu este live;
- titlurile rotative, caruselele și ticker-ele nu sunt live;
- nu se cuibăresc live regions;
- același mesaj nu este emis repetat.

## Imagini, iconuri și media

- imaginile informative au alt contextual;
- imaginile decorative au alt gol;
- linkul-imagine are un singur nume accesibil, fără dublarea „Bimael Bimael”;
- icon button are nume accesibil;
- iconul decorativ are aria-hidden;
- iconurile de status nu înlocuiesc textul;
- diagramele au rezumat și, când e necesar, tabel de date;
- audio/video au subtitrări, transcript și control de volum/playback;
- autoplay cu sunet este interzis.

## Citire și conținut academic

- limba documentului este ro; schimbările de limbă în pasaje folosesc lang;
- abrevierile rare sunt explicate la prima utilizare;
- linkurile au texte descriptive, nu serii de „citește mai mult” fără context;
- citările și notele pot fi atinse și cu tastatura;
- notele de subsol oferă întoarcere la referință;
- bibliografia păstrează selecția și copierea textului;
- modul de lectură nu elimină landmarks sau acțiuni esențiale;
- print-ul păstrează titlu, autori, DOI, licență, note și URL.

## Localizare

- documentul folosește lang ro;
- datele și numerele sunt generate cu Intl, nu prin split pe string;
- time datetime păstrează valoarea ISO și interfața indică timezone-ul;
- pluralizarea folosește reguli locale;
- ordinea numelui nu este presupusă;
- layout-ul suportă etichete engleze cu minimum 30% mai lungi;
- diacriticele sunt prezente în fonturile livrate.

## Forced colors și preferințe

Se verifică:

- forced-colors active;
- prefers-contrast more, unde este disponibil;
- prefers-reduced-motion;
- prefers-reduced-data, ca enhancement;
- zoom text și page zoom;
- dimensiune de font mărită la nivel de OS/browser.

În forced colors:

- focusul folosește CanvasText/Highlight;
- border-urile de control nu dispar;
- background images și textura nu poartă informație;
- selected/current rămâne perceptibil fără culoarea brandului.

## Matrice de testare manuală

| Suprafață | Tastatură | Screen reader | Zoom/reflow | Axe |
| --- | --- | --- | --- | --- |
| Home | nav, feature, agenda, newsletter | landmarks, H1, linkuri | 200% și 400% | obligatoriu |
| Profil autor | rails, switcher, actions, agenda | identitate, current, portret | 320 px și 400% | obligatoriu |
| Articol | TOC, note, citare, salvare | headings, figure, table | text 200%, print | obligatoriu |
| Search | input, filtre, rezultate, pagination | counts, no-results | drawer filtre | obligatoriu |
| Eveniment/webinar | CTA, ticket, calendar | date, status, preț | 320 px | obligatoriu |
| Cart/checkout | toate câmpurile, submit, erori | labels, summary, payment state | 320 px și 200% | obligatoriu |
| Auth/cont | formular, menus | errors, current route | 320 px | obligatoriu |
| Studio/admin | editor, tables, dialogs | status workflow, permissions | 768 px și 200% | obligatoriu |

### Combinații screen reader

Minimum înainte de release:

- NVDA + Firefox sau Chrome pe Windows;
- VoiceOver + Safari pe macOS;
- VoiceOver + Safari pe iOS pentru drawer, profil și checkout;
- TalkBack + Chrome pe Android pentru cel puțin fluxurile P0 critice, dacă dispozitivul este disponibil.

## Teste automate

Automatizarea include:

- axe pe Home, Profil autor, Articol, Search, Event, Checkout, Auth, Studio și Admin;
- verificarea unui singur main și H1 per rută;
- linkuri fără destinație și ancore fără țintă;
- nume accesibile pentru toate controalele;
- focus trap și return focus pentru drawer/dialog;
- tab/tabpanel wiring dacă se folosesc tabs;
- contrast pentru tokenuri și teme;
- reflow fără document overflow la 320, 390, 768, 1024, 1280 și 1440 px;
- respectarea reduced motion;
- formulare cu label/error association;
- route focus și document title.

Testele automate nu pot valida calitatea alt textului, ordinea cognitivă, claritatea mesajelor sau utilitatea cu screen reader; acestea rămân manuale.

## QA pe fiecare vertical slice

1. Inspectare vizuală în browser la mobil și desktop.
2. Navigare exclusiv cu tastatura.
3. Zoom 200% și 400%; font mărit.
4. Reduced motion și forced colors.
5. Axe fără critical sau serious.
6. Un screen reader pe ruta principală a slice-ului.
7. Stări loading, empty, error, offline și business.
8. Text românesc real și etichete engleze mai lungi.
9. Verificare focus după route change, dialog și submit.
10. Corectare înainte de următorul slice.

## Release gate

Nu se declară finalizat dacă:

- există un control fără nume sau acțiune;
- focusul nu este vizibil ori este acoperit;
- navigația mobilă nu poate fi închisă și cu Escape;
- pagina necesită scroll orizontal la 320 px sau 400% zoom;
- contrastul textului normal este sub 4.5:1;
- autorul, cartușul sau agenda rulează automat fără control;
- tablist nu are tabpanel și comportament de tastatură;
- evenimentele duplicate vizual sunt duplicate pentru screen reader;
- formularele nu au label și erori asociate;
- rutele nu actualizează H1, title și focus;
- axe raportează probleme critical/serious;
- fluxurile principale nu au fost testate cu tastatura și cel puțin un screen reader.
