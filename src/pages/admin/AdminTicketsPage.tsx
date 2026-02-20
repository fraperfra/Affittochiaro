import { useState, useMemo } from 'react';
import { Search, MessageSquare, ChevronLeft, ChevronRight, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate, formatInitials } from '../../utils/formatters';
import { Card, Badge, Modal, Button } from '../../components/ui';
import toast from 'react-hot-toast';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketCategory = 'technical' | 'billing' | 'account' | 'general';

interface Ticket {
  id: string;
  code: string;
  userName: string;
  userEmail: string;
  userRole: 'tenant' | 'agency';
  subject: string;
  body: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  adminReply?: string;
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; icon: React.ReactNode }> = {
  open: { label: 'Aperto', variant: 'warning', icon: <AlertCircle size={14} /> },
  in_progress: { label: 'In lavorazione', variant: 'info', icon: <Clock size={14} /> },
  resolved: { label: 'Risolto', variant: 'success', icon: <CheckCircle size={14} /> },
  closed: { label: 'Chiuso', variant: 'neutral', icon: <XCircle size={14} /> },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: 'Bassa', color: 'text-green-600' },
  medium: { label: 'Media', color: 'text-yellow-600' },
  high: { label: 'Alta', color: 'text-orange-600' },
  urgent: { label: 'Urgente', color: 'text-red-600' },
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  technical: 'Tecnico',
  billing: 'Pagamenti',
  account: 'Account',
  general: 'Generale',
};

const MOCK_TICKETS: Ticket[] = [
  { id: '1', code: 'TKT-001', userName: 'Marco Rossi', userEmail: 'marco@email.it', userRole: 'tenant', subject: 'Non riesco ad accedere al mio account', body: 'Da ieri non riesco più ad accedere. Ho provato a reimpostare la password ma non funziona.', status: 'open', priority: 'high', category: 'account', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '2', code: 'TKT-002', userName: 'Immobiliare Futura', userEmail: 'info@futura.it', userRole: 'agency', subject: 'Addebito crediti errato', body: 'Mi sono stati addebitati 5 crediti invece di 1 per lo sblocco del profilo.', status: 'in_progress', priority: 'urgent', category: 'billing', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: '3', code: 'TKT-003', userName: 'Giulia Bianchi', userEmail: 'giulia@email.it', userRole: 'tenant', subject: 'Come caricare il video di presentazione?', body: 'Non trovo il pulsante per caricare il video nel mio profilo.', status: 'resolved', priority: 'low', category: 'technical', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(), adminReply: 'Il pulsante per il video si trova nella sezione "Il Mio Profilo" > scheda "Video". Puoi caricare un video MP4 fino a 50MB.' },
  { id: '4', code: 'TKT-004', userName: 'Casa e Dintorni SRL', userEmail: 'admin@casadintorni.it', userRole: 'agency', subject: 'Piano professionale non attivato', body: 'Ho pagato il piano professionale ieri ma il mio account mostra ancora il piano base.', status: 'open', priority: 'urgent', category: 'billing', createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: '5', code: 'TKT-005', userName: 'Luca Verdi', userEmail: 'luca@email.it', userRole: 'tenant', subject: 'Candidatura non inviata', body: 'Ho cliccato su "Candidati" ma non ricevo nessuna conferma. La candidatura è stata registrata?', status: 'in_progress', priority: 'medium', category: 'technical', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '6', code: 'TKT-006', userName: 'Sara Neri', userEmail: 'sara@email.it', userRole: 'tenant', subject: 'Richiesta cancellazione account', body: 'Vorrei cancellare il mio account e tutti i dati associati per GDPR.', status: 'open', priority: 'medium', category: 'account', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: '7', code: 'TKT-007', userName: 'Immobili Milano', userEmail: 'info@immobilimilano.it', userRole: 'agency', subject: 'Annuncio non pubblicato', body: 'Ho creato un nuovo annuncio 2 giorni fa ma non appare nella ricerca pubblica.', status: 'resolved', priority: 'high', category: 'technical', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(), adminReply: 'Gli annunci nuovi vengono moderati entro 24h. Il tuo annuncio è ora visibile.' },
  { id: '8', code: 'TKT-008', userName: 'Filippo Romano', userEmail: 'filippo@email.it', userRole: 'tenant', subject: 'Domanda generale sul servizio', body: 'Come funziona il matching con le agenzie? Ho compilato tutto il profilo ma non ricevo contatti.', status: 'closed', priority: 'low', category: 'general', createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 13 * 86400000).toISOString(), adminReply: 'Il matching avviene quando le agenzie cercano inquilini che corrispondono al tuo profilo. Assicurati che il profilo sia verificato per massimizzare la visibilità.' },
];

const PAGE_SIZE = 10;

