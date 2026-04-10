/**
 * Dati mock per le pagine pubbliche del sito (listing, guide, servizi, agenzie).
 * Separato da src/utils/mockData.ts che serve la dashboard interna.
 */

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type Tipologia = 'appartamento' | 'stanza' | 'bilocale' | 'trilocale' | 'villa';

export type PublicListing = {
  id: string;
  slug: string;
  titolo: string;
  descrizione: string;
  prezzo: number;
  comune: string;
  comuneSlug: string;
  regione: string;
  regioneSlug: string;
  zona: string;
  tipologia: Tipologia;
  tipologiaSlug: string;
  mq: number;
  camere: number;
  bagni: number;
  piano: number;
  disponibile: string;
  isExclusive: boolean;
  immagini: string[];
  agenziaId?: string;
  lat: number;
  lng: number;
};

export type PublicAgenzia = {
  id: string;
  slug: string;
  nome: string;
  citta: string;
  regione: string;
  descrizione: string;
  telefono: string;
  email: string;
  logo: string;
  annunciIds: string[];
};

export type Servizio = {
  id: string;
  slug: string;
  nome: string;
  descrizione: string;
  vantaggi: string[];
  icona: string;
};

export type Articolo = {
  id: string;
  slug: string;
  titolo: string;
  categoria: 'trovare-casa' | 'candidatura' | 'anti-truffa' | 'guide-citta' | 'agenzie';
  intro: string;
  contenuto: string;
  immagine: string;
  dataPubblicazione: string;
  tempoLettura: number;
};

export type Candidatura = {
  id: string;
  listingId: string;
  listingTitolo: string;
  comune: string;
  dataInvio: string;
  stato: 'in-attesa' | 'visualizzata' | 'contattato' | 'rifiutata';
};

// ─── Agenzie ─────────────────────────────────────────────────────────────────

export const publicAgenzie: PublicAgenzia[] = [
  {
    id: 'ag-1',
    slug: 'immobiliare-rossi-bologna',
    nome: 'Immobiliare Rossi',
    citta: 'Bologna',
    regione: 'Emilia-Romagna',
    descrizione: 'Agenzia immobiliare leader a Bologna con oltre 20 anni di esperienza negli affitti residenziali.',
    telefono: '+39 051 123 4567',
    email: 'info@immobiliarerossi.it',
    logo: 'https://picsum.photos/seed/ag1/80/80',
    annunciIds: ['lst-1', 'lst-2', 'lst-3'],
  },
  {
    id: 'ag-2',
    slug: 'casa-sicura-milano',
    nome: 'Casa Sicura Milano',
    citta: 'Milano',
    regione: 'Lombardia',
    descrizione: 'Specializzati in affitti garantiti e profili inquilini verificati nel cuore di Milano.',
    telefono: '+39 02 987 6543',
    email: 'info@casasicuramilano.it',
    logo: 'https://picsum.photos/seed/ag2/80/80',
    annunciIds: ['lst-4', 'lst-5'],
  },
  {
    id: 'ag-3',
    slug: 'affitti-roma-centro',
    nome: 'Affitti Roma Centro',
    citta: 'Roma',
    regione: 'Lazio',
    descrizione: 'Agenzia specializzata negli affitti nel centro storico e nei quartieri più richiesti di Roma.',
    telefono: '+39 06 555 7890',
    email: 'info@affittiroma.it',
    logo: 'https://picsum.photos/seed/ag3/80/80',
    annunciIds: ['lst-6', 'lst-7'],
  },
  {
    id: 'ag-4',
    slug: 'immobiliare-firenze-sud',
    nome: 'Immobiliare Firenze Sud',
    citta: 'Firenze',
    regione: 'Toscana',
    descrizione: 'Affitti residenziali a Firenze e dintorni. Partner certificato AffittoChiaro.',
    telefono: '+39 055 234 5678',
    email: 'info@immobiliarefirenze.it',
    logo: 'https://picsum.photos/seed/ag4/80/80',
    annunciIds: ['lst-8'],
  },
  {
    id: 'ag-5',
    slug: 'casa-torino-group',
    nome: 'Casa Torino Group',
    citta: 'Torino',
    regione: 'Piemonte',
    descrizione: 'Il riferimento per gli affitti residenziali a Torino. Oltre 500 contratti stipulati.',
    telefono: '+39 011 876 5432',
    email: 'info@casatorino.it',
    logo: 'https://picsum.photos/seed/ag5/80/80',
    annunciIds: ['lst-9', 'lst-10'],
  },
];

// ─── Annunci ─────────────────────────────────────────────────────────────────

