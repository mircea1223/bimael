# Bimael — ghid de ilustrație și asset-uri

## Scop

Ilustrația Bimael trebuie să unească toate rutele într-o singură lume editorială: arhivă culturală, manuscris, revistă academică și salon intelectual. Ea susține identitatea și orientarea, fără să înlocuiască informația sau să încetinească pagina.

Acest document acoperă:

- portrete de autor;
- gravuri și line-art editorial;
- brush stroke, cartușe și ornamente;
- logo și iconografie;
- textura de hârtie;
- logo-uri de sponsori și parteneri;
- producția, optimizarea, accesibilitatea și proveniența asset-urilor.

## Delimitarea strictă a referințelor

### Imaginea 1

Este sursa principală pentru:

- caracterul monocrom de cerneală;
- gravură, desen în tuș, stippling și pensulă uscată;
- raportul dintre ilustrație și tipografie;
- materialitatea hârtiei;
- linii fine, margini calme și spațiu negativ;
- nivelul de rafinament al portretului, cartușului și însemnelor.

Nu este o bibliotecă de asset-uri de copiat și nu stabilește:

- același portret pe toate paginile;
- forma exactă a brush stroke-ului;
- forma exactă a cartușului;
- poziția ori dimensiunea ilustrației;
- grila paginii.

### Imaginea 2

Este sursa numai pentru rolul ilustrației în arhitectură:

- portretul este punct focal în centrul profilului;
- cartușul oferă context editorial;
- switcher-ul schimbă autorul;
- sponsorii au zonă proprie.

Imaginea 2 nu dictează stilul desenului, forma cercului sau aspectul manuscris al schiței.

Regula de aprobare: un asset trebuie să pară din universul Imaginii 1, dar să ocupe un rol stabilit de Imaginea 2 sau de informația paginii.

## Direcție artistică

### Limbaj vizual aprobat

- cerneală neagră sau charcoal pe hârtie caldă;
- linie vie, cu variație moderată de grosime;
- cross-hatching rar și stippling controlat;
- gravură reinterpretată contemporan;
- brush stroke sec, asimetric și cu margine organică;
- colaj editorial restrâns la una sau două intervenții;
- negative space generos;
- accent sepia, oxblood ori petrol numai când adaugă ierarhie.

### Limbaj interzis

- ilustrație corporate generică;
- clip-art, emoji și pictograme cartoon;
- fotografie stock evidentă;
- vectori cu gradient comercial;
- 3D lucios, neon, glassmorphism;
- filtre care imită superficial hârtia sau vechimea;
- combinații de gravură, iconuri outline moderne și desene cartoon în aceeași pagină;
- reprezentări inconsistente ale aceluiași autor;
- elemente decorative care arată ca butoane.

## Sistemul de portrete

### Variante suportate

1. **Portret în tuș** — varianta de identitate recomandată.
2. **Gravură** — pentru colecții istorice sau ton academic solemn.
3. **Line-art** — pentru liste, miniaturi și contexte compacte.
4. **Fotografie editorială** — când există drepturi și un set fotografic coerent.
5. **Monogramă** — fallback determinist când nu există imagine.

Toate variantele aceluiași autor provin dintr-un master și păstrează fizionomia, încadrarea și direcția luminii.

### Încadrare

- raport master recomandat: 4:5;
- variantă de scenă: 1:1 sau 4:5 într-un container stabil;
- fața ocupă aproximativ 32–42% din înălțimea masterului;
- ochii sunt între 38–45% din înălțime;
- minimum 8% spațiu sigur în jurul părului, ochelarilor și umerilor;
- brush stroke-ul nu traversează ochii, gura sau alte trăsături definitorii;
- nu se taie vârful capului pe mobil;
- miniatura rămâne recognoscibilă la 48 px.

Fotografia poate folosi crop numai dacă metadata include focal point. Portretul desenat folosește implicit contain.

### Linie și contrast

- linie principală: echivalent vizual 1.25–1.75 px la un canvas de 1024 px;
- linie secundară: minimum 0.75 px la 1024 px;
- variația grosimii este organică, dar nu depășește aproximativ 1:3;
- zonele negre compacte nu depășesc 20–25% din portret;
- cross-hatching-ul nu creează moiré la redimensionare;
- fundalul masterului este transparent sau separat de desen;
- contrastul feței rămâne clar atât pe canvas, cât și pe surface.

