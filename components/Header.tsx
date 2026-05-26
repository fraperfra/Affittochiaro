import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../src/store';
import {
  ArrowLeft, LayoutDashboard, Menu, X,
  Megaphone, Search as SearchIcon,
  MessageCircle, Send, Sparkles,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/case-e-stanze-in-affitto', label: 'Annunci' },
  { to: '/cerca-inquilino', label: 'Cerca Inquilino' },
  { to: '/servizi', label: 'Servizi' },
  { to: '/agenzie', label: 'Agenzie' },
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
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
          <Link to="/" className="flex items-center md:static md:translate-x-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-[75px] md:h-[72px] md:mt-[3px] w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive(link.to) ? 'text-action-green' : 'text-brand-green'}`}
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
                className="text-brand-green bg-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all border border-brand-green/30"
              >
                ACCEDI
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

      {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[110] md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        style={{ top: 'calc(5rem + env(safe-area-inset-top, 0px))' }}
      />

      {/* Slide panel */}
      <div
        className={`fixed right-0 w-[280px] bg-white z-[120] md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          top: 'calc(5rem + env(safe-area-inset-top, 0px))',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px)',
        }}
      >
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors ${isActive(link.to)
                    ? 'text-action-green bg-primary-50 border-r-4 border-action-green'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* ── Mobile Bottom Nav + Chat (hidden on md+) ────────────────────── */}
      <div className="md:hidden">

        {/* Chat FAB — positioned above the nav bar, right side */}
        <button
          onClick={() => setShowChat(v => !v)}
          className="fixed z-[130] w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center shadow-lg shadow-brand-green/30 active:scale-95 transition-transform"
          style={{
            right: '18px',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 74px + 12px)',
          }}
          aria-label="Apri chat"
        >
          {showChat ? <X size={19} /> : <MessageCircle size={19} />}
        </button>

        {/* Bottom Nav Bar */}
        <nav
          className="fixed left-0 right-0 z-[100]"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
          aria-label="Navigazione mobile"
        >
          <div
            className="mx-3 flex items-center bg-white border border-gray-100 rounded-2xl"
            style={{
              height: '64px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* Annunci */}
            <Link
              to="/case-e-stanze-in-affitto"
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-l-2xl transition-colors active:scale-95 ${isActive('/case-e-stanze-in-affitto') ? 'text-teal-500' : 'text-gray-400'}`}
            >
              <Megaphone size={20} />
              <span className={`mt-0.5 text-[10px] leading-tight font-medium ${isActive('/case-e-stanze-in-affitto') ? 'text-teal-500 font-semibold' : 'text-gray-500'}`}>
                Annunci
              </span>
            </Link>

            {/* Cerca */}
            <Link
              to="/cerca-inquilino"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${isActive('/cerca-inquilino') ? 'text-teal-500' : 'text-gray-400'}`}
            >
              <SearchIcon size={20} />
              <span className={`mt-0.5 text-[10px] leading-tight font-medium ${isActive('/cerca-inquilino') ? 'text-teal-500 font-semibold' : 'text-gray-500'}`}>
                Cerca
              </span>
            </Link>

            {/* Trova Casa */}
            <Link
              to="/register"
              className="flex items-center justify-center flex-1 h-full px-1 active:scale-95 transition-transform"
            >
              <span className="bg-brand-green text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap leading-tight">
                Trova Casa
              </span>
            </Link>

            {/* Accedi */}
            <Link
              to="/login"
              className="flex items-center justify-center flex-1 h-full px-1 active:scale-95 transition-transform"
            >
              <span className="border border-brand-green/50 text-brand-green text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap leading-tight">
                Accedi
              </span>
            </Link>

            {/* Menu / Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-r-2xl transition-colors active:scale-95 ${mobileOpen ? 'text-teal-500' : 'text-gray-400'}`}
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              <span className={`mt-0.5 text-[10px] leading-tight font-medium ${mobileOpen ? 'text-teal-500 font-semibold' : 'text-gray-500'}`}>
                Menu
              </span>
            </button>
          </div>
        </nav>
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
