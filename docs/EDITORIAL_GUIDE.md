# Ghid editorial Bimael

## Principiu

Bimael publică idei pentru un public larg fără a dilua diferența dintre eseu, opinie, preprint și cercetare validată. Autoritatea vine din claritatea statutului, surselor și limitelor, nu din solemnitatea tonului.

Limba implicită este româna. Conținutul demo este fictiv și trebuie marcat ca atare în profil, afiliere, produs, eveniment sau disclaimer-ul paginii.

## Voce

- clară, calmă și precisă;
- cultă, dar fără jargon ornamental;
- accesibilă fără afirmații simplificate excesiv;
- curioasă și argumentată, nu promoțională;
- prudentă când dovezile sunt incomplete;
- umană, fără clickbait sau superlative comerciale.

Titlul poate crea tensiune intelectuală, dar nu promite o concluzie pe care materialul nu o susține. Evită „dovada definitivă”, „știința demonstrează” și alte formule totale când sursa descrie doar o asociere, un model sau o interpretare.

## Tipuri de conținut

Etichetele runtime curente sunt:

| Tip | Utilizare |
| --- | --- |
| Eseu | argument sau explorare semnată; nu implică cercetare originală |
| Articol editorial | selecție/interpretare realizată în cadrul redacției |
| Studiu | material cu metodă și aparat academic explicit; eticheta singură nu implică peer review |
| Preprint | versiune publică înaintea validării formale; disclaimer obligatoriu |
| Recenzie | evaluarea unei cărți, lucrări, expoziții sau idei |

Nu transforma automat un material „aprobat editorial” în „peer reviewed”. Peer review-ul poate fi afirmat numai când există workflow, recenzori, versiune, decizie și audit verificabile.

Statusurile UI curente sunt `draft`, `in_review` și `publicat`; serverul demo produce și `approved`. „Approved” înseamnă aprobare editorială în demo, nu validare academică.

## Structura articolului

Minimum:

1. titlu specific și lipsit de clickbait;
2. subtitlu care delimitează întrebarea sau metoda;
3. tipul materialului și statusul;
4. autor, afiliere și dată;
5. excerpt pentru listări;
6. abstract distinct de introducere pentru materialele academice;
7. corp structurat prin heading-uri descriptive;
8. cuvinte-cheie controlate;
9. bibliografie și note suficiente pentru afirmațiile centrale;
10. disclosure academic/comercial.

DOI, ORCID, afilierea, finanțarea și conflictul de interese se afișează numai dacă sunt reale și verificate. Valorile `example.invalid`, ORCID-ul `0000-0000-0000-0000` și instituțiile care includ „Demo” sunt placeholders, nu identități publicabile.

## Stil în limba română

- păstrează diacriticele corecte `ă â î ș ț`;
- folosește ghilimele românești „…” și ghilimele simple «…» numai conform convenției editoriale alese;
- folosește linia de dialog/em dash cu spațiere consecventă;
- datele vizibile se localizează `ro-RO`; valorile machine-readable rămân ISO 8601;
- moneda este RON și se stochează în bani, nu în numere cu virgulă;
- heading-urile folosesc sentence case, nu majuscule integrale în conținutul sursă;
- evită „Lorem ipsum”, emoji, jargon SaaS și formule promoționale generice.

## Surse, citări și integritate

- separă observația, interpretarea și opinia autorului;
- citează sursa primară când afirmația depinde de un studiu;
- păstrează autorul, titlul, publicația/editura, anul și identificatorul disponibil;
- nu inventa DOI, citări, instituții, testimoniale sau indicatori de impact;
- orice traducere numește traducătorul și ediția sursă;
- figurile și tabelele au sursă, legendă și drept de utilizare;
- corecțiile materiale primesc dată și descriere; retragerile rămân accesibile cu motivul publicabil;
- finanțarea și conflictul de interese sunt câmpuri explicite, nu note ascunse.

## Autori și portrete

Profilul public trebuie să distingă numele, titlul academic, afilierea, domeniile și biografia. Titlurile și afilierile se verifică înainte de publicare. Contactul respectă opțiunea de vizibilitate.

Portretele urmează ghidul de ilustrație și includ alt contextual când sunt informative. Monograma este fallback, nu o identitate grafică arbitrară. Nu folosi stock evident și nu schimba stilul vizual de la un autor la altul.

## Workflow editorial

Flux țintă:

```text
draft → in_review → changes_requested | approved → scheduled | published → archived
```

Autorul poate crea și trimite propriul draft, dar nu îl publică. Editorul verifică structura, drepturile, disclosure-urile și eticheta academică. Recenzorul academic, când va exista, primește numai versiuni alocate și nu substituie decizia editorială.

În implementarea actuală, draftul conține doar titlu și abstract, este păstrat în memoria serverului și poate fi aprobat de editor/administrator prin ID. Nota introdusă în UI nu este încă persistată, iar aprobarea nu publică un articol complet. Documentează aceste limite în orice demonstrație.

## Evenimente, produse și sponsori

- data, fusul orar, modul, locația, prețul și disponibilitatea sunt explicite;
- sold out, încheiat, curând și replay nu sunt promisiuni echivalente;
- un bilet demo nu confirmă o rezervare externă;
- produsele descriu formatul, livrarea, accesul și politica aplicabilă;
- rezultatele sponsorizate și relațiile instituționale sunt marcate;
- sponsorizarea nu schimbă statutul academic și nu poate fi ascunsă în relevanța editorială.

## Accesibilitate și SEO editorial

- un singur H1 descrie pagina;
- heading-urile păstrează ierarhia semantică;
- linkurile au text contextual, nu „click aici”;
- alt text-ul descrie informația, nu decorul;
- transcriptul și subtitrările sunt obligatorii pentru video publicat;
- titlul SEO și descrierea rezumă fidel pagina;
- structured data nu declară `ScholarlyArticle`, `Event` sau `Product` dacă atributele obligatorii nu sunt reale.

## Checklist înainte de publicare

- tipul și statusul sunt corecte;
- autorul, afilierea și disclosure-urile sunt verificate;
- afirmațiile centrale au surse;
- bibliografia și linkurile funcționează;
- demo/placeholders au fost eliminate sau marcate;
- drepturile media sunt documentate;
- titlul, excerpt-ul, metadata și alt text-ul sunt completate;
- conținutul a fost verificat la mobil, zoom și print;
- aprobarea editorială nu este prezentată drept peer review.

