/**
 * ListingsPage (tenant dashboard) — mostra solo gli annunci salvati.
 * Per cercare nuovi annunci l'utente viene indirizzato alla pagina pubblica /annunci.
 */

import { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Eye,
  Users,
  Send,
  CheckCircle,
  Calendar,
  PawPrint,
  Cigarette,
  ExternalLink,
  Search,
  Trash2,
  Bookmark,
  Check,
  PenLine,
  Building2,
} from 'lucide-react';
import { useListingStore, useAuthStore } from '../../store';
import type { CachedListing } from '../../store/listingStore';
import { mockListings } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';
import { Listing, TenantUser } from '../../types';

// Tipo unificato per la visualizzazione dei salvati (pubblici + mock)
interface SavedDisplay {
  id: string;
  title: string;
  city: string;
  zone?: string;
  price: number;
  priceDisplay?: string;
  rooms: number;
  squareMeters: number;
  bathrooms: number;
  furnished: boolean;
  features: string[];
  description: string;
  agencyName: string;
  applicationsCount: number;
  views: number;
  createdAt?: string;
  floor?: number;
  expenses?: number;
}
import { EMPLOYMENT_TYPE_LABELS } from '../../types/cv';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

// ─── Application form types ───────────────────────────────────────────────────

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  employmentType: string;
  monthlyIncome: string;
  moveInDate: string;
  stayDuration: string;
  hasPets: boolean;
  petDetails: string;
  isSmoker: boolean;
  message: string;
}

const INITIAL_FORM: ApplicationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  occupation: '',
  employmentType: '',
  monthlyIncome: '',
  moveInDate: '',
  stayDuration: '12 mesi',
  hasPets: false,
  petDetails: '',
  isSmoker: false,
  message: '',
};

// ─── Saved Listing Card ───────────────────────────────────────────────────────

