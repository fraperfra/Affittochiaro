import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  FileText, Plus, Copy, Eye, Edit3, Trash2, Search,
  Home, Mail, FileCheck, Star, Check, MoreVertical,
  Building2, Users, ClipboardList, Sparkles
} from 'lucide-react';

interface AgencyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'listing' | 'communication' | 'contract' | 'evaluation';
  content: string;
  placeholders: string[];
  isSystem: boolean;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
}

const TEMPLATES: AgencyTemplate[] = [
  {
    id: 'lst_bilocale',
    name: 'Annuncio Bilocale Standard',
    description: 'Template per annunci di bilocali con tutte le sezioni necessarie.',
    category: 'listing',
    content: 'Splendido bilocale di {{mq}} mq in {{zona}}, composto da soggiorno con angolo cottura, camera da letto, bagno. {{caratteristiche}}. Disponibile dal {{data_disponibilita}}. Canone: {{prezzo}}/mese.',
    placeholders: ['mq', 'zona', 'caratteristiche', 'data_disponibilita', 'prezzo'],
    isSystem: true,
    usageCount: 234,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'lst_trilocale',
    name: 'Annuncio Trilocale Famiglia',
    description: 'Ottimizzato per famiglie, evidenzia spazi e servizi vicini.',
    category: 'listing',
    content: 'Ampio trilocale di {{mq}} mq, ideale per famiglie. {{num_camere}} camere, soggiorno luminoso, cucina abitabile. Zona {{zona}} - vicino a scuole, parchi e trasporti. Canone: {{prezzo}}/mese.',
    placeholders: ['mq', 'num_camere', 'zona', 'prezzo'],
    isSystem: true,
    usageCount: 189,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'lst_luxury',
    name: 'Annuncio Immobile di Pregio',
    description: 'Template per immobili di alto livello con descrizione accurata.',
    category: 'listing',
    content: 'Esclusivo appartamento di {{mq}} mq in {{indirizzo}}, finiture di pregio. {{descrizione_dettagliata}}. Piano {{piano}}, ascensore, posto auto. Classe energetica {{classe}}.',
    placeholders: ['mq', 'indirizzo', 'descrizione_dettagliata', 'piano', 'classe'],
    isSystem: false,
    usageCount: 45,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdAt: '2024-03-20',
  },
  {
    id: 'com_welcome',
    name: 'Benvenuto Candidatura',
    description: 'Messaggio automatico di conferma ricezione candidatura.',
    category: 'communication',
    content: 'Gentile {{nome_inquilino}},\n\nLa ringraziamo per la candidatura per l\'immobile in {{indirizzo}}. Abbiamo ricevuto la sua documentazione e la esamineremo entro {{tempo_risposta}}.\n\nCordiali saluti,\n{{nome_agenzia}}',
    placeholders: ['nome_inquilino', 'indirizzo', 'tempo_risposta', 'nome_agenzia'],
    isSystem: true,
    usageCount: 567,
    lastUsed: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'com_accepted',
    name: 'Candidatura Accettata',
    description: 'Notifica al candidato selezionato con i prossimi passi.',
    category: 'communication',
    content: 'Gentile {{nome_inquilino}},\n\nSiamo lieti di comunicarle che la sua candidatura per l\'immobile in {{indirizzo}} e stata accettata.\n\nI prossimi passi:\n1. Firma del contratto\n2. Versamento cauzione\n3. Consegna chiavi\n\nLa contatteremo per fissare un appuntamento.\n\nCordiali saluti,\n{{nome_agenzia}}',
    placeholders: ['nome_inquilino', 'indirizzo', 'nome_agenzia'],
    isSystem: true,
    usageCount: 342,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'com_rejected',
    name: 'Candidatura Non Selezionata',
    description: 'Risposta professionale per candidature non accettate.',
    category: 'communication',
    content: 'Gentile {{nome_inquilino}},\n\nLa ringraziamo per l\'interesse mostrato per l\'immobile in {{indirizzo}}. Purtroppo, dopo attenta valutazione, abbiamo selezionato un altro candidato.\n\nLe auguriamo buona fortuna nella ricerca.\n\nCordiali saluti,\n{{nome_agenzia}}',
    placeholders: ['nome_inquilino', 'indirizzo', 'nome_agenzia'],
    isSystem: true,
    usageCount: 215,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'con_standard',
    name: 'Contratto 4+4 Standard',
    description: 'Template base per contratto di locazione ad uso abitativo 4+4.',
    category: 'contract',
    content: 'CONTRATTO DI LOCAZIONE AD USO ABITATIVO\n\nTra {{locatore}} (Locatore) e {{conduttore}} (Conduttore)\n\nImmobile: {{indirizzo}}\nDurata: 4 anni + 4 di rinnovo\nCanone: {{canone}} EUR/mese\nCaparra: {{caparra}} EUR\n\nDecorrenza: {{data_inizio}}',
    placeholders: ['locatore', 'conduttore', 'indirizzo', 'canone', 'caparra', 'data_inizio'],
    isSystem: true,
    usageCount: 456,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: '2024-01-15',
  },
  {
    id: 'con_transitorio',
    name: 'Contratto Transitorio',
    description: 'Per locazioni a durata limitata (da 1 a 18 mesi).',
    category: 'contract',
    content: 'CONTRATTO DI LOCAZIONE TRANSITORIA\n\nTra {{locatore}} e {{conduttore}}\n\nImmobile: {{indirizzo}}\nDurata: {{durata_mesi}} mesi\nMotivazione: {{motivazione}}\nCanone: {{canone}} EUR/mese',
    placeholders: ['locatore', 'conduttore', 'indirizzo', 'durata_mesi', 'motivazione', 'canone'],
    isSystem: true,
    usageCount: 178,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    createdAt: '2024-02-10',
  },
  {
    id: 'eval_checklist',
    name: 'Checklist Valutazione Inquilino',
    description: 'Lista di controllo per valutare i candidati in modo oggettivo.',
    category: 'evaluation',
    content: 'VALUTAZIONE CANDIDATO: {{nome_inquilino}}\n\n[ ] Documenti completi\n[ ] Reddito adeguato (>3x canone)\n[ ] Referenze verificate\n[ ] Nessun precedente negativo\n[ ] Garanzia adeguata\n\nPunteggio: __/100\nNote: ___',
    placeholders: ['nome_inquilino'],
    isSystem: true,
    usageCount: 123,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: '2024-04-01',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tutti', icon: FileText, count: TEMPLATES.length },
  { id: 'listing', label: 'Annunci', icon: Home, count: TEMPLATES.filter(t => t.category === 'listing').length },
  { id: 'communication', label: 'Comunicazioni', icon: Mail, count: TEMPLATES.filter(t => t.category === 'communication').length },
  { id: 'contract', label: 'Contratti', icon: FileCheck, count: TEMPLATES.filter(t => t.category === 'contract').length },
  { id: 'evaluation', label: 'Valutazione', icon: ClipboardList, count: TEMPLATES.filter(t => t.category === 'evaluation').length },
];

export default function AgencyTemplatesPage() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

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

  const handleCopy = (template: AgencyTemplate) => {
    navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    toast.success('Contenuto copiato negli appunti');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatRelative = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Poco fa';
    if (hours < 24) return `${hours}h fa`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}gg fa`;
    return formatDate(date);
  };

  const categoryIcons: Record<string, typeof FileText> = {
    listing: Home,
    communication: Mail,
    contract: FileCheck,
    evaluation: ClipboardList,
  };

  const categoryColors: Record<string, string> = {
    listing: 'bg-blue-50 text-blue-600',
    communication: 'bg-green-50 text-green-600',
    contract: 'bg-purple-50 text-purple-600',
    evaluation: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Template</h1>
          <p className="text-text-secondary">
            Modelli pronti per annunci, comunicazioni, contratti e valutazioni
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Crea Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText size={20} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{TEMPLATES.length}</p>
              <p className="text-xs text-text-muted">Template Totali</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Building2 size={20} className="text-teal-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{TEMPLATES.filter(t => t.isSystem).length}</p>
              <p className="text-xs text-text-muted">Di Sistema</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Star size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{TEMPLATES.filter(t => !t.isSystem).length}</p>
              <p className="text-xs text-text-muted">Personalizzati</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Copy size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {TEMPLATES.reduce((acc, t) => acc + t.usageCount, 0).toLocaleString('it-IT')}
              </p>
              <p className="text-xs text-text-muted">Utilizzi Totali</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
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
                {cat.count}
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

      {/* Template List */}
      <div className="space-y-3">
        {filtered.map(template => {
          const CatIcon = categoryIcons[template.category] || FileText;
          const isExpanded = expandedId === template.id;

          return (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[template.category]}`}>
                    <CatIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{template.name}</h3>
                      {template.isSystem && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                          SISTEMA
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{template.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span>{template.usageCount} utilizzi</span>
                      <span>Ultimo uso: {formatRelative(template.lastUsed)}</span>
                      <span>{template.placeholders.length} variabili</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : template.id)}
                      className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                      title="Anteprima"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(template)}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedId === template.id
                          ? 'bg-success/10 text-success'
                          : 'hover:bg-background-secondary text-text-muted'
                      }`}
                      title="Copia contenuto"
                    >
                      {copiedId === template.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuId(menuId === template.id ? null : template.id)}
                        className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuId === template.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                          <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-border py-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary">
                              <Edit3 size={14} />
                              Modifica
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary">
                              <Copy size={14} />
                              Duplica
                            </button>
                            {!template.isSystem && (
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-red-50">
                                <Trash2 size={14} />
                                Elimina
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Contenuto</h4>
                    <pre className="bg-gray-50 rounded-lg p-3 text-sm text-text-primary whitespace-pre-wrap font-sans border border-gray-100">
                      {template.content}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Variabili</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {template.placeholders.map(p => (
                        <span key={p} className="px-2 py-1 text-xs font-mono bg-primary-50 text-primary-600 rounded border border-primary-100">
                          {`{{${p}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-card text-center">
          <FileText size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary mb-1">Nessun template trovato</h3>
          <p className="text-sm text-text-muted">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  );
}
