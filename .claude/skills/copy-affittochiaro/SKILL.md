---
name: copy-affittochiaro
description: Use when analyzing, writing, or reviewing copy, microcopy, CTAs, page titles, or meta descriptions for the Affittochiaro rental platform, or when simulating how a first-time visitor experiences the site. Encodes Affittochiaro's brand voice rules and a first-time-visitor persona checklist.
---

# Copy Affittochiaro

## Quando si attiva
- Devi scrivere o riscrivere copy (headline, subheadline, CTA, micro-copy, title/meta description) per il sito Affittochiaro.
- Devi valutare se un testo esistente è coerente con la voce del brand.
- Devi simulare l'esperienza di un primo visitatore sul sito (chiarezza, comprensione, punti di abbandono).

## Workflow

1. **Individua il copy in scope.** File React specifici (per una revisione puntuale) oppure l'intera pagina/funnel vista nell'ordine reale di navigazione (per una simulazione utente, anche via browser).
2. **Carica `references/voce-affittochiaro.md`** e confronta il testo con le regole di voce e il test dei 3 secondi.
3. **Se il task è una simulazione di un primo visitatore**, carica anche `references/persona-checklist.md` e percorri le pagine nell'ordine reale di scroll/navigazione, annotando comprensione, esitazioni e aspettative ad ogni sezione.
4. **Restituisci l'output:**
   - Se il task è un audit/simulazione → usa la struttura di `references/formato-report.md`.
   - Se il task è scrivere copy nuovo → restituisci il testo proposto, con una riga di motivazione per ogni scelta non ovvia rispetto alle regole di voce.

## Vincolo
Questa skill non modifica file di codice per default: produce testo e report. Applicare le modifiche al codice è un passo separato, da richiedere esplicitamente.