export default function AdminTicketsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (search) {
        const s = search.toLowerCase();
        if (!t.userName.toLowerCase().includes(s) && !t.subject.toLowerCase().includes(s) && !t.code.toLowerCase().includes(s)) return false;
      }
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSendReply = () => {
    if (!reply.trim() || !selected) return;
    setTickets(prev => prev.map(t =>
      t.id === selected.id ? { ...t, adminReply: reply, status: 'resolved' as TicketStatus, updatedAt: new Date().toISOString() } : t
    ));
    setSelected(prev => prev ? { ...prev, adminReply: reply, status: 'resolved', updatedAt: new Date().toISOString() } : null);
    setReply('');
    toast.success('Risposta inviata · ticket contrassegnato come risolto');
  };

  const handleChangeStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    if (selected?.id === ticketId) setSelected(prev => prev ? { ...prev, status } : null);
    toast.success(`Stato aggiornato: ${STATUS_CONFIG[status].label}`);
  };

  const counts = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  }), [tickets]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Ticket di Supporto</h1>
        <p className="text-text-secondary">Gestisci le richieste di supporto di inquilini e agenzie</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Aperti', value: counts.open, color: 'text-yellow-600' },
          { label: 'In lavorazione', value: counts.in_progress, color: 'text-blue-600' },
          { label: 'Risolti', value: counts.resolved, color: 'text-green-600' },
          { label: 'Urgenti', value: counts.urgent, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" placeholder="Cerca per codice, utente o oggetto..." className="input pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input sm:w-44" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as TicketStatus | ''); setPage(1); }}>
            <option value="">Tutti gli stati</option>
            {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
          <select className="input sm:w-36" value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value as TicketPriority | ''); setPage(1); }}>
            <option value="">Priorità</option>
            {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
          </select>
        </div>
      </Card>

      {/* Ticket list */}
      <div className="space-y-3">
        {paginated.map(t => (
          <Card
            key={t.id}
            className="p-4 cursor-pointer hover:shadow-medium transition-shadow"
            onClick={() => { setSelected(t); setReply(t.adminReply || ''); }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center">
                <MessageSquare size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-text-muted">{t.code}</span>
                  <Badge variant={STATUS_CONFIG[t.status].variant}>{STATUS_CONFIG[t.status].label}</Badge>
                  <span className={`text-xs font-semibold ${PRIORITY_CONFIG[t.priority].color}`}>● {PRIORITY_CONFIG[t.priority].label}</span>
                  <span className="text-xs bg-background-secondary px-2 py-0.5 rounded-full">{CATEGORY_LABELS[t.category]}</span>
                </div>
                <p className="font-medium text-text-primary truncate">{t.subject}</p>
                <p className="text-sm text-text-secondary truncate mt-0.5">{t.body}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span>{t.userName} · {t.userRole === 'agency' ? 'Agenzia' : 'Inquilino'}</span>
                  <span>·</span>
                  <span>{formatDate(t.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">{filtered.length} ticket · Pagina {page} di {totalPages}</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={16} /></button>
            <button className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selected && (
        <Modal isOpen onClose={() => setSelected(null)} title={`${selected.code} · ${selected.subject}`} size="lg">
          <div className="space-y-4 p-4">
            {/* Meta */}
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={STATUS_CONFIG[selected.status].variant}>{STATUS_CONFIG[selected.status].label}</Badge>
              <span className={`text-sm font-semibold ${PRIORITY_CONFIG[selected.priority].color}`}>● {PRIORITY_CONFIG[selected.priority].label}</span>
              <span className="text-sm text-text-muted">{CATEGORY_LABELS[selected.category]}</span>
              <span className="text-sm text-text-muted ml-auto">{formatDate(selected.createdAt)}</span>
            </div>

            {/* User info */}
            <div className="p-3 bg-background-secondary rounded-xl text-sm">
              <p className="font-medium">{selected.userName}</p>
              <p className="text-text-muted">{selected.userEmail} · {selected.userRole === 'agency' ? 'Agenzia' : 'Inquilino'}</p>
            </div>

            {/* Ticket body */}
            <div className="p-3 border border-border rounded-xl">
              <p className="text-sm text-text-secondary leading-relaxed">{selected.body}</p>
            </div>

            {/* Existing reply */}
            {selected.adminReply && (
              <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl">
                <p className="text-xs font-semibold text-primary-700 mb-1">Risposta Admin</p>
                <p className="text-sm text-text-primary leading-relaxed">{selected.adminReply}</p>
              </div>
            )}

            {/* Reply form */}
            {selected.status !== 'closed' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {selected.adminReply ? 'Aggiorna risposta' : 'Scrivi risposta'}
                </label>
                <textarea
                  rows={4}
                  className="input resize-none"
                  placeholder="Scrivi una risposta all'utente..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                {(['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map(s => (
                  <button
                    key={s}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selected.status === s ? 'bg-primary-600 text-white border-primary-600' : 'border-border hover:bg-background-secondary'}`}
                    onClick={() => handleChangeStatus(selected.id, s)}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
              {selected.status !== 'closed' && (
                <Button size="sm" className="ml-auto" leftIcon={<Send size={14} />} onClick={handleSendReply} disabled={!reply.trim()}>
                  Invia risposta
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
