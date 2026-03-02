/**
 * CMS Admin Page
 * Full admin panel at /admin/cms with tabs: Theme, Content, Sections, Versions
 */
import React, { useState, useRef } from 'react';
import { useCMSStore } from '../../cms/cms-store';
import { defaultContent, defaultSections, defaultTheme } from '../../cms/cms-defaults';
import { CMSColorScale, CMSSectionItem } from '../../cms/cms-types';
import {
    Palette, Type, Layout, History, Save, Download, Upload, RotateCcw,
    Eye, EyeOff, GripVertical, ChevronDown, ChevronRight, Trash2, Check, AlertCircle, X
} from 'lucide-react';

// ─── Color Picker Component ──────────────────────────────────────────────────

const ColorInput: React.FC<{
    label: string; value: string; onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
    <div className="flex items-center gap-3">
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-gray-600 block truncate">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs text-gray-500 font-mono bg-gray-50 rounded px-1.5 py-0.5 border border-gray-200 w-full"
            />
        </div>
    </div>
);

// ─── Color Scale Editor ──────────────────────────────────────────────────────

const ColorScaleEditor: React.FC<{
    name: string; path: string; scale: CMSColorScale; onUpdate: (path: string, val: any) => void;
}> = ({ name, path, scale, onUpdate }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        {[50, 200, 500, 700, 900].map((k) => (
                            <div
                                key={k}
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: scale[k as keyof CMSColorScale] }}
                            />
                        ))}
                    </div>
                    <span className="font-medium text-sm text-gray-700 capitalize">{name}</span>
                </div>
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {open && (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {Object.entries(scale).map(([key, val]) => (
                        <ColorInput
                            key={key}
                            label={`${name}-${key}`}
                            value={val}
                            onChange={(v) => onUpdate(`${path}.${key}`, v)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Font Selector ───────────────────────────────────────────────────────────

const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Poppins', 'Open Sans', 'Lato', 'Montserrat', 'Raleway',
    'Nunito', 'Outfit', 'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Work Sans',
    'Source Sans Pro', 'Ubuntu', 'Rubik', 'Mulish', 'Barlow', 'Josefin Sans',
];

// ─── Main Admin Page ─────────────────────────────────────────────────────────

type TabId = 'theme' | 'content' | 'sections' | 'versions';

export default function CMSAdminPage() {
    const [activeTab, setActiveTab] = useState<TabId>('theme');
    const {
        draftConfig, publishedConfig, versions, isDirty,
        updateTheme, updateContent, updateSections,
        publish, rollback, exportJSON, importJSON, resetDraft, resetAll,
    } = useCMSStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showNotif = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleExport = () => {
        const json = exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cms-config-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotif('success', 'JSON esportato con successo!');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const json = ev.target?.result as string;
            const ok = importJSON(json);
            showNotif(ok ? 'success' : 'error', ok ? 'Configurazione importata!' : 'File JSON non valido');
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handlePublish = () => {
        publish();
        showNotif('success', 'Modifiche pubblicate!');
    };

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'theme', label: 'Tema', icon: <Palette size={18} /> },
        { id: 'content', label: 'Contenuti', icon: <Type size={18} /> },
        { id: 'sections', label: 'Sezioni', icon: <Layout size={18} /> },
        { id: 'versions', label: 'Versioni', icon: <History size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">CMS - Gestione Sito</h1>
                    <p className="text-sm text-gray-500 mt-1">Modifica tema, contenuti e sezioni del sito</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {isDirty && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                            <AlertCircle size={12} />
                            Modifiche non pubblicate
                        </span>
                    )}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                        <Download size={16} />
                        Esporta
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                        <Upload size={16} />
                        Importa
                    </button>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                    {isDirty && (
                        <>
                            <button
                                onClick={resetDraft}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                            >
                                <RotateCcw size={16} />
                                Annulla
                            </button>
                            <button
                                onClick={handlePublish}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-sm font-bold text-white transition-colors shadow-lg shadow-green-500/20"
                            >
                                <Save size={16} />
                                Pubblica
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    {notification.msg}
                    <button onClick={() => setNotification(null)} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'sections' && <SectionsTab />}
            {activeTab === 'versions' && (
                <VersionsTab
                    versions={versions}
                    onRollback={(id) => { rollback(id); showNotif('success', 'Rollback riuscito!'); }}
                    onResetAll={() => { resetAll(); showNotif('success', 'Reset completo!'); }}
                />
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME TAB
// ═══════════════════════════════════════════════════════════════════════════════

function ThemeTab() {
    const theme = useCMSStore((s) => s.draftConfig.theme);
    const updateTheme = useCMSStore((s) => s.updateTheme);

    return (
        <div className="space-y-8">
            {/* Colors */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-primary-500" />
                    Colori
                </h2>

                <div className="space-y-3">
                    <ColorScaleEditor
                        name="Primary"
                        path="colors.primary"
                        scale={theme.colors.primary}
                        onUpdate={updateTheme}
                    />
                    <ColorScaleEditor
                        name="Accent"
                        path="colors.accent"
                        scale={theme.colors.accent}
                        onUpdate={updateTheme}
                    />
                    <ColorScaleEditor
                        name="Teal"
                        path="colors.teal"
                        scale={theme.colors.teal}
                        onUpdate={updateTheme}
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                    <ColorInput label="Brand Green" value={theme.colors.brandGreen} onChange={(v) => updateTheme('colors.brandGreen', v)} />
                    <ColorInput label="Action Green" value={theme.colors.actionGreen} onChange={(v) => updateTheme('colors.actionGreen', v)} />
                    <ColorInput label="Soft Green" value={theme.colors.softGreen} onChange={(v) => updateTheme('colors.softGreen', v)} />
                    <ColorInput label="Error Red" value={theme.colors.errorRed} onChange={(v) => updateTheme('colors.errorRed', v)} />
                    <ColorInput label="Trust Blue" value={theme.colors.trustBlue} onChange={(v) => updateTheme('colors.trustBlue', v)} />
                    <ColorInput label="Dark Gray" value={theme.colors.darkGray} onChange={(v) => updateTheme('colors.darkGray', v)} />
                    <ColorInput label="Medium Gray" value={theme.colors.mediumGray} onChange={(v) => updateTheme('colors.mediumGray', v)} />
                </div>
            </section>

            {/* Fonts */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Type size={20} className="text-primary-500" />
                    Font
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Font Heading</label>
                        <select
                            value={theme.fonts.heading.split(',')[0].trim()}
                            onChange={(e) => updateTheme('fonts.heading', `${e.target.value}, system-ui, sans-serif`)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm"
                        >
                            {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: theme.fonts.heading }}>
                            Anteprima: AaBbCc 123
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Font Body</label>
                        <select
                            value={theme.fonts.body.split(',')[0].trim()}
                            onChange={(e) => updateTheme('fonts.body', `${e.target.value}, system-ui, sans-serif`)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm"
                        >
                            {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: theme.fonts.body }}>
                            Anteprima: AaBbCc 123
                        </p>
                    </div>
                </div>
            </section>

            {/* Font Sizes */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Dimensioni Font</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl">
                    {Object.entries(theme.fontSizes).map(([key, val]) => (
                        <div key={key}>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">{key}</label>
                            <input
                                type="text"
                                value={val}
                                onChange={(e) => updateTheme(`fontSizes.${key}`, e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-mono bg-white"
                            />
                            <p className="text-gray-400 mt-1 truncate" style={{ fontSize: val }}>Aa</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Spacing */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Spaziature</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                    {Object.entries(theme.spacing).map(([key, val]) => (
                        <div key={key}>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                                type="text"
                                value={val}
                                onChange={(e) => updateTheme(`spacing.${key}`, e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-mono bg-white"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Border Radius */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Border Radius</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-xl">
                    {Object.entries(theme.borderRadius).map(([key, val]) => (
                        <div key={key} className="text-center">
                            <div
                                className="w-12 h-12 bg-primary-200 border-2 border-primary-400 mx-auto mb-2"
                                style={{ borderRadius: val }}
                            />
                            <label className="text-xs font-medium text-gray-600 block">{key}</label>
                            <input
                                type="text"
                                value={val}
                                onChange={(e) => updateTheme(`borderRadius.${key}`, e.target.value)}
                                className="w-full px-1 py-0.5 border border-gray-200 rounded text-xs font-mono bg-white mt-1 text-center"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TAB
// ═══════════════════════════════════════════════════════════════════════════════

function ContentTab() {
    const content = useCMSStore((s) => s.draftConfig.content);
    const updateContent = useCMSStore((s) => s.updateContent);

    // Group content by page.section
    const grouped: Record<string, Record<string, { key: string; value: string }[]>> = {};
    const allKeys = new Set([...Object.keys(defaultContent), ...Object.keys(content)]);

    allKeys.forEach((key) => {
        const parts = key.split('.');
        const page = parts[0] || 'other';
        const section = parts[1] || 'general';
        if (!grouped[page]) grouped[page] = {};
        if (!grouped[page][section]) grouped[page][section] = [];
        grouped[page][section].push({ key, value: content[key] ?? defaultContent[key] ?? '' });
    });

    const pageLabels: Record<string, string> = {
        home: '🏠 Home Page',
        comeFunziona: '📋 Come Funziona',
        faq: '❓ FAQ',
        chiSiamo: '👥 Chi Siamo',
    };

    const sectionLabels: Record<string, string> = {
        hero: '🦸 Hero',
        problems: '⚠️ Problemi',
        benefits: '✅ Benefici',
        howItWorks: '⚙️ Come Funziona',
        testimonials: '💬 Testimonianze',
        finalCta: '🎯 CTA Finale',
        faq: '❓ FAQ',
        partners: '🤝 Partner',
    };

    const [openPages, setOpenPages] = useState<Record<string, boolean>>({ home: true });

    const togglePage = (page: string) => {
        setOpenPages((prev) => ({ ...prev, [page]: !prev[page] }));
    };

    return (
        <div className="space-y-4">
            {Object.entries(grouped).map(([page, sections]) => (
                <div key={page} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => togglePage(page)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-semibold text-gray-900">
                            {pageLabels[page] || `📄 ${page}`}
                        </span>
                        {openPages[page] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {openPages[page] && (
                        <div className="p-4 space-y-6">
                            {Object.entries(sections).map(([section, items]) => (
                                <div key={section}>
                                    <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                                        {sectionLabels[section] || section}
                                    </h3>
                                    <div className="space-y-3">
                                        {items.map(({ key, value }) => {
                                            const elementId = key.split('.').slice(2).join('.');
                                            const isLong = value.length > 80;
                                            return (
                                                <div key={key}>
                                                    <label className="text-xs font-mono text-gray-400 mb-1 block">{elementId || key}</label>
                                                    {isLong ? (
                                                        <textarea
                                                            value={value}
                                                            onChange={(e) => updateContent(key, e.target.value)}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => updateContent(key, e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function SectionsTab() {
    const sections = useCMSStore((s) => s.draftConfig.sections);
    const updateSections = useCMSStore((s) => s.updateSections);

    const handleToggle = (pageId: string, sectionId: string) => {
        const pageSections = [...(sections[pageId] || [])];
        const idx = pageSections.findIndex((s) => s.id === sectionId);
        if (idx === -1) return;
        pageSections[idx] = { ...pageSections[idx], visible: !pageSections[idx].visible };
        updateSections(pageId, pageSections);
    };

    const handleMoveUp = (pageId: string, index: number) => {
        if (index === 0) return;
        const pageSections = [...(sections[pageId] || [])].sort((a, b) => a.order - b.order);
        const temp = pageSections[index].order;
        pageSections[index] = { ...pageSections[index], order: pageSections[index - 1].order };
        pageSections[index - 1] = { ...pageSections[index - 1], order: temp };
        updateSections(pageId, pageSections);
    };

    const handleMoveDown = (pageId: string, index: number) => {
        const pageSections = [...(sections[pageId] || [])].sort((a, b) => a.order - b.order);
        if (index >= pageSections.length - 1) return;
        const temp = pageSections[index].order;
        pageSections[index] = { ...pageSections[index], order: pageSections[index + 1].order };
        pageSections[index + 1] = { ...pageSections[index + 1], order: temp };
        updateSections(pageId, pageSections);
    };

    return (
        <div className="space-y-6">
            {Object.entries(sections).map(([pageId, pageSections]) => {
                const sorted = [...pageSections].sort((a, b) => a.order - b.order);
                return (
                    <div key={pageId} className="border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900 capitalize">
                                📄 {pageId === 'home' ? 'Home Page' : pageId}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">Trascina per riordinare, click sull'occhio per mostrare/nascondere</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {sorted.map((section, idx) => (
                                <div
                                    key={section.id}
                                    className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${section.visible ? 'bg-white' : 'bg-gray-50 opacity-60'
                                        }`}
                                >
                                    <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-sm font-medium ${section.visible ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                                            {section.label}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2 font-mono">{section.id}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleMoveUp(pageId, idx)}
                                            disabled={idx === 0}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors text-gray-500"
                                            title="Sposta su"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => handleMoveDown(pageId, idx)}
                                            disabled={idx === sorted.length - 1}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors text-gray-500"
                                            title="Sposta giù"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => handleToggle(pageId, section.id)}
                                            className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'hover:bg-blue-50 text-blue-500' : 'hover:bg-gray-200 text-gray-400'
                                                }`}
                                            title={section.visible ? 'Nascondi' : 'Mostra'}
                                        >
                                            {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function VersionsTab({
    versions,
    onRollback,
    onResetAll,
}: {
    versions: { id: string; timestamp: number; label: string }[];
    onRollback: (id: string) => void;
    onResetAll: () => void;
}) {
    const [confirmReset, setConfirmReset] = useState(false);

    return (
        <div className="space-y-6">
            {/* Current state */}
            <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                <div>
                    <p className="font-semibold text-green-800">✅ Versione Corrente (Pubblicata)</p>
                    <p className="text-xs text-green-600 mt-0.5">Questa è la versione attualmente attiva sul sito</p>
                </div>
            </div>

            {/* Version list */}
            {versions.length > 0 ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-sm text-gray-700">Cronologia versioni ({versions.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {versions.map((v) => (
                            <div key={v.id} className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{v.label}</p>
                                    <p className="text-xs text-gray-400">{new Date(v.timestamp).toLocaleString('it-IT')}</p>
                                </div>
                                <button
                                    onClick={() => onRollback(v.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-600 transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Ripristina
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400">
                    <History size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Nessuna versione precedente</p>
                    <p className="text-sm mt-1">Le versioni verranno salvate quando pubblichi le modifiche</p>
                </div>
            )}

            {/* Reset */}
            <div className="border border-red-200 rounded-2xl p-5 bg-red-50/50">
                <h3 className="font-semibold text-red-700 text-sm mb-2">⚠️ Zona Pericolosa</h3>
                <p className="text-xs text-red-600 mb-4">Ripristina tutte le impostazioni ai valori originali. Questa azione non può essere annullata.</p>
                {!confirmReset ? (
                    <button
                        onClick={() => setConfirmReset(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                    >
                        <Trash2 size={14} />
                        Reset Completo
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { onResetAll(); setConfirmReset(false); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            Conferma Reset
                        </button>
                        <button
                            onClick={() => setConfirmReset(false)}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Annulla
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