export const publicListings: PublicListing[] = [
  {
    id: 'lst-1',
    slug: 'bilocale-luminoso-bologna-centro',
    titolo: 'Bilocale luminoso in centro storico',
    descrizione: 'Splendido bilocale ristrutturato nel cuore di Bologna, a pochi passi da Piazza Maggiore. L\'appartamento è stato completamente rinnovato nel 2023 con materiali di qualità. Cucina attrezzata, bagno moderno con doccia, ampio soggiorno con soffitti alti. Riscaldamento autonomo. Ideale per professionisti o coppie.',
    prezzo: 950,
    comune: 'Bologna',
    comuneSlug: 'bologna',
    regione: 'Emilia-Romagna',
    regioneSlug: 'emilia-romagna',
    zona: 'Centro Storico',
    tipologia: 'bilocale',
    tipologiaSlug: 'bilocale',
    mq: 55,
    camere: 1,
    bagni: 1,
    piano: 3,
    disponibile: 'Subito',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst1a/800/600',
      'https://picsum.photos/seed/lst1b/800/600',
      'https://picsum.photos/seed/lst1c/800/600',
    ],
    agenziaId: 'ag-1',
    lat: 44.4938,
    lng: 11.3426,
  },
  {
    id: 'lst-2',
    slug: 'trilocale-con-balcone-bologna-navile',
    titolo: 'Trilocale con balcone - Quartiere Navile',
    descrizione: 'Ampio trilocale in zona residenziale tranquilla, a 10 minuti dal centro con i mezzi. Due camere da letto, soggiorno con balcone, cucina abitabile e bagno. Cantina inclusa. Adatto a famiglie o coinquilini.',
    prezzo: 1100,
    comune: 'Bologna',
    comuneSlug: 'bologna',
    regione: 'Emilia-Romagna',
    regioneSlug: 'emilia-romagna',
    zona: 'Navile',
    tipologia: 'trilocale',
    tipologiaSlug: 'trilocale',
    mq: 85,
    camere: 2,
    bagni: 1,
    piano: 1,
    disponibile: '01/02/2026',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst2a/800/600',
      'https://picsum.photos/seed/lst2b/800/600',
    ],
    agenziaId: 'ag-1',
    lat: 44.5108,
    lng: 11.3389,
  },
  {
    id: 'lst-3',
    slug: 'stanza-singola-bologna-universitaria',
    titolo: 'Stanza singola zona universitaria',
    descrizione: 'Stanza singola luminosa in appartamento condiviso con altri 2 studenti. Cucina attrezzata, bagno in comune, connessione fibra inclusa. A 5 minuti a piedi dalle facoltà di Lettere e Scienze.',
    prezzo: 420,
    comune: 'Bologna',
    comuneSlug: 'bologna',
    regione: 'Emilia-Romagna',
    regioneSlug: 'emilia-romagna',
    zona: 'Zona Universitaria',
    tipologia: 'stanza',
    tipologiaSlug: 'stanza',
    mq: 18,
    camere: 1,
    bagni: 1,
    piano: 2,
    disponibile: 'Subito',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst3a/800/600',
    ],
    agenziaId: 'ag-1',
    lat: 44.4975,
    lng: 11.3531,
  },
  {
    id: 'lst-4',
    slug: 'appartamento-moderno-milano-navigli',
    titolo: 'Appartamento moderno ai Navigli',
    descrizione: 'Elegante appartamento ristrutturato nel vivace quartiere dei Navigli. Open space cucina-soggiorno, camera matrimoniale, bagno con vasca. Portineria, ascensore. Adatto a professionisti. Zona ottimamente servita da mezzi pubblici.',
    prezzo: 1600,
    comune: 'Milano',
    comuneSlug: 'milano',
    regione: 'Lombardia',
    regioneSlug: 'lombardia',
    zona: 'Navigli',
    tipologia: 'appartamento',
    tipologiaSlug: 'appartamento',
    mq: 65,
    camere: 1,
    bagni: 1,
    piano: 4,
    disponibile: 'Subito',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst4a/800/600',
      'https://picsum.photos/seed/lst4b/800/600',
      'https://picsum.photos/seed/lst4c/800/600',
    ],
    agenziaId: 'ag-2',
    lat: 45.4484,
    lng: 9.1774,
  },
  {
    id: 'lst-5',
    slug: 'bilocale-porta-venezia-milano',
    titolo: 'Bilocale in Porta Venezia',
    descrizione: 'Bilocale in ottimo stato in zona Porta Venezia, cuore pulsante della movida milanese. Cucina separata, soggiorno spazioso, camera da letto, doppio servizio. Palazzo d\'epoca con ascensore.',
    prezzo: 1350,
    comune: 'Milano',
    comuneSlug: 'milano',
    regione: 'Lombardia',
    regioneSlug: 'lombardia',
    zona: 'Porta Venezia',
    tipologia: 'bilocale',
    tipologiaSlug: 'bilocale',
    mq: 58,
    camere: 1,
    bagni: 2,
    piano: 2,
    disponibile: '15/01/2026',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst5a/800/600',
      'https://picsum.photos/seed/lst5b/800/600',
    ],
    agenziaId: 'ag-2',
    lat: 45.4726,
    lng: 9.2037,
  },
  {
    id: 'lst-6',
    slug: 'trilocale-prati-roma',
    titolo: 'Trilocale nel quartiere Prati',
    descrizione: 'Splendido trilocale nel prestigioso quartiere Prati, a 5 minuti dal Vaticano. Due camere da letto, grande soggiorno con vista sulla piazza, cucina a vista, bagno ristrutturato. Palazzo storico con portiere.',
    prezzo: 1800,
    comune: 'Roma',
    comuneSlug: 'roma',
    regione: 'Lazio',
    regioneSlug: 'lazio',
    zona: 'Prati',
    tipologia: 'trilocale',
    tipologiaSlug: 'trilocale',
    mq: 90,
    camere: 2,
    bagni: 1,
    piano: 3,
    disponibile: 'Subito',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst6a/800/600',
      'https://picsum.photos/seed/lst6b/800/600',
      'https://picsum.photos/seed/lst6c/800/600',
    ],
    agenziaId: 'ag-3',
    lat: 41.9025,
    lng: 12.4631,
  },
  {
    id: 'lst-7',
    slug: 'appartamento-trastevere-roma',
    titolo: 'Appartamento nel cuore di Trastevere',
    descrizione: 'Affascinante appartamento nel borgo di Trastevere, il quartiere più autentico di Roma. Travi a vista, pavimenti in cotto, cucina tipica romana. Ideale per chi vuole vivere la vera atmosfera capitolina.',
    prezzo: 1400,
    comune: 'Roma',
    comuneSlug: 'roma',
    regione: 'Lazio',
    regioneSlug: 'lazio',
    zona: 'Trastevere',
    tipologia: 'appartamento',
    tipologiaSlug: 'appartamento',
    mq: 70,
    camere: 2,
    bagni: 1,
    piano: 2,
    disponibile: '01/03/2026',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst7a/800/600',
      'https://picsum.photos/seed/lst7b/800/600',
    ],
    agenziaId: 'ag-3',
    lat: 41.8893,
    lng: 12.4698,
  },
  {
    id: 'lst-8',
    slug: 'villa-con-giardino-firenze-fiesole',
    titolo: 'Villa con giardino - Fiesole',
    descrizione: 'Villa indipendente con giardino privato sulle colline di Fiesole, con vista panoramica su Firenze. Quattro camere da letto, tre bagni, cucina professionale, sala da pranzo, ampio terrazzo. Posto auto. Ideale per famiglie che cercano verde e tranquillità a 15 minuti dal centro.',
    prezzo: 3200,
    comune: 'Firenze',
    comuneSlug: 'firenze',
    regione: 'Toscana',
    regioneSlug: 'toscana',
    zona: 'Fiesole',
    tipologia: 'villa',
    tipologiaSlug: 'villa',
    mq: 250,
    camere: 4,
    bagni: 3,
    piano: 0,
    disponibile: 'Subito',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst8a/800/600',
      'https://picsum.photos/seed/lst8b/800/600',
      'https://picsum.photos/seed/lst8c/800/600',
      'https://picsum.photos/seed/lst8d/800/600',
    ],
    agenziaId: 'ag-4',
    lat: 43.8088,
    lng: 11.2952,
  },
  {
    id: 'lst-9',
    slug: 'bilocale-crocetta-torino',
    titolo: 'Bilocale in zona Crocetta',
    descrizione: 'Bilocale silenzioso e ben esposto nel prestigioso quartiere Crocetta. Cucina abitabile, soggiorno, camera doppia, bagno con finestra. Palazzo in buono stato, cortile interno, cantina. A pochi passi dal mercato e dai mezzi pubblici.',
    prezzo: 800,
    comune: 'Torino',
    comuneSlug: 'torino',
    regione: 'Piemonte',
    regioneSlug: 'piemonte',
    zona: 'Crocetta',
    tipologia: 'bilocale',
    tipologiaSlug: 'bilocale',
    mq: 60,
    camere: 1,
    bagni: 1,
    piano: 2,
    disponibile: 'Subito',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst9a/800/600',
      'https://picsum.photos/seed/lst9b/800/600',
    ],
    agenziaId: 'ag-5',
    lat: 45.0556,
    lng: 7.6567,
  },
  {
    id: 'lst-10',
    slug: 'trilocale-san-salvario-torino',
    titolo: 'Trilocale ristrutturato in San Salvario',
    descrizione: 'Trilocale completamente ristrutturato nel quartiere più trendy di Torino. Open space cucina-soggiorno, due camere da letto, bagno con doccia walk-in. Infissi nuovi, riscaldamento autonomo a condensazione. Ottima posizione per sfruttare tutta la vita del quartiere.',
    prezzo: 1050,
    comune: 'Torino',
    comuneSlug: 'torino',
    regione: 'Piemonte',
    regioneSlug: 'piemonte',
    zona: 'San Salvario',
    tipologia: 'trilocale',
    tipologiaSlug: 'trilocale',
    mq: 80,
    camere: 2,
    bagni: 1,
    piano: 3,
    disponibile: '01/02/2026',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst10a/800/600',
      'https://picsum.photos/seed/lst10b/800/600',
    ],
    agenziaId: 'ag-5',
    lat: 45.0568,
    lng: 7.6811,
  },
  {
    id: 'lst-11',
    slug: 'monolocale-modena-centro',
    titolo: 'Monolocale moderno in centro a Modena',
    descrizione: 'Monolocale ristrutturato a due passi dal Duomo di Modena. Zona giorno con letto a scomparsa, angolo cottura, bagno con doccia. Ideale per chi lavora in centro o studia all\'Università di Modena.',
    prezzo: 580,
    comune: 'Modena',
    comuneSlug: 'modena',
    regione: 'Emilia-Romagna',
    regioneSlug: 'emilia-romagna',
    zona: 'Centro',
    tipologia: 'appartamento',
    tipologiaSlug: 'appartamento',
    mq: 35,
    camere: 1,
    bagni: 1,
    piano: 1,
    disponibile: 'Subito',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst11a/800/600',
    ],
    agenziaId: undefined,
    lat: 44.6462,
    lng: 10.9264,
  },
  {
    id: 'lst-12',
    slug: 'appartamento-esclusivo-reggio-emilia',
    titolo: 'Appartamento esclusivo con terrazzo - Reggio Emilia',
    descrizione: 'Ampio appartamento con terrazzo privato di 40mq in zona residenziale premium. Tre camere da letto, due bagni, cucina professionale, doppio ingresso. Posto auto e cantina inclusi. Ideale per famiglie che cercano spazio e qualità.',
    prezzo: 1200,
    comune: 'Reggio Emilia',
    comuneSlug: 'reggio-emilia',
    regione: 'Emilia-Romagna',
    regioneSlug: 'emilia-romagna',
    zona: 'Semicentro',
    tipologia: 'appartamento',
    tipologiaSlug: 'appartamento',
    mq: 120,
    camere: 3,
    bagni: 2,
    piano: 4,
    disponibile: '01/03/2026',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst12a/800/600',
      'https://picsum.photos/seed/lst12b/800/600',
      'https://picsum.photos/seed/lst12c/800/600',
    ],
    agenziaId: 'ag-1',
    lat: 44.6989,
    lng: 10.6297,
  },
  {
    id: 'lst-13',
    slug: 'stanza-doppia-firenze-oltrarno',
    titolo: 'Stanza doppia in Oltrarno - Firenze',
    descrizione: 'Stanza doppia in appartamento condiviso nel caratteristico quartiere Oltrarno. Cucina e bagno in comune con altri 2 coinquilini. Appartamento silenzioso, ottima luce naturale. A 10 minuti a piedi da Palazzo Pitti.',
    prezzo: 490,
    comune: 'Firenze',
    comuneSlug: 'firenze',
    regione: 'Toscana',
    regioneSlug: 'toscana',
    zona: 'Oltrarno',
    tipologia: 'stanza',
    tipologiaSlug: 'stanza',
    mq: 22,
    camere: 1,
    bagni: 1,
    piano: 2,
    disponibile: 'Subito',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst13a/800/600',
    ],
    agenziaId: 'ag-4',
    lat: 43.7653,
    lng: 11.2488,
  },
  {
    id: 'lst-14',
    slug: 'bilocale-parioli-roma',
    titolo: 'Bilocale elegante ai Parioli',
    descrizione: 'Raffinato bilocale nel quartiere residenziale dei Parioli, tra i più esclusivi di Roma. Cucina completamente attrezzata, soggiorno con parquet, camera matrimoniale, bagno con doppio lavabo. Portiere, garage, cantina.',
    prezzo: 1550,
    comune: 'Roma',
    comuneSlug: 'roma',
    regione: 'Lazio',
    regioneSlug: 'lazio',
    zona: 'Parioli',
    tipologia: 'bilocale',
    tipologiaSlug: 'bilocale',
    mq: 65,
    camere: 1,
    bagni: 1,
    piano: 5,
    disponibile: 'Subito',
    isExclusive: false,
    immagini: [
      'https://picsum.photos/seed/lst14a/800/600',
      'https://picsum.photos/seed/lst14b/800/600',
    ],
    agenziaId: 'ag-3',
    lat: 41.9268,
    lng: 12.4997,
  },
  {
    id: 'lst-15',
    slug: 'appartamento-panoramico-milano-isola',
    titolo: 'Appartamento panoramico in zona Isola',
    descrizione: 'Appartamento al 7° piano con vista mozzafiato sul quartiere Isola e sullo skyline di Milano. Open space, cucina a vista, camera da letto, bagno con doccia. Edificio recente con ascensore, portineria, posto auto in box.',
    prezzo: 1750,
    comune: 'Milano',
    comuneSlug: 'milano',
    regione: 'Lombardia',
    regioneSlug: 'lombardia',
    zona: 'Isola',
    tipologia: 'appartamento',
    tipologiaSlug: 'appartamento',
    mq: 60,
    camere: 1,
    bagni: 1,
    piano: 7,
    disponibile: '01/02/2026',
    isExclusive: true,
    immagini: [
      'https://picsum.photos/seed/lst15a/800/600',
      'https://picsum.photos/seed/lst15b/800/600',
      'https://picsum.photos/seed/lst15c/800/600',
    ],
    agenziaId: 'ag-2',
    lat: 45.4889,
    lng: 9.1883,
  },
];

