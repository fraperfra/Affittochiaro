import { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  Home,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  Bell,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Euro,
  PawPrint,
  Cigarette,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';
import { formatDate, formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface Application {
  id: string;
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
  listingId: number;
  listingTitle: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'contacted';
}

interface AgencyNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  applicantName: string;
  listingTitle: string;
  listingId: number;
  applicationId: string;
  createdAt: string;
  read: boolean;
}

const statusConfig = {
  pending: { label: 'In Attesa', variant: 'warning' as const, icon: Clock },
  contacted: { label: 'Contattato', variant: 'info' as const, icon: Phone },
  accepted: { label: 'Accettato', variant: 'success' as const, icon: CheckCircle },
  rejected: { label: 'Rifiutato', variant: 'error' as const, icon: XCircle },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AgencyNotification[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Load applications and notifications from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedApplications = localStorage.getItem('affittochiaro_applications');
      const storedNotifications = localStorage.getItem('affittochiaro_agency_notifications');

      if (storedApplications) {
        setApplications(JSON.parse(storedApplications));
      }
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };

    loadData();

    // Poll for new applications every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  const filteredApplications = applications.filter(app => {
    if (filterStatus && app.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.firstName.toLowerCase().includes(query) ||
        app.lastName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.listingTitle.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('affittochiaro_applications', JSON.stringify(updatedApplications));

    const statusLabels = {
      pending: 'In attesa',
      contacted: 'Contattato',
      accepted: 'Accettato',
      rejected: 'Rifiutato',
    };

    toast.success(`Candidatura segnata come "${statusLabels[newStatus]}"`);
  };

  const handleDeleteApplication = (applicationId: string) => {
    const updatedApplications = applications.filter(app => app.id !== applicationId);
    setApplications(updatedApplications);
    localStorage.setItem('affittochiaro_applications', JSON.stringify(updatedApplications));
    toast.success('Candidatura eliminata');
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify(updatedNotifications));
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Stats
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const contactedCount = applications.filter(a => a.status === 'contacted').length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Candidature Ricevute</h1>
          <p className="text-text-secondary">
            {applications.length} candidature totali
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-background-secondary hover:bg-background-tertiary transition-colors"
            >
              <Bell size={20} className="text-text-secondary" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-50 overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Notifiche</h3>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-primary-500 hover:text-primary-600"
                      >
                        Segna tutte lette
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-text-muted text-sm">Nessuna notifica</p>
                    ) : (
                      notifications.slice(0, 10).map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-background-secondary transition-colors ${
                            !notification.read ? 'bg-primary-50' : ''
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            const app = applications.find(a => a.id === notification.applicationId);
                            if (app) setSelectedApplication(app);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-primary-500' : 'bg-gray-300'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{notification.title}</p>
                              <p className="text-xs text-text-muted truncate">{notification.message}</p>
                              <p className="text-xs text-text-muted mt-1">
                                {formatDateTime(new Date(notification.createdAt))}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">{applications.length}</p>
          <p className="text-text-muted text-sm">Totale</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-warning">{pendingCount}</p>
          <p className="text-text-muted text-sm">In Attesa</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-info">{contactedCount}</p>
          <p className="text-text-muted text-sm">Contattati</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">{acceptedCount}</p>
          <p className="text-text-muted text-sm">Accettati</p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca per nome, email o annuncio..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tutti gli stati</option>
            <option value="pending">In Attesa</option>
            <option value="contacted">Contattati</option>
            <option value="accepted">Accettati</option>
            <option value="rejected">Rifiutati</option>
          </select>
        </div>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const isExpanded = expandedIds.has(application.id);
            const StatusIcon = statusConfig[application.status].icon;

            return (
              <Card key={application.id} padding="none" className="overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-background-secondary/50 transition-colors"
                  onClick={() => toggleExpand(application.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-primary">
                          {application.firstName} {application.lastName}
                        </h3>
                        <Badge variant={statusConfig[application.status].variant}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusConfig[application.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted truncate">
                        Candidatura per: <span className="text-primary-600 font-medium">{application.listingTitle}</span>
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-text-muted">
                        {formatDateTime(new Date(application.submittedAt))}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-background-secondary rounded-lg">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-background-secondary/30 animate-slideDown">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-text-primary flex items-center gap-2">
                          <User size={16} /> Contatti
                        </h4>
                        <div className="space-y-2">
                          <a
                            href={`mailto:${application.email}`}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary-500"
                          >
                            <Mail size={14} />
                            {application.email}
                          </a>
                          <a
                            href={`tel:${application.phone}`}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary-500"
                          >
                            <Phone size={14} />
                            {application.phone}
                          </a>
                        </div>
                      </div>

                      {/* Employment Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-text-primary flex items-center gap-2">
                          <Briefcase size={16} /> Lavoro
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-text-muted">Occupazione:</span> {application.occupation}</p>
                          <p><span className="text-text-muted">Contratto:</span> {application.employmentType}</p>
                          <p className="flex items-center gap-1">
                            <span className="text-text-muted">Reddito:</span>
                            <span className="font-medium text-success">{application.monthlyIncome}</span>
                          </p>
                        </div>
                      </div>

                      {/* Housing Preferences */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-text-primary flex items-center gap-2">
                          <Home size={16} /> Preferenze
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-1">
                            <Calendar size={14} className="text-text-muted" />
                            <span className="text-text-muted">Ingresso:</span> {application.moveInDate}
                          </p>
                          <p><span className="text-text-muted">Durata:</span> {application.stayDuration}</p>
                          <p className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 ${application.hasPets ? 'text-warning' : 'text-text-muted'}`}>
                              <PawPrint size={14} />
                              {application.hasPets ? application.petDetails : 'No animali'}
                            </span>
                            <span className={`flex items-center gap-1 ${application.isSmoker ? 'text-warning' : 'text-text-muted'}`}>
                              <Cigarette size={14} />
                              {application.isSmoker ? 'Fumatore' : 'Non fumatore'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-text-primary flex items-center gap-2">
                          <MessageSquare size={16} /> Presentazione
                        </h4>
                        <p className="text-sm text-text-secondary bg-white p-3 rounded-lg border border-border">
                          "{application.message}"
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                      {application.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(application.id, 'contacted')}
                          leftIcon={<Phone size={14} />}
                        >
                          Segna Contattato
                        </Button>
                      )}
                      {(application.status === 'pending' || application.status === 'contacted') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            leftIcon={<CheckCircle size={14} />}
                          >
                            Accetta
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="text-error hover:bg-red-50"
                            leftIcon={<XCircle size={14} />}
                          >
                            Rifiuta
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedApplication(application)}
                        leftIcon={<Eye size={14} />}
                      >
                        Dettagli
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-error hover:bg-red-50 ml-auto"
                        onClick={() => handleDeleteApplication(application.id)}
                        leftIcon={<Trash2 size={14} />}
                      >
                        Elimina
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="📩"
          title="Nessuna candidatura"
          description={searchQuery || filterStatus ? "Prova a modificare i filtri" : "Le candidature inviate dagli inquilini appariranno qui"}
        />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title="Dettaglio Candidatura"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Applicant Header */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-teal-50 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                {selectedApplication.firstName.charAt(0)}{selectedApplication.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </h3>
                <p className="text-text-secondary">{selectedApplication.occupation}</p>
                <Badge variant={statusConfig[selectedApplication.status].variant} className="mt-1">
                  {statusConfig[selectedApplication.status].label}
                </Badge>
              </div>
            </div>

            {/* Listing Info */}
            <div className="p-4 bg-background-secondary rounded-xl">
              <p className="text-sm text-text-muted mb-1">Candidatura per</p>
              <p className="font-semibold text-primary-600">{selectedApplication.listingTitle}</p>
              <p className="text-sm text-text-muted mt-1">
                Inviata il {formatDateTime(new Date(selectedApplication.submittedAt))}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Mail size={16} className="text-primary-500" /> Contatti
                </h4>
                <p className="text-sm">{selectedApplication.email}</p>
                <p className="text-sm">{selectedApplication.phone}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Briefcase size={16} className="text-primary-500" /> Lavoro
                </h4>
                <p className="text-sm">{selectedApplication.occupation}</p>
                <p className="text-sm">{selectedApplication.employmentType}</p>
                <p className="text-sm font-medium text-success">{selectedApplication.monthlyIncome}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar size={16} className="text-primary-500" /> Tempistiche
                </h4>
                <p className="text-sm">Ingresso: {selectedApplication.moveInDate}</p>
                <p className="text-sm">Durata: {selectedApplication.stayDuration}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Home size={16} className="text-primary-500" /> Preferenze
                </h4>
                <p className="text-sm">
                  Animali: {selectedApplication.hasPets ? selectedApplication.petDetails : 'No'}
                </p>
                <p className="text-sm">
                  Fumatore: {selectedApplication.isSmoker ? 'Si' : 'No'}
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-primary-500" /> Messaggio
              </h4>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-secondary italic">"{selectedApplication.message}"</p>
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedApplication(null)}>
            Chiudi
          </Button>
          {selectedApplication && (
            <Button
              onClick={() => window.location.href = `mailto:${selectedApplication.email}`}
              leftIcon={<Mail size={16} />}
            >
              Contatta via Email
            </Button>
          )}
        </ModalFooter>
      </Modal>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}