Nu se folosește mix-blend-mode pentru a elimina fundalul alb al asset-ului critic. Fundalul se elimină în producție, astfel încât contrastul să fie previzibil.

### Brush stroke

- este un layer separat de portret;
- folosește maximum două direcții dominante;
- nu imită aceeași pată pe fiecare autor;
- are opacitate și margini controlate, fără a părea o eroare de compresie;
- poate varia pe colecție, dar folosește aceeași densitate și aceeași familie de pensulă;
- este aria-hidden și nu poartă informație.

### Monogramă fallback

- inițialele sunt generate din numele afișat, nu din email;
- folosește aceleași tokenuri de suprafață și border;
- nu inventează stemă, titlu sau afiliere;
- numele complet rămâne disponibil lângă monogramă;
- combinațiile de inițiale se testează pentru unul, două și trei cuvinte.

## Consistența între autori

Un set de portrete folosește:

- aceeași scară a capului;
- același nivel de detaliu;
- aceeași densitate de hatching;
- aceeași gamă tonală;
- aceeași regulă de margine și spațiu sigur;
- aceeași rezoluție și pipeline de export;
- variații individuale numai în expresie, poziție moderată și brush stroke.

Este interzis ca un autor să fie fotografie realistă, altul anime, altul gravură și altul icon generic în aceeași listă.

Pentru demo, autorii fictivi sunt marcați ca atare în date și documentație. Nu se generează o asemănare cu o persoană reală fără drepturi și aprobare.

## Cartuș editorial

Cartușul poate conține:

- titlul unui articol;
- un fragment;
- un citat;
- un concept-cheie;
- un eveniment apropiat.

Reguli vizuale:

- formă de notă marginală, etichetă de arhivă sau fragment de manuscris;
- linie neregulată controlată ori border capilar;
- maximum 32ch pe mobil și 38ch pe desktop;
- padding generos și înălțime determinată de conținut;
- maximum trei rânduri în scena autorului;
- o singură coadă sau ancoră discretă, dacă este necesară;
- fără radius de balon comic și fără umbră grea;
- text serif italic ori heading serif, în funcție de conținut;
- nu se suprapune peste față, H1 sau controls.

Cartușul nu se schimbă aleator. Dacă este interactiv, folosește link real și focus vizibil; dacă este citat, folosește semantică blockquote.

## Logo și însemne

- logo-ul principal este un asset original, nu decupat din referință;
- masterul este vectorial;
- există variante horizontală, compactă și monocromă;
- aria de siguranță este minimum înălțimea literei B din wordmark;
- dimensiunea minimă păstrează detaliile gravurii; sub prag se folosește varianta simplificată;
- logo-ul nu este inversat prin CSS filter;
- pe dark mode se folosește o variantă desenată pentru fundal întunecat;
- logo-ul central este întotdeauna link Home, dar asset-ul însuși nu imită un buton;
- imaginea are alt gol când linkul oferă aria-label „Bimael — Acasă”, pentru a evita nume dublu.

Însemnele de domeniu pot deriva din manuscrise, instrumente academice, botanică sau arhivă, dar nu reproduc steme instituționale existente fără drepturi.

## Iconografie

- set unic, vectorial;
- grid de 20 sau 24 px;
- stroke 1.5–1.75 px la 24 px;
- capete și colțuri coerente;
- iconurile utilitare sunt sans ca ton: clare, nu ornamentale;
- iconurile decorative pot avea detaliu de gravură, dar nu se folosesc în controls mici;
- fiecare icon button are nume accesibil;
- iconul decorativ este aria-hidden;
- nu se amestecă iconuri filled, outline și hand-drawn fără reguli de variantă.

Simbolurile pentru Previous, Next, Search, Account, Save, Share, Cart și Close trebuie să rămână imediat recognoscibile.

## Textura de hârtie

Textura este ambient, nu conținut.

### Reguli

- opacitate vizuală 2–5% în majoritatea suprafețelor;
- frecvență joasă, fără pete care concurează cu literele;
- nu se repetă vizibil;
- nu conține margini, umbre sau semne ce par parte din layout;
- nu este baked în fiecare imagine;
- nu se aplică peste input, table, code, formule sau zone cu text mic dacă reduce claritatea;
- poate fi eliminată la prefers-reduced-data;
- nu folosește background-attachment fixed pe mobil;
- contrastul textului se verifică pe randarea finală cu textura activă.

