// Conținut editorial pentru Sinapsă & Sens.
// Într-o versiune de producție, aceste date ar veni dintr-un CMS.

export const authors = [
  {
    id: 'marian',
    name: 'Marian Bituics',
    role: 'Doctorand · Filosofia minții',
    badge: 'M|B',
    epigraph: '„Nu explicăm mintea ca s-o desființăm, ci ca s-o înțelegem.”',
    bio: 'Cercetez granița dintre conștiința trăită și explicația neuronală — cum devine activitatea creierului experiență. Scriu pentru cititorul care refuză deopotrivă misticismul și reducționismul.',
    tags: ['Fenomenologie', 'Neuroștiințe cognitive', 'Filosofia minții'],
  },
  {
    id: 'ana',
    name: 'Ana-Maria Ilinca',
    role: 'Cercetătoare · Neuroștiințe afective',
    badge: 'A|I',
    epigraph: '„Sentimentul nu este opusul rațiunii, ci condiția ei.”',
    bio: 'Studiez emoția ca formă de cunoaștere: ce ne spun circuitele afective despre valorile pe care le trăim și de ce a simți înseamnă, deja, a înțelege.',
    tags: ['Emoție', 'Etica afectelor', 'Neuroștiințe'],
  },
  {
    id: 'tudor',
    name: 'Tudor Vlas',
    role: 'Doctorand · Filosofia științei',
    badge: 'T|V',
    epigraph: '„Fiecare măsurătoare ascunde o metafizică.”',
    bio: 'Mă interesează cum se construiește un fapt științific și ce presupuneri tacite ascunde un model. Între laborator și concept, caut locul unde măsura devine sens.',
    tags: ['Filosofia științei', 'Cauzalitate', 'Epistemologie'],
  },
]

export const articleTitles = [
  'Ce știe creierul despre liberul arbitru',
  'Fenomenologia atenției, de la Husserl la rețele neuronale',
  'Conștiința nu este un loc',
  'Memoria ca ficțiune necesară',
  'Neuroetica deciziilor morale',
  'Timpul trăit și timpul măsurat',
  'Ce rămâne din eu când creierul se schimbă',
  'Durerea, între semnal și semnificație',
]

export const featuredArticles = [
  {
    domain: 'Neuroetică',
    title: 'Ce știe creierul despre liberul arbitru',
    dek: 'Experimentele lui Libet au fost citite prea repede ca o condamnare a voinței. Recitesc dovezile și întreb ce înseamnă, de fapt, „a decide”.',
    author: 'Marian Bituics',
    read: '12 min',
  },
  {
    domain: 'Fenomenologie',
    title: 'Fenomenologia atenției',
    dek: 'De la privirea husserliană la rețelele de saliență: cum a devenit atenția, dintr-un act al conștiinței, o hartă de activări.',
    author: 'Marian Bituics',
    read: '9 min',
  },
  {
    domain: 'Filosofia minții',
    title: 'Conștiința nu este un loc',
    dek: 'Căutăm sediul conștiinței ca pe un oraș pe hartă. Poate că întrebarea „unde” este chiar greșeala care ne ține pe loc.',
    author: 'Ana-Maria Ilinca',
    read: '7 min',
  },
]

export const domains = [
  {
    name: 'Filosofia minții',
    desc: 'Raportul dintre stările mentale și cele fizice — și ce înseamnă să reduci unul la celălalt.',
    count: 18,
  },
  {
    name: 'Fenomenologie',
    desc: 'Structura experienței trăite, descrisă la persoana întâi, înainte de orice teorie.',
    count: 12,
  },
  {
    name: 'Neuroetică',
    desc: 'Ce datorăm — și ce ne datorăm — unei ființe cu creier, memorie și frică de moarte.',
    count: 9,
  },
  {
    name: 'Conștiință & Qualia',
    desc: 'Problema grea a conștiinței și limitele a ceea ce o explicație poate atinge.',
    count: 11,
  },
  {
    name: 'Filosofia științei',
    desc: 'Cum se construiește un fapt, ce presupune un model și unde se oprește măsura.',
    count: 7,
  },
]

export const events = [
  { type: 'Webinar', kind: 'webinar', title: 'Predicția și percepția: creierul ca mașină bayesiană', when: '18 iulie 2026 · 19:00' },
  { type: 'Dezbatere', kind: 'talk', title: 'Are creierul nevoie de suflet?', when: '24 iulie 2026 · 18:30' },
  { type: 'Webinar', kind: 'webinar', title: 'Atenția în epoca distragerii', when: '31 iulie 2026 · 19:00' },
  { type: 'Lansare de carte', kind: 'talk', title: '„Mintea întrupată” — seară de lectură', when: '07 august 2026 · 20:00' },
  { type: 'Seminar', kind: 'talk', title: 'Liberul arbitru după Libet', when: '14 august 2026 · 17:00' },
  { type: 'Webinar', kind: 'webinar', title: 'Ce este o experiență? Qualia pe înțelesul tuturor', when: '21 august 2026 · 19:00' },
]

export const partners = [
  'Institutul de Filosofie',
  'CogLab UB',
  'Revista Hyperion',
  'Fundația Noesis',
]

export const primaryNav = ['Prezentare', 'Știri', 'Dezbateri', 'Domenii', 'Povești', 'Contact']
