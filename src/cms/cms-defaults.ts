/**
 * CMS Defaults
 * All current hardcoded values extracted from the codebase.
 * These serve as fallback when no CMS override exists.
 */
import { CMSConfig, CMSContent, CMSTheme, CMSSections } from './cms-types';

// ─── Default Theme (matches current tailwind.config.js) ───────────────────────

export const defaultTheme: CMSTheme = {
    colors: {
        primary: {
            50: '#E6FFF5', 100: '#B3FFE0', 200: '#80FFCC', 300: '#4DFFB8',
            400: '#1AFFA3', 500: '#00C48C', 600: '#00A376', 700: '#008261',
            800: '#00614B', 900: '#004036',
        },
        accent: {
            50: '#FFF2EC', 100: '#FFD9C7', 200: '#FFC0A3', 300: '#FFA77E',
            400: '#FF8E5A', 500: '#FF6B35', 600: '#E55A2A', 700: '#CC4A20',
            800: '#B33915', 900: '#99290B',
        },
        teal: {
            50: '#E6F5F2', 100: '#B3E0D8', 200: '#80CCBE', 300: '#4DB8A4',
            400: '#1AA38A', 500: '#0A8F70', 600: '#0A7A60', 700: '#0A5E4D',
            800: '#08493C', 900: '#05342B',
        },
        brandGreen: '#004832',
        actionGreen: '#00D094',
        softGreen: '#F4F9F6',
        errorRed: '#FF5A5F',
        trustBlue: '#2B7DE9',
        darkGray: '#1A1A1A',
        mediumGray: '#666666',
    },
    fonts: {
        heading: 'Inter, Roboto, system-ui, -apple-system, sans-serif',
        body: 'Inter, Roboto, system-ui, -apple-system, sans-serif',
    },
    fontSizes: {
        xs: '0.75rem', sm: '0.9375rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.625rem', '4xl': '2rem',
        '5xl': '2.25rem', '6xl': '3rem',
    },
    spacing: {
        sectionPaddingY: '4rem',
        sectionPaddingX: '1rem',
        cardPadding: '2rem',
        gap: '1.5rem',
    },
    borderRadius: {
        sm: '0.375rem', md: '0.5rem', lg: '0.75rem',
        xl: '1rem', '2xl': '1.5rem', full: '9999px',
    },
};

// ─── Default Content (all hardcoded texts) ────────────────────────────────────

export const defaultContent: CMSContent = {
    // Hero
    'home.hero.badge': 'NOVITÀ: VIDEO PRESENTAZIONE INQUILINO',
    'home.hero.title': 'Smetti di inviare email a vuoto. Trova casa in meno di 2 Settimane',
    'home.hero.subtitle': 'Basta ignorare annunci già scaduti. Crea il tuo Profilo Verificato, presenta te stesso con un CV dedicato e ricevi risposte dai proprietari in meno di 24 ore.',
    'home.hero.cta': 'CREA IL TUO PROFILO GRATIS',
    'home.hero.socialProof': 'Unisciti a 30.000+ inquilini felici',
    'home.hero.cardTitle': 'La più grande community di inquilini in Italia',
    'home.hero.cardSubtitle': 'Ogni 5 minuti un nuovo inquilino completa il suo profilo.',
    'home.hero.cardLabel': 'Inquilini Registrati e Verificati',
    'home.hero.cardCta': 'UNISCITI A LORO →',

    // Problems
    'home.problems.title': 'Cercare Casa in Affitto è un Incubo?',
    'home.problems.subtitle': 'Sappiamo cosa provi. Il mercato degli affitti oggi è frammentato, lento e spesso frustrante.',
    'home.problems.stat': '"Il 73% degli inquilini impiega oltre 2 mesi per trovare casa. Tu puoi farlo in 2 settimane."',

    // Benefits
    'home.benefits.title': 'Presenta Te Stesso Come il Candidato Ideale',
    'home.benefits.subtitle': 'Non sei solo un numero in una lista. Con Affittochiaro crei il curriculum perfetto dell\'inquilino.',

    // HowItWorks
    'home.howItWorks.title': 'Come Funziona',

    // Testimonials
    'home.testimonials.badge': 'TESTIMONIANZE',
    'home.testimonials.title': 'Cosa dicono i nostri inquilini',
    'home.testimonials.rating': 'Eccezionale 4.9/5 su Trustpilot',

    // FinalCTA
    'home.finalCta.badge': 'Inizia Ora',
    'home.finalCta.title': 'La tua prossima casa ti sta cercando',
    'home.finalCta.subtitle': 'Lascia i tuoi dati e ricevi proposte personalizzate direttamente nella tua email. Niente spam, solo annunci che fanno per te.',
    'home.finalCta.button': 'Voglio ricevere proposte',

    // FAQ
    'home.faq.title': 'Domande Frequenti',

    // Partners
    'home.partners.title': 'I nostri partner',
};

// ─── Default Sections (page layout) ──────────────────────────────────────────

export const defaultSections: CMSSections = {
    home: [
        { id: 'hero', label: 'Hero', visible: true, order: 0 },
        { id: 'partners', label: 'Partner Carousel', visible: true, order: 1 },
        { id: 'problems', label: 'Problemi', visible: true, order: 2 },
        { id: 'benefits', label: 'Benefici', visible: true, order: 3 },
        { id: 'howItWorks', label: 'Come Funziona', visible: true, order: 4 },
        { id: 'cityMap', label: 'Mappa Città', visible: true, order: 5 },
        { id: 'listings', label: 'Annunci', visible: true, order: 6 },
        { id: 'testimonials', label: 'Testimonianze', visible: true, order: 7 },
        { id: 'finalCta', label: 'CTA Finale', visible: true, order: 8 },
        { id: 'faq', label: 'FAQ', visible: true, order: 9 },
    ],
};

// ─── Full Default Config ──────────────────────────────────────────────────────

export const defaultConfig: CMSConfig = {
    theme: defaultTheme,
    content: defaultContent,
    sections: defaultSections,
};
