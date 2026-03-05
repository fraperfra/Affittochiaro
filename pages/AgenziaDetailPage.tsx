import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, BadgeCheck,
  Home, Star, Calendar, ExternalLink, PlayCircle,
} from 'lucide-react';
import { mockAgencies } from '../src/utils/mockData';

const WHAT_THEY_MANAGE = [
  'Affitti residenziali (monolocali e bilocali)',
  'Contratti 4+4 e 3+2',
  'Locazioni a studenti e lavoratori',
];

const WHY_PARTNER_BULLETS = [
  'Riceve solo profili inquilini verificati prima di ogni visita',
  'Gestisce documenti in digitale — nessun cartaceo via email',
  'Garantisce risposta alle candidature entro 24 ore',
];

export const AgenziaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agency = mockAgencies.find(a => a.id === id);

  if (!agency) return <Navigate to="/agenzie" replace />;

  return (
    <div className="bg-white">

      {/* ── COVER + HERO ────────────────────────────────────── */}
      <section className="relative">
        {/* Cover */}
        <div className="w-full h-48 md:h-64 overflow-hidden bg-gray-100">
          <img
            src={agency.coverImage}
            alt={agency.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x400/f4f9f6/004832?text=${encodeURIComponent(agency.name)}`;
            }}
          />
        </div>

        {/* Back link */}
        <div className="absolute top-4 left-4">
          <Link
            to="/agenzie"
            className="inline-flex items-center gap-1.5 bg-white/95 text-brand-green text-sm font-bold px-3 py-2 rounded-xl shadow-sm hover:bg-white transition-colors min-h-[44px]"
          >
            <ArrowLeft size={15} /> Agenzie partner
          </Link>
        </div>

        {/* Info bar */}
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="flex items-end gap-4 -mt-8 md:-mt-10 relative z-10">
            {/* Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-black text-brand-green flex-shrink-0 overflow-hidden">
              {agency.logo ? (
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                agency.name.charAt(0)
              )}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {agency.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-action-green bg-soft-green px-2 py-0.5 rounded-full">
                    <BadgeCheck size={10} /> Verificata
                  </span>
                )}
                {agency.rating && (
                  <span className="inline-flex items-center gap-1 text-xs text-medium-gray">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-brand-green">{agency.rating.toFixed(1)}</span>
                    {agency.reviewsCount > 0 && <span>· {agency.reviewsCount} rec.</span>}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl md:text-4xl font-bold text-brand-green leading-tight">{agency.name}</h1>
            <p className="text-medium-gray flex items-center gap-1.5 mt-1 text-sm">
              <MapPin size={14} />
              {agency.address?.city || 'Italia'}
              {agency.address?.province ? `, ${agency.address.province}` : ''}
              {agency.partnerSince && (
                <>
                  <span className="text-gray-300 mx-1">·</span>
                  <Calendar size={13} />
                  Agenzia partner Affittochiaro dal {agency.partnerSince}
                </>
              )}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-gray-100">
            {agency.contractsLastYear != null && (
              <div>
                <p className="text-2xl font-bold text-brand-green">{agency.contractsLastYear}</p>
                <p className="text-xs uppercase tracking-widest text-medium-gray font-semibold">locazioni / 12 mesi</p>
              </div>
            )}
            {agency.activeListingsCount > 0 && (
              <div className="border-l border-gray-200 pl-6">
                <p className="text-2xl font-bold text-brand-green">{agency.activeListingsCount}</p>
                <p className="text-xs uppercase tracking-widest text-medium-gray font-semibold">annunci attivi</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENUTO PRINCIPALE ────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">

          {/* Colonna sinistra: video */}
          <div>
            {agency.videoUrl ? (
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="aspect-video bg-gray-900">
                  <iframe
                    src={agency.videoUrl}
                    title={`Presentazione ${agency.name}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-medium-gray flex items-center gap-1.5">
                    <PlayCircle size={13} className="text-action-green" />
                    Presentazione dell'agenzia
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-3 text-medium-gray">
                <PlayCircle size={40} className="text-gray-300" />
                <p className="text-sm">Video presentazione non ancora disponibile</p>
              </div>
            )}

            {/* Perché è partner */}
            <div className="mt-10">
              <h2 className="text-xl md:text-2xl font-bold text-brand-green mb-5">
                Perché questa agenzia è partner Affittochiaro
              </h2>
              <ul className="space-y-3">
                {WHY_PARTNER_BULLETS.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <BadgeCheck size={18} className="text-action-green flex-shrink-0 mt-0.5" />
                    <span className="text-brand-green text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Citazione titolare */}
              <blockquote className="mt-8 border-l-4 border-action-green pl-5 py-1">
                <p className="text-brand-green italic text-sm leading-relaxed">
                  "Con Affittochiaro le visite a vuoto sono diminuite drasticamente. I profili che riceviamo sono già verificati e i documenti sono sempre in ordine."
                </p>
                <footer className="mt-2 text-xs font-semibold text-medium-gray">
                  — Titolare, {agency.name}
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Colonna destra: contatti + cosa gestiscono + CTA */}
          <div className="space-y-5">

            {/* Contatti */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-medium-gray mb-4">Contatti</h3>
              <ul className="space-y-3">
                {agency.address && (
                  <li className="flex items-start gap-2.5 text-sm text-brand-green">
                    <MapPin size={15} className="flex-shrink-0 text-action-green mt-0.5" />
                    <span>
                      {agency.address.street}<br />
                      {agency.address.postalCode} {agency.address.city}
                    </span>
                  </li>
                )}
                {agency.phone && (
                  <li>
                    <a href={`tel:${agency.phone}`} className="flex items-center gap-2.5 text-sm text-brand-green hover:text-action-green transition-colors">
                      <Phone size={15} className="flex-shrink-0 text-action-green" />
                      {agency.phone}
                    </a>
                  </li>
                )}
                {agency.email && (
                  <li>
                    <a href={`mailto:${agency.email}`} className="flex items-center gap-2.5 text-sm text-brand-green hover:text-action-green transition-colors break-all">
                      <Mail size={15} className="flex-shrink-0 text-action-green" />
                      {agency.email}
                    </a>
                  </li>
                )}
                {agency.website && (
                  <li>
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-brand-green hover:text-action-green transition-colors">
                      <Globe size={15} className="flex-shrink-0 text-action-green" />
                      <span className="truncate">{agency.website.replace('https://', '')}</span>
                      <ExternalLink size={11} className="flex-shrink-0 text-medium-gray" />
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Cosa gestiscono */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-medium-gray mb-4">Cosa gestiscono</h3>
              <ul className="space-y-2">
                {WHAT_THEY_MANAGE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-brand-green">
                    <Home size={13} className="flex-shrink-0 text-action-green mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA principale */}
            <Link
              to={`/annunci?agency=${agency.id}`}
              className="flex items-center justify-center gap-2 bg-brand-green text-white font-bold px-5 py-3.5 rounded-xl min-h-[44px] w-full hover:bg-black transition-colors text-sm"
            >
              Vedi gli immobili gestiti da questa agenzia
              <ArrowLeft size={14} className="rotate-180" />
            </Link>

            <Link
              to="/agenzie"
              className="flex items-center justify-center gap-2 text-brand-green font-semibold text-sm hover:underline mt-1"
            >
              <ArrowLeft size={13} /> Torna alle agenzie partner
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
