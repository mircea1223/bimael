import type { Article, Author, CulturalEvent, Product, Sponsor } from '../domain/types'

export const authors: Author[] = [
  {
    id: 'a-marian',
    slug: 'marian-bituics',
    name: 'Marian Bituics',
    academicTitle: 'Doctorand · Filosofia minții',
    affiliation: 'Centrul Demo pentru Studii ale Conștiinței',
    orcid: '0000-0000-0000-0000',
    fields: ['Fenomenologie', 'Neuroștiințe cognitive', 'Etica minții'],
    quote: 'Nu explicăm mintea ca s-o desființăm, ci ca s-o înțelegem.',
    cartouche: 'Timpul trăit și timpul măsurat',
    bio: 'Cercetează granița dintre conștiința trăită și explicația neuronală: cum devine activitatea creierului experiență și unde se oprește vocabularul măsurătorii. Profil fictiv, creat pentru demonstrarea platformei.',
    portrait: 'ink',
    monogram: 'MB',
    counts: { articole: 4, webinarii: 2, evenimente: 2, proiecte: 2, shop: 2, arhiva: 8 },
  },
  {
    id: 'a-ana',
    slug: 'ana-maria-ilinca',
    name: 'Ana-Maria Ilinca',
    academicTitle: 'Cercetătoare · Neuroștiințe afective',
    affiliation: 'Laboratorul Demo de Cogniție Întrupată',
    fields: ['Emoție', 'Etica afectelor', 'Cogniție întrupată'],
    quote: 'Sentimentul nu este opusul rațiunii, ci una dintre condițiile ei.',
    cartouche: 'Ce poate spune o emoție înaintea cuvintelor?',
    bio: 'Studiază emoția ca formă de cunoaștere și felul în care circuitele afective participă la judecată. Profil fictiv, cu date demo neverificate academic.',
    portrait: 'monogram',
    monogram: 'AI',
    counts: { articole: 2, webinarii: 1, evenimente: 1, proiecte: 1, shop: 0, arhiva: 3 },
  },
  {
    id: 'a-tudor',
    slug: 'tudor-vlas',
    name: 'Tudor Vlas',
    academicTitle: 'Doctorand · Filosofia științei',
    affiliation: 'Arhiva Demo pentru Istoria Ideilor',
    fields: ['Epistemologie', 'Cauzalitate', 'Istoria măsurării'],
    quote: 'Fiecare măsurătoare poartă cu sine o metafizică discretă.',
    cartouche: 'Când devine o observație fapt științific?',
    bio: 'Urmărește presupunerile tacite din modele și instrumente, între laborator, arhivă și concept. Profil fictiv pentru evaluarea produsului.',
    portrait: 'monogram',
    monogram: 'TV',
    counts: { articole: 1, webinarii: 0, evenimente: 2, proiecte: 2, shop: 1, arhiva: 4 },
  },
]

