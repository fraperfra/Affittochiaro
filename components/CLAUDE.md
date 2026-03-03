# components/ — Landing Page

These are landing page components only (not the app dashboard).
Loaded via `pages/HomePage.tsx`, separate from `src/components/`.

## Key Components
- `Hero` — split copy/community-card, animated counter, city name prop
- `HowItWorks` — 3-step process cards
- `Benefits` — benefit cards from `data/advantages.ts`
- `Testimonials` — horizontal scroll on mobile, grid on desktop
- `FinalCTA` — lead capture form
- `PartnersCarousel` — infinite marquee, logos at full color (no grayscale)
- `CityMap` — interactive Italy SVG map
- `LiveNotifications` — rotating toast-style notifications

## Styling (landing only)
- Tailwind via **CDN** (`index.html` inline config) — not PostCSS
- Brand: `brand-green` #004832 · `action-green` #00D094 · `soft-green` #F4F9F6
- Section pattern: white bg / gray-50 bg alternating, `border-b border-gray-100`
- No decorative blobs (`blur-[Xpx]`), no `rounded-[2.5rem]+`, no `hover:shadow-xl`
- Badge labels: `border-l-2 border-action-green pl-3` style (not pill/rounded-full)

## CMS Hook
A hook auto-wraps editable text in `<InlineEditor>` from `src/cms/`.
Do not fight it — just make design edits, the hook will add its wrappers on save.
