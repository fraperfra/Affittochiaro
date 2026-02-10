import React, { useState } from 'react';
import { useChat } from '../src/hooks/useChat';
import { ChatWindow, ConversationList } from '../src/components/chat';
import { useAuthStore } from '../src/store';
import { X } from 'lucide-react';

export const ChatButton: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    searchQuery,
    setSearchQuery,
    uniqueListings,
    filterListingId,
    setFilterListingId,
    activeConv
  } = useChat();

  return (
    <>
      {/* Widget Window */}
      {/* Widget Window */}
      {isOpen && (
        <div className={`fixed z-[200] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all animate-slide-up
          left-4 right-4 top-24 md:left-auto md:top-auto md:right-10 md:w-[380px] md:h-[600px]
          ${isAuthenticated ? 'bottom-[140px] md:bottom-[150px]' : 'bottom-[240px] md:bottom-[250px]'}`}
        >

          {/* Header del Widget se siamo nella lista conversazioni (per chiudere o titolo) */}
          {!activeConversationId && (
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-brand-green/5">
              <h3 className="font-bold text-brand-green">Messaggi</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/5 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          )}

          {activeConversationId ? (
            <ChatWindow
              activeConversation={activeConv}
              messages={messages}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveConversationId(null)}
              showMobileList={false}
              className="h-full"
            />
          ) : (
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              uniqueListings={uniqueListings}
              filterListingId={filterListingId}
              onFilterListingChange={setFilterListingId}
              className="h-full w-full"
              showMobileList={true}
            />
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 z-[100] bg-[#00D094] text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-transform md:right-10
          ${isAuthenticated ? 'bottom-6 md:bottom-10' : 'bottom-[104px] md:bottom-[104px]'}`}
        aria-label="Chat"
      >
        {isOpen ? (
          <X className="w-12 h-12" />
        ) : (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
        )}
        <span className="font-bold text-sm uppercase tracking-tighter">{isOpen ? 'CHIUDI' : 'CHAT'}</span>
      </button>
    </>
  );
};
