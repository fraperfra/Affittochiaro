import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../store';
import {
    generateMockConversations,
    generateMockMessages,
    STORAGE_KEY,
    CONVERSATIONS_KEY
} from '../services/mock/messages';
import { Conversation, Message } from '../types';

export function useChat() {
    const { user } = useAuthStore();
    const userRole = user?.role === 'agency' ? 'agency' : 'tenant';

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileList, setShowMobileList] = useState(true);
    const [filterListingId, setFilterListingId] = useState<string>('');

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
        if (!activeConversationId) return;
        const stored = localStorage.getItem(STORAGE_KEY + '_' + activeConversationId);
        if (stored) {
            setMessages(JSON.parse(stored));
        } else {
            const mock = generateMockMessages(activeConversationId, userRole);
            setMessages(mock);
            localStorage.setItem(STORAGE_KEY + '_' + activeConversationId, JSON.stringify(mock));
        }

        // Mark as read
        setConversations((prev) => {
            const updated = prev.map((c) =>
                c.id === activeConversationId ? { ...c, unreadCount: 0 } : c
            );
            localStorage.setItem(CONVERSATIONS_KEY + '_' + userRole, JSON.stringify(updated));
            return updated;
        });
    }, [activeConversationId, userRole]);

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

    const activeConv = conversations.find((c) => c.id === activeConversationId);
    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeConversationId) return;

        const msg: Message = {
            id: `msg_${Date.now()}`,
            conversationId: activeConversationId,
            senderId: 'self',
            senderRole: userRole,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
            read: false,
        };

        const updatedMessages = [...messages, msg];
        setMessages(updatedMessages);
        localStorage.setItem(STORAGE_KEY + '_' + activeConversationId, JSON.stringify(updatedMessages));

        // Update conversation's last message
        setConversations((prev) => {
            const updated = prev.map((c) =>
                c.id === activeConversationId
                    ? { ...c, lastMessage: newMessage.trim(), lastMessageTime: msg.timestamp }
                    : c
            );
            localStorage.setItem(CONVERSATIONS_KEY + '_' + userRole, JSON.stringify(updated));
            return updated;
        });

        setNewMessage('');
    };

    const openConversation = (convId: string) => {
        setActiveConversationId(convId);
        setShowMobileList(false);
    };

    return {
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        newMessage,
        setNewMessage,
        searchQuery,
        setSearchQuery,
        showMobileList,
        setShowMobileList,
        filterListingId,
        setFilterListingId,
        uniqueListings,
        filteredConversations,
        activeConv,
        totalUnread,
        handleSendMessage,
        openConversation,
        userRole
    };
}
