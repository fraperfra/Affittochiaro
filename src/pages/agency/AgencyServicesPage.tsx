import { useState } from 'react';
import {
  Zap, Leaf, FileText, Truck, Scale, Home, Building2,
  MapPin, Sparkles, ChevronRight, Check, Clock,
} from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'coming_soon';
  popular?: boolean;
}

const SERVICES: Service[] = [
  // Contratti & Burocrazia
  {
    id: 'registrazione-contratto',
    icon: <FileText size={22} className="text-blue-600" />,
    title: 'Registrazione contratto',
    description: "Registra i contratti di locazione presso l'Agenzia delle Entrate in modo semplice e digitale.",
    category: 'Contratti & Burocrazia',
    status: 'coming_soon',
    popular: true,
  },
  {
    id: 'cedolare-secca',
    icon: <FileText size={22} className="text-blue-500" />,
    title: 'Cedolare secca',
    description: "Gestisci l'opzione cedolare secca per ridurre la tassazione sui canoni d'affitto.",
    category: 'Contratti & Burocrazia',
    status: 'coming_soon',
  },
  {
    id: 'disdetta-contratto',
    icon: <FileText size={22} className="text-red-500" />,
    title: 'Disdetta contratto',
    description: 'Genera e invia la disdetta del contratto di locazione con modelli conformi alla normativa vigente.',
    category: 'Contratti & Burocrazia',
    status: 'coming_soon',
  },

  // Certificazioni
  {
    id: 'ape',
    icon: <Leaf size={22} className="text-green-600" />,
    title: 'Attestato APE',
    description: "Ottieni l'Attestato di Prestazione Energetica (APE) necessario per locare il tuo immobile.",
    category: 'Certificazioni',
    status: 'coming_soon',
    popular: true,
  },
  {
    id: 'visura-catastale',
    icon: <MapPin size={22} className="text-orange-500" />,
    title: 'Visura catastale',
    description: 'Richiedi visure catastali e planimetrie catastali online in pochi minuti.',
    category: 'Certificazioni',
    status: 'coming_soon',
  },
  {
    id: 'perizia-tecnica',
    icon: <Building2 size={22} className="text-slate-500" />,
    title: 'Perizia tecnica',
    description: 'Valutazione tecnica e strutturale degli immobili da parte di professionisti certificati.',
    category: 'Certificazioni',
    status: 'coming_soon',
  },

  // Casa & Logistica
  {
    id: 'voltura-utenze',
    icon: <Zap size={22} className="text-amber-500" />,
    title: 'Voltura utenze',
    description: 'Gestisci la voltura di luce, gas e internet in modo rapido e senza stress.',
    category: 'Casa & Logistica',
    status: 'coming_soon',
  },
  {
    id: 'traslochi',
    icon: <Truck size={22} className="text-violet-600" />,
    title: 'Traslochi',
    description: 'Prenota i migliori servizi di trasloco per i tuoi inquilini a prezzi convenzionati.',
    category: 'Casa & Logistica',
    status: 'coming_soon',
  },
  {
    id: 'pulizie',
    icon: <Home size={22} className="text-teal-500" />,
    title: 'Pulizie fine locazione',
    description: 'Servizio professionale di pulizia per il ripristino degli immobili a fine contratto.',
    category: 'Casa & Logistica',
    status: 'coming_soon',
  },

  // Consulenza
  {
    id: 'consulenza-legale',
    icon: <Scale size={22} className="text-indigo-600" />,
    title: 'Consulenza legale',
    description: 'Consulta avvocati specializzati in diritto immobiliare per tutelare i tuoi interessi.',
    category: 'Consulenza',
    status: 'coming_soon',
    popular: true,
  },
  {
    id: 'valutazione-immobile',
    icon: <Building2 size={22} className="text-yellow-600" />,
    title: 'Valutazione immobile',
    description: 'Scopri il valore di mercato del tuo immobile con una valutazione professionale certificata.',
    category: 'Consulenza',
    status: 'coming_soon',
  },
];

const CATEGORIES = [
  { id: 'Contratti & Burocrazia', icon: <FileText size={16} className="text-blue-500" /> },
  { id: 'Certificazioni', icon: <Leaf size={16} className="text-green-500" /> },
  { id: 'Casa & Logistica', icon: <Truck size={16} className="text-violet-500" /> },
  { id: 'Consulenza', icon: <Scale size={16} className="text-indigo-500" /> },
];

export default function AgencyServicesPage() {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const handleNotify = (serviceId: string, serviceTitle: string) => {
    setNotified(prev => new Set(prev).add(serviceId));
    toast.success(`Ottimo! Ti avviseremo non appena "${serviceTitle}" sarà disponibile.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Servizi</h1>
            <p className="text-white/80 mt-1">
              Strumenti e partner selezionati per semplificare il lavoro della tua agenzia
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-white/20 text-sm text-white/70">
          <div className="flex items-center gap-1.5">
            <Check size={14} className="text-green-300" />
            <span>Partner verificati</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-yellow-300" />
            <span>Nuovi servizi in arrivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary-200" />
            <span>{SERVICES.length} servizi pianificati</span>
          </div>
        </div>
      </div>

      {/* Services by category */}
      {CATEGORIES.map(({ id: category, icon }) => {
        const categoryServices = SERVICES.filter(s => s.category === category);
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {icon}
              <h2 className="text-base font-bold text-text-primary">{category}</h2>
              <span className="text-xs text-text-muted">({categoryServices.length})</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryServices.map((service) => (
                <Card key={service.id} className="flex flex-col gap-3">
                  {/* Icon + badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 bg-background-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {service.popular && (
                        <Badge variant="warning" size="sm">Popolare</Badge>
                      )}
                      <Badge variant="neutral" size="sm">
                        <Clock size={10} className="mr-1 inline" />
                        Prossimamente
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{service.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{service.description}</p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleNotify(service.id, service.title)}
                    disabled={notified.has(service.id)}
                    className={`w-full text-sm py-2 px-4 rounded-xl border transition-colors ${
                      notified.has(service.id)
                        ? 'bg-green-50 border-green-200 text-green-700 cursor-default'
                        : 'border-border text-text-secondary hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {notified.has(service.id) ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check size={14} /> Riceverai una notifica
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        Avvisami quando disponibile
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
