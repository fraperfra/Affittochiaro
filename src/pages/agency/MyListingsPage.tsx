import { useState } from 'react';
import { Plus, Edit2, Eye, Trash2, Users, Pause, Play, Save, MapPin } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { ITALIAN_CITIES } from '../../utils/constants';
import { PROPERTY_TYPE_LABELS, LISTING_FEATURE_LABELS, HEATING_TYPE_LABELS, PropertyType, ListingFeature, HeatingType } from '../../types/listing';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

interface AgencyListing {
  id: number;
  title: string;
  description: string;
  city: string;
  zone: string;
  price: number;
  expenses: number;
  deposit: number;
  rooms: number;
  bathrooms: number;
  sqm: number;
  floor: number;
  propertyType: PropertyType;
  furnished: 'yes' | 'no' | 'partial';
  heatingType: HeatingType;
  features: ListingFeature[];
  petsAllowed: boolean;
  smokingAllowed: boolean;
  status: ListingStatus;
  views: number;
  applications: number;
  createdAt: Date;
}

type ListingStatus = 'active' | 'paused' | 'rented' | 'expired' | 'draft';

const statusConfig: Record<ListingStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'error' | 'neutral' }> = {
  active: { label: 'Attivo', variant: 'success' },
  paused: { label: 'In Pausa', variant: 'warning' },
  rented: { label: 'Affittato', variant: 'info' },
  expired: { label: 'Scaduto', variant: 'error' },
  draft: { label: 'Bozza', variant: 'neutral' },
};

const INITIAL_LISTINGS: AgencyListing[] = [
  {
    id: 1, title: 'Bilocale luminoso in zona Navigli', description: 'Splendido bilocale ristrutturato con affaccio sul Naviglio Grande. Luminoso e silenzioso, ideale per giovani professionisti.',
    city: 'Milano', zone: 'Navigli', price: 1200, expenses: 120, deposit: 2400, rooms: 2, bathrooms: 1, sqm: 55, floor: 3,
    propertyType: 'apartment', furnished: 'yes', heatingType: 'autonomous', features: ['balcony', 'air_conditioning', 'washing_machine', 'internet'],
    petsAllowed: false, smokingAllowed: false, status: 'active', views: 234, applications: 12, createdAt: new Date('2024-10-15'),
  },
  {
    id: 2, title: 'Trilocale con terrazzo zona Porta Romana', description: 'Ampio trilocale con terrazzo abitabile e doppia esposizione. Zona servitissima, vicino a metro e università.',
    city: 'Milano', zone: 'Porta Romana', price: 1650, expenses: 150, deposit: 3300, rooms: 3, bathrooms: 2, sqm: 85, floor: 5,
    propertyType: 'apartment', furnished: 'partial', heatingType: 'centralized', features: ['terrace', 'elevator', 'video_intercom', 'cellar'],
    petsAllowed: true, smokingAllowed: false, status: 'active', views: 156, applications: 8, createdAt: new Date('2024-10-20'),
  },
  {
    id: 3, title: 'Monolocale arredato centro storico', description: 'Monolocale completamente arredato nel cuore del centro storico. Perfetto per studenti e lavoratori single.',
    city: 'Milano', zone: 'Centro Storico', price: 850, expenses: 80, deposit: 1700, rooms: 1, bathrooms: 1, sqm: 35, floor: 2,
    propertyType: 'studio', furnished: 'yes', heatingType: 'autonomous', features: ['internet', 'washing_machine', 'air_conditioning'],
    petsAllowed: false, smokingAllowed: false, status: 'paused', views: 89, applications: 5, createdAt: new Date('2024-09-10'),
  },
  {
    id: 4, title: 'Quadrilocale con box zona Isola', description: 'Quadrilocale spazioso con box auto e cantina. Zona Isola, quartiere trendy e ben collegato.',
    city: 'Milano', zone: 'Isola', price: 2100, expenses: 200, deposit: 4200, rooms: 4, bathrooms: 2, sqm: 110, floor: 1,
    propertyType: 'apartment', furnished: 'no', heatingType: 'floor', features: ['garage', 'cellar', 'elevator', 'video_intercom', 'garden'],
    petsAllowed: true, smokingAllowed: false, status: 'rented', views: 412, applications: 23, createdAt: new Date('2024-08-05'),
  },
];

interface ListingFormData {
  title: string;
  description: string;
  city: string;
  zone: string;
  price: string;
  expenses: string;
  deposit: string;
  rooms: string;
  bathrooms: string;
  sqm: string;
  floor: string;
  propertyType: PropertyType;
  furnished: 'yes' | 'no' | 'partial';
  heatingType: HeatingType;
  features: ListingFeature[];
  petsAllowed: boolean;
  smokingAllowed: boolean;
}

