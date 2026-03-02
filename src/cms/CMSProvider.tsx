/**
 * CMS Provider
 * Wraps the app and injects CSS custom properties from the active CMS theme.
 */
import React, { useEffect } from 'react';
import { useCMSStore } from './cms-store';
import { CMSTheme } from './cms-types';

function applyThemeToDOM(theme: CMSTheme) {
    const root = document.documentElement;

    // Colors - primary scale
    Object.entries(theme.colors.primary).forEach(([key, val]) => {
        root.style.setProperty(`--cms-primary-${key}`, val);
    });
    // Colors - accent scale
    Object.entries(theme.colors.accent).forEach(([key, val]) => {
        root.style.setProperty(`--cms-accent-${key}`, val);
    });
    // Colors - teal scale
    Object.entries(theme.colors.teal).forEach(([key, val]) => {
        root.style.setProperty(`--cms-teal-${key}`, val);
    });
    // Brand colors
    root.style.setProperty('--cms-brand-green', theme.colors.brandGreen);
    root.style.setProperty('--cms-action-green', theme.colors.actionGreen);
    root.style.setProperty('--cms-soft-green', theme.colors.softGreen);
    root.style.setProperty('--cms-error-red', theme.colors.errorRed);
    root.style.setProperty('--cms-trust-blue', theme.colors.trustBlue);
    root.style.setProperty('--cms-dark-gray', theme.colors.darkGray);
    root.style.setProperty('--cms-medium-gray', theme.colors.mediumGray);

    // Fonts
    root.style.setProperty('--cms-font-heading', theme.fonts.heading);
    root.style.setProperty('--cms-font-body', theme.fonts.body);

    // Font sizes
    Object.entries(theme.fontSizes).forEach(([key, val]) => {
        root.style.setProperty(`--cms-fs-${key}`, val);
    });

    // Spacing
    root.style.setProperty('--cms-section-py', theme.spacing.sectionPaddingY);
    root.style.setProperty('--cms-section-px', theme.spacing.sectionPaddingX);
    root.style.setProperty('--cms-card-padding', theme.spacing.cardPadding);
    root.style.setProperty('--cms-gap', theme.spacing.gap);

    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, val]) => {
        root.style.setProperty(`--cms-radius-${key}`, val);
    });
}

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const draftConfig = useCMSStore((s) => s.draftConfig);
    const publishedConfig = useCMSStore((s) => s.publishedConfig);
    const isEditMode = useCMSStore((s) => s.isEditMode);

    const activeTheme = isEditMode ? draftConfig.theme : publishedConfig.theme;

    useEffect(() => {
        applyThemeToDOM(activeTheme);
    }, [activeTheme]);

    return <>{children}</>;
};

export default CMSProvider;
