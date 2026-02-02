import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNotifications } from './hooks';
import {
  Header,
  MobileMenu,
  LiveNotifications,
  Footer,
  StickyBottomBar,
  ChatButton,
  ExitIntentPopup,
} from './components';
import {
  HomePage,
  AnnunciPage,
  ComeFunzionaPage,
  FAQPage,
  NotFoundPage,
} from './pages';

const AppContent: React.FC = () => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const [activeCityName, setActiveCityName] = useState('Roma');

  // Custom hook for notifications
  const { notifications, counter, dismissNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-action-green/30 overflow-x-hidden relative">
      {/* Mobile Menu Modal */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header */}
      <Header />

      {/* Live Notifications */}
      <LiveNotifications notifications={notifications} onDismiss={dismissNotification} />

      {/* Main Content */}
      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                counter={counter}
                activeCityName={activeCityName}
                onCityChange={setActiveCityName}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            }
          />
          <Route path="/annunci" element={<AnnunciPage />} />
          <Route path="/come-funziona" element={<ComeFunzionaPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Elements */}
      <StickyBottomBar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <ChatButton />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
