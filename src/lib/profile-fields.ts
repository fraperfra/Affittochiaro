export type ProfileField = {
  key: string;
  label: string;
  section: string;
  href: string;
};

export const PROFILE_FIELDS: ProfileField[] = [
  { key: 'telefono',             label: 'Numero di telefono',      section: 'dati-personali',    href: '/tenant/profile#dati-personali'    },
  { key: 'dataNascita',          label: 'Data di nascita',         section: 'dati-personali',    href: '/tenant/profile#dati-personali'    },
  { key: 'bio',                  label: 'Descrizione personale',   section: 'dati-personali',    href: '/tenant/profile#dati-personali'    },
  { key: 'occupation',           label: 'Occupazione',             section: 'lavoro',            href: '/tenant/profile#lavoro'            },
  { key: 'employmentType',       label: 'Tipo di contratto',       section: 'lavoro',            href: '/tenant/profile#lavoro'            },
  { key: 'annualIncome',         label: 'Reddito annuo',           section: 'lavoro',            href: '/tenant/profile#lavoro'            },
  { key: 'documents',            label: 'Documenti caricati',      section: 'documenti',         href: '/tenant/profile#documenti'         },
  { key: 'preferredCities',      label: 'Città preferite',         section: 'preferenze',        href: '/tenant/profile#preferenze'        },
  { key: 'maxBudget',            label: 'Budget massimo',          section: 'preferenze',        href: '/tenant/profile#preferenze'        },
  { key: 'availableFrom',        label: 'Disponibile da',          section: 'preferenze',        href: '/tenant/profile#preferenze'        },
];
