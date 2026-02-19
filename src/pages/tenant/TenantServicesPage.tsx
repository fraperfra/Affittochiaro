import { useState } from 'react';
import {
  Shield,
  Scale,
  Truck,
  Zap,
  SprayCan,
  Home,
  FileCheck,
  Banknote,
  Star,
  Sparkles,
  Crown,
  Check,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Eye,
} from 'lucide-react';

interface Service {
  id: string;
  icon: React.ReactNode;
  gradient: string;
  title: string;
  description: string;
  badge?: string;
  cta: string;
  href: string;
}

const services: Service[] = [
  {
    id: 'garanzia',
    icon: <Shield size={28} className="text-white" />,
    gradient: 'from-blue-500 to-blue-700',
    title: 'Garanzia Affitto',
    description: 'Non hai un garante? Nessun problema. Accedi a soluzioni di garanzia per inquilini che coprono fino a 12 mensilità di affitto non pagate.',
    badge: 'Più richiesto',
    cta: 'Scopri le garanzie',
    href: '#',
  },
  {
    id: 'assicurazione',
    icon: <Home size={28} className="text-white" />,
    gradient: 'from-emerald-500 to-teal-600',
    title: 'Assicurazione Inquilino',
    description: 'Proteggiti da danni accidentali all\'immobile, responsabilità civile verso il proprietario e furto. Piani da €3/mese.',
    cta: 'Ottieni un preventivo',
    href: '#',
  },
  {
    id: 'legale',
    icon: <Scale size={28} className="text-white" />,
    gradient: 'from-violet-500 to-purple-700',
    title: 'Assistenza Legale',
    description: 'Avvocati specializzati in diritto immobiliare per la revisione del contratto, contestazioni e tutela dei tuoi diritti come inquilino.',
    cta: 'Prenota una consulenza',
    href: '#',
  },
  {
    id: 'traslochi',
    icon: <Truck size={28} className="text-white" />,
    gradient: 'from-orange-500 to-amber-600',
    title: 'Traslochi Facili',
    description: 'Confronta preventivi di ditte di trasloco certificate nella tua città. Risparmia fino al 30% rispetto ai prezzi di mercato.',
    cta: 'Richiedi preventivi',
    href: '#',
  },
  {
    id: 'utenze',
    icon: <Zap size={28} className="text-white" />,
    gradient: 'from-yellow-400 to-orange-500',
    title: 'Attivazione Utenze',
    description: 'Attiva luce, gas e internet in un\'unica soluzione. Ti seguiamo dal voltura al primo pagamento, senza code né burocrazia.',
    cta: 'Attiva le utenze',
    href: '#',
  },
  {
    id: 'pulizie',
    icon: <SprayCan size={28} className="text-white" />,
    gradient: 'from-cyan-500 to-blue-600',
    title: 'Pulizie Professionali',
    description: 'Servizi di pulizia profonda all\'ingresso o all\'uscita dall\'appartamento. Incluso smacchiatura tende, sanitari e pavimenti.',
    cta: 'Prenota una pulizia',
    href: '#',
  },
  {
    id: 'deposito',
    icon: <Banknote size={28} className="text-white" />,
    gradient: 'from-rose-500 to-pink-600',
    title: 'Deposito Cauzionale Virtuale',
    description: 'Alternativa moderna al deposito tradizionale. Paga solo il 4% annuo invece di bloccare 3 mensilità sul conto del proprietario.',
    badge: 'Novità',
    cta: 'Scopri come funziona',
    href: '#',
  },
  {
    id: 'check',
    icon: <FileCheck size={28} className="text-white" />,
    gradient: 'from-slate-500 to-gray-700',
    title: 'Sopralluogo e Perizia',
    description: 'Un nostro tecnico certificato ispeziona l\'immobile prima della firma, documentando ogni dettaglio per tutelarti in fase di uscita.',
    cta: 'Prenota un sopralluogo',
    href: '#',
  },
];

