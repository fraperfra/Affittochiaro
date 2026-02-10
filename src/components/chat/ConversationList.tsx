import { Search, Building2, Home } from 'lucide-react';
import { formatInitials } from '../../utils/formatters';
import { Conversation } from '../../types';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    uniqueListings: { id: number; title: string }[];
    filterListingId: string;
    onFilterListingChange: (id: string) => void;
    className?: string;
    showMobileList?: boolean;
}

export function ConversationList({
    conversations,
    activeConversationId,
    onSelectConversation,
    searchQuery,
    onSearchChange,
    uniqueListings,
    filterListingId,
    onFilterListingChange,
    className = '',
    showMobileList = true
}: ConversationListProps) {
    return (
        <div className={`w-full lg:w-80 border-r border-border flex flex-col ${className} ${!showMobileList && activeConversationId ? 'hidden lg:flex' : 'flex'
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Listing filter (only for agency role with listings) */}
                {uniqueListings.length > 0 && (
                    <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <select
                            className="input pl-9 text-sm pr-8"
                            value={filterListingId}
                            onChange={(e) => onFilterListingChange(e.target.value)}
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
                {conversations.length > 0 ? (
                    conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelectConversation(conv.id)}
                            className={`w-full flex items-start gap-3 p-3 text-left hover:bg-background-secondary transition-colors border-b border-border/50 ${activeConversationId === conv.id ? 'bg-primary-50' : ''
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
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'
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
    );
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
