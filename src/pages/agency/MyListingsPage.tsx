import { useState } from 'react';
import { Plus, Edit2, Eye, Trash2, MoreVertical, Users, Pause, Play } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';

// Mock agency listings
const mockAgencyListings = [
  {
    id: 1,
    title: 'Bilocale luminoso in zona Navigli',
    city: 'Milano',
    price: 1200,
    rooms: 2,
    sqm: 55,
    status: 'active' as const,
    views: 234,
    applications: 12,
    createdAt: new Date('2024-10-15'),
  },
  {
    id: 2,
    title: 'Trilocale con terrazzo zona Porta Romana',
    city: 'Milano',
    price: 1650,
    rooms: 3,
    sqm: 85,
    status: 'active' as const,
    views: 156,
    applications: 8,
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 3,
    title: 'Monolocale arredato centro storico',
    city: 'Milano',
    price: 850,
    rooms: 1,
    sqm: 35,
    status: 'paused' as const,
    views: 89,
    applications: 5,
    createdAt: new Date('2024-09-10'),
  },
  {
    id: 4,
    title: 'Quadrilocale con box zona Isola',
    city: 'Milano',
    price: 2100,
    rooms: 4,
    sqm: 110,
    status: 'rented' as const,
    views: 412,
    applications: 23,
    createdAt: new Date('2024-08-05'),
  },
];

type ListingStatus = 'active' | 'paused' | 'rented' | 'expired';

const statusConfig: Record<ListingStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'error' }> = {
  active: { label: 'Attivo', variant: 'success' },
  paused: { label: 'In Pausa', variant: 'warning' },
  rented: { label: 'Affittato', variant: 'info' },
  expired: { label: 'Scaduto', variant: 'error' },
};

export default function MyListingsPage() {
  const [listings] = useState(mockAgencyListings);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalApplications = listings.reduce((sum, l) => sum + l.applications, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">I Miei Annunci</h1>
          <p className="text-text-secondary">
            {activeCount} annunci attivi • {formatNumber(totalViews)} visualizzazioni totali
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
          Nuovo Annuncio
        </Button>
      </div>

      {/* Stats Cards */}
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

      {/* Listings Table */}
      {listings.length > 0 ? (
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
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-background-secondary/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{listing.title}</p>
                        <p className="text-sm text-text-muted">
                          {listing.city} • {listing.rooms} locali • {listing.sqm}m²
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
                        <Button variant="ghost" size="sm" className="btn-icon">
                          <Edit2 size={16} />
                        </Button>
                        {listing.status === 'active' ? (
                          <Button variant="ghost" size="sm" className="btn-icon">
                            <Pause size={16} />
                          </Button>
                        ) : listing.status === 'paused' ? (
                          <Button variant="ghost" size="sm" className="btn-icon">
                            <Play size={16} />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="btn-icon text-error hover:bg-red-50"
                          onClick={() => {
                            setSelectedListing(listing.id);
                            setShowDeleteModal(true);
                          }}
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
          action={{
            label: 'Crea Annuncio',
            onClick: () => setShowCreateModal(true),
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Elimina Annuncio"
        size="sm"
      >
        <p className="text-text-secondary">
          Sei sicuro di voler eliminare questo annuncio? Questa azione non puo essere annullata.
        </p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
            Elimina
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Listing Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuovo Annuncio"
        size="lg"
      >
        <div className="text-center py-8">
          <p className="text-text-muted">
            Form di creazione annuncio in fase di sviluppo
          </p>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Annulla
          </Button>
          <Button onClick={() => setShowCreateModal(false)}>
            Salva Bozza
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
