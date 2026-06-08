import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../src/store';
import {
  ArrowLeft, LayoutDashboard, Menu, X,
  MessageCircle, Send, Sparkles,
} from 'lucide-react';
import BottomTabNav from '../src/components/layout/BottomTabNav';

const NAV_LINKS = [
  { to: '/case-e-stanze-in-affitto', label: 'Annunci' },
  { to: '/cerca-inquilino', label: 'Cerca Inquilino' },
  { to: '/come-funziona', label: 'Come Funziona' },
  { to: '/servizi', label: 'Servizi' },
  { to: '/agenzie', label: 'Agenzie' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/guide-affitto', label: 'News' },
];

interface ChatMsg { from: 'user' | 'bot'; text: string }

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { from: 'bot', text: 'Ciao! Sono l\'assistente di AffittoChiaro. Come posso aiutarti oggi?' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMsgs(m => [
      ...m,
      { from: 'user', text },
      { from: 'bot', text: 'Grazie per il tuo messaggio! Un nostro operatore ti risponderà al più presto.' },
    ]);
    setChatInput('');
  };

  return (
    <>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm bg-white"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <header className="relative bg-white/95 backdrop-blur-md px-4 md:px-8 h-20 flex items-center justify-center md:justify-between border-b border-gray-100">

          {/* Logo — sinistra su tutti gli schermi */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-[52px] md:h-[72px] md:mt-[3px] w-auto" />
          </Link>

          {/* Desktop: nav + bottoni a destra */}
          <nav className="hidden md:flex items-center gap-4 xl:gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-wider ${isActive(link.to) ? 'text-action-green' : 'text-brand-green'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-green/10"
              >
                TROVA CASA
              </Link>
              <Link
                to="/login"
                className="text-brand-green px-2 font-bold text-sm hover:text-action-green transition-colors"
              >
                Accedi
              </Link>
            </div>
          </nav>
        </header>

        {/* ── Banner Torna alla dashboard ──────────────── */}
        {isAuthenticated && user && (
          <div className="bg-primary-50 border-b border-primary-100 px-4 md:px-8 py-3 flex items-center justify-between gap-3 shadow-md relative z-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LayoutDashboard size={16} className="text-primary-600 shrink-0" />
              <span className="hidden sm:inline">Stai navigando come <span className="font-semibold text-gray-900">{(user as any).profile?.firstName || user?.email}</span></span>
            </div>
            <button
              onClick={() => navigate(user.role === 'tenant' ? '/tenant/listings' : user.role === 'agency' ? '/agency' : '/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shrink-0"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Torna alla dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </div>
        )}
      </div>


      {/* ── Mobile Bottom Nav + Chat (hidden on md+) ────────────────────── */}
      <div className="md:hidden">

        {/* Blur backdrop — covers page below header when menu is open */}
        <div
          className={`fixed left-0 right-0 bottom-0 z-[95] ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            top: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.18)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Chat FAB — positioned above the nav bar, right side */}
        <button
          onClick={() => setShowChat(v => !v)}
          className="chat-fab fixed z-[130] w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center shadow-lg shadow-brand-green/30 active:scale-95 transition-transform"
          style={{
            right: '18px',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px + 12px)',
          }}
          aria-label="Apri chat"
        >
          {showChat ? <X size={19} /> : <MessageCircle size={19} />}
        </button>

        {/* ── Authenticated: dashboard BottomTabNav ── */}
        {isAuthenticated && user ? (
          <div className="mobile-nav-bar">
            <BottomTabNav userRole={user.role as 'tenant' | 'agency' | 'landlord' | 'admin'} />
          </div>
        ) : (
          /* ── Guest: expandable pill nav — grows upward from the button row ── */
          <nav
            className="mobile-nav-bar fixed left-0 right-0 z-[100]"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
            aria-label="Navigazione mobile"
          >
            <div
              className="mx-3 bg-white border border-gray-100 rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {/* Nav links + legal — expands upward above the button row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: mobileOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
              <div style={{ overflow: 'hidden', minHeight: 0 }}>
                {/* Logo header inside the drawer */}
                <div className="flex items-center justify-center px-6 pt-5 pb-3">
                  <Link to="/" onClick={() => setMobileOpen(false)}>
                    <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-10 w-auto" />
                  </Link>
                </div>
                <div className="border-t border-gray-100" />

                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                      isActive(link.to)
                        ? 'text-action-green bg-primary-50 border-l-4 border-action-green'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 px-6 py-3 flex flex-wrap gap-x-5 gap-y-2">
                  <Link to="/privacy-policy" onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-brand-green transition-colors">Privacy Policy</Link>
                  <Link to="/termini-di-servizio" onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-brand-green transition-colors">Termini e Condizioni</Link>
                  <Link to="/cookie-policy" onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-brand-green transition-colors">Cookie Policy</Link>
                </div>
              </div>
              </div>

              {/* Separator */}
              <div
                className="border-t border-gray-100 mx-0"
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              />

              {/* Always visible: Trova Casa · Accedi · Menu */}
              <div className="flex items-center" style={{ height: '64px' }}>
                {/* Trova Casa */}
                <Link
                  to="/register"
                  className="flex items-center justify-center flex-1 h-full px-3 active:scale-95 transition-transform"
                >
                  <span className="bg-brand-green text-white text-sm font-bold px-5 py-3 rounded-xl whitespace-nowrap shadow-sm shadow-brand-green/20">
                    Trova Casa
                  </span>
                </Link>

                {/* Accedi */}
                <Link
                  to="/login"
                  className="flex items-center justify-center flex-1 h-full px-3 active:scale-95 transition-transform"
                >
                  <span className="border border-brand-green/40 text-brand-green text-sm font-bold px-5 py-3 rounded-xl whitespace-nowrap">
                    Accedi
                  </span>
                </Link>

                {/* Menu */}
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  className={`flex flex-col items-center justify-center flex-1 h-full rounded-r-2xl transition-colors active:scale-95 ${mobileOpen ? 'text-teal-500' : 'text-gray-400'}`}
                  aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                  <span className={`mt-0.5 text-[11px] leading-tight font-medium ${mobileOpen ? 'text-teal-500 font-semibold' : 'text-gray-500'}`}>
                    Menu
                  </span>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* ── Chat Widget ─────────────────────────────────────────────────── */}
      {showChat && (
        <div
          className="md:hidden fixed z-[140] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            right: '12px',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px + 56px)',
            width: 'calc(100vw - 24px)',
            maxWidth: '340px',
            height: '380px',
          }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-brand-green shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Assistente AffittoChiaro</p>
              <p className="text-green-200 text-[11px]">Online</p>
            </div>
            <button onClick={() => setShowChat(false)} className="ml-auto text-white/70 hover:text-white shrink-0">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-gray-50">
            {chatMsgs.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-snug ${msg.from === 'user'
                      ? 'bg-brand-green text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-3 py-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Scrivi un messaggio..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-xl bg-brand-green text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
