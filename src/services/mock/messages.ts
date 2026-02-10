import { Conversation, Message } from '../../types';

export const STORAGE_KEY = 'affittochiaro_messages';
export const CONVERSATIONS_KEY = 'affittochiaro_conversations';

export function generateMockConversations(userRole: 'tenant' | 'agency'): Conversation[] {
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

export function generateMockMessages(conversationId: string, userRole: 'tenant' | 'agency'): Message[] {
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
