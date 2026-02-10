export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: 'tenant' | 'agency';
    text: string;
    timestamp: string;
    read: boolean;
}

export interface Conversation {
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
