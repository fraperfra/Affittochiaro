/**
 * CMS Type Definitions
 * Types for the entire CMS system: theme, content, sections, versioning
 */

// ─── Theme Types ──────────────────────────────────────────────────────────────

export interface CMSColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface CMSThemeColors {
    primary: CMSColorScale;
    accent: CMSColorScale;
    teal: CMSColorScale;
    brandGreen: string;
    actionGreen: string;
    softGreen: string;
    errorRed: string;
    trustBlue: string;
    darkGray: string;
    mediumGray: string;
}

export interface CMSThemeFonts {
    heading: string;
    body: string;
}

export interface CMSThemeFontSizes {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
}

export interface CMSThemeSpacing {
    sectionPaddingY: string;
    sectionPaddingX: string;
    cardPadding: string;
    gap: string;
}

export interface CMSThemeBorderRadius {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
}

export interface CMSTheme {
    colors: CMSThemeColors;
    fonts: CMSThemeFonts;
    fontSizes: CMSThemeFontSizes;
    spacing: CMSThemeSpacing;
    borderRadius: CMSThemeBorderRadius;
}

// ─── Content Types ────────────────────────────────────────────────────────────

/**
 * Content is stored as a flat map: "pageId.sectionId.elementId" → text
 * Example: "home.hero.title" → "Smetti di inviare email a vuoto"
 */
export type CMSContent = Record<string, string>;

// ─── Section Types ────────────────────────────────────────────────────────────

export interface CMSSectionItem {
    id: string;
    label: string;
    visible: boolean;
    order: number;
}

export type CMSSections = Record<string, CMSSectionItem[]>; // pageId → sections[]

// ─── Config & Versioning ──────────────────────────────────────────────────────

export interface CMSConfig {
    theme: CMSTheme;
    content: CMSContent;
    sections: CMSSections;
}

export interface CMSVersion {
    id: string;
    timestamp: number;
    label: string;
    config: CMSConfig;
}

export interface CMSState {
    draftConfig: CMSConfig;
    publishedConfig: CMSConfig;
    versions: CMSVersion[];
    isEditMode: boolean;
    isDirty: boolean;
}
