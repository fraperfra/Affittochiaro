/**
 * CMS Hooks
 * Convenient hooks for reading CMS content, theme, and sections from components.
 */
import { useCMSStore } from './cms-store';
import { defaultContent, defaultSections } from './cms-defaults';

/**
 * Get a text value from the CMS.
 * Falls back to the default hardcoded text if no override exists.
 */
export function useCMSText(id: string): string {
    const isEditMode = useCMSStore((s) => s.isEditMode);
    const draftContent = useCMSStore((s) => s.draftConfig.content);
    const publishedContent = useCMSStore((s) => s.publishedConfig.content);

    const activeContent = isEditMode ? draftContent : publishedContent;
    return activeContent[id] ?? defaultContent[id] ?? '';
}

/**
 * Get the active theme (draft if editing, published otherwise).
 */
export function useCMSTheme() {
    const isEditMode = useCMSStore((s) => s.isEditMode);
    const draftTheme = useCMSStore((s) => s.draftConfig.theme);
    const publishedTheme = useCMSStore((s) => s.publishedConfig.theme);
    return isEditMode ? draftTheme : publishedTheme;
}

/**
 * Get visible sections for a page, sorted by order.
 */
export function useCMSSections(pageId: string) {
    const isEditMode = useCMSStore((s) => s.isEditMode);
    const draftSections = useCMSStore((s) => s.draftConfig.sections);
    const publishedSections = useCMSStore((s) => s.publishedConfig.sections);

    const activeSections = isEditMode ? draftSections : publishedSections;
    const pageSections = activeSections[pageId] ?? defaultSections[pageId] ?? [];

    return pageSections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order);
}

/**
 * Get all sections for a page (including hidden), for the CMS admin panel.
 */
export function useCMSAllSections(pageId: string) {
    const sections = useCMSStore((s) => s.draftConfig.sections);
    return sections[pageId] ?? defaultSections[pageId] ?? [];
}

/**
 * Check if CMS edit mode is active.
 */
export function useCMSEditMode() {
    return useCMSStore((s) => s.isEditMode);
}
