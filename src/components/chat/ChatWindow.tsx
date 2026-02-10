import {
    Send,
    ArrowLeft,
    Building2,
    Paperclip,
    CheckCheck
} from 'lucide-react';
import { Button } from '../ui';
import { formatInitials } from '../../utils/formatters';
import { Conversation, Message } from '../../types';
import { useEffect, useRef } from 'react';

interface ChatWindowProps {
    activeConversation: Conversation | undefined;
    messages: Message[];
    newMessage: string;
    onNewMessageChange: (text: string) => void;
    onSendMessage: () => void;
    onBack: () => void;
    showMobileList: boolean;
    className?: string;
}

export function ChatWindow({
    activeConversation,
    messages,
    newMessage,
    onNewMessageChange,
    onSendMessage,
    onBack,
    showMobileList,
    className = ''
}: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const formatChatTime = (timestamp: string): string => {
        return new Date(timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex-1 flex flex-col ${className} ${showMobileList && !activeConversation ? 'hidden lg:flex' : 'flex'
            }`}>
            {activeConversation ? (
                <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <button
                            className="lg:hidden p-1 rounded-lg hover:bg-background-secondary"
                            onClick={onBack}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                                {activeConversation.participantRole === 'agency' ? (
                                    <Building2 size={18} />
                                ) : (
                                    formatInitials(activeConversation.participantName.split(' ')[0], activeConversation.participantName.split(' ')[1])
                                )}
                            </div>
                            {activeConversation.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-text-primary">{activeConversation.participantName}</p>
                            <p className="text-xs text-text-muted">
                                {activeConversation.isOnline ? 'Online' : 'Offline'}
                                {activeConversation.listingTitle && (
                                    <span className="text-primary-500 ml-2">
                                        — {activeConversation.listingTitle}
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
                                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isSelf
                                                ? 'bg-primary-500 text-white rounded-br-sm'
                                                : 'bg-white border border-border rounded-bl-sm'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        <div className={`flex items-center gap-1 mt-1 ${isSelf ? 'justify-end' : 'justify-start'
                                            }`}>
                                            <span className={`text-[10px] ${isSelf ? 'text-white/70' : 'text-text-muted'
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
                                    onChange={(e) => onNewMessageChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <Button
                                size="sm"
                                onClick={onSendMessage}
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
    );
}
