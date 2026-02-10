import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  Pause,
  Play,
  Trash2,
  MapPin,
  Home,
  Euro,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import { useListingStore } from '../../store';
import { mockListings } from '../../utils/mockData';
import { formatDate, formatCurrency, formatNumber, formatSquareMeters } from '../../utils/formatters';
import { ITALIAN_CITIES } from '../../utils/constants';
import { Listing, ListingStatus } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

const statusConfig: Record<ListingStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'error' | 'neutral'; icon: React.ReactNode }> = {
  active: { label: 'Attivo', variant: 'success', icon: <CheckCircle size={14} /> },
  paused: { label: 'In Pausa', variant: 'warning', icon: <Pause size={14} /> },
  pending_review: { label: 'In Revisione', variant: 'info', icon: <Clock size={14} /> },
  rented: { label: 'Affittato', variant: 'info', icon: <CheckCircle size={14} /> },
  expired: { label: 'Scaduto', variant: 'error', icon: <XCircle size={14} /> },
  rejected: { label: 'Rifiutato', variant: 'error', icon: <XCircle size={14} /> },
  draft: { label: 'Bozza', variant: 'neutral', icon: <Clock size={14} /> },
};

export default function ListingsManagementPage() {
  const { listings, setListings, filters, setFilters, pagination, setPagination } = useListingStore();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    setListings(mockListings.slice(0, 500));
    setPagination({ total: mockListings.length, totalPages: Math.ceil(mockListings.length / 20) });
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !listing.title.toLowerCase().includes(search) &&
        !listing.address.city.toLowerCase().includes(search) &&
        !listing.agencyName.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    if (filters.city && listing.address.city !== filters.city) return false;
    if (statusFilter && listing.status !== statusFilter) return false;
    return true;
  });

  const paginatedListings = filteredListings.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  // Stats
  const totalActive = listings.filter(l => l.status === 'active').length;
  const totalPending = listings.filter(l => l.status === 'pending_review').length;
  const totalRented = listings.filter(l => l.status === 'rented').length;
  const avgPrice = Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length);

  const handleApprove = (listing: Listing) => {
    const updated = listings.map(l =>
      l.id === listing.id ? { ...l, status: 'active' as ListingStatus } : l
    );
    setListings(updated);
    setShowActions(null);
    toast.success(`Annuncio "${listing.title}" approvato!`);
  };

  const handleReject = (listing: Listing) => {
    const updated = listings.map(l =>
      l.id === listing.id ? { ...l, status: 'rejected' as ListingStatus } : l
    );
    setListings(updated);
    setShowActions(null);
    toast.success(`Annuncio "${listing.title}" rifiutato`);
  };

  const handlePause = (listing: Listing) => {
    const updated = listings.map(l =>
      l.id === listing.id ? { ...l, status: 'paused' as ListingStatus } : l
    );
    setListings(updated);
    setShowActions(null);
    toast.success(`Annuncio "${listing.title}" messo in pausa`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestione Annunci</h1>
          <p className="text-text-secondary">
            {formatNumber(filteredListings.length)} annunci totali
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={16} />}>
          Esporta CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">{formatNumber(listings.length)}</p>
          <p className="text-text-muted">Totale Annunci</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">{formatNumber(totalActive)}</p>
          <p className="text-text-muted">Attivi</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-warning">{totalPending}</p>
          <p className="text-text-muted">In Revisione</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{formatCurrency(avgPrice)}</p>
          <p className="text-text-muted">Prezzo Medio</p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca per titolo, citta, agenzia..."
              className="input pl-10"
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              className="input w-auto"
              value={filters.city || ''}
              onChange={(e) => setFilters({ city: e.target.value || undefined })}
            >
              <option value="">Tutte le citta</option>
              {ITALIAN_CITIES.slice(0, 15).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              className="input w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tutti gli stati</option>
              <option value="active">Attivi</option>
              <option value="pending_review">In Revisione</option>
              <option value="paused">In Pausa</option>
              <option value="rented">Affittati</option>
              <option value="expired">Scaduti</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Listings Display */}
      {paginatedListings.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {paginatedListings.map((listing) => (
              <Card key={listing.id} padding="md">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary line-clamp-2 mb-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <MapPin size={12} />
                      {listing.address.city} • {listing.rooms} locali • {formatSquareMeters(listing.squareMeters)}
                    </p>
                  </div>
                  <Badge variant={statusConfig[listing.status]?.variant || 'neutral'}>
                    {statusConfig[listing.status]?.label || listing.status}
                  </Badge>
                </div>

                {/* Agenzia */}
                <p className="text-sm text-text-secondary mb-3">
                  📍 <span className="font-medium">{listing.agencyName}</span>
                </p>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(listing.price)}
                  </span>
                  <span className="text-sm text-text-muted">/mese</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-3 border-y border-gray-100 mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Eye size={16} className="text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Views</p>
                      <p className="font-semibold text-text-primary">{formatNumber(listing.views)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar size={16} className="text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Data</p>
                      <p className="font-semibold text-text-primary text-sm">{formatDate(listing.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedListing(listing)}
                    leftIcon={<Eye size={14} />}
                  >
                    Dettagli
                  </Button>
                  {listing.status === 'pending_review' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleApprove(listing)}
                        leftIcon={<CheckCircle size={14} />}
                      >
                        Approva
                      </Button>
                      <button
                        onClick={() => handleReject(listing)}
                        className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  {listing.status === 'active' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePause(listing)}
                      leftIcon={<Pause size={14} />}
                    >
                      Pausa
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Annuncio</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Agenzia</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Prezzo</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Stato</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Views</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Data</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-background-secondary/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                            <Home size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary line-clamp-1 max-w-xs">
                              {listing.title}
                            </p>
                            <p className="text-sm text-text-muted flex items-center gap-1">
                              <MapPin size={12} />
                              {listing.address.city} • {listing.rooms} locali • {formatSquareMeters(listing.squareMeters)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        <p className="text-sm">{listing.agencyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary-600">
                          {formatCurrency(listing.price)}/mese
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig[listing.status]?.variant || 'neutral'}>
                          {statusConfig[listing.status]?.label || listing.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-text-muted">
                          <Eye size={14} />
                          <span>{formatNumber(listing.views)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {formatDate(listing.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="btn-icon"
                            onClick={() => setSelectedListing(listing)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="btn-icon"
                            onClick={() => setShowActions(showActions === listing.id ? null : listing.id)}
                          >
                            <MoreVertical size={16} />
                          </Button>

                          {showActions === listing.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-border z-10">
                              <div className="p-1">
                                {listing.status === 'pending_review' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(listing)}
                                      className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                                    >
                                      <CheckCircle size={14} className="text-success" />
                                      Approva
                                    </button>
                                    <button
                                      onClick={() => handleReject(listing)}
                                      className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                                    >
                                      <XCircle size={14} className="text-error" />
                                      Rifiuta
                                    </button>
                                  </>
                                )}
                                {listing.status === 'active' && (
                                  <button
                                    onClick={() => handlePause(listing)}
                                    className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                                  >
                                    <Pause size={14} className="text-warning" />
                                    Metti in Pausa
                                  </button>
                                )}
                                {listing.status === 'paused' && (
                                  <button
                                    className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                                  >
                                    <Play size={14} className="text-success" />
                                    Riattiva
                                  </button>
                                )}
                                <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-red-50 text-error flex items-center gap-2">
                                  <Trash2 size={14} />
                                  Elimina
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-text-muted">
                Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, filteredListings.length)} di {filteredListings.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ page: pagination.page - 1 })}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-text-secondary px-2">
                  Pagina {pagination.page} di {Math.ceil(filteredListings.length / pagination.limit)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= Math.ceil(filteredListings.length / pagination.limit)}
                  onClick={() => setPagination({ page: pagination.page + 1 })}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          icon="🏠"
          title="Nessun annuncio trovato"
          description="Prova a modificare i filtri"
        />
      )}

      {/* Listing Detail Modal */}
      <Modal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title="Dettaglio Annuncio"
        size="lg"
      >
        {selectedListing && (
          <div className="space-y-6">
            {/* Image placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-teal-100 rounded-xl flex items-center justify-center">
              <Home size={48} className="text-primary-300" />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedListing.title}</h3>
                <p className="text-text-secondary flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selectedListing.address.city}, {selectedListing.address.street}
                </p>
              </div>
              <Badge variant={statusConfig[selectedListing.status]?.variant || 'neutral'}>
                {statusConfig[selectedListing.status]?.label || selectedListing.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background-secondary rounded-xl text-center">
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(selectedListing.price)}</p>
                <p className="text-xs text-text-muted">/mese</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl text-center">
                <p className="text-2xl font-bold">{selectedListing.rooms}</p>
                <p className="text-xs text-text-muted">Locali</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl text-center">
                <p className="text-2xl font-bold">{selectedListing.squareMeters}</p>
                <p className="text-xs text-text-muted">m²</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl text-center">
                <p className="text-2xl font-bold">{formatNumber(selectedListing.views)}</p>
                <p className="text-xs text-text-muted">Views</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Descrizione</h4>
              <p className="text-text-secondary text-sm">{selectedListing.description}</p>
            </div>

            <div className="p-4 bg-background-secondary rounded-xl">
              <p className="text-sm text-text-muted">Agenzia</p>
              <p className="font-medium">{selectedListing.agencyName}</p>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedListing(null)}>
            Chiudi
          </Button>
          {selectedListing?.status === 'pending_review' && (
            <>
              <Button variant="danger" onClick={() => {
                handleReject(selectedListing);
                setSelectedListing(null);
              }}>
                Rifiuta
              </Button>
              <Button onClick={() => {
                handleApprove(selectedListing);
                setSelectedListing(null);
              }}>
                Approva
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