### Export

- AVIF sau WebP cu JPEG fallback numai dacă este necesar;
- dimensiune potrivită pentru suprafață, fără fișier multi-megabyte;
- layer separat și cache-uit;
- variantă mai simplă pentru mobil;
- canvas color rămâne vizibil dacă asset-ul nu se încarcă.

## Ornamente și separatoare

- separatoare capilare de 1 px;
- asterism, fleuron sau marcaj de arhivă maximum o dată per secțiune;
- ornamentul nu intră în accessibility tree;
- ornamentul nu este folosit în locul unui heading sau buton;
- culoarea folosește border ori accent-soft, nu text-subtle dacă ar părea text;
- dimensiunea se adaptează fără a provoca overflow.

## Sponsori și parteneri

- logo-urile sunt furnizate ori folosite cu permisiune;
- se păstrează raportul original și spațiul de siguranță;
- tratamentul implicit este monocrom charcoal/sepia;
- hover poate readuce culoarea numai dacă nu este singurul indiciu de link;
- există variantă pentru dark mode;
- containerul rezervă aspect-ratio pentru a evita CLS;
- alt-ul este numele instituției; nu include „logo-ul” dacă nu este necesar;
- linkul are nume accesibil și focus vizibil;
- sponsorii comerciali sunt marcați distinct de partenerii editoriali;
- ordinea și mărimea nu implică o ierarhie necontractată.

## Ilustrații editoriale

### Domenii și colecții

Fiecare domeniu poate primi un motiv:

- filosofie: diagramă, bust reinterpretat, marginalia;
- neuroștiințe: rețea, secțiune anatomică stilizată, instrument de observație;
- medicină: gravură anatomică non-senzaționalistă;
- istorie: hartă, sigiliu, document;
- literatură: manuscris, pană, tipar;
- științe cognitive și AI: diagramă abstractă, nu robot umanoid generic.

Motivele au același stroke, densitate și tratament cromatic. Ele nu reprezintă afirmații științifice fără sursă.

### Dezbateri

- participanții au tratament egal;
- nu se folosește lumină/culoare pentru a sugera câștigătorul;
- schema teză–antiteză păstrează dimensiuni și contrast echivalente;
- moderatorul și sursele sunt distincte prin tipografie, nu prin diminuare excesivă.

### Evenimente și produse

- evenimentele pot avea afișe editoriale în aceeași paletă;
- webinarul nu primește iconografie neon de streaming;
- produsul are fotografie/scan fidel și nu este mascat de ornament;
- badge-urile comerciale folosesc tokenuri de stare, nu stickere promoționale stridente.

## Formate și pipeline

### Master

- SVG pentru logo, iconuri, separatoare, cartușe și line-art cu complexitate rezonabilă;
- sursă vectorială sau raster minimum 2× pentru portrete;
- fotografie în profil de culoare sRGB;
- layer-ele portret, brush și fundal sunt separate;
- fiecare asset are ID, autor, sursă, licență, data aprobării și restricții.

### Livrare web

- SVG optimizat, fără metadata inutilă, script sau ID-uri conflictuale;
- AVIF/WebP pentru raster, cu fallback dacă suportul țintă îl cere;
- width și height explicite;
- srcset și sizes conforme layout-ului;
- lazy loading pentru asset-uri sub fold;
- portretul LCP primește fetch priority doar pe ruta unde este realmente LCP;
- thumbnail separat, nu masterul redimensionat în browser;
- limita orientativă: portret hero 150–300 KB, thumbnail sub 50 KB, textură sub 120 KB, logo SVG sub 40 KB; depășirile se justifică.

### Securitate SVG

- SVG-urile externe sunt sanitizate;
- scripturile, event handlers, foreignObject și URL-urile externe neaprobate sunt eliminate;
- SVG-ul încărcat de utilizator nu este inserat inline fără sanitizare;
- fonturile nu sunt embedded în SVG;
- textul important rămâne HTML, nu paths în imagine.

## Dark mode și blend modes

- fiecare asset critic are o variantă aprobată pentru dark ori este așezat pe surface light;
- invert, screen și multiply nu sunt strategie de producție pentru portrete sau logo;
- blend modes pot fi folosite numai decorativ, după test de contrast și performanță;
- brush stroke-ul poate schimba tokenul, nu fizionomia portretului;
- textura dark are frecvență și opacitate mai mici pentru a evita noise;
- forced colors poate elimina decorul fără pierdere de informație.

