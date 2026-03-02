/**
 * CMS Store (Zustand)
 * Manages draft/published config, versioning, edit mode, and persistence.
 */
import { create } from 'zustand';
import { CMSConfig, CMSVersion, CMSState } from './cms-types';
import { defaultConfig } from './cms-defaults';

const STORAGE_KEYS = {
    DRAFT: 'cms-draft',
    PUBLISHED: 'cms-published',
    VERSIONS: 'cms-versions',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('CMS: Failed to save to localStorage', e);
    }
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
    const result = { ...base };
    for (const key of Object.keys(override) as Array<keyof T>) {
        const val = override[key];
        if (val && typeof val === 'object' && !Array.isArray(val) && typeof base[key] === 'object' && !Array.isArray(base[key])) {
            result[key] = deepMerge(base[key] as any, val as any);
        } else if (val !== undefined) {
            result[key] = val as T[keyof T];
        }
    }
    return result;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface CMSActions {
    // Theme
    updateTheme: (path: string, value: any) => void;
    // Content
    updateContent: (key: string, value: string) => void;
    // Sections
    updateSections: (pageId: string, sections: CMSConfig['sections'][string]) => void;
    // Publishing
    publish: (label?: string) => void;
    rollback: (versionId: string) => void;
    // Edit mode
    toggleEditMode: () => void;
    setEditMode: (on: boolean) => void;
    // Import / Export
    exportJSON: () => string;
    importJSON: (json: string) => boolean;
    // Reset
    resetDraft: () => void;
    resetAll: () => void;
    // Get active config (published if not editing, draft if editing)
    getActiveConfig: () => CMSConfig;
}

type CMSStore = CMSState & CMSActions;

// ─── Create Store ─────────────────────────────────────────────────────────────

