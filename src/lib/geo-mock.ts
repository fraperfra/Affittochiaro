export type Regione = { nome: string; slug: string };
export type Citta = { nome: string; slug: string; regione: string };

export const REGIONI: Regione[] = [
  { nome: 'Emilia-Romagna',       slug: 'emilia-romagna'       },
  { nome: 'Lombardia',            slug: 'lombardia'            },
  { nome: 'Lazio',                slug: 'lazio'                },
  { nome: 'Veneto',               slug: 'veneto'               },
  { nome: 'Piemonte',             slug: 'piemonte'             },
  { nome: 'Toscana',              slug: 'toscana'              },
  { nome: 'Campania',             slug: 'campania'             },
  { nome: 'Puglia',               slug: 'puglia'               },
  { nome: 'Sicilia',              slug: 'sicilia'              },
  { nome: 'Liguria',              slug: 'liguria'              },
  { nome: 'Marche',               slug: 'marche'               },
  { nome: 'Abruzzo',              slug: 'abruzzo'              },
  { nome: 'Friuli-Venezia Giulia',slug: 'friuli-venezia-giulia'},
  { nome: 'Trentino-Alto Adige',  slug: 'trentino-alto-adige'  },
  { nome: 'Umbria',               slug: 'umbria'               },
  { nome: 'Sardegna',             slug: 'sardegna'             },
  { nome: 'Calabria',             slug: 'calabria'             },
  { nome: 'Basilicata',           slug: 'basilicata'           },
  { nome: "Valle d'Aosta",        slug: 'valle-d-aosta'        },
  { nome: 'Molise',               slug: 'molise'               },
];

export const CITTA: Citta[] = [
  // Emilia-Romagna
  { nome: 'Bologna',       slug: 'bologna',       regione: 'emilia-romagna' },
  { nome: 'Reggio Emilia', slug: 'reggio-emilia', regione: 'emilia-romagna' },
  { nome: 'Modena',        slug: 'modena',        regione: 'emilia-romagna' },
  { nome: 'Parma',         slug: 'parma',         regione: 'emilia-romagna' },
  { nome: 'Rimini',        slug: 'rimini',        regione: 'emilia-romagna' },
  { nome: 'Ferrara',       slug: 'ferrara',       regione: 'emilia-romagna' },
  { nome: 'Ravenna',       slug: 'ravenna',       regione: 'emilia-romagna' },
  { nome: 'Piacenza',      slug: 'piacenza',      regione: 'emilia-romagna' },
  // Lombardia
  { nome: 'Milano',        slug: 'milano',        regione: 'lombardia' },
  { nome: 'Bergamo',       slug: 'bergamo',       regione: 'lombardia' },
  { nome: 'Brescia',       slug: 'brescia',       regione: 'lombardia' },
  { nome: 'Monza',         slug: 'monza',         regione: 'lombardia' },
  { nome: 'Como',          slug: 'como',          regione: 'lombardia' },
  { nome: 'Pavia',         slug: 'pavia',         regione: 'lombardia' },
  // Lazio
  { nome: 'Roma',          slug: 'roma',          regione: 'lazio' },
  { nome: 'Latina',        slug: 'latina',        regione: 'lazio' },
  { nome: 'Frosinone',     slug: 'frosinone',     regione: 'lazio' },
  // Veneto
  { nome: 'Venezia',       slug: 'venezia',       regione: 'veneto' },
  { nome: 'Verona',        slug: 'verona',        regione: 'veneto' },
  { nome: 'Padova',        slug: 'padova',        regione: 'veneto' },
  { nome: 'Vicenza',       slug: 'vicenza',       regione: 'veneto' },
  { nome: 'Treviso',       slug: 'treviso',       regione: 'veneto' },
  // Piemonte
  { nome: 'Torino',        slug: 'torino',        regione: 'piemonte' },
  { nome: 'Novara',        slug: 'novara',        regione: 'piemonte' },
  { nome: 'Alessandria',   slug: 'alessandria',   regione: 'piemonte' },
  // Toscana
  { nome: 'Firenze',       slug: 'firenze',       regione: 'toscana' },
  { nome: 'Pisa',          slug: 'pisa',          regione: 'toscana' },
  { nome: 'Siena',         slug: 'siena',         regione: 'toscana' },
  { nome: 'Livorno',       slug: 'livorno',       regione: 'toscana' },
  // Campania
  { nome: 'Napoli',        slug: 'napoli',        regione: 'campania' },
  { nome: 'Salerno',       slug: 'salerno',       regione: 'campania' },
  { nome: 'Caserta',       slug: 'caserta',       regione: 'campania' },
  // Puglia
  { nome: 'Bari',          slug: 'bari',          regione: 'puglia' },
  { nome: 'Lecce',         slug: 'lecce',         regione: 'puglia' },
  { nome: 'Taranto',       slug: 'taranto',       regione: 'puglia' },
  // Sicilia
  { nome: 'Palermo',       slug: 'palermo',       regione: 'sicilia' },
  { nome: 'Catania',       slug: 'catania',       regione: 'sicilia' },
  { nome: 'Messina',       slug: 'messina',       regione: 'sicilia' },
  // Liguria
  { nome: 'Genova',        slug: 'genova',        regione: 'liguria' },
  { nome: 'Savona',        slug: 'savona',        regione: 'liguria' },
  // Marche
  { nome: 'Ancona',        slug: 'ancona',        regione: 'marche' },
  { nome: 'Pesaro',        slug: 'pesaro',        regione: 'marche' },
  // Friuli-Venezia Giulia
  { nome: 'Trieste',       slug: 'trieste',       regione: 'friuli-venezia-giulia' },
  { nome: 'Udine',         slug: 'udine',         regione: 'friuli-venezia-giulia' },
  // Trentino
  { nome: 'Trento',        slug: 'trento',        regione: 'trentino-alto-adige' },
  { nome: 'Bolzano',       slug: 'bolzano',       regione: 'trentino-alto-adige' },
  // Umbria
  { nome: 'Perugia',       slug: 'perugia',       regione: 'umbria' },
  // Sardegna
  { nome: 'Cagliari',      slug: 'cagliari',      regione: 'sardegna' },
  { nome: 'Sassari',       slug: 'sassari',       regione: 'sardegna' },
  // Calabria
  { nome: 'Reggio Calabria', slug: 'reggio-calabria', regione: 'calabria' },
  // Abruzzo
  { nome: "L'Aquila",      slug: 'l-aquila',      regione: 'abruzzo' },
  { nome: 'Pescara',       slug: 'pescara',       regione: 'abruzzo' },
];

export const getCittaByRegione = (regioneSlug: string): Citta[] =>
  CITTA.filter((c) => c.regione === regioneSlug);

export const getRegioneByComune = (comuneSlug: string): string | null =>
  CITTA.find((c) => c.slug === comuneSlug)?.regione ?? null;

export const getNomeCitta = (slug: string): string =>
  CITTA.find((c) => c.slug === slug)?.nome ?? slug;

export const getNomeRegione = (slug: string): string =>
  REGIONI.find((r) => r.slug === slug)?.nome ?? slug;
