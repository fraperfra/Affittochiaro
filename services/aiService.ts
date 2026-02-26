/**
 * Generatore di pitch inquilino — basato su template, senza dipendenze esterne.
 */

const INTROS = [
  (name: string) => `Mi chiamo ${name} e sono un inquilino affidabile e rispettoso.`,
  (name: string) => `Sono ${name}, una persona seria e ordinata alla ricerca di una casa.`,
  (name: string) => `Mi chiamo ${name} e tengo molto alla cura degli ambienti in cui vivo.`,
];

const JOB_PHRASES: Record<string, string> = {
  'dipendente':       'Lavoro come dipendente con contratto stabile',
  'libero professionista': 'Lavoro come libero professionista con reddito continuativo',
  'imprenditore':     'Sono imprenditore con attività consolidata',
  'studente':         'Sono uno studente universitario serio e indipendente',
  'pensionato':       'Sono pensionato con entrate fisse e regolari',
};

const HOBBY_PHRASES = (hobbies: string) =>
  hobbies && hobbies !== 'vari interessi'
    ? `Nel tempo libero mi dedico a ${hobbies}.`
    : 'Nel tempo libero ho passioni che coltivo con rispetto per i vicini.';

const CLOSING = [
  'Cerco un ambiente tranquillo in cui sentirmi a casa e mi impegno a rispettare le regole condominiali.',
  'Sono puntuale nei pagamenti e curo gli spazi come fossero miei.',
  'Sono una persona tranquilla e rispettosa, pronta a costruire un rapporto di fiducia col proprietario.',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const generateTenantPitch = async (userData: {
  name: string;
  job: string;
  reason: string;
  hobbies: string;
}): Promise<string> => {
  // Piccolo delay per feedback visivo del caricamento
  await new Promise(r => setTimeout(r, 600));

  const seed = userData.name.length + userData.job.length;
  const intro  = pick(INTROS, seed)(userData.name);
  const jobKey = Object.keys(JOB_PHRASES).find(k =>
    userData.job.toLowerCase().includes(k)
  );
  const jobPhrase = jobKey ? JOB_PHRASES[jobKey] : `Lavoro come ${userData.job}`;
  const hobby   = HOBBY_PHRASES(userData.hobbies);
  const closing = pick(CLOSING, seed + userData.hobbies.length);

  return `${intro} ${jobPhrase}. ${hobby} ${closing}`.trim();
};