export const useCMSStore = create<CMSStore>((set, get) => {
    const storedPublished = loadFromStorage<CMSConfig>(STORAGE_KEYS.PUBLISHED, defaultConfig);
    const storedDraft = loadFromStorage<CMSConfig>(STORAGE_KEYS.DRAFT, storedPublished);
    const storedVersions = loadFromStorage<CMSVersion[]>(STORAGE_KEYS.VERSIONS, []);

    // Ensure stored configs have all fields via deep merge with defaults
    const published = deepMerge(defaultConfig, storedPublished);
    const draft = deepMerge(defaultConfig, storedDraft);

    return {
        draftConfig: draft,
        publishedConfig: published,
        versions: storedVersions,
        isEditMode: false,
        isDirty: JSON.stringify(draft) !== JSON.stringify(published),

        // ─── Theme ────────────────────────────────────────────────────────
        updateTheme: (path: string, value: any) => {
            set((state) => {
                const newTheme = { ...state.draftConfig.theme };
                const parts = path.split('.');
                let obj: any = newTheme;
                for (let i = 0; i < parts.length - 1; i++) {
                    obj[parts[i]] = { ...obj[parts[i]] };
                    obj = obj[parts[i]];
                }
                obj[parts[parts.length - 1]] = value;

                const newDraft = { ...state.draftConfig, theme: newTheme };
                saveToStorage(STORAGE_KEYS.DRAFT, newDraft);
                return {
                    draftConfig: newDraft,
                    isDirty: JSON.stringify(newDraft) !== JSON.stringify(state.publishedConfig),
                };
            });
        },

        // ─── Content ──────────────────────────────────────────────────────
        updateContent: (key: string, value: string) => {
            set((state) => {
                const newContent = { ...state.draftConfig.content, [key]: value };
                const newDraft = { ...state.draftConfig, content: newContent };
                saveToStorage(STORAGE_KEYS.DRAFT, newDraft);
                return {
                    draftConfig: newDraft,
                    isDirty: JSON.stringify(newDraft) !== JSON.stringify(state.publishedConfig),
                };
            });
        },

        // ─── Sections ─────────────────────────────────────────────────────
        updateSections: (pageId, sections) => {
            set((state) => {
                const newSections = { ...state.draftConfig.sections, [pageId]: sections };
                const newDraft = { ...state.draftConfig, sections: newSections };
                saveToStorage(STORAGE_KEYS.DRAFT, newDraft);
                return {
                    draftConfig: newDraft,
                    isDirty: JSON.stringify(newDraft) !== JSON.stringify(state.publishedConfig),
                };
            });
        },

        // ─── Publish ──────────────────────────────────────────────────────
        publish: (label?: string) => {
            set((state) => {
                const version: CMSVersion = {
                    id: generateId(),
                    timestamp: Date.now(),
                    label: label || `Versione ${state.versions.length + 1}`,
                    config: JSON.parse(JSON.stringify(state.publishedConfig)), // snapshot of OLD published
                };
                const newVersions = [version, ...state.versions].slice(0, 20); // Keep max 20 versions
                const newPublished = JSON.parse(JSON.stringify(state.draftConfig));

                saveToStorage(STORAGE_KEYS.PUBLISHED, newPublished);
                saveToStorage(STORAGE_KEYS.VERSIONS, newVersions);
                saveToStorage(STORAGE_KEYS.DRAFT, newPublished);

                return {
                    publishedConfig: newPublished,
                    draftConfig: newPublished,
                    versions: newVersions,
                    isDirty: false,
                };
            });
        },

        // ─── Rollback ─────────────────────────────────────────────────────
        rollback: (versionId: string) => {
            set((state) => {
                const version = state.versions.find((v) => v.id === versionId);
                if (!version) return state;

                const restoredConfig = JSON.parse(JSON.stringify(version.config));
                saveToStorage(STORAGE_KEYS.PUBLISHED, restoredConfig);
                saveToStorage(STORAGE_KEYS.DRAFT, restoredConfig);

                return {
                    publishedConfig: restoredConfig,
                    draftConfig: restoredConfig,
                    isDirty: false,
                };
            });
        },

        // ─── Edit Mode ────────────────────────────────────────────────────
        toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode })),
        setEditMode: (on: boolean) => set({ isEditMode: on }),

        // ─── Export ───────────────────────────────────────────────────────
        exportJSON: () => {
            const { publishedConfig, versions } = get();
            const exportData = {
                config: publishedConfig,
                versions,
                exportedAt: new Date().toISOString(),
                version: '1.0',
            };
            return JSON.stringify(exportData, null, 2);
        },

        // ─── Import ───────────────────────────────────────────────────────
        importJSON: (json: string) => {
            try {
                const data = JSON.parse(json);
                if (!data.config) return false;

                const importedConfig = deepMerge(defaultConfig, data.config);
                const importedVersions = data.versions || [];

                saveToStorage(STORAGE_KEYS.PUBLISHED, importedConfig);
                saveToStorage(STORAGE_KEYS.DRAFT, importedConfig);
                saveToStorage(STORAGE_KEYS.VERSIONS, importedVersions);

                set({
                    publishedConfig: importedConfig,
                    draftConfig: importedConfig,
                    versions: importedVersions,
                    isDirty: false,
                });
                return true;
            } catch {
                return false;
            }
        },

        // ─── Reset ────────────────────────────────────────────────────────
        resetDraft: () => {
            set((state) => {
                const published = JSON.parse(JSON.stringify(state.publishedConfig));
                saveToStorage(STORAGE_KEYS.DRAFT, published);
                return { draftConfig: published, isDirty: false };
            });
        },

        resetAll: () => {
            localStorage.removeItem(STORAGE_KEYS.DRAFT);
            localStorage.removeItem(STORAGE_KEYS.PUBLISHED);
            localStorage.removeItem(STORAGE_KEYS.VERSIONS);
            set({
                draftConfig: JSON.parse(JSON.stringify(defaultConfig)),
                publishedConfig: JSON.parse(JSON.stringify(defaultConfig)),
                versions: [],
                isDirty: false,
            });
        },

        // ─── Active Config ────────────────────────────────────────────────
        getActiveConfig: () => {
            const state = get();
            return state.isEditMode ? state.draftConfig : state.publishedConfig;
        },
    };
});
