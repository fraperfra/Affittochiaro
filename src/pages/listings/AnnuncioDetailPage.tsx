import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MapPin, Maximize2, BedDouble, Bath, Home, Star,
  ChevronLeft, ChevronRight, Calendar, Building2,
  ShieldCheck, Phone, ArrowRight,
} from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getNomeCitta, getNomeRegione } from '@/lib/geo-mock';
import { getListingBySlug, getSimilarListings, getAgenziaById } from '@/lib/mock-data';
import { buildListingUrl, formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { ApplicationModal, type ApplicationData, TenantRegistrationModal, type TenantRegistrationData } from '../../../components';

export default function AnnuncioDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const { regione = '', comune = '', tipologia = '', slug = '' } = useParams<{
    regione: string;
    comune: string;
    tipologia: string;
    slug: string;
  }>();

  const listing = getListingBySlug(slug);
  const [imgIndex, setImgIndex] = useState(0);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  if (!listing) return <Navigate to="/case-e-stanze-in-affitto" replace />;

  const nomeCitta = getNomeCitta(comune);
  const nomeRegione = getNomeRegione(regione);
  const agenzia = listing.agenziaId ? getAgenziaById(listing.agenziaId) : undefined;
  const simili = getSimilarListings(listing, 3);
  const immagini = listing.immagini;

  const prevImg = () => setImgIndex((i) => (i - 1 + immagini.length) % immagini.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % immagini.length);

  const applicationListing = {
    id: listing.id,
    title: listing.titolo,
    price: formatPrice(listing.prezzo),
    type: listing.tipologia,
    image: listing.immagini[0],
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setIsRegistrationModalOpen(true);
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    const existing = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    const newApp = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      agencyId: listing.agenziaId || 'agency_1',
      viewed: false,
    };
    localStorage.setItem('affittochiaro_applications', JSON.stringify([...existing, newApp]));

    const existingAppliedIds = JSON.parse(localStorage.getItem('affittochiaro_applied_ids') || '[]');
    if (!existingAppliedIds.includes(listing.id)) {
      localStorage.setItem('affittochiaro_applied_ids', JSON.stringify([...existingAppliedIds, listing.id]));
    }

    const existingNotifs = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    const notif = {
      id: Date.now().toString(),
      type: 'new_application',
      title: 'Nuova Candidatura',
      message: `${data.firstName} ${data.lastName} si è candidato per "${data.listingTitle}"`,
      applicantName: `${data.firstName} ${data.lastName}`,
      listingTitle: data.listingTitle,
      listingId: data.listingId,
      applicationId: newApp.id,
      createdAt: new Date().toISOString(),
      read: false,
      agencyId: listing.agenziaId || 'agency_1',
    };
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify([notif, ...existingNotifs]));
  };

  return (
    <>
      <PageMeta
        title={listing.titolo}
        description={`${listing.tipologia} in affitto a ${listing.zona}, ${listing.comune}. ${listing.mq} m², ${listing.camere} camere, ${listing.bagni} bagni. ${formatPrice(listing.prezzo)}.`}
        canonical={`https://affittochiaro.it${buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug)}`}
      />

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Trova Affitto', href: '/case-e-stanze-in-affitto' },
            { label: nomeRegione, href: `/case-e-stanze-in-affitto/${regione}` },
            { label: nomeCitta, href: `/case-e-stanze-in-affitto/${regione}/${comune}` },
            { label: listing.titolo },
          ]}
        />

        {/* Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100" style={{ height: 320 }}>
          <img
            src={immagini[imgIndex]}
            alt={`${listing.titolo} — foto ${imgIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {listing.isExclusive && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              <Star size={11} className="fill-white" /> Esclusiva AffittoChiaro
            </div>
          )}
          {immagini.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                aria-label="Foto precedente"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                aria-label="Foto successiva"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {immagini.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {immagini.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {immagini.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIndex ? 'border-primary-500' : 'border-transparent'}`}
              >
                <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Colonna principale */}
          <div>
            {/* Titolo + posizione */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-text-muted text-sm mb-2">
                <MapPin size={14} />
                <span>{listing.zona}, {listing.comune}</span>
              </div>
              <h1 className="font-bold text-text-primary mb-3">
                {listing.titolo}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                <span className="flex items-center gap-1.5"><Maximize2 size={15} />{listing.mq} m²</span>
                <span className="flex items-center gap-1.5"><BedDouble size={15} />{listing.camere} {listing.camere === 1 ? 'camera' : 'camere'}</span>
                <span className="flex items-center gap-1.5"><Bath size={15} />{listing.bagni} {listing.bagni === 1 ? 'bagno' : 'bagni'}</span>
                <span className="flex items-center gap-1.5"><Building2 size={15} />Piano {listing.piano === 0 ? 'terra' : listing.piano}</span>
                <span className="flex items-center gap-1.5"><Calendar size={15} />Disponibile: {listing.disponibile}</span>
              </div>
            </div>

            {/* Descrizione */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Descrizione</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {listing.descrizione}
              </p>
            </div>

            {/* Mappa placeholder */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Posizione</h2>
              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-48 flex flex-col items-center justify-center gap-2 text-text-muted">
                <MapPin size={28} className="text-gray-300" />
                <p className="text-sm">{listing.zona}, {listing.comune}</p>
                <p className="text-xs text-text-muted opacity-70">Mappa interattiva in arrivo</p>
              </div>
            </div>

            {/* Requisiti candidato (solo esclusivi) */}
            {listing.isExclusive && (
              <div className="card bg-primary-50 border border-primary-100 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-primary-500" />
                  <h2 className="text-base font-semibold text-text-primary">Requisiti candidatura</h2>
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Questo è un annuncio in esclusiva AffittoChiaro. Per candidarti è necessario:
                </p>
                <ul className="space-y-1.5 text-sm text-text-secondary">
                  {[
                    'Profilo completo con documento d\'identità verificato',
                    'Busta paga o documentazione reddito degli ultimi 3 mesi',
                    'Nessuna procedura di sfratto in corso',
                    'Referenze dell\'ultimo locatore (se disponibili)',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Annunci simili */}
            {simili.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Annunci simili</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {simili.map((s) => (
                    <Link
                      key={s.id}
                      to={buildListingUrl(s.regioneSlug, s.comuneSlug, s.tipologiaSlug, s.slug)}
                      className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 block"
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={s.immagini[0]}
                          alt={s.titolo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-text-muted mb-0.5 flex items-center gap-1">
                          <MapPin size={10} />{s.zona}
                        </div>
                        <p className="text-xs font-semibold text-text-primary line-clamp-2 mb-1">{s.titolo}</p>
                        <span className="text-sm font-bold text-primary-600">{formatPrice(s.prezzo)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Prezzo + CTA */}
            <div className="card sticky top-4">
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(listing.prezzo)}</span>
                <p className="text-text-muted text-sm mt-0.5 capitalize">{listing.tipologia} · {listing.mq} m²</p>
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full text-center mb-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-soft-green text-brand-green border border-action-green/40 font-bold hover:bg-action-green/20 transition-colors"
              >
                Candidati
                <ArrowRight size={16} />
              </button>

              {!listing.isExclusive && (
                <p className="text-xs text-text-muted text-center">
                  Il tuo profilo arriva direttamente all'agenzia.
                </p>
              )}
            </div>

            {/* Box agenzia (solo esclusivi) */}
            {listing.isExclusive && agenzia && (
              <div className="card">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Gestito da</h3>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={agenzia.logo}
                    alt={agenzia.nome}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{agenzia.nome}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <MapPin size={10} />{agenzia.citta}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <ShieldCheck size={13} className="text-primary-500" />
                  Agenzia partner verificata
                </div>
              </div>
            )}

            {/* Info contatto */}
            {!listing.isExclusive && (
              <div className="card bg-background-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={15} className="text-primary-500" />
                  <h3 className="text-sm font-semibold text-text-primary">Hai domande?</h3>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  Accedi per richiedere informazioni all'agenzia tramite AffittoChiaro.
                </p>
                <Link to="/register" className="btn btn-primary w-full text-center text-sm">
                  Cerca casa ora
                </Link>
              </div>
            )}

            {/* Link torna a città */}
            <Link
              to={`/case-e-stanze-in-affitto/${regione}/${comune}`}
              className="text-primary-600 hover:underline text-sm flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Tutti gli annunci a {nomeCitta}
            </Link>
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        listing={applicationListing}
        onSubmit={handleApplicationSubmit}
      />

      <TenantRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onComplete={(_data: TenantRegistrationData) => {
          setIsRegistrationModalOpen(false);
        }}
      />
    </>
  );
}