// ─── Servizi ─────────────────────────────────────────────────────────────────

export const servizi: Servizio[] = [
  {
    id: 'srv-1',
    slug: 'analisi-profilo-cv',
    nome: 'Analisi Profilo CV',
    descrizione: 'Il nostro team esamina il tuo profilo e ti fornisce un report dettagliato su punti di forza e aree di miglioramento. Ti aiutiamo a presentarti al meglio alle agenzie.',
    vantaggi: [
      'Report personalizzato in 48 ore',
      'Consigli pratici per migliorare la candidatura',
      'Confronto con i profili più richiesti',
      'Consulenza telefonica inclusa',
    ],
    icona: 'FileText',
  },
  {
    id: 'srv-2',
    slug: 'verifica-documenti',
    nome: 'Verifica Documenti',
    descrizione: 'Carichiamo e verifichiamo i tuoi documenti (buste paga, contratto di lavoro, documenti d\'identità) per renderti un candidato certificato e aumentare le tue possibilità.',
    vantaggi: [
      'Verifica in 24 ore lavorative',
      'Badge "Documenti Verificati" sul profilo',
      'Maggiore fiducia dalle agenzie',
      'Conservazione sicura dei documenti',
    ],
    icona: 'ShieldCheck',
  },
  {
    id: 'srv-3',
    slug: 'consulenza-contrattuale',
    nome: 'Consulenza Contrattuale',
    descrizione: 'Un nostro esperto legale rivede il contratto di affitto prima della firma. Ti spieghiamo ogni clausola e ti tuteliamo da condizioni potenzialmente sfavorevoli.',
    vantaggi: [
      'Revisione completa del contratto',
      'Spiegazione di ogni clausola in linguaggio semplice',
      'Segnalazione di clausole irregolari',
      'Supporto durante la trattativa',
    ],
    icona: 'Scale',
  },
  {
    id: 'srv-4',
    slug: 'assicurazione-affitto',
    nome: 'Assicurazione Affitto',
    descrizione: 'Proteggi il tuo affitto con la nostra polizza. In caso di imprevisti (perdita del lavoro, malattia) copriamo fino a 6 mesi di canone, garantendo la tua tranquillità.',
    vantaggi: [
      'Copertura fino a 6 mesi di canone',
      'Attivazione in pochi giorni',
      'Nessuna franchigia',
      'Assistenza legale inclusa in caso di controversie',
    ],
    icona: 'Umbrella',
  },
];

