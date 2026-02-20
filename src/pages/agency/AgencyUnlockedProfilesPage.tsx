import { useState, useMemo } from 'react';
import { useAgencyStore } from '../../store';
import { mockTenants } from '../../utils/mockData';
import { Card, Button, Badge, Modal, ModalFooter } from '../../components/ui';
import {
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  Edit2,
  User,
  Unlock,
  Bookmark,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import { formatRelativeTime, formatInitials } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

type ActiveTab = 'sbloccati' | 'salvati';

export default function AgencyUnlockedProfilesPage() {
  const {
    unlockedTenants,
    updateUnlockedTenantNote,
    savedTenants,
    updateSavedTenantNote,
    removeSavedTenant,
  } = useAgencyStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('sbloccati');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: string; type: ActiveTab } | null>(null);
  const [noteContent, setNoteContent] = useState('');

  // ── Sbloccati ──────────────────────────────────────────────
  const enrichedUnlocked = useMemo(() =>
    unlockedTenants
      .map((u) => ({ ...u, profile: mockTenants.find((t) => t.id === u.tenantId) }))
      .filter((u) => u.profile)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()),
    [unlockedTenants]
  );

  // ── Salvati ────────────────────────────────────────────────
  const enrichedSaved = useMemo(() =>
    savedTenants
      .map((s) => ({ ...s, profile: mockTenants.find((t) => t.id === s.tenantId) }))
      .filter((s) => s.profile)
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()),
    [savedTenants]
  );

  const filteredUnlocked = enrichedUnlocked.filter(({ profile }) =>
    !searchTerm ||
    `${profile?.firstName} ${profile?.lastName} ${profile?.currentCity}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSaved = enrichedSaved.filter(({ profile }) =>
    !searchTerm ||
    `${profile?.firstName} ${profile?.lastName} ${profile?.currentCity}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditNote = (id: string, type: ActiveTab, current = '') => {
    setEditingNote({ id, type });
    setNoteContent(current);
  };

  const handleSaveNote = () => {
    if (!editingNote) return;
    if (editingNote.type === 'sbloccati') {
      updateUnlockedTenantNote(editingNote.id, noteContent);
    } else {
      updateSavedTenantNote(editingNote.id, noteContent);
    }
    setEditingNote(null);
    setNoteContent('');
  };

  const tabs: { id: ActiveTab; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'sbloccati', label: 'Sbloccati', count: unlockedTenants.length, icon: <Unlock size={16} /> },
    { id: 'salvati', label: 'Salvati', count: savedTenants.length, icon: <Bookmark size={16} /> },
  ];

  const currentList = activeTab === 'sbloccati' ? filteredUnlocked : filteredSaved;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Archivio Profili</h1>
          <p className="text-text-secondary">Gestisci i contatti e le note dei tuoi candidati</p>
        </div>
        <Link to={ROUTES.AGENCY_TENANTS}>
          <Button variant="secondary" size="sm" leftIcon={<Search size={15} />}>
            Cerca nuovi
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Cerca nell'archivio..."
          className="input pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      {currentList.length > 0 ? (
        <div className="space-y-4">
          {activeTab === 'sbloccati' && filteredUnlocked.map(({ tenantId, unlockedAt, contactInfo, notes, profile }) => (
            <ProfileCard
              key={tenantId}
              tenantId={tenantId}
              profile={profile!}
              notes={notes}
              dateLabel={`Sbloccato ${formatRelativeTime(unlockedAt)}`}
              contactInfo={contactInfo}
              onEditNote={() => handleEditNote(tenantId, 'sbloccati', notes)}
              type="sbloccati"
            />
          ))}

          {activeTab === 'salvati' && filteredSaved.map(({ tenantId, savedAt, notes, profile }) => (
            <ProfileCard
              key={tenantId}
              tenantId={tenantId}
              profile={profile!}
              notes={notes}
              dateLabel={`Salvato ${formatRelativeTime(savedAt)}`}
              onEditNote={() => handleEditNote(tenantId, 'salvati', notes)}
              onRemove={() => removeSavedTenant(tenantId)}
              type="salvati"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {activeTab === 'sbloccati' ? <Unlock size={24} className="text-gray-400" /> : <Bookmark size={24} className="text-gray-400" />}
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            {activeTab === 'sbloccati' ? 'Nessun profilo sbloccato' : 'Nessun profilo salvato'}
          </h3>
          <p className="text-text-secondary text-sm mt-1 max-w-xs mx-auto">
            {activeTab === 'sbloccati'
              ? 'Sblocca i profili degli inquilini per accedere ai loro contatti.'
              : 'Salva i profili che ti interessano per ritrovarli facilmente qui.'}
          </p>
          <Link to={ROUTES.AGENCY_TENANTS} className="inline-block mt-4">
            <Button size="sm">Vai alla ricerca</Button>
          </Link>
        </div>
      )}

      {/* Edit Note Modal */}
      <Modal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        title="Note interne"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Le note sono visibili a tutti i membri del tuo account agenzia.
          </p>
          <textarea
            className="input min-h-[140px] resize-y w-full"
            placeholder="Es: Contattato telefonicamente, molto disponibile. Cerca casa entro marzo..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            maxLength={1000}
            autoFocus
          />
          <p className="text-xs text-text-muted text-right">{noteContent.length}/1000</p>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setEditingNote(null)}>Annulla</Button>
          <Button onClick={handleSaveNote}>Salva Nota</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// ── Shared card component ───────────────────────────────────
