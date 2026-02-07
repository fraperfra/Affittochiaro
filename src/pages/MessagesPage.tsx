import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  CheckCheck,
  Clock,
  Building2,
  User,
  Paperclip,
  Smile,
  Phone,
  Trash2,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { TenantUser, AgencyUser } from '../types';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { formatInitials } from '../utils/formatters';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'tenant' | 'agency';
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'tenant' | 'agency';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  listingId?: number;
  listingTitle?: string;
}

const STORAGE_KEY = 'affittochiaro_messages';
const CONVERSATIONS_KEY = 'affittochiaro_conversations';

// Generate mock conversations based on user role
function generateMockConversations(userRole: 'tenant' | 'agency'): Conversation[] {
  if (userRole === 'tenant') {
    return [
      {
        id: 'conv_1',
        participantId: 'agency_1',
        participantName: 'Immobiliare Milano Srl',
        participantRole: 'agency',
        lastMessage: 'Buongiorno! Abbiamo visto il suo profilo e potrebbe essere interessato ad un trilocale in Zona Navigli.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 'conv_2',
        participantId: 'agency_2',
        participantName: 'Casa&Affitti Roma',
        participantRole: 'agency',
        lastMessage: 'La ringraziamo per la candidatura. Le faremo sapere entro la settimana.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 'conv_3',
        participantId: 'agency_3',
        participantName: 'Gruppo Immobiliare Torino',
        participantRole: 'agency',
        lastMessage: 'Perfetto, le confermo la visita per giovedi alle 16:00.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        unreadCount: 1,
        isOnline: true,
      },
      {
        id: 'conv_4',
        participantId: 'agency_4',
        participantName: 'Tecnocasa Firenze',
        participantRole: 'agency',
        lastMessage: 'Grazie per le informazioni. Le invieremo i documenti da compilare.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        unreadCount: 0,
        isOnline: false,
      },
    ];
  }
  return [
    {
      id: 'conv_1',
      participantId: 'tenant_1',
      participantName: 'Marco Rossi',
      participantRole: 'tenant',
      lastMessage: 'Buongiorno, sarei interessato al bilocale in Via Dante. E ancora disponibile?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      unreadCount: 1,
      isOnline: true,
      listingId: 1,
      listingTitle: 'Bilocale luminoso in zona Navigli',
    },
    {
      id: 'conv_2',
      participantId: 'tenant_2',
      participantName: 'Laura Bianchi',
      participantRole: 'tenant',
      lastMessage: 'Grazie mille per la disponibilita. A giovedi!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      unreadCount: 0,
      isOnline: false,
      listingId: 2,
      listingTitle: 'Trilocale con terrazzo zona Porta Romana',
    },
    {
      id: 'conv_3',
      participantId: 'tenant_3',
      participantName: 'Giuseppe Verdi',
      participantRole: 'tenant',
      lastMessage: 'Ho inviato la documentazione richiesta. Puo verificare?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      unreadCount: 3,
      isOnline: true,
      listingId: 1,
      listingTitle: 'Bilocale luminoso in zona Navigli',
    },
    {
      id: 'conv_4',
      participantId: 'tenant_4',
      participantName: 'Anna Ferrari',
      participantRole: 'tenant',
      lastMessage: 'Vorrei sapere se accettate animali domestici.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      unreadCount: 0,
      isOnline: false,
      listingId: 3,
      listingTitle: 'Monolocale arredato centro storico',
    },
    {
      id: 'conv_5',
      participantId: 'tenant_5',
      participantName: 'Paolo Conte',
      participantRole: 'tenant',
      lastMessage: 'Il contratto e stato firmato. Grazie per tutto!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      unreadCount: 0,
      isOnline: false,
      listingId: 4,
      listingTitle: 'Quadrilocale con box zona Isola',
    },
  ];
}

