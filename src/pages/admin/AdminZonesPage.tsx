import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, MapPin, Check, X, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import toast from 'react-hot-toast';

interface Zone {
  id: string;
  city: string;
  region: string;
  province: string;
  isActive: boolean;
  tenantCount: number;
  agencyCount: number;
  listingCount: number;
}

const INITIAL_ZONES: Zone[] = [
  { id: '1', city: 'Milano', region: 'Lombardia', province: 'MI', isActive: true, tenantCount: 4820, agencyCount: 143, listingCount: 892 },
  { id: '2', city: 'Roma', region: 'Lazio', province: 'RM', isActive: true, tenantCount: 5210, agencyCount: 178, listingCount: 1043 },
  { id: '3', city: 'Torino', region: 'Piemonte', province: 'TO', isActive: true, tenantCount: 2340, agencyCount: 87, listingCount: 421 },
  { id: '4', city: 'Bologna', region: 'Emilia-Romagna', province: 'BO', isActive: true, tenantCount: 1890, agencyCount: 64, listingCount: 312 },
  { id: '5', city: 'Firenze', region: 'Toscana', province: 'FI', isActive: true, tenantCount: 1760, agencyCount: 58, listingCount: 287 },
  { id: '6', city: 'Napoli', region: 'Campania', province: 'NA', isActive: true, tenantCount: 2100, agencyCount: 72, listingCount: 345 },
  { id: '7', city: 'Venezia', region: 'Veneto', province: 'VE', isActive: true, tenantCount: 890, agencyCount: 31, listingCount: 143 },
  { id: '8', city: 'Genova', region: 'Liguria', province: 'GE', isActive: true, tenantCount: 1120, agencyCount: 38, listingCount: 198 },
  { id: '9', city: 'Palermo', region: 'Sicilia', province: 'PA', isActive: false, tenantCount: 320, agencyCount: 8, listingCount: 42 },
  { id: '10', city: 'Bari', region: 'Puglia', province: 'BA', isActive: false, tenantCount: 280, agencyCount: 6, listingCount: 31 },
  { id: '11', city: 'Padova', region: 'Veneto', province: 'PD', isActive: true, tenantCount: 1050, agencyCount: 35, listingCount: 167 },
  { id: '12', city: 'Verona', region: 'Veneto', province: 'VR', isActive: true, tenantCount: 980, agencyCount: 32, listingCount: 154 },
  { id: '13', city: 'Trieste', region: 'Friuli-Venezia Giulia', province: 'TS', isActive: true, tenantCount: 620, agencyCount: 21, listingCount: 89 },
  { id: '14', city: 'Brescia', region: 'Lombardia', province: 'BS', isActive: true, tenantCount: 870, agencyCount: 28, listingCount: 132 },
  { id: '15', city: 'Cagliari', region: 'Sardegna', province: 'CA', isActive: false, tenantCount: 190, agencyCount: 4, listingCount: 18 },
];

const EMPTY_ZONE: Omit<Zone, 'id'> = {
  city: '', region: '', province: '', isActive: true, tenantCount: 0, agencyCount: 0, listingCount: 0,
};

export default function AdminZonesPage() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [form, setForm] = useState(EMPTY_ZONE);
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null);

  const filtered = useMemo(() =>
    zones.filter(z => !search || z.city.toLowerCase().includes(search.toLowerCase()) || z.region.toLowerCase().includes(search.toLowerCase())),
    [zones, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_ZONE);
    setShowModal(true);
  };

  const openEdit = (z: Zone) => {
    setEditing(z);
    setForm({ city: z.city, region: z.region, province: z.province, isActive: z.isActive, tenantCount: z.tenantCount, agencyCount: z.agencyCount, listingCount: z.listingCount });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.city.trim() || !form.region.trim() || !form.province.trim()) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    if (editing) {
      setZones(prev => prev.map(z => z.id === editing.id ? { ...z, ...form } : z));
      toast.success('Zona aggiornata');
    } else {
      const newZone: Zone = { ...form, id: Date.now().toString() };
      setZones(prev => [...prev, newZone]);
      toast.success('Zona aggiunta');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setZones(prev => prev.filter(z => z.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Zona eliminata');
  };

  const handleToggleActive = (id: string) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, isActive: !z.isActive } : z));
    const zone = zones.find(z => z.id === id);
    toast.success(`${zone?.city} ${zone?.isActive ? 'disattivata' : 'attivata'}`);
  };

  const totals = useMemo(() => ({
    active: zones.filter(z => z.isActive).length,
    tenants: zones.reduce((s, z) => s + z.tenantCount, 0),
    agencies: zones.reduce((s, z) => s + z.agencyCount, 0),
    listings: zones.reduce((s, z) => s + z.listingCount, 0),
  }), [zones]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Zone (Città)</h1>
          <p className="text-text-secondary">Gestisci le città attive sulla piattaforma</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Aggiungi Zona</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Zone Attive', value: totals.active, color: 'text-green-600' },
          { label: 'Inquilini', value: totals.tenants.toLocaleString(), color: 'text-primary-600' },
          { label: 'Agenzie', value: totals.agencies, color: 'text-teal-600' },
          { label: 'Annunci', value: totals.listings, color: 'text-accent-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input type="text" placeholder="Cerca per città o regione..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Città</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden sm:table-cell">Regione</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary hidden md:table-cell">Inquilini</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary hidden md:table-cell">Agenzie</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary hidden lg:table-cell">Annunci</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary">Stato</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(z => (
                <tr key={z.id} className="hover:bg-background-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-text-muted flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{z.city}</p>
                        <p className="text-xs text-text-muted">{z.province}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text-secondary">{z.region}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center">
                    <span className="text-sm font-medium">{z.tenantCount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center">
                    <span className="text-sm font-medium">{z.agencyCount}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    <span className="text-sm font-medium">{z.listingCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(z.id)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${z.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {z.isActive ? <Check size={12} /> : <X size={12} />}
                      {z.isActive ? 'Attiva' : 'Inattiva'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => openEdit(z)}><Edit2 size={14} className="text-text-muted" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeleteTarget(z)}><Trash2 size={14} className="text-error" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal isOpen onClose={() => setShowModal(false)} title={editing ? `Modifica: ${editing.city}` : 'Aggiungi Zona'} size="md">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Città *</label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="es. Milano" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Regione *</label>
                <Input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="es. Lombardia" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Provincia *</label>
                <Input value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} placeholder="es. MI" maxLength={2} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Zona attiva</label>
              <button
                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button onClick={handleSave}>{editing ? 'Salva Modifiche' : 'Aggiungi Zona'}</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Elimina Zona" size="sm">
          <div className="p-4">
            <p className="text-text-secondary">Sei sicuro di voler eliminare <strong>{deleteTarget.city}</strong>? Questa azione non può essere annullata.</p>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Annulla</Button>
            <Button variant="danger" onClick={handleDelete}>Elimina</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
