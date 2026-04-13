import { Link } from 'react-router-dom';
import {
  UserPlus, FileCheck, Search, MessageCircle, Key,
  CheckCircle2, ArrowRight, ShieldCheck, Star,
} from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const STEPS = [
  {
    n: '01',
    icon: <UserPlus size={24} />,
    titolo: 'Crea il profilo',
    desc: 'Compila le informazioni su di te: lavoro, reddito, referenze. Carica i documenti richiesti una volta sola.',
    dettagli: [
      'Documento d\'identità e codice fiscale',
      'Ultime 3 buste paga o dichiarazione redditi',
      'Referenze da locatori precedenti (se disponibili)',
      'Presentazione personale in formato testo',
    ],
  },
  {
    n: '02',
    icon: <Search size={24} />,
    titolo: 'Cerca tra gli annunci',
    desc: 'Sfoglia gli annunci per città e tipologia. Filtra per prezzo, metratura e disponibilità.',
    dettagli: [
      'Migliaia di annunci verificati',
      'Filtri per città, zona, prezzo e tipologia',
      'Annunci esclusivi AffittoChiaro',
      'Mappa interattiva delle zone',
    ],
  },
  {
    n: '03',
    icon: <FileCheck size={24} />,
    titolo: 'Candidati',
    desc: 'Invia la candidatura direttamente dall\'annuncio. Il profilo arriva all\'agenzia in modo completo e ordinato.',
    dettagli: [
      'Un click per candidarti',
      'Il profilo viene inviato automaticamente',
      'Nessuna email con allegati',
      'Tracciamento dello stato della candidatura',
    ],
  },
  {
    n: '04',
    icon: <MessageCircle size={24} />,
    titolo: 'Vieni contattato',
    desc: 'L\'agenzia valuta il tuo profilo e ti contatta per fissare la visita. Solo visite qualificate, nessun giro a vuoto.',
    dettagli: [
      'Risposta garantita entro 24 ore lavorative',
      'Comunicazione diretta con l\'agente',
      'Visita concordata in base ai tuoi orari',
      'Feedback sull\'esito della candidatura',
    ],
  },
  {
    n: '05',
    icon: <Key size={24} />,
    titolo: 'Firma il contratto',
    desc: 'Una volta approvato, l\'agenzia prepara il contratto. Puoi richiederci una revisione legale prima della firma.',
    dettagli: [
      'Supporto alla revisione del contratto',
      'Verifica delle clausole',
      'Tutela legale in caso di controversie',
      'Assistenza post-firma',
    ],
  },
];

const VANTAGGI = [
  { icon: <ShieldCheck size={20} />, testo: 'Agenzie verificate — nessun intermediario improvvisato' },
  { icon: <Star size={20} />, testo: 'Un profilo vale per tutti gli annunci' },
  { icon: <CheckCircle2 size={20} />, testo: 'Zero visite a vuoto — le agenzie vedono il profilo prima di contattarti' },
  { icon: <FileCheck size={20} />, testo: 'Documenti sicuri e sempre accessibili' },
];

export default function ComeFunzionaInquilinoPage() {
  return (
    <>
      <PageMeta
        title="Come funziona per chi cerca casa"
        description="Scopri come trovare casa con AffittoChiaro in 5 passi: crea il profilo, candidati agli annunci e vieni contattato dalle agenzie verificate."
      />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Come funziona', href: '/come-funziona' },
            { label: 'Per chi cerca casa' },
          ]}
        />

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-bold text-text-primary mb-3">
            Trovare casa con AffittoChiaro
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Crei il profilo una volta sola. Vale per tutti gli annunci. Le agenzie ti trovano — non il contrario.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {STEPS.map((step, i) => (
            <div key={i} className="card flex gap-5">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center">
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 h-8 bg-primary-100" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-primary-400 mb-1">STEP {step.n}</div>
                <h2 className="text-lg font-bold text-text-primary mb-1">{step.titolo}</h2>
                <p className="text-text-secondary text-sm mb-3">{step.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {step.dettagli.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 size={13} className="text-primary-400 shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Vantaggi */}
        <div className="card bg-background-secondary mb-10">
          <h2 className="text-base font-bold text-text-primary mb-4">Perché AffittoChiaro</h2>
          <ul className="space-y-3">
            {VANTAGGI.map((v, i) => (
              <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                <span className="text-primary-500 shrink-0">{v.icon}</span>
                {v.testo}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/register" className="btn btn-primary btn-lg flex items-center gap-2 mx-auto w-fit">
            Trova il tuo affitto <ArrowRight size={18} />
          </Link>
          <p className="text-text-muted text-sm mt-3">
            Crei il profilo una volta sola. Vale per tutti gli annunci.
          </p>
          <Link
            to="/faq"
            className="mt-4 inline-block text-primary-600 text-sm font-semibold hover:underline"
          >
            Hai dubbi? Leggi le domande frequenti →
          </Link>
        </div>
      </div>
    </>
  );
}