export const articles: Article[] = [
  {
    id: 'art-liber-arbitru', slug: 'ce-stie-creierul-despre-liberul-arbitru',
    title: 'Ce știe creierul despre liberul arbitru',
    subtitle: 'O recitire prudentă a experimentelor lui Libet',
    excerpt: 'Experimentele lui Libet au fost citite prea repede ca o condamnare a voinței. Ce măsoară, de fapt, semnalul de pregătire?',
    abstract: 'Eseul separă constatarea experimentală de interpretarea filosofică și propune o lectură stratificată a deciziei.',
    body: [
      'O măsurătoare nu este niciodată o sentință metafizică. Ea izolează un fenomen, îl face comparabil și lasă în afara cadrului o parte din experiența pe care pretinde că o descrie.',
      'În experimentele clasice, momentul intenției este raportat retrospectiv, iar actul este redus la o mișcare simplă. Între aceste două repere rămân deliberarea, formarea motivelor și felul în care un agent își recunoaște propria acțiune.',
      'Prudența nu slăbește știința. Dimpotrivă, îi păstrează afirmațiile la scara dovezilor. Liberul arbitru nu este demonstrat de o ezitare a datelor, dar nici eliminat de apariția timpurie a unui potențial neuronal.',
    ],
    kind: 'Eseu', authorId: 'a-marian', domain: 'Neuroetică', publishedAt: '2026-06-18T09:00:00Z', readMinutes: 12,
    keywords: ['liber arbitru', 'Libet', 'neuroetică'], status: 'publicat', bibliography: ['Libet, B. et al. (1983). Time of conscious intention to act.', 'Schurger, A. et al. (2012). An accumulator model for spontaneous neural activity.'],
  },
  {
    id: 'art-atentie', slug: 'fenomenologia-atentiei', title: 'Fenomenologia atenției',
    subtitle: 'De la descrierea trăită la rețelele de saliență',
    excerpt: 'Cum a devenit atenția, dintr-un act al conștiinței, o hartă de activări — și ce s-a pierdut în traducere.',
    abstract: 'Un dialog metodologic între descrierea fenomenologică și modelele cognitive ale atenției.',
    body: ['Atenția nu luminează pur și simplu un obiect deja dat. Ea schimbă relieful experienței.', 'Modelele neuronale descriu distribuția resurselor și competiția dintre stimuli. Fenomenologia întreabă cum apare această selecție pentru subiect.', 'Cele două registre devin fertile când nu sunt forțate să vorbească unul în locul celuilalt.'],
    kind: 'Articol editorial', authorId: 'a-marian', domain: 'Fenomenologie', publishedAt: '2026-06-02T09:00:00Z', readMinutes: 9,
    keywords: ['atenție', 'fenomenologie', 'saliență'], status: 'publicat', bibliography: ['Husserl, E. Analyses Concerning Passive and Active Synthesis.'],
  },
  {
    id: 'art-emotie', slug: 'emotia-ca-forma-de-cunoastere', title: 'Emoția ca formă de cunoaștere',
    subtitle: 'Corpul nu este doar locul în care simțim',
    excerpt: 'Afectele nu bruiază mereu judecata; uneori îi oferă primele criterii de relevanță.',
    abstract: 'Un eseu despre contribuția evaluărilor afective la raționamentul cotidian.',
    body: ['Înainte de a formula o propoziție, corpul a ordonat deja o parte din lume.', 'O emoție nu este o dovadă, însă poate fi o formă de orientare. Ea ne spune ce a devenit relevant înainte ca justificarea să fie disponibilă.', 'Rațiunea matură nu elimină afectul; îl supune reflecției și îl face discutabil.'],
    kind: 'Eseu', authorId: 'a-ana', domain: 'Psihologie', publishedAt: '2026-05-21T09:00:00Z', readMinutes: 8,
    keywords: ['emoție', 'cogniție', 'etică'], status: 'publicat', bibliography: ['Damasio, A. Descartes’ Error.'],
  },
  {
    id: 'art-masura', slug: 'masura-si-metafizica', title: 'Măsura și metafizica discretă',
    subtitle: 'Ce presupune un instrument înainte să producă un număr',
    excerpt: 'Instrumentele nu sunt ferestre neutre: fiecare selectează o lume în care anumite diferențe contează.',
    abstract: 'Preprint demo despre presupozițiile ontologice ale practicilor de măsurare.',
    body: ['A măsura înseamnă a stabili o identitate repetabilă între situații care nu sunt niciodată perfect identice.', 'Etalonul stabilizează diferențele și transformă observația într-un limbaj comun.', 'Acest text este un preprint demonstrativ, nu o lucrare validată prin peer review.'],
    kind: 'Preprint', authorId: 'a-tudor', domain: 'Filosofia științei', publishedAt: '2026-04-11T09:00:00Z', readMinutes: 14,
    keywords: ['măsurare', 'instrument', 'epistemologie'], status: 'publicat', bibliography: ['Chang, H. Inventing Temperature.'],
  },
]

export const events: CulturalEvent[] = [
  { id: 'ev-atentie', slug: 'atentia-in-epoca-distragerii', type: 'Webinar', title: 'Atenția în epoca distragerii', description: 'O întâlnire despre economie cognitivă, oboseală și practici de lectură lentă.', startsAt: '2026-07-31T16:00:00Z', timezone: 'Europe/Bucharest', mode: 'Online', location: 'Platformă video externă · link după înscriere', status: 'open', priceMinor: 6500, seatsLeft: 42, authorIds: ['a-marian'], productSlug: 'webinar-atentie' },
  { id: 'ev-libet', slug: 'liberul-arbitru-dupa-libet', type: 'Dezbatere', title: 'Liberul arbitru după Libet', description: 'Două poziții, un moderator și o bibliografie comună.', startsAt: '2026-08-14T14:00:00Z', timezone: 'Europe/Bucharest', mode: 'Hibrid', location: 'Casa Universitarilor, București + online', status: 'few', priceMinor: 0, seatsLeft: 7, authorIds: ['a-marian', 'a-tudor'] },
  { id: 'ev-qualia', slug: 'ce-este-o-experienta', type: 'Webinar', title: 'Ce este o experiență? Qualia pe înțelesul tuturor', description: 'Introducere atentă în vocabularul conștiinței.', startsAt: '2026-08-21T16:00:00Z', timezone: 'Europe/Bucharest', mode: 'Online', location: 'Online', status: 'soon', priceMinor: 4500, authorIds: ['a-ana'], productSlug: 'webinar-qualia' },
  { id: 'ev-arhiva', slug: 'arhiva-vie-a-ideilor', type: 'Atelier', title: 'Arhiva vie a ideilor', description: 'Atelier de lucru cu fișe, marginalii și ediții vechi.', startsAt: '2026-07-18T09:00:00Z', timezone: 'Europe/Bucharest', mode: 'Fizic', location: 'Biblioteca Demo Noesis', status: 'sold-out', priceMinor: 0, seatsLeft: 0, authorIds: ['a-tudor'] },
  { id: 'ev-replay', slug: 'predictie-si-perceptie', type: 'Webinar', title: 'Predicție și percepție', description: 'Înregistrare arhivată și transcript.', startsAt: '2026-05-12T16:00:00Z', timezone: 'Europe/Bucharest', mode: 'Online', location: 'Arhivă video demo', status: 'replay', priceMinor: 3500, authorIds: ['a-ana'] },
]