function ProfileCard({
  tenantId,
  profile,
  notes,
  dateLabel,
  contactInfo,
  onEditNote,
  onRemove,
  type,
}: {
  tenantId: string;
  profile: any;
  notes?: string;
  dateLabel: string;
  contactInfo?: { email: string; phone?: string };
  onEditNote: () => void;
  onRemove?: () => void;
  type: ActiveTab;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Avatar + info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.firstName} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                {formatInitials(profile?.firstName || '', profile?.lastName || '')}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-text-primary truncate">
                {profile?.firstName} {profile?.lastName}
              </h3>
              {profile?.isVerified && <Badge variant="success" size="sm">✓</Badge>}
              {type === 'salvati' && <Badge variant="warning" size="sm"><BookmarkCheck size={11} className="inline mr-0.5" />Salvato</Badge>}
              {type === 'sbloccati' && <Badge variant="primary" size="sm"><Unlock size={11} className="inline mr-0.5" />Sbloccato</Badge>}
            </div>
            <p className="text-sm text-text-muted mb-2">
              {profile?.age} anni · {profile?.occupation} · {profile?.currentCity}
            </p>

            {/* Contacts (only for unlocked) */}
            {contactInfo && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 text-primary-600 hover:underline">
                  <Mail size={13} />{contactInfo.email}
                </a>
                {contactInfo.phone && (
                  <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5 text-primary-600 hover:underline">
                    <Phone size={13} />{contactInfo.phone}
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <Calendar size={11} /> {dateLabel}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 lg:hidden" />

        {/* Notes */}
        <div className="lg:w-72 bg-yellow-50/60 rounded-xl p-4 border border-yellow-100 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-yellow-800 flex items-center gap-1.5">
              <FileText size={13} /> Note interne
            </span>
            <button
              onClick={onEditNote}
              className="p-1.5 hover:bg-yellow-100 rounded-lg text-yellow-700 transition-colors"
              title="Modifica nota"
            >
              <Edit2 size={13} />
            </button>
          </div>
          {notes ? (
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{notes}</p>
          ) : (
            <button
              onClick={onEditNote}
              className="text-sm text-text-muted italic hover:text-yellow-700 text-left transition-colors"
            >
              + Aggiungi nota...
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col justify-end gap-2 lg:border-l lg:pl-5 lg:border-gray-100 shrink-0">
          <Button variant="outline" size="sm" leftIcon={<User size={14} />}>
            Vedi profilo
          </Button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="flex items-center gap-1.5 text-xs text-error hover:text-red-700 mt-auto justify-end"
              title="Rimuovi dai salvati"
            >
              <Trash2 size={13} /> Rimuovi
            </button>
          )}
        </div>

      </div>
    </Card>
  );
}
