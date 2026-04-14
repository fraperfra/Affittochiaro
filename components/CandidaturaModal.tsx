import React, { useState } from 'react';
import { X, User, Mail, Phone, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingInfo {
  id: string;
  titolo: string;
  prezzo: string;
  immagine: string;
}

interface CandidaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingInfo | null;
}

export const CandidaturaModal: React.FC<CandidaturaModalProps> = ({ isOpen, onClose, listing }) => {
  const [form, setForm] = useState({ nome: '', email: '', telefono: '', messaggio: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  if (!isOpen || !listing) return null;

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.nome.trim()) e.nome = 'Campo obbligatorio';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email non valida';
    if (!form.telefono.trim()) e.telefono = 'Campo obbligatorio';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
      existing.push({
        id: Date.now().toString(),
        listingId: listing.id,
        listingTitolo: listing.titolo,
        nome: form.nome,
        email: form.email,
        telefono: form.telefono,
        messaggio: form.messaggio,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      });
      localStorage.setItem('affittochiaro_applications', JSON.stringify(existing));
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Invia candidatura</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{listing.titolo}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Candidatura inviata!</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-[36ch] mx-auto">
                L'agenzia riceverà la tua richiesta. Per aumentare le probabilità di risposta, crea il tuo profilo inquilino.
              </p>
              <Link
                to="/register"
                onClick={onClose}
                className="btn btn-primary w-full justify-center text-sm mb-3"
              >
                Crea il tuo profilo
              </Link>
              <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Chiudi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Listing preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img src={listing.immagine} alt={listing.titolo} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">{listing.titolo}</p>
                  <p className="text-xs font-bold text-primary-600 mt-0.5">{listing.prezzo}</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome e cognome *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.nome}
                    onChange={handleChange('nome')}
                    placeholder="Mario Rossi"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${errors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                </div>
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="mario@email.com"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telefono *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange('telefono')}
                    placeholder="+39 333 000 0000"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${errors.telefono ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                </div>
                {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Messaggio <span className="font-normal text-gray-400">(opzionale)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={form.messaggio}
                    onChange={handleChange('messaggio')}
                    rows={3}
                    placeholder="Presentati brevemente all'agenzia..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center text-sm gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {loading ? 'Invio in corso...' : 'Invia candidatura'}
              </button>

              <p className="text-center text-xs text-gray-400">
                Hai già un account?{' '}
                <Link to="/login" onClick={onClose} className="text-primary-600 font-semibold hover:underline">
                  Accedi
                </Link>
                {' '}per candidarti con il tuo profilo completo.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