const SavedListingCard = memo(({
  listing,
  isApplied,
  onRemove,
  onClick,
  onApply,
}: {
  listing: SavedDisplay;
  isApplied: boolean;
  onRemove: (id: string, e: React.MouseEvent) => void;
  onClick: (listing: SavedDisplay) => void;
  onApply: (listing: SavedDisplay, e: React.MouseEvent) => void;
}) => {
  const isNew = listing.createdAt &&
    new Date().getTime() - new Date(listing.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Card hover padding="none" className="overflow-hidden" onClick={() => onClick(listing)}>
      <div className="flex">
        {/* Thumbnail */}
        <div className="relative w-24 md:w-36 min-h-[100px] shrink-0 bg-gradient-to-br from-primary-100 to-teal-100">
          {isNew && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-primary-500 text-white rounded">
              NUOVO
            </span>
          )}
          <button
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-white/90 text-error hover:bg-error hover:text-white"
            onClick={(e) => onRemove(listing.id, e)}
            title="Rimuovi dai salvati"
          >
            <Trash2 size={11} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base md:text-lg text-text-primary line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-xs md:text-sm text-text-secondary mt-0.5 truncate">
              {listing.city}{listing.zone ? ` • ${listing.zone}` : ''}
            </p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="text-xs px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">
                {listing.rooms} locali
              </span>
              <span className="text-xs px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">
                {listing.squareMeters}m²
              </span>
              {listing.furnished && (
                <span className="text-xs px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">
                  Arredato
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg md:text-xl font-bold text-primary-600">
              {listing.priceDisplay ?? formatCurrency(listing.price)}
              <span className="text-xs md:text-sm font-normal text-text-muted">/mese</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden md:flex items-center gap-1 text-xs text-text-muted">
                <Users size={14} />{listing.applicationsCount}
              </span>
              <span className="hidden md:flex items-center gap-1 text-xs text-text-muted">
                <Eye size={14} />{listing.views}
              </span>
              {isApplied ? (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <CheckCircle size={14} /> Inviata
                </span>
              ) : (
                <button
                  className="text-xs md:text-sm font-semibold text-primary-500 flex items-center gap-1 p-1.5 md:p-2 -mr-2"
                  onClick={(e) => onApply(listing, e)}
                >
                  <Send size={14} /> Candidati
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function ListingsPage() {
  const navigate = useNavigate();
  const { savedListings, savedListingsCache, toggleSavedListing } = useListingStore();
  const { user } = useAuthStore();
  const tenantUser = user as TenantUser;

  const [selectedListing, setSelectedListing] = useState<SavedDisplay | null>(null);
  const [applyingTo, setApplyingTo] = useState<SavedDisplay | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load previously applied listing IDs
  useEffect(() => {
    const stored = localStorage.getItem('affittochiaro_applied_ids');
    if (stored) setAppliedIds(JSON.parse(stored));
  }, []);

  // Pre-fill form from user profile
  useEffect(() => {
    if (applyingTo && tenantUser?.profile) {
      const p = tenantUser.profile;
      setFormData({
        ...INITIAL_FORM,
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: tenantUser.email || '',
        phone: p.phone || '',
        occupation: p.occupation || '',
        employmentType: p.employmentType || '',
        monthlyIncome: p.annualIncome
          ? `${Math.round(p.annualIncome / 12).toLocaleString('it-IT')} €/mese`
          : '',
      });
    }
  }, [applyingTo]);

  // Combina listing salvati: prima cerca nei mock (dashboard), poi nel cache pubblico
  const savedListingData: SavedDisplay[] = savedListings
    .map((id) => {
      // Cerca nei mock
      const mock = mockListings.find((l) => l.id === id);
      if (mock) {
        return {
          id: mock.id,
          title: mock.title,
          city: mock.address.city,
          zone: mock.zone,
          price: mock.price,
          rooms: mock.rooms,
          squareMeters: mock.squareMeters,
          bathrooms: mock.bathrooms,
          furnished: mock.furnished === 'yes',
          features: mock.features as string[],
          description: mock.description,
          agencyName: mock.agencyName,
          applicationsCount: mock.applicationsCount,
          views: mock.views,
          createdAt: mock.createdAt?.toString(),
          floor: mock.floor,
          expenses: mock.expenses,
        } satisfies SavedDisplay;
      }
      // Cerca nel cache pubblico
      const cached: CachedListing | undefined = savedListingsCache[id];
      if (cached) {
        return {
          id: cached.id,
          title: cached.title,
          city: cached.city,
          zone: cached.zone,
          price: cached.price,
          priceDisplay: cached.priceDisplay,
          rooms: cached.rooms,
          squareMeters: cached.squareMeters,
          bathrooms: cached.bathrooms,
          furnished: cached.furnished,
          features: cached.features,
          description: cached.description,
          agencyName: cached.agencyName,
          applicationsCount: cached.applicationsCount,
          views: cached.views,
          createdAt: cached.createdAt,
          floor: cached.floor,
          expenses: cached.expenses,
        } satisfies SavedDisplay;
      }
      return null;
    })
    .filter((l) => l !== null) as SavedDisplay[];

  const isApplied = useCallback((id: string) => appliedIds.includes(id), [appliedIds]);

  const handleRemoveSaved = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedListing(id);
    toast('Rimosso dai salvati');
  }, [toggleSavedListing]);

  const handleListingClick = useCallback((listing: SavedDisplay) => {
    setSelectedListing(listing);
  }, []);

  const openApplicationForm = useCallback((listing: SavedDisplay, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (appliedIds.includes(listing.id)) {
      toast('Hai già inviato la candidatura per questo annuncio');
      return;
    }
    setApplyingTo(listing);
  }, [appliedIds]);

  const handleSubmitApplication = async () => {
    if (!applyingTo) return;

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Scrivi un messaggio di presentazione');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const application = {
      id: `app_${Date.now()}`,
      ...formData,
      listingId: applyingTo.id as unknown as number,
      listingTitle: applyingTo.title,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    const existing = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    existing.push(application);
    localStorage.setItem('affittochiaro_applications', JSON.stringify(existing));

    const notification = {
      id: `notif_${Date.now()}`,
      type: 'new_application',
      title: 'Nuova candidatura ricevuta',
      message: `${formData.firstName} ${formData.lastName} si è candidato per "${applyingTo.title}"`,
      applicantName: `${formData.firstName} ${formData.lastName}`,
      listingTitle: applyingTo.title,
      listingId: applyingTo.id,
      applicationId: application.id,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const existingNotifs = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    existingNotifs.unshift(notification);
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify(existingNotifs));

    const newAppliedIds = [...appliedIds, applyingTo.id];
    setAppliedIds(newAppliedIds);
    localStorage.setItem('affittochiaro_applied_ids', JSON.stringify(newAppliedIds));

    setIsSubmitting(false);
    setApplyingTo(null);
    setFormData(INITIAL_FORM);
    toast.success('Candidatura inviata con successo!');
  };

  return (
    <div className="space-y-4">

      {/* ── Banner cerca annunci ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <Search size={20} className="shrink-0 opacity-90" />
          <div>
            <p className="font-semibold text-sm md:text-base">Cerca nuovi annunci</p>
            <p className="text-xs text-primary-100 hidden md:block">
              Sfoglia centinaia di appartamenti, salvali e candidati
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/annunci')}
          className="flex items-center gap-1.5 shrink-0 bg-white text-primary-700 font-bold text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Vai agli annunci
          <ExternalLink size={14} />
        </button>
      </div>

      {/* ── Intestazione sezione ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Heart size={18} className="text-error" fill="currentColor" />
            Annunci Salvati
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            {savedListingData.length === 0
              ? 'Nessun annuncio salvato'
              : `${savedListingData.length} annunc${savedListingData.length === 1 ? 'io salvato' : 'i salvati'}`}
          </p>
        </div>
      </div>

      {/* ── Lista salvati ───────────────────────────────────────────────────── */}
      {savedListingData.length > 0 ? (
        <div className="grid gap-2">
          {savedListingData.map((listing) => (
            <SavedListingCard
              key={listing.id}
              listing={listing}
              isApplied={isApplied(listing.id)}
              onRemove={handleRemoveSaved}
              onClick={handleListingClick}
              onApply={openApplicationForm}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark size={40} className="text-text-muted" />}
          title="Nessun annuncio salvato"
          description="Salva gli annunci che ti interessano cliccando il cuore ♥ durante la ricerca"
          action={{
            label: 'Cerca annunci',
            onClick: () => navigate('/annunci'),
          }}
        />
      )}

      {/* ── Detail Modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title={selectedListing?.title}
        size="lg"
        footer={
          selectedListing && (
            <div className="flex items-center gap-3 w-full">
              {isApplied(selectedListing.id) ? (
                <Button
                  disabled
                  variant="secondary"
                  leftIcon={<CheckCircle size={20} />}
                  className="flex-1 py-4 text-base md:text-lg h-auto rounded-xl justify-center"
                >
                  Già candidato
                </Button>
              ) : (
                <Button
                  leftIcon={<Send size={20} />}
                  className="flex-1 py-4 text-base md:text-lg h-auto shadow-md rounded-xl bg-primary-600 hover:bg-primary-700 justify-center"
                  onClick={() => {
                    setSelectedListing(null);
                    openApplicationForm(selectedListing);
                  }}
                >
                  Candidati
                </Button>
              )}
              <Button
                variant="outline"
                className={`w-14 h-14 p-0 rounded-full shrink-0 border-2 ${savedListings.includes(selectedListing.id)
                  ? 'border-primary-500 text-primary-500 bg-primary-50'
                  : 'border-border text-text-secondary hover:border-primary-500 hover:text-primary-500'}`}
                onClick={() => {
                  toggleSavedListing(selectedListing.id);
                  toast.success(
                    savedListings.includes(selectedListing.id) ? 'Rimosso dai salvati' : 'Salvato!'
                  );
                }}
              >
                <Heart size={24} fill={savedListings.includes(selectedListing.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>
          )
        }
      >
        {selectedListing && (
          <div className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-teal-100 rounded-xl" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-3xl font-bold text-primary-600">
                  {selectedListing.priceDisplay ?? formatCurrency(selectedListing.price)}
                </span>
                <span className="text-text-muted">/mese</span>
                {selectedListing.expenses && (
                  <p className="text-sm text-text-muted">
                    + {formatCurrency(selectedListing.expenses)} spese
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{selectedListing.city}</p>
                <p className="text-sm text-text-muted">{selectedListing.zone}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 p-4 bg-background-secondary rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.rooms}</p>
                <p className="text-xs text-text-muted">Locali</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.squareMeters}</p>
                <p className="text-xs text-text-muted">m²</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.bathrooms}</p>
                <p className="text-xs text-text-muted">Bagni</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">
                  {selectedListing.floor !== undefined ? selectedListing.floor : '-'}
                </p>
                <p className="text-xs text-text-muted">Piano</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Descrizione</h4>
              <p className="text-text-secondary">{selectedListing.description}</p>
            </div>

            {selectedListing.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Caratteristiche</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.features.map((feature) => (
                    <Badge key={String(feature)} variant="success"><Check size={11} className="inline mr-0.5" />{String(feature)}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-background-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"><Building2 size={20} className="text-primary-600" /></div>
              <div className="flex-1">
                <p className="font-medium">{selectedListing.agencyName}</p>
                <p className="text-sm text-text-muted">Agenzia verificata</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Application Modal ───────────────────────────────────────────────── */}
      <Modal
        isOpen={!!applyingTo}
        onClose={() => { setApplyingTo(null); setFormData(INITIAL_FORM); }}
        title="Candidatura"
        size="lg"
      >
        {applyingTo && (
          <div className="space-y-6">
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="text-sm text-primary-600 font-medium">Ti stai candidando per:</p>
              <p className="font-bold text-text-primary mt-1">{applyingTo.title}</p>
              <p className="text-sm text-text-secondary">
                {applyingTo.city} - {applyingTo.priceDisplay ?? formatCurrency(applyingTo.price)}/mese
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Dati Personali</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nome *" value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                <Input label="Cognome *" value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                <Input label="Email *" type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <Input label="Telefono *" type="tel" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Situazione Lavorativa</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Occupazione" value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                <div>
                  <label className="label">Tipo Contratto</label>
                  <select className="input" value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}>
                    <option value="">Seleziona...</option>
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <Input label="Reddito mensile" value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="es. 1.500 €/mese" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Preferenze Abitative</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Data ingresso desiderata" type="date" value={formData.moveInDate}
                  onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })} />
                <div>
                  <label className="label">Durata permanenza</label>
                  <select className="input" value={formData.stayDuration}
                    onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}>
                    <option value="6 mesi">6 mesi</option>
                    <option value="12 mesi">12 mesi</option>
                    <option value="24 mesi">24 mesi</option>
                    <option value="36+ mesi">36+ mesi</option>
                    <option value="Indeterminata">Indeterminata</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.hasPets}
                    onChange={(e) => setFormData({ ...formData, hasPets: e.target.checked })}
                    className="rounded border-border" />
                  <PawPrint size={16} className="text-text-muted" />
                  <span className="text-sm">Ho animali domestici</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isSmoker}
                    onChange={(e) => setFormData({ ...formData, isSmoker: e.target.checked })}
                    className="rounded border-border" />
                  <Cigarette size={16} className="text-text-muted" />
                  <span className="text-sm">Fumatore</span>
                </label>
              </div>

              {formData.hasPets && (
                <Input label="Descrivi i tuoi animali" className="mt-3"
                  value={formData.petDetails}
                  onChange={(e) => setFormData({ ...formData, petDetails: e.target.value })}
                  placeholder="es. Un gatto di 3 anni" />
              )}
            </div>

            <div>
              <label className="label">Messaggio di presentazione *</label>
              <textarea
                className="input min-h-[100px] resize-y"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Presentati brevemente: chi sei, perché cerchi questa casa, quando vorresti trasferirti..."
                rows={4}
              />
              <p className="text-xs text-text-muted mt-1">
                Un buon messaggio aumenta le possibilità di essere selezionato
              </p>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setApplyingTo(null); setFormData(INITIAL_FORM); }}>
            Annulla
          </Button>
          <Button leftIcon={<Send size={16} />} onClick={handleSubmitApplication} isLoading={isSubmitting}>
            Invia Candidatura
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