const EMPTY_FORM: ListingFormData = {
  title: '', description: '', city: '', zone: '', price: '', expenses: '', deposit: '',
  rooms: '2', bathrooms: '1', sqm: '', floor: '',
  propertyType: 'apartment', furnished: 'no', heatingType: 'autonomous',
  features: [], petsAllowed: false, smokingAllowed: false,
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<AgencyListing[]>(INITIAL_LISTINGS);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalApplications = listings.reduce((sum, l) => sum + l.applications, 0);

  const filtered = filterStatus ? listings.filter(l => l.status === filterStatus) : listings;

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowFormModal(true);
  };

  const openEditModal = (listing: AgencyListing) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title,
      description: listing.description,
      city: listing.city,
      zone: listing.zone,
      price: String(listing.price),
      expenses: String(listing.expenses || ''),
      deposit: String(listing.deposit || ''),
      rooms: String(listing.rooms),
      bathrooms: String(listing.bathrooms),
      sqm: String(listing.sqm),
      floor: String(listing.floor || ''),
      propertyType: listing.propertyType,
      furnished: listing.furnished,
      heatingType: listing.heatingType,
      features: [...listing.features],
      petsAllowed: listing.petsAllowed,
      smokingAllowed: listing.smokingAllowed,
    });
    setShowFormModal(true);
  };

  const handleSave = (asDraft = false) => {
    if (!formData.title.trim()) { toast.error('Inserisci un titolo'); return; }
    if (!formData.city) { toast.error('Seleziona una citta'); return; }
    if (!formData.price || parseInt(formData.price) <= 0) { toast.error('Inserisci un prezzo valido'); return; }

    if (editingId) {
      setListings(listings.map(l => l.id === editingId ? {
        ...l,
        title: formData.title, description: formData.description, city: formData.city, zone: formData.zone,
        price: parseInt(formData.price), expenses: parseInt(formData.expenses) || 0,
        deposit: parseInt(formData.deposit) || 0, rooms: parseInt(formData.rooms) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1, sqm: parseInt(formData.sqm) || 0,
        floor: parseInt(formData.floor) || 0, propertyType: formData.propertyType,
        furnished: formData.furnished, heatingType: formData.heatingType,
        features: formData.features, petsAllowed: formData.petsAllowed, smokingAllowed: formData.smokingAllowed,
      } : l));
      toast.success('Annuncio aggiornato!');
    } else {
      const newListing: AgencyListing = {
        id: Date.now(),
        title: formData.title, description: formData.description, city: formData.city, zone: formData.zone,
        price: parseInt(formData.price), expenses: parseInt(formData.expenses) || 0,
        deposit: parseInt(formData.deposit) || 0, rooms: parseInt(formData.rooms) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1, sqm: parseInt(formData.sqm) || 0,
        floor: parseInt(formData.floor) || 0, propertyType: formData.propertyType,
        furnished: formData.furnished, heatingType: formData.heatingType,
        features: formData.features, petsAllowed: formData.petsAllowed, smokingAllowed: formData.smokingAllowed,
        status: asDraft ? 'draft' : 'active',
        views: 0, applications: 0, createdAt: new Date(),
      };
      setListings([newListing, ...listings]);
      toast.success(asDraft ? 'Bozza salvata!' : 'Annuncio pubblicato!');
    }
    setShowFormModal(false);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setListings(listings.filter(l => l.id !== deleteTarget));
    setDeleteTarget(null);
    toast.success('Annuncio eliminato');
  };

  const handleToggleStatus = (listing: AgencyListing) => {
    const newStatus = listing.status === 'active' ? 'paused' : 'active';
    setListings(listings.map(l => l.id === listing.id ? { ...l, status: newStatus } : l));
    toast.success(newStatus === 'active' ? 'Annuncio riattivato' : 'Annuncio messo in pausa');
  };

  const toggleFeature = (feature: ListingFeature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">I Miei Annunci</h1>
          <p className="text-text-secondary">
            {activeCount} annunci attivi &bull; {formatNumber(totalViews)} visualizzazioni totali
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={openCreateModal}>
          Nuovo Annuncio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">{listings.length}</p>
          <p className="text-text-muted">Annunci Totali</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">{activeCount}</p>
          <p className="text-text-muted">Attivi</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">{formatNumber(totalViews)}</p>
          <p className="text-text-muted">Visualizzazioni</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{totalApplications}</p>
          <p className="text-text-muted">Candidature</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'active', 'paused', 'draft', 'rented'].map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {status === '' ? 'Tutti' : statusConfig[status as ListingStatus]?.label || status}
          </Button>
        ))}
      </div>

      {/* Listings Table */}
      {filtered.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Annuncio</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Prezzo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Stato</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Visualizzazioni</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Candidature</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Data</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((listing) => (
                  <tr key={listing.id} className="hover:bg-background-secondary/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{listing.title}</p>
                        <p className="text-sm text-text-muted flex items-center gap-1">
                          <MapPin size={12} />
                          {listing.city}{listing.zone ? ` - ${listing.zone}` : ''} &bull; {listing.rooms} locali &bull; {listing.sqm}m²
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(listing.price)}/mese
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig[listing.status].variant}>
                        {statusConfig[listing.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Eye size={14} className="text-text-muted" />
                        <span>{formatNumber(listing.views)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-text-muted" />
                        <span>{listing.applications}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="btn-icon" onClick={() => openEditModal(listing)}>
                          <Edit2 size={16} />
                        </Button>
                        {(listing.status === 'active' || listing.status === 'paused') && (
                          <Button variant="ghost" size="sm" className="btn-icon" onClick={() => handleToggleStatus(listing)}>
                            {listing.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="sm"
                          className="btn-icon text-error hover:bg-red-50"
                          onClick={() => setDeleteTarget(listing.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="🏠"
          title="Nessun annuncio"
          description="Inizia a pubblicare i tuoi immobili"
          action={{ label: 'Crea Annuncio', onClick: openCreateModal }}
        />
      )}

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Elimina Annuncio" size="sm">
        <p className="text-text-secondary">
          Sei sicuro di voler eliminare questo annuncio? Questa azione non puo essere annullata.
        </p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Annulla</Button>
          <Button variant="danger" onClick={handleDelete}>Elimina</Button>
        </ModalFooter>
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setFormData(EMPTY_FORM); }}
        title={editingId ? 'Modifica Annuncio' : 'Nuovo Annuncio'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic */}
          <div>
            <h4 className="font-semibold mb-3">Informazioni Base</h4>
            <div className="space-y-4">
              <Input
                label="Titolo annuncio *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="es. Bilocale luminoso in zona Navigli"
              />
              <div>
                <label className="label">Descrizione</label>
                <textarea
                  className="input min-h-[80px] resize-y"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrivi l'immobile in dettaglio..."
                  rows={3}
                />
              </div>
              <div>
                <label className="label">Tipo immobile</label>
                <select className="input" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold mb-3">Posizione</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Citta *</label>
                <select className="input" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                  <option value="">Seleziona...</option>
                  {ITALIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Zona"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                placeholder="es. Navigli, Porta Romana..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-semibold mb-3">Prezzo</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Affitto mensile (€) *"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1200"
              />
              <Input
                label="Spese condominio (€)"
                type="number"
                value={formData.expenses}
                onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                placeholder="100"
              />
              <Input
                label="Deposito cauzionale (€)"
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                placeholder="2400"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h4 className="font-semibold mb-3">Caratteristiche</h4>
            <div className="grid grid-cols-4 gap-4">
              <Input label="Locali" type="number" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
              <Input label="Bagni" type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} />
              <Input label="Superficie (m²)" type="number" value={formData.sqm} onChange={(e) => setFormData({ ...formData, sqm: e.target.value })} />
              <Input label="Piano" type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Arredamento</label>
                <select className="input" value={formData.furnished} onChange={(e) => setFormData({ ...formData, furnished: e.target.value as 'yes' | 'no' | 'partial' })}>
                  <option value="no">Non arredato</option>
                  <option value="yes">Arredato</option>
                  <option value="partial">Parzialmente arredato</option>
                </select>
              </div>
              <div>
                <label className="label">Riscaldamento</label>
                <select className="input" value={formData.heatingType} onChange={(e) => setFormData({ ...formData, heatingType: e.target.value as HeatingType })}>
                  {Object.entries(HEATING_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Dotazioni</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LISTING_FEATURE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    formData.features.includes(key as ListingFeature)
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-border hover:border-primary-300 text-text-secondary'
                  }`}
                  onClick={() => toggleFeature(key as ListingFeature)}
                >
                  {formData.features.includes(key as ListingFeature) ? '✓ ' : ''}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h4 className="font-semibold mb-3">Preferenze inquilino</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.petsAllowed}
                  onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Animali ammessi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smokingAllowed}
                  onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Fumatori ammessi</span>
              </label>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowFormModal(false); setFormData(EMPTY_FORM); }}>
            Annulla
          </Button>
          {!editingId && (
            <Button variant="outline" leftIcon={<Save size={16} />} onClick={() => handleSave(true)}>
              Salva Bozza
            </Button>
          )}
          <Button onClick={() => handleSave(false)}>
            {editingId ? 'Aggiorna' : 'Pubblica'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