interface VisibilityPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const visibilityPlans: VisibilityPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 'Gratis',
    period: '',
    description: 'Il profilo base incluso in ogni account',
    icon: <Eye size={20} className="text-gray-500" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    features: [
      'Profilo visibile nelle ricerche',
      'Curriculum Inquilino completo',
      'Badge di verifica base',
      'Candidatura agli annunci',
    ],
    cta: 'Piano attuale',
    highlighted: false,
  },
  {
    id: 'evidenziato',
    name: 'In Evidenza',
    price: '€3,99',
    period: '/mese',
    description: 'Mettiti in risalto e ricevi più contatti',
    icon: <Star size={20} className="text-amber-500" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    features: [
      'Badge "In Evidenza" sul profilo',
      'Appari tra i primi 20 risultati',
      'Sfondo dorato nelle liste di ricerca',
      'Notifiche prioritarie alle agenzie',
      'Statistiche visualizzazioni profilo',
    ],
    cta: 'Inizia ora',
    highlighted: false,
  },
  {
    id: 'top',
    name: 'Top Profilo',
    price: '€7,99',
    period: '/mese',
    description: 'Massima visibilità, candidature garantite',
    icon: <Crown size={20} className="text-white" />,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-brand-green to-emerald-700',
    borderColor: 'border-transparent',
    features: [
      'Badge "Top" dorato sul profilo',
      'Primo risultato in tutte le ricerche',
      'Etichetta in evidenza nei risultati',
      'Notifiche push alle agenzie partner',
      'Report settimanale visite profilo',
      'Supporto prioritario',
    ],
    cta: 'Attiva Top Profilo',
    highlighted: true,
  },
];

export default function TenantServicesPage() {
  const [activePlan, setActivePlan] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Servizi per Inquilini</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Tutto ciò di cui hai bisogno per trovare casa e viverci al meglio, in un unico posto.
        </p>
      </div>

      {/* Services Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => (
            <a
              key={service.id}
              href={service.href}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Image / Gradient Banner */}
              <div className={`relative h-28 bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  {service.icon}
                </div>
                {service.badge && (
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{service.title}</h3>
                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed flex-1">{service.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-green group-hover:gap-2 transition-all">
                  {service.cta}
                  <ArrowRight size={12} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Extra Visibilità Section */}
      <section className="rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 sm:p-8 space-y-6">
        {/* Section Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Extra Visibilità
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                Potenzia il profilo
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Aumenta le tue chance di trovare casa apparendo in cima alle ricerche delle agenzie partner.
            </p>
          </div>
        </div>

        {/* How it works banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <Eye size={18} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Le agenzie ricevono ogni settimana una lista di profili suggeriti.
            Con <strong>In Evidenza</strong> o <strong>Top Profilo</strong> il tuo curriculum appare sempre tra i primi, aumentando le candidature ricevute.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibilityPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-5 flex flex-col ${plan.bgColor} ${plan.borderColor} ${plan.highlighted ? 'shadow-lg shadow-emerald-100' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  CONSIGLIATO
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.highlighted ? 'bg-white/20' : 'bg-white'}`}>
                  {plan.icon}
                </div>
              </div>

              <h3 className={`font-bold text-base ${plan.color}`}>{plan.name}</h3>
              <p className={`text-[11px] mt-0.5 mb-3 ${plan.highlighted ? 'text-emerald-200' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="mb-4">
                <span className={`text-2xl font-extrabold ${plan.color}`}>{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.highlighted ? 'text-emerald-300' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={13} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-emerald-300' : 'text-brand-green'}`} />
                    <span className={`text-xs leading-snug ${plan.highlighted ? 'text-emerald-100' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => setActivePlan(plan.id)}
                disabled={plan.id === 'standard'}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                  ${plan.id === 'standard'
                    ? 'bg-gray-200 text-gray-400 cursor-default'
                    : plan.highlighted
                      ? 'bg-white text-brand-green hover:bg-gray-50 active:scale-[0.98]'
                      : 'bg-brand-green text-white hover:bg-opacity-90 active:scale-[0.98]'
                  }`}
              >
                {activePlan === plan.id ? 'Selezionato ✓' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-center text-[11px] text-gray-400">
          I piani si rinnovano automaticamente. Puoi disdire in qualsiasi momento dalle impostazioni.
          Pagamento sicuro tramite Stripe.
        </p>
      </section>
    </div>
  );
}