// ─── Articoli ─────────────────────────────────────────────────────────────────

export const articoli: Articolo[] = [
  {
    id: 'art-1',
    slug: 'come-presentarsi-al-proprietario',
    titolo: 'Come presentarsi al proprietario: la guida completa',
    categoria: 'candidatura',
    intro: 'La prima impressione conta. Scopri come costruire un profilo inquilino che conquista le agenzie al primo sguardo e aumenta le tue possibilità di trovare casa.',
    contenuto: `## Perché il profilo inquilino è fondamentale

Nel mercato degli affitti di oggi, la concorrenza è altissima. Per ogni appartamento disponibile, decine di candidati inviano la propria richiesta. Come distinguersi?

La risposta è semplice: avere un profilo completo, trasparente e professionale.

## I documenti che fanno la differenza

Le agenzie immobiliari richiedono sempre più spesso una serie di documenti prima ancora di fissare un appuntamento:

- **Documento d'identità valido** (carta d'identità o passaporto)
- **Codice fiscale**
- **Ultime 3 buste paga** o dichiarazione dei redditi (CU) se autonomo
- **Contratto di lavoro** (a tempo indeterminato è preferibile)

## Come scrivere una buona presentazione personale

La bio del tuo profilo è la prima cosa che legge l'agenzia. Ecco alcune regole:

1. Presentati in modo sintetico ma completo
2. Indica il tuo lavoro e la tua situazione familiare
3. Spiega perché cerchi casa in quella città
4. Menziona eventuali referenze da proprietari precedenti

## Il garanzie: quando serve e come ottenerla

Se sei giovane, hai un contratto a termine o sei libero professionista, molte agenzie potrebbero chiederti un garante. Prepararti in anticipo ti fa risparmiare tempo.

## Conclusione

Investire qualche ora nella cura del tuo profilo può fare la differenza tra ottenere un appuntamento e non ricevere risposta. Con AffittoChiaro, puoi costruire il tuo curriculum inquilino completo e renderlo visibile alle agenzie partner.`,
    immagine: 'https://picsum.photos/seed/art1/1200/630',
    dataPubblicazione: '2025-11-15',
    tempoLettura: 5,
  },
  {
    id: 'art-2',
    slug: 'affittare-senza-busta-paga',
    titolo: 'Affittare senza busta paga: è possibile?',
    categoria: 'trovare-casa',
    intro: 'Freelance, partite IVA, studenti: trovare casa senza un contratto a tempo indeterminato è difficile ma non impossibile. Ecco le strategie che funzionano davvero.',
    contenuto: `## Il problema dei lavoratori autonomi

Freelance, liberi professionisti e titolari di partita IVA affrontano ostacoli enormi nella ricerca di un affitto. Le agenzie tendono a preferire dipendenti con contratto a tempo indeterminato, ritenuti "più sicuri".

Eppure, in Italia, quasi 5 milioni di persone lavorano in modo autonomo. Non possono essere escluse dal mercato degli affitti.

## Cosa puoi fare

### 1. Mostra la continuità del reddito
Porta le ultime 2-3 dichiarazioni dei redditi (Modello Unico). Se il tuo fatturato è stabile o in crescita, questo pesa molto.

### 2. Proponi un garante
Un genitore o un familiare con reddito fisso può fare da garante. È la soluzione più diffusa.

### 3. Offri più mensilità in anticipo
Proporre 3-6 mesi di anticipo può rassicurare il proprietario. Non è sempre possibile, ma vale la pena provare.

### 4. Cerca agenzie aperte ai profili autonomi
AffittoChiaro lavora con agenzie selezionate che hanno esperienza con inquilini freelance e partite IVA.

## Il curriculum inquilino fa la differenza

Con un profilo completo e i documenti verificati su AffittoChiaro, le agenzie possono valutarti in modo più obiettivo, andando oltre il semplice tipo di contratto.`,
    immagine: 'https://picsum.photos/seed/art2/1200/630',
    dataPubblicazione: '2025-12-03',
    tempoLettura: 6,
  },
  {
    id: 'art-3',
    slug: 'come-riconoscere-annuncio-truffa',
    titolo: 'Come riconoscere un annuncio truffa in 5 passi',
    categoria: 'anti-truffa',
    intro: 'Le truffe nel settore degli affitti sono in aumento. Ecco i segnali d\'allarme da riconoscere subito e come proteggerti prima di versare qualsiasi somma.',
    contenuto: `## Il fenomeno delle truffe immobiliari

Ogni anno in Italia migliaia di persone perdono soldi a causa di annunci immobiliari falsi. Il danno medio è di oltre 2.000 euro per vittima.

Con l'avvento delle piattaforme online, i truffatori sono diventati sempre più sofisticati. Ma ci sono segnali che non sbagliano mai.

## I 5 segnali da non ignorare

### 1. Prezzo troppo basso
Un bilocale in centro Milano a 400€/mese non esiste. Se il prezzo è irrealisticamente basso, è quasi certamente una truffa. Confronta sempre con annunci simili nella stessa zona.

### 2. Proprietario all'estero che non può incontrarti
"Sono all'estero per lavoro, vi mando le chiavi via corriere dopo il versamento del deposito" — questa frase è il classico inizio di una truffa.

### 3. Richiesta di pagamento anticipato prima della visita
Nessun proprietario o agenzia legittima chiede denaro prima che tu abbia visto l'immobile. Mai.

### 4. Comunicazione solo via email o chat
I truffatori evitano le telefonate perché temono il riconoscimento vocale. Insisti sempre per una chiamata o un incontro di persona.

### 5. Documenti dell'immobile non verificabili
Chiedi sempre la visura catastale o il contratto registrato del precedente inquilino. Un proprietario legittimo non ha problemi a mostrarli.

## Come proteggersi

- Usa solo piattaforme con agenzie verificate
- Non versare mai caparre senza aver firmato un preliminare
- Controlla la corrispondenza tra intestatario del conto e proprietario dichiarato
- Segnala gli annunci sospetti alla Polizia Postale`,
    immagine: 'https://picsum.photos/seed/art3/1200/630',
    dataPubblicazione: '2025-12-20',
    tempoLettura: 4,
  },
  {
    id: 'art-4',
    slug: 'guida-affitti-bologna',
    titolo: 'Guida agli affitti a Bologna: quartieri, prezzi e consigli',
    categoria: 'guide-citta',
    intro: 'Bologna è una delle città più richieste in Italia per gli affitti. Scopri i quartieri migliori, i prezzi aggiornati al 2025 e i consigli pratici per trovare casa sotto le Torri.',
    contenuto: `## Perché affittare a Bologna

Bologna è una città universitaria, culturale e gastronomica, ma è anche un importante hub per il lavoro, grazie alla presenza di multinazionali e alla vicinanza con il distretto della Motor Valley.

Il mercato degli affitti è competitivo, specialmente a settembre con l'inizio dell'anno accademico. Muoversi con anticipo è fondamentale.

## I quartieri di Bologna

### Centro Storico
Il cuore della città, con i portici storici. Prezzi: **€900-1.400/mese** per un bilocale. Ideale per chi vuole camminare ovunque. Più rumoroso la sera.

### Zona Universitaria
Attorno alle facoltà, molto vivace. Prezzi per stanza: **€350-500/mese**. Ambiente giovane e dinamico.

### Navile
Quartiere in evoluzione, ottimi collegamenti. Trilocali da **€850-1.100/mese**. Buon rapporto qualità/prezzo.

### Savena e San Donnino
Zone residenziali tranquille. Prezzi più bassi, meno servizi. Appartamenti da **€700-950/mese**.

### Bolognina
Zona multiculturale in riqualificazione. Prezzi contenuti e in crescita. Buona scelta per chi ha budget limitato.

## Prezzi medi (2025)

| Tipologia | Prezzo medio |
|-----------|-------------|
| Stanza singola | €380-500 |
| Monolocale | €550-750 |
| Bilocale | €850-1.200 |
| Trilocale | €1.000-1.500 |

## Consigli pratici

1. **Inizia la ricerca con 2-3 mesi di anticipo**, specialmente se cerchi per settembre
2. **Completa il tuo profilo AffittoChiaro** prima di candidarti
3. **Considera i costi totali**: spese condominiali, riscaldamento, garage
4. **Verifica i mezzi pubblici**: Bologna ha un ottimo servizio di bus e tram`,
    immagine: 'https://picsum.photos/seed/art4/1200/630',
    dataPubblicazione: '2026-01-10',
    tempoLettura: 7,
  },
  {
    id: 'art-5',
    slug: 'guida-affitti-milano',
    titolo: 'Affittare a Milano nel 2026: prezzi, zone e strategie',
    categoria: 'guide-citta',
    intro: 'Milano è la città più cara d\'Italia per gli affitti. Ma con la strategia giusta, è possibile trovare casa a prezzi sostenibili anche nel capoluogo lombardo.',
    contenuto: `## Il mercato milanese degli affitti

Milano è il motore economico d'Italia e la città con i canoni di affitto più elevati. I prezzi medi sono cresciuti del 12% nel 2025, spinti dalla domanda internazionale e dal turismo.

Eppure, con le giuste informazioni e un profilo inquilino curato, è possibile trovare soluzioni interessanti.

## Le zone di Milano per fascia di prezzo

### Zone Premium (>€1.500/mese per bilocale)
Brera, Navigli, Porta Venezia, Magenta, Isola, City Life

### Zone Intermedie (€1.100-1.500/mese)
Loreto, Lambrate, Cimiano, Niguarda, Bovisa

### Zone Più Accessibili (<€1.100/mese)
Quarto Oggiaro, Baggio, Rogoredo, Corvetto, Gratosoglio

## I quartieri consigliati per fascia di necessità

**Studenti**: Bovisa (vicina al Politecnico), Gorla, Crescenzago
**Professionisti**: Navigli, Isola, Porta Venezia
**Famiglie**: Affori, Niguarda, Baggio

## Come trovare casa a Milano

Il mercato milanese si muove velocemente. Un appartamento viene spesso affittato entro 48-72 ore dalla pubblicazione. Per questo:

- Tieni il profilo sempre aggiornato e completo
- Attiva le notifiche per le zone di interesse
- Sii pronto a visitare entro 24 ore dalla disponibilità
- Prepara tutti i documenti in anticipo`,
    immagine: 'https://picsum.photos/seed/art5/1200/630',
    dataPubblicazione: '2026-01-25',
    tempoLettura: 6,
  },
  {
    id: 'art-6',
    slug: 'agenzie-immobiliari-come-sceglierla',
    titolo: 'Come scegliere l\'agenzia immobiliare giusta per trovare affitto',
    categoria: 'agenzie',
    intro: 'Non tutte le agenzie immobiliari sono uguali. Ecco come valutare un\'agenzia prima di affidarle la ricerca di casa, i segnali positivi e quelli da evitare.',
    contenuto: `## Perché l'agenzia giusta fa la differenza

Affidarsi a un'agenzia immobiliare può sembrare costoso, ma in realtà può farti risparmiare tempo, stress e denaro. La chiave è scegliere quella giusta.

## Cosa valutare prima di scegliere

### Specializzazione
Alcune agenzie si occupano solo di vendite, altre solo di affitti. Preferisci chi ha esperienza specifica nel mercato delle locazioni.

### Presenza locale
Un'agenzia radicata nella zona conosce i prezzi reali, i proprietari affidabili e le insidie del quartiere.

### Trasparenza sulle commissioni
Le commissioni di agenzia sono in genere pari a 1-2 mensilità. Diffida di chi non le specifica subito o le gonfia dopo.

### Portfolio verificato
Le agenzie partner di AffittoChiaro sono selezionate e verificate. Questo significa che i loro annunci sono reali e aggiornati.

## I segnali di un'agenzia affidabile

✅ Ti chiede i documenti prima di farti visitare gli immobili
✅ Ha un ufficio fisico visitabile
✅ Risponde alle domande in modo chiaro e dettagliato
✅ Non ti pressa ad accettare il primo appartamento che vedi
✅ Fornisce un contratto scritto con tutte le condizioni

## Quelli da evitare

❌ Chiede commissioni in contanti prima di qualsiasi visita
❌ Non ha sito web o profilo verificato
❌ Non ti permette di parlare direttamente con il proprietario
❌ Annunci con foto di bassa qualità o copiati da altri siti

## Conclusione

Con AffittoChiaro puoi accedere a un network di agenzie selezionate che lavorano con inquilini verificati. Questo significa meno burocrazia, più fiducia e contratti più veloci.`,
    immagine: 'https://picsum.photos/seed/art6/1200/630',
    dataPubblicazione: '2026-02-05',
    tempoLettura: 5,
  },
];

