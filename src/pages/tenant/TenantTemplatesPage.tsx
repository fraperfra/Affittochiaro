import { useState, useMemo } from 'react';
import {
  FileText, Download, Eye, Star, Copy, Search,
  Layout, FileCheck, Mail, Sparkles, Check, ChevronRight
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'cv' | 'letter' | 'application';
  preview: string;
  isPremium: boolean;
  downloads: number;
  rating: number;
}

const TEMPLATES: Template[] = [
  {
    id: 'cv_standard',
    name: 'CV Standard',
    description: 'Layout classico e professionale, ideale per la maggior parte delle candidature.',
    category: 'cv',
    preview: 'Formato A4, sezioni ordinate, colori neutri',
    isPremium: false,
    downloads: 12450,
    rating: 4.5,
  },
  {
    id: 'cv_compact',
    name: 'CV Compatto',
    description: 'Versione sintetica su una pagina. Perfetto per prime presentazioni.',
    category: 'cv',
    preview: 'Una pagina, informazioni essenziali, design pulito',
    isPremium: false,
    downloads: 8320,
    rating: 4.3,
  },
  {
    id: 'cv_detailed',
    name: 'CV Dettagliato',
    description: 'Include tutte le sezioni con grafici e referenze complete.',
    category: 'cv',
    preview: 'Multi-pagina, grafici punteggio, referenze dettagliate',
    isPremium: true,
    downloads: 5680,
    rating: 4.8,
  },
  {
    id: 'cv_modern',
    name: 'CV Moderno',
    description: 'Design contemporaneo con sidebar colorata e icone.',
    category: 'cv',
    preview: 'Layout a due colonne, icone, palette moderna',
    isPremium: true,
    downloads: 3240,
    rating: 4.7,
  },
  {
    id: 'letter_presentation',
    name: 'Lettera di Presentazione',
    description: 'Template professionale per presentarti al proprietario o agenzia.',
    category: 'letter',
    preview: 'Intestazione, corpo personalizzabile, firma',
    isPremium: false,
    downloads: 9870,
    rating: 4.4,
  },
  {
    id: 'letter_reference_request',
    name: 'Richiesta Referenza',
    description: 'Modello per richiedere referenze al precedente locatore.',
    category: 'letter',
    preview: 'Formato formale, campi pre-compilabili',
    isPremium: false,
    downloads: 4560,
    rating: 4.2,
  },
  {
    id: 'letter_guarantor',
    name: 'Dichiarazione Garante',
    description: 'Template per la dichiarazione del garante con tutti i dati necessari.',
    category: 'letter',
    preview: 'Dichiarazione formale, dati garante, firma',
    isPremium: true,
    downloads: 2890,
    rating: 4.6,
  },
  {
    id: 'app_standard',
    name: 'Candidatura Standard',
    description: 'Modello di candidatura completo per rispondere ad un annuncio.',
    category: 'application',
    preview: 'Dati personali, motivazione, documenti allegati',
    isPremium: false,
    downloads: 15230,
    rating: 4.5,
  },
  {
    id: 'app_professional',
    name: 'Candidatura Professionale',
    description: 'Versione avanzata con referenze, timeline lavorativa e garanzie.',
    category: 'application',
    preview: 'Layout premium, referenze integrate, timeline',
    isPremium: true,
    downloads: 6780,
    rating: 4.9,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tutti', icon: Layout },
  { id: 'cv', label: 'CV Inquilino', icon: FileText },
  { id: 'letter', label: 'Lettere', icon: Mail },
  { id: 'application', label: 'Candidature', icon: FileCheck },
];

export default function TenantTemplatesPage() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...TEMPLATES];
    if (category !== 'all') {
      result = result.filter(t => t.category === category);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [category, searchQuery]);

  const handleUse = (template: Template) => {
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categoryLabels: Record<string, string> = {
    cv: 'CV Inquilino',
    letter: 'Lettera',
    application: 'Candidatura',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Template</h1>
        <p className="text-text-secondary">
          Scegli tra modelli professionali per il tuo CV, lettere e candidature
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = cat.id === 'all'
            ? TEMPLATES.length
            : TEMPLATES.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
              }`}
            >
              <Icon size={16} />
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                category === cat.id ? 'bg-white/20' : 'bg-background-secondary'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Cerca template..."
          className="input pl-9 text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Preview Header */}
            <div className="h-32 bg-gradient-to-br from-primary-50 to-teal-50 p-4 flex items-center justify-center relative">
              {template.isPremium && (
                <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                  <Sparkles size={10} />
                  PREMIUM
                </span>
              )}
              <div className="w-20 h-28 bg-white rounded shadow-sm border border-gray-100 flex flex-col items-center justify-center p-2 group-hover:scale-105 transition-transform">
                <div className="w-full h-2 bg-primary-200 rounded mb-1" />
                <div className="w-full h-1 bg-gray-200 rounded mb-0.5" />
                <div className="w-3/4 h-1 bg-gray-200 rounded mb-2" />
                <div className="w-full h-1 bg-gray-100 rounded mb-0.5" />
                <div className="w-full h-1 bg-gray-100 rounded mb-0.5" />
                <div className="w-2/3 h-1 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase text-primary-500 tracking-wider">
                  {categoryLabels[template.category]}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs text-text-secondary">{template.rating}</span>
                </div>
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{template.name}</h3>
              <p className="text-sm text-text-muted line-clamp-2 mb-3">{template.description}</p>
              <p className="text-xs text-text-muted mb-4">
                {template.preview}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {template.downloads.toLocaleString('it-IT')} download
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewId(previewId === template.id ? null : template.id)}
                    className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                    title="Anteprima"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleUse(template)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      copiedId === template.id
                        ? 'bg-success text-white'
                        : template.isPremium
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check size={14} />
                        Applicato
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        Usa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Expanded */}
            {previewId === template.id && (
              <div className="px-4 pb-4 border-t border-border mt-2 pt-3">
                <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Anteprima</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="h-3 bg-primary-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-5/6" />
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="mt-2 h-2 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-4/5" />
                </div>
                <p className="text-xs text-text-muted mt-2 italic">{template.preview}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-card text-center">
          <FileText size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary mb-1">Nessun template trovato</h3>
          <p className="text-sm text-text-muted">Prova a modificare i filtri di ricerca</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
        <Sparkles size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-primary-700">
          <p className="font-medium mb-1">Template Premium</p>
          <p className="text-primary-600">
            I template premium offrono layout avanzati e personalizzazioni extra per aumentare
            le tue possibilita di successo. Disponibili con il piano a pagamento.
          </p>
        </div>
      </div>
    </div>
  );
}
