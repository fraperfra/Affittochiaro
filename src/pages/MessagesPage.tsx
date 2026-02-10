import { Card } from '../components/ui';
import { ConversationList, ChatWindow } from '../components/chat';
import { useChat } from '../hooks';

export default function MessagesPage() {
  const {
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
  } = useChat();

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
          <ConversationList
            conversations={filteredConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={openConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            uniqueListings={uniqueListings}
            filterListingId={filterListingId}
            onFilterListingChange={setFilterListingId}
            showMobileList={showMobileList}
          />

          {/* Chat Area */}
          <ChatWindow
            activeConversation={activeConv}
            messages={messages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setShowMobileList(true);
              setActiveConversationId(null);
            }}
            showMobileList={showMobileList}
          />
        </div>
      </Card>
    </div>
  );
}
