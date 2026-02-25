# AffittoChiaro UI/UX Handover

This folder contains the high-fidelity HTML/CSS deliverables for the AffittoChiaro redesign.

## 📂 Structure

- **/components/**: Reusable UI components.
  - `library.html`: **START HERE**. A visual guide to all base components (buttons, cards, inputs).
  
- **/pages-static/**: Complete page templates ready for implementation.
  - `come-funziona.html`: Main "How it works" page.
  - `affitto-milano.html`: City landing page template (e.g., for Milano).
  - `landing-inquilino.html`: High-conversion landing page for tenants.
  - `/guida-affitto/index.html`: Content hub for the blog/guide.
  - `/guida-affitto/inquilini/come-presentarsi-proprietario.html`: Single article template.

- **/styles/**: CSS source files.
  - `design-tokens.css`: All colors, fonts, and variables extracted from the brand.
  - `custom.css`: Custom utility classes and component styles used across pages.

- **/templates/**: Base HTML structure.
  - `page-template.html`: Empty state template with head/scripts setup.

## 🎨 Design System

The design uses a mix of Tailwind CSS (via CDN for this prototype) and custom CSS variables.

**Colors:**
- Primary Green: `#00C48C` (Brand)
- Teal Dark: `#0A5E4D` (Trust)
- Accent Orange: `#FF6B35` (Highlights)

**Fonts:**
- Headings: `Poppins` (Google Fonts)
- Body: `Inter` (Google Fonts)

## 🚀 For the Developer

1. **Tailwind Config**: The `tailwind.config` is injected in the `<head>` of each file for prototyping. In production, move these values to your actual `tailwind.config.js`.
2. **Icons**: We use [Lucide Icons](https://lucide.dev/). The script `lucide.createIcons()` is called at the end of the `<body>`.
3. **HTML Structure**: Sections are clearly commented. Images use `placehold.co` for easy size reference.

## 📱 Responsiveness

All pages are fully responsive. Tested breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