## Accesibilitate

### Arbore de decizie pentru alt

1. Imaginea transmite informație care nu este disponibilă în text apropiat?
   - Da: alt concis și contextual.
   - Nu: continuă.
2. Imaginea este singurul conținut al unui link?
   - Da: linkul are nume accesibil prin alt sau aria-label, nu ambele redundant.
   - Nu: continuă.
3. Imaginea este decorativă?
   - Da: alt gol și, pentru SVG inline, aria-hidden true.
4. Imaginea este complexă?
   - Da: alt scurt + descriere extinsă în text, figure/figcaption sau tabel.

Alt-ul descrie scopul, nu fiecare linie de hatching. Nu include automat culoarea, stilul sau „imagine cu”.

### Contrast și reflow

- ilustrația nu scade contrastul textului;
- textul nu este baked în imagine;
- la 400% zoom, asset-ul nu acoperă heading-uri sau controls;
- când imaginile sunt dezactivate, numele, heading-ul și acțiunile rămân;
- cartușul și sponsorii păstrează ordinea DOM logică.

## Proveniență, drepturi și integritate

Pentru fiecare asset se păstrează:

- creator și data creației;
- prompt sau proces, dacă este generat;
- referințe folosite;
- licență și domeniul de utilizare;
- consimțământ pentru asemănare, când este cazul;
- versiunea master și hash-ul exportului;
- alt text aprobat;
- credit obligatoriu.

Nu se folosesc:

- portrete ale persoanelor reale fără drepturi;
- steme, sigilii sau logo-uri instituționale fără permisiune;
- imagini stock prezentate ca documente istorice;
- ilustrații generate care falsifică dovezi, evenimente sau afiliere;
- asset-uri din referințe decupate și prezentate drept creație originală.

## Brief de producție pentru un portret nou

Fiecare comandă de portret include:

1. numele și statutul real/fictiv;
2. drepturile și acordul;
3. referință facială aprobată;
4. variantă: tuș, gravură, line-art sau fotografie;
5. raport 4:5 și focal point;
6. nivel de detaliu și stroke conform ghidului;
7. expresie și ținută;
8. brush stroke separat;
9. fundal transparent;
10. variante hero, listă, thumbnail și dark;
11. alt text;
12. export și buget de fișier;
13. verificare la 48, 160, 320 și 640 px.

## QA vizual și tehnic

Fiecare asset critic se verifică:

| Context | Verificare |
| --- | --- |
| 320 px | fără crop distructiv, cartuș în viewport, detalii lizibile |
| 390 px | echilibru cu H1 și acțiuni, fără overflow |
| 768 px | scală corectă în compoziția tabletă |
| 1280 px | relație cu rails și agenda |
| 1440 px | spațiu negativ și densitate apropiate direcției artistice |
| light | contrast, transparență și textură |
| dark, dacă există | variantă dedicată, fără invert |
| forced colors | informația rămâne fără decor |
| reduced data | fallback fără textură și asset greu |
| imagini blocate | nume, structură și acțiuni intacte |

Checklist:

- asset original, nu copie a referinței;
- autorul corect se schimbă împreună cu portretul;
- aceeași familie de stroke și contrast;
- width/height/aspect-ratio prezente;
- srcset/sizes corecte;
- fără PNG multi-megabyte livrat inutil;
- fără layout shift;
- alt text contextual sau alt gol justificat;
- fără text important în imagine;
- fără blend mode critic;
- licență și proveniență documentate;
- contrast verificat peste textura finală;
- nicio inconsecvență între rutele publice, studio și admin.

## Criterii de acceptare

Sistemul de ilustrație este acceptabil numai dacă:

- portretele par create de aceeași mână și rămân individuale;
- gramatica Imaginii 1 este recognoscibilă fără copiere mecanică;
- rolurile structurale provin din Imaginea 2;
- logo-ul, iconurile, cartușul, portretele și sponsorii folosesc aceeași lume vizuală;
- portretele nu sunt statice când autorul se schimbă;
- textura este subtilă și poate fi eliminată;
- asset-urile sunt optimizate și nu compromit LCP/CLS;
- alt textul, contrastul și fallback-urile sunt aprobate;
- drepturile și proveniența sunt documentate.
