import { getAccessToken } from '../api/client';

type MessageHandler = (data: any) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private listeners: Map<string, MessageHandler[]> = new Map();
    private reconnectInterval: number = 3000;
    private maxReconnectAttempts: number = 5;
    private reconnectAttempts: number = 0;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN) return;

        const token = getAccessToken();
        const wsUrl = `${this.url}?token=${token}`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
            this.reconnectAttempts = 0;
            this.notify('connection', { status: 'connected' });
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.notify(data.type, data.payload);
            } catch (e) {
                console.error('WebSocket message parse error', e);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
            this.notify('connection', { status: 'disconnected' });
            this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error', error);
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}`);
                this.reconnectAttempts++;
                this.connect();
            }, this.reconnectInterval);
        }
    }

    subscribe(type: string, handler: MessageHandler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)?.push(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.listeners.get(type);
            if (handlers) {
                this.listeners.set(
                    type,
                    handlers.filter((h) => h !== handler)
                );
            }
        };
    }

    send(type: string, payload: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        } else {
            console.warn('WebSocket not connected. Message not sent.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    private notify(type: string, data: any) {
        const handlers = this.listeners.get(type);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }
}

// Export singleton instance
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
export const wsService = new WebSocketService(WS_URL);
