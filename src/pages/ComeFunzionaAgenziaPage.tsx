import { Link } from 'react-router-dom';
import {
  BadgeCheck, Users, FileText, TrendingUp, MessageCircle,
  CheckCircle2, ArrowRight, Phone,
} from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const FEATURES = [
  {
    icon: <Users size={22} />,
    titolo: 'Database candidati verificati',
    desc: 'Accedi a un database di inquilini con profilo completo, documenti verificati e storico delle candidature. Zero perdite di tempo con profili incompleti.',
  },
  {
    icon: <FileText size={22} />,
    titolo: 'Gestione digitale delle candidature',
    desc: 'Ricevi candidature strutturate: dati personali, reddito, referenze e documenti in un\'unica schermata. Nessun cartaceo, nessuna email disorganizzata.',
  },
  {
    icon: <TrendingUp size={22} />,
    titolo: 'Annunci in esclusiva',
    desc: 'Pubblica annunci in esclusiva AffittoChiaro. I tuoi immobili vengono mostrati agli inquilini più qualificati, aumentando la qualità delle candidature ricevute.',
  },
  {
    icon: <MessageCircle size={22} />,
    titolo: 'Comunicazione diretta',
    desc: 'Contatta i candidati selezionati direttamente dalla piattaforma. Tieni traccia di ogni conversazione e della progressione di ogni pratica.',
  },
];

const HOW_IT_WORKS = [
  { n: '1', testo: 'Ci contatti e fissiamo una chiamata conoscitiva' },
  { n: '2', testo: 'Verifichiamo i tuoi documenti e attiviamo il profilo agenzia' },
  { n: '3', testo: 'Pubblichi i tuoi immobili e accedi al database inquilini' },
  { n: '4', testo: 'Ricevi candidature qualificate e chiudi i contratti più velocemente' },
];

export default function ComeFunzionaAgenziaPage() {
  return (
    <>
      <PageMeta
        title="Come funziona per le agenzie"
        description="Scopri come AffittoChiaro aiuta le agenzie immobiliari a trovare inquilini verificati e gestire le candidature in modo digitale."
      />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Come funziona', href: '/come-funziona' },
            { label: 'Per le agenzie' },
          ]}
        />

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-3">
            AffittoChiaro per le agenzie
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Meno visite a vuoto, più contratti. Il database di inquilini verificati che le agenzie partner usano ogni giorno.
          </p>
        </div>

        {/* Come funziona steps */}
        <div className="card mb-10">
          <h2 className="text-base font-bold text-text-primary mb-5">Come si diventa partner</h2>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step.n}
                </div>
                <p className="text-text-secondary text-sm pt-1">{step.testo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {FEATURES.map((f, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-text-primary text-sm">{f.titolo}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Vantaggi chiave */}
        <div className="card bg-background-secondary mb-10">
          <h2 className="text-base font-bold text-text-primary mb-4">Risultati delle agenzie partner</h2>
          <ul className="space-y-3">
            {[
              'Riduzione del 60% delle visite non andate a buon fine',
              'Candidature complete dall\'85% degli inquilini al primo invio',
              'Tempo medio di locazione ridotto da 45 a 18 giorni',
              'Accesso a oltre 10.000 inquilini verificati attivi',
            ].map((v, i) => (
              <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                <CheckCircle2 size={16} className="text-primary-500 shrink-0" />
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="card bg-primary-500 text-white text-center py-10">
          <BadgeCheck size={36} className="mx-auto mb-3 text-white/80" />
          <h2 className="text-xl font-bold mb-2">Diventa partner AffittoChiaro</h2>
          <p className="text-white/80 text-sm mb-6 max-w-sm mx-auto">
            Ti contattiamo entro 24 ore per una chiamata conoscitiva.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/cerca-inquilino"
              className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              Diventa partner <ArrowRight size={16} />
            </Link>
            <Link
              to="/agenzie"
              className="text-white/90 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              <Phone size={13} /> Come funziona il database candidati? →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
