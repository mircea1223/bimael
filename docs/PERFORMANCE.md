# Performanță

## Obiective

Pe paginile publice reprezentative, țintele sunt:

- LCP sub 2,5 s în condiții mobile realiste;
- INP sub 200 ms;
- CLS sub 0,1;
- entry JavaScript sub 200 KB gzip;
- CSS sub 20 KB gzip;
- media LCP sub 400 KB comprimat;
- fără scroll orizontal la 320, 390, 768 și 1440 px.

Acestea sunt bugete, nu rezultate garantate. Core Web Vitals trebuie măsurate pe deployment, nu deduse doar din mărimea bundle-ului.

## Baseline verificat

Build-ul din 12 iulie 2026 a transformat 137 module și a produs:

| Artifact | Dimensiune | Gzip |
| --- | ---: | ---: |
| entry JavaScript | 324,83 KB | 101,72 KB |
| CSS global | 58,35 KB | 11,36 KB |
| cel mai mare route chunk | 13,25 KB | 4,36 KB |
| Home route chunk | 7,03 KB | 2,34 KB |
| portret WebP | 372,97 KB | n/a |
| logo WebP | 18,12 KB | n/a |
| textură WebP | 5,14 KB | n/a |

Entry-ul și CSS-ul respectă bugetele stabilite. Portretul este aproape de plafonul media și trebuie urmărit pe conexiuni lente.

## Optimizări existente

- paginile sunt importate cu `React.lazy`, rezultând chunks pe familii de rute;
- build target este `es2022`;
- logo-ul, portretul și textura folosite la runtime sunt WebP optimizate;
- variantele PNG/JPG sursă nu sunt emise în build dacă nu sunt importate;
- logo-ul și portretul au atribute dimensionale, reducând riscul CLS;
- fonturile sunt system stacks, fără request-uri externe;
- textura are aproximativ 5 KB și dispare la `prefers-reduced-data` sau `prefers-reduced-motion`;
- animațiile și smooth scroll sunt reduse prin media query;
- există print stylesheet pentru articol;
- Express servește asset-urile statice cu cache de o oră în production.

## Limitări actuale

- clientul este SPA hidratat integral; nu există SSR, streaming sau HTML editorial per rută;
- entry-ul include React, routerul și contextul demo pentru toate paginile;
- imaginile nu au încă `srcset`, `sizes` sau variantă AVIF;
- componentele `<img>` nu setează încă `loading="lazy"` pentru cazurile non-LCP;
- portretul WebP are aproximativ 373 KB chiar și când este afișat mai mic;
- CSS-ul este global și va crește dacă vertical slices nu își păstrează limitele;
- serverul nu configurează compresie; reverse proxy/CDN trebuie să livreze Brotli/gzip;
- cache-ul nu folosește încă `immutable` pentru numele hash-uite și nu există politică CDN documentată în cod;
- nu există RUM, Lighthouse CI sau performance regression gate; Playwright verifică numai overflow-ul în două puncte ale fluxului mobil;
- starea/localStorage și renderarea listelor nu sunt testate cu volume de producție.

## Reguli pentru asset-uri

1. păstrează originalul numai ca sursă, nu ca import de runtime;
2. generează WebP și AVIF la dimensiunile de afișare relevante;
3. folosește `srcset`/`sizes` pentru fotografii și portrete;
4. rezervă spațiul prin `width`/`height` sau `aspect-ratio`;
5. LCP primește `fetchPriority="high"`; imaginile sub fold primesc `loading="lazy"` și `decoding="async"`;
6. nu folosi background images pentru conținut informativ;
7. textura rămâne opțională și nu afectează contrastul;
8. SVG-urile sunt optimizate, fără metadata sau path-uri inutile.

Logo-ul WebP are 300 × 300, iar portretul 1200 × 1036. Atributele HTML actuale păstrează raportul, dar valorile trebuie aliniate la dimensiunea intrinsecă în următoarea revizie pentru metadata mai precisă.

## JavaScript și rendering

- păstrează lazy loading la nivel de rută și evită barrel imports care reunesc chunks;
- serviciile de domeniu rămân funcții pure, fără dependențe UI;
- nu hidrata componente editoriale fără interacțiune dacă migrarea full-stack permite HTML server-rendered;
- nu introduce o bibliotecă de state globală înainte ca use case-urile să o justifice;
- virtualizează numai liste cu volum măsurabil; pentru liste editoriale scurte, HTML simplu este mai accesibil;
- debounce pentru căutarea remote viitoare, nu pentru filtrarea locală instantanee;
- evită polling; folosește invalidare sau evenimente numai pentru date dinamice reale.

## Server și cache

În deployment:

- asset-urile hash-uite: `Cache-Control: public, max-age=31536000, immutable`;
- `index.html`: fără cache lung sau cu revalidare;
- API personalizat: `private, no-store` pentru sesiuni și date de cont;
- răspunsuri publice editoriale: ETag/revalidare și CDN numai după separarea datelor personalizate;
- Brotli pentru JS/CSS/SVG și gzip fallback;
- timeouts la reverse proxy și limite pentru body;
- health/readiness separate când PostgreSQL și providerii devin reali.

Nu cache-ui răspunsuri care conțin utilizator, acces webinar, comenzi sau roluri.

## Verificare

Pentru fiecare schimbare relevantă:

```sh
npm run build
```

Compară dimensiunile Vite cu baseline-ul de mai sus. O creștere entry de peste 10 KB gzip sau media LCP de peste 400 KB cere justificare.

În browser, verifică cel puțin:

- Home, profil autor, articol, căutare și checkout;
- 390 × 844 și 1440 × 900;
- throttling mobil și cache rece;
- LCP element, long tasks, CLS și request waterfall;
- reduced motion/data și print;
- back/forward, deep linking și route chunk loading.

CI rulează momentan lint, typecheck, teste și build, dar nu Lighthouse sau Playwright. Suite-ul E2E local verifică overflow-ul la 390 px pe Home și Autori. Introducerea Lighthouse CI și extinderea matricei responsive sunt următoarele quality gates de performanță.
