import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Instagram, Facebook, Linkedin } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Trova casa', to: '/case-e-stanze-in-affitto' },
  { label: 'Cerca Inquilino', to: '/cerca-inquilino' },
  { label: 'Come Funziona', to: '/come-funziona' },
  { label: 'Agenzie Partner', to: '/agenzie' },
];

const SERVICE_LINKS = [
  { label: 'Servizi Casa', to: '/servizi' },
  { label: 'Guide Affitto', to: '/guide-affitto' },
  { label: 'Domande frequenti', to: '/faq' },
];

const COMPANY_LINKS = [
  { label: 'Chi Siamo', to: '/chi-siamo' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Termini di Servizio', to: '/termini-di-servizio' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/affittochiaro', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/affittochiaro', Icon: Facebook },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/affittochiaro', Icon: Linkedin },
];

const LinkColumn: React.FC<{ title: string; links: { label: string; to: string }[] }> = ({ title, links }) => (
  <div>
    <h4 className="font-bold mb-5 text-white/50 uppercase tracking-wider text-xs">{title}</h4>
    <ul className="space-y-3.5 text-sm text-white/60">
      {links.map((l) => (
        <li key={l.to + l.label}>
          <Link to={l.to} className="inline-flex items-center gap-1.5 hover:text-white transition-colors group">
            <span>{l.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A5C38] text-white pb-32">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold leading-[1.2]">
              Resta aggiornato sulle <span className="text-action-green">migliori case</span>
            </h3>
            <p className="text-white/50 text-sm mt-2 leading-[1.5]">
              Nuovi annunci, guide e consigli per l'affitto, direttamente nella tua casella.
            </p>
          </div>
          <form
            className="flex w-full lg:w-auto max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="La tua email"
              aria-label="La tua email"
              className="flex-1 lg:w-72 bg-white/10 border border-white/15 rounded-l-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-action-green focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-action-green text-white font-bold text-sm px-5 py-3 rounded-r-xl hover:brightness-110 transition-all whitespace-nowrap"
            >
              Iscriviti
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-12 grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">
        {/* Brand + contatti */}
        <div className="col-span-2 lg:col-span-4">
          <img
            src="/assets/logoaffittochiaro_pic.webp"
            alt="Affittochiaro"
            className="h-12 w-auto mb-5"
          />
          <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
            La tua prossima casa ti sta aspettando.
            <span className="text-white font-medium"> Un profilo, mille opportunità.</span>
          </p>

          <div className="space-y-2.5 mb-6">
            <a href="mailto:info@affittochiaro.it" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
              <Mail size={16} className="text-action-green shrink-0" />
              info@affittochiaro.it
            </a>
            <a href="tel:800123456" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
              <Phone size={16} className="text-action-green shrink-0" />
              800.123.456
            </a>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-action-green hover:bg-white/5 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Spacer su desktop */}
        <div className="hidden lg:block lg:col-span-1" />

        <div className="lg:col-span-2">
          <LinkColumn title="Esplora" links={EXPLORE_LINKS} />
        </div>
        <div className="lg:col-span-2">
          <LinkColumn title="Servizi" links={SERVICE_LINKS} />
        </div>
        <div className="lg:col-span-3">
          <LinkColumn title="Azienda" links={COMPANY_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-white/40">© 2025 Affittochiaro. Tutti i diritti riservati.</div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="w-2 h-2 bg-action-green rounded-full"></span>
            <span>Oltre 30.000 inquilini già registrati</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