export const products: Product[] = [
  { id: 'p-carte', slug: 'mintea-intrupata', title: 'Mintea întrupată — caiet de lectură', type: 'Carte', description: 'Ediție tipărită demo, 184 de pagini, cu bibliografie și spațiu pentru note.', priceMinor: 8900, currency: 'RON', stock: 18 },
  { id: 'p-webinar', slug: 'webinar-atentie', title: 'Acces webinar: Atenția în epoca distragerii', type: 'Webinar', description: 'Bilet digital demo; accesul real necesită configurarea furnizorului video.', priceMinor: 6500, currency: 'RON', stock: null, eventId: 'ev-atentie' },
  { id: 'p-ebook', slug: 'atlasul-intrebarilor', title: 'Atlasul întrebărilor — ebook', type: 'Ebook', description: 'Dosar editorial digital cu 24 de întrebări interdisciplinare.', priceMinor: 2900, currency: 'RON', stock: null },
  { id: 'p-qualia', slug: 'webinar-qualia', title: 'Acces webinar: Ce este o experiență?', type: 'Webinar', description: 'Rezervare anticipată în mediul demonstrativ.', priceMinor: 4500, currency: 'RON', stock: null, eventId: 'ev-qualia' },
]

export const sponsors: Sponsor[] = [
  { id: 's-noesis', name: 'Fundația Noesis', tier: 'instituțional' },
  { id: 's-coglab', name: 'CogLab București', tier: 'partener' },
  { id: 's-hyperion', name: 'Revista Hyperion', tier: 'colaborator' },
  { id: 's-arhiva', name: 'Arhiva Ideilor', tier: 'colaborator' },
]

export const domains = [
  { slug: 'filosofia-mintii', name: 'Filosofia minții', count: 18, description: 'Relația dintre experiență, explicație și realitatea fizică.' },
  { slug: 'neurostiinte', name: 'Neuroștiințe', count: 14, description: 'Creierul cercetat fără a reduce persoana la o imagine.' },
  { slug: 'psihologie', name: 'Psihologie', count: 11, description: 'Afect, memorie, atenție și sens în viața cotidiană.' },
  { slug: 'istorie', name: 'Istoria ideilor', count: 9, description: 'Concepte urmărite prin arhive, ediții și dispute.' },
  { slug: 'teologie', name: 'Teologie', count: 7, description: 'Tradiții, interpretări și forme ale vieții spirituale.' },
  { slug: 'inteligenta-artificiala', name: 'Inteligență artificială', count: 6, description: 'Agenți, responsabilitate și limitele analogiei cu mintea.' },
]

export const projects = [
  { id: 'pr-1', authorId: 'a-marian', title: 'Lexiconul conștiinței', description: 'Un vocabular comentat între filosofie și neuroștiințe.', status: 'În lucru' },
  { id: 'pr-2', authorId: 'a-marian', title: 'Caietul experienței', description: 'Eseuri și conversații despre persoana întâi.', status: 'Deschis' },
  { id: 'pr-3', authorId: 'a-ana', title: 'Atlas afectiv', description: 'Hartă critică a teoriilor contemporane ale emoției.', status: 'În lucru' },
  { id: 'pr-4', authorId: 'a-tudor', title: 'Istoria etalonului', description: 'Arhivă despre instrumente și standarde de măsurare.', status: 'Arhivă deschisă' },
]
