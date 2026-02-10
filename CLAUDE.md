# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Affittochiaro landing page - an Italian property rental platform focused on tenant profiles ("Curriculum dell'Inquilino"). React + TypeScript SPA with AI-powered features via open ai.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for AI tenant pitch generation features.

## Architecture

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS (CDN), React Router v7

**Key Directories:**
- `components/` - Reusable UI components (Header, Hero, CityMap, etc.)
- `pages/` - Route page components (HomePage, AnnunciPage, FAQPage, etc.)
- `hooks/` - Custom React hooks (useNotifications)
- `services/` - External API services (geminiService.ts for Gemini AI)
- `data/` - Static data (cities, listings, notifications, advantages)
- `assets/` - Static media files

**Routing (React Router v7):**
- `/` → HomePage
- `/annunci` → AnnunciPage (listings)
- `/come-funziona` → ComeFunzionaPage
- `/faq` → FAQPage

**Path Alias:** `@/*` maps to project root

## Styling

Tailwind CSS with custom theme colors:
- Brand: `brand-green` (#004832), `action-green` (#00D094)
- UI: `soft-green`, `error-red` (#FF5A5F), `trust-blue` (#2B7DE9)
- Custom border radius: `rounded-4xl` (2rem), `rounded-5xl` (2.5rem)

Styles defined in `index.html` via Tailwind CDN configuration.

## Key Features

- Interactive Italy map with clickable cities (`CityMap.tsx` + `data/cities.ts`)
- Live notification system (`useNotifications` hook with 10s rotation, 6s auto-dismiss)
- Exit-intent popup, sticky bottom bar, mobile menu