function generateMockMessages(conversationId: string, userRole: 'tenant' | 'agency'): Message[] {
  const now = Date.now();
  const otherRole = userRole === 'tenant' ? 'agency' : 'tenant';

  const templates: { text: string; fromSelf: boolean; minutesAgo: number }[] = [
    { text: 'Buongiorno! Come posso aiutarla?', fromSelf: userRole === 'agency', minutesAgo: 120 },
    { text: 'Buongiorno, ho visto il vostro annuncio per il bilocale in centro e sarei molto interessato.', fromSelf: userRole === 'tenant', minutesAgo: 115 },
    { text: 'Certo! L\'appartamento e ancora disponibile. Ha gia preparato la documentazione?', fromSelf: userRole === 'agency', minutesAgo: 100 },
    { text: 'Si, ho il mio CV dell\'inquilino completo su Affittochiaro con tutte le referenze.', fromSelf: userRole === 'tenant', minutesAgo: 90 },
    { text: 'Ottimo! Ho controllato il suo profilo e sembra perfetto. Quando sarebbe disponibile per una visita?', fromSelf: userRole === 'agency', minutesAgo: 60 },
    { text: 'Potrei venire giovedi o venerdi pomeriggio, che ne dice?', fromSelf: userRole === 'tenant', minutesAgo: 45 },
    { text: 'Giovedi alle 16:00 va benissimo. Le mando l\'indirizzo esatto.', fromSelf: userRole === 'agency', minutesAgo: 30 },
    { text: 'Perfetto, ci vediamo giovedi! Grazie.', fromSelf: userRole === 'tenant', minutesAgo: 20 },
  ];

  return templates.map((t, i) => ({
    id: `${conversationId}_msg_${i}`,
    conversationId,
    senderId: t.fromSelf ? 'self' : 'other',
    senderRole: t.fromSelf ? userRole : otherRole,
    text: t.text,
    timestamp: new Date(now - t.minutesAgo * 60 * 1000).toISOString(),
    read: true,
  }));
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ora';
  if (diffMins < 60) return `${diffMins} min fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays === 1) return 'Ieri';
  if (diffDays < 7) return `${diffDays}gg fa`;
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
}

function formatChatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const userRole = user?.role === 'agency' ? 'agency' : 'tenant';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [filterListingId, setFilterListingId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    const stored = localStorage.getItem(CONVERSATIONS_KEY + '_' + userRole);
    if (stored) {
      setConversations(JSON.parse(stored));
    } else {
      const mock = generateMockConversations(userRole);
      setConversations(mock);
      localStorage.setItem(CONVERSATIONS_KEY + '_' + userRole, JSON.stringify(mock));
    }
  }, [userRole]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversation) return;
    const stored = localStorage.getItem(STORAGE_KEY + '_' + activeConversation);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const mock = generateMockMessages(activeConversation, userRole);
      setMessages(mock);
      localStorage.setItem(STORAGE_KEY + '_' + activeConversation, JSON.stringify(mock));
    }

    // Mark as read
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === activeConversation ? { ...c, unreadCount: 0 } : c
      );
      localStorage.setItem(CONVERSATIONS_KEY + '_' + userRole, JSON.stringify(updated));
      return updated;
    });
  }, [activeConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Unique listings from conversations (for the filter dropdown)
  const uniqueListings = useMemo(() => {
    const map = new Map<number, string>();
    conversations.forEach(c => {
      if (c.listingId && c.listingTitle) {
        map.set(c.listingId, c.listingTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    let result = conversations;

    // Filter by listing
    if (filterListingId) {
      const lid = Number(filterListingId);
      result = result.filter(c => c.listingId === lid);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.participantName.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q) ||
          (c.listingTitle && c.listingTitle.toLowerCase().includes(q))
      );
    }

    return result;
  }, [conversations, searchQuery, filterListingId]);

  const activeConv = conversations.find((c) => c.id === activeConversation);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const msg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation,
      senderId: 'self',
      senderRole: userRole,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY + '_' + activeConversation, JSON.stringify(updatedMessages));

    // Update conversation's last message
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === activeConversation
          ? { ...c, lastMessage: newMessage.trim(), lastMessageTime: msg.timestamp }
          : c
      );
      localStorage.setItem(CONVERSATIONS_KEY + '_' + userRole, JSON.stringify(updated));
      return updated;
    });

    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openConversation = (convId: string) => {
    setActiveConversation(convId);
    setShowMobileList(false);
  };

  const getUserDisplayName = () => {
    if (!user) return 'Tu';
    if (user.role === 'tenant') {
      return `${(user as TenantUser).profile.firstName}`;
    }
    if (user.role === 'agency') {
      return (user as AgencyUser).agency.name;
    }
    return 'Tu';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Messaggi</h1>
          <p className="text-text-secondary">
            {totalUnread > 0 ? `${totalUnread} messaggi non letti` : 'Tutte le conversazioni'}
          </p>
        </div>
      </div>

      {/* Chat Layout */}
      <Card padding="none" className="overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`w-full lg:w-80 border-r border-border flex flex-col ${
            !showMobileList && activeConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Search + Filter */}
            <div className="p-3 border-b border-border space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Cerca conversazioni..."
                  className="input pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Listing filter (only for agency role with listings) */}
              {uniqueListings.length > 0 && (
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <select
                    className="input pl-9 text-sm pr-8"
                    value={filterListingId}
                    onChange={(e) => setFilterListingId(e.target.value)}
                  >
                    <option value="">Tutti gli immobili</option>
                    {uniqueListings.map(l => (
                      <option key={l.id} value={String(l.id)}>{l.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-background-secondary transition-colors border-b border-border/50 ${
                      activeConversation === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                        {conv.participantRole === 'agency' ? (
                          <Building2 size={18} />
                        ) : (
                          formatInitials(conv.participantName.split(' ')[0], conv.participantName.split(' ')[1])
                        )}
                      </div>
                      {conv.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold' : 'font-medium'}`}>
                          {conv.participantName}
                        </p>
                        <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                          {formatMessageTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      {/* Listing tag for agency conversations */}
                      {conv.listingTitle && (
                        <p className="text-[10px] text-primary-500 font-medium truncate mt-0.5 flex items-center gap-1">
                          <Home size={10} className="flex-shrink-0" />
                          {conv.listingTitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-xs truncate ${
                          conv.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'
                        }`}>
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 ml-2 w-5 h-5 text-[10px] font-bold bg-primary-500 text-white rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-text-muted text-sm">
                  Nessuna conversazione trovata
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${
            showMobileList && !activeConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <button
                    className="lg:hidden p-1 rounded-lg hover:bg-background-secondary"
                    onClick={() => { setShowMobileList(true); setActiveConversation(null); }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                      {activeConv.participantRole === 'agency' ? (
                        <Building2 size={18} />
                      ) : (
                        formatInitials(activeConv.participantName.split(' ')[0], activeConv.participantName.split(' ')[1])
                      )}
                    </div>
                    {activeConv.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">{activeConv.participantName}</p>
                    <p className="text-xs text-text-muted">
                      {activeConv.isOnline ? 'Online' : 'Offline'}
                      {activeConv.listingTitle && (
                        <span className="text-primary-500 ml-2">
                          — {activeConv.listingTitle}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background-secondary/30">
                  {messages.map((msg) => {
                    const isSelf = msg.senderId === 'self';
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isSelf
                              ? 'bg-primary-500 text-white rounded-br-sm'
                              : 'bg-white border border-border rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            isSelf ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={`text-[10px] ${
                              isSelf ? 'text-white/70' : 'text-text-muted'
                            }`}>
                              {formatChatTime(msg.timestamp)}
                            </span>
                            {isSelf && (
                              <CheckCheck size={12} className={msg.read ? 'text-blue-200' : 'text-white/50'} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border bg-white">
                  <div className="flex items-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-background-secondary text-text-muted" title="Allega file">
                      <Paperclip size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Scrivi un messaggio..."
                        className="input resize-none text-sm min-h-[40px] max-h-[120px] py-2.5 pr-10"
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="!rounded-full !p-2.5"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state when no conversation selected */
              <div className="flex-1 flex items-center justify-center bg-background-secondary/30">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-text-muted" />
                  </div>
                  <h3 className="font-semibold text-text-primary">I tuoi messaggi</h3>
                  <p className="text-sm text-text-muted mt-1">
                    Seleziona una conversazione per iniziare
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