// ─── Candidature mock ─────────────────────────────────────────────────────────

export const candidatureMock: Candidatura[] = [
  {
    id: 'cand-1',
    listingId: 'lst-1',
    listingTitolo: 'Bilocale luminoso in centro storico',
    comune: 'Bologna',
    dataInvio: '2026-01-10',
    stato: 'contattato',
  },
  {
    id: 'cand-2',
    listingId: 'lst-4',
    listingTitolo: 'Appartamento moderno ai Navigli',
    comune: 'Milano',
    dataInvio: '2026-01-15',
    stato: 'visualizzata',
  },
  {
    id: 'cand-3',
    listingId: 'lst-7',
    listingTitolo: 'Appartamento nel cuore di Trastevere',
    comune: 'Roma',
    dataInvio: '2026-01-20',
    stato: 'in-attesa',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const getListingsByComune = (comuneSlug: string): PublicListing[] =>
  publicListings.filter((l) => l.comuneSlug === comuneSlug);

export const getListingsByTipologia = (comuneSlug: string, tipologiaSlug: string): PublicListing[] =>
  publicListings.filter((l) => l.comuneSlug === comuneSlug && l.tipologiaSlug === tipologiaSlug);

export const getListingBySlug = (slug: string): PublicListing | undefined =>
  publicListings.find((l) => l.slug === slug);

export const getExclusiveListings = (): PublicListing[] =>
  publicListings.filter((l) => l.isExclusive);

export const getSimilarListings = (listing: PublicListing, count = 3): PublicListing[] =>
  publicListings
    .filter((l) => l.id !== listing.id && (l.comuneSlug === listing.comuneSlug || l.tipologia === listing.tipologia))
    .slice(0, count);

export const getAgenziaById = (id: string): PublicAgenzia | undefined =>
  publicAgenzie.find((a) => a.id === id);

export const getServizioBySlug = (slug: string): Servizio | undefined =>
  servizi.find((s) => s.slug === slug);

export const getArticoloBySlug = (slug: string): Articolo | undefined =>
  articoli.find((a) => a.slug === slug);
