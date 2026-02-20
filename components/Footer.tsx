import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1A15] text-white pt-16 pb-32 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/5 pb-12 text-sm">
        {/* Navigazione */}
        <div>
          <h4 className="font-bold mb-6 text-white/60 uppercase tracking-wider text-xs">Esplora</h4>
          <ul className="space-y-4 text-white/40">
            <li><Link to="/come-funziona" className="hover:text-white transition-colors">Come funziona</Link></li>
            <li><Link to="/annunci" className="hover:text-white transition-colors">Trova casa</Link></li>
            <li><Link to="/ricerca-inquilino" className="hover:text-white transition-colors">Cerca Inquilino</Link></li>
            <li><Link to="/servizi" className="hover:text-white transition-colors">Servizi</Link></li>
            <li><Link to="/agenzie" className="hover:text-white transition-colors">Agenzie</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Domande frequenti</Link></li>
          </ul>
        </div>

        {/* Risorse */}
        <div>
          <h4 className="font-bold mb-6 text-white/60 uppercase tracking-wider text-xs">Risorse</h4>
          <ul className="space-y-4 text-white/40">
            <li><Link to="/chi-siamo" className="hover:text-white transition-colors">Chi Siamo</Link></li>
            <li><Link to="/affittonews" className="hover:text-white transition-colors">Blog & News</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Guida all'affitto</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Supporto</Link></li>
          </ul>
        </div>

        {/* Brand */}
        <div className="col-span-2">
          <div className="mb-5">
            <img
              src="/assets/logoaffittochiaro_pic.webp"
              alt="Affittochiaro"
              className="h-12 w-auto"
            />
          </div>
          <p className="text-white/50 leading-relaxed mb-6">
            La tua prossima casa ti sta aspettando. Niente più ore perse tra annunci sparsi, niente più candidature ignorate.
            <span className="text-white font-medium"> Un profilo, mille opportunità.</span>
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span className="w-2 h-2 bg-action-green rounded-full"></span>
            <span>Oltre 1.200 inquilini già registrati</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[11px] text-white/30">© 2025 Affittochiaro. Tutti i diritti riservati.</div>
        <div className="flex items-center gap-6 text-[11px] text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Termini di Servizio</a>
          <a href="#" className="hover:text-white/60 transition-colors">Cookie</a>
          <Link to="/design-system" className="hover:text-white/60 transition-colors opacity-50">System</Link>
        </div>
      </div>
    </footer>
  );
};
