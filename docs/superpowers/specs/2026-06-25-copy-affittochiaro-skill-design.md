# Skill "copy-affittochiaro" — design

## Obiettivo

Creare una Skill di Claude Code, specifica per questo progetto, che codifichi la voce/stile di Affittochiaro e una checklist di qualità del testo, così da poter:
1. analizzare il copy esistente (pagine, componenti, micro-copy) e segnalare dove si scosta dalle regole di voce del brand;
2. scrivere o riscrivere copy nuovo coerente con quella voce;
3. simulare un visitatore italiano alle prime armi sul sito per valutare chiarezza e produrre un report di audit.

Il deliverable della sessione che usa la skill è **solo un report** (nessuna modifica al codice).

## Contesto

- Affittochiaro inverte il mercato affitti: l'inquilino crea un "Curriculum dell'Inquilino" verificato (identità, reddito, referenze, video) e sono i proprietari/agenzie a contattarlo, non il contrario. Promessa centrale: ~2 settimane medie per trovare casa vs 2-3 mesi del mercato tradizionale.
- Esiste già `affittochiaro_copy_v2.md` (sul Desktop, fuori dal repo) con regole di voce molto precise: 2ª persona singolare, verbi d'azione, benefici con numeri concreti, contrasto "prima/dopo", niente "gratis", niente "Registrati" come CTA principale, niente "la nostra piattaforma", niente passivo, niente aggettivi vuoti (innovativo, rivoluzionario...), niente promesse non verificabili. Più il "test dei 3 secondi": chi arriva deve capire senza scrollare (a) cosa fa il sito, (b) come lo fa di diverso, (c) cosa deve fare adesso.
- Un audit precedente (SEO/accessibilità) ha già rilevato che 10 pagine pubbliche su 11 condividono lo stesso `<title>`/meta description generico — segnale che il copy non è stato curato in modo uniforme su tutto il sito, non solo in homepage.
- Decisioni prese in fase di brainstorming (vedi conversazione):
  - Una sola Skill, non un sub-agente separato.
  - `affittochiaro_copy_v2.md` è la fonte di verità per le regole di voce (non il copy live, che può discostarsene).
  - La simulazione "primo visitatore" userà un browser reale (Playwright contro il dev server), non solo lettura del codice.
  - Il deliverable di questa sessione è un report, non una riscrittura applicata al codice.

## Struttura della skill

Skill di progetto, vive dentro il repo: `Affittochiaro New/.claude/skills/copy-affittochiaro/`.

```
.claude/skills/copy-affittochiaro/
├── SKILL.md
└── references/
    ├── voce-affittochiaro.md
    ├── persona-checklist.md
    └── formato-report.md
```

### `SKILL.md`

Contenuto minimo, sempre caricato quando la skill si attiva:
- **Frontmatter**: `name: copy-affittochiaro`, `description` con i trigger espliciti (analizzare/scrivere/revisionare copy, microcopy, CTA, title/meta description, simulare un utente che arriva sul sito Affittochiaro).
- **Quando si attiva**: audit di copy esistente, scrittura di copy nuovo, simulazione "primo visitatore", revisione di title/meta/CTA.
- **Workflow** (4 passi):
  1. Individuare il copy in scope (file React specifici, oppure l'intero funnel/pagina se si lavora dal browser).
  2. Caricare `references/voce-affittochiaro.md` e confrontare il testo con le regole.
  3. Se il task è una simulazione utente, caricare anche `references/persona-checklist.md` e percorrere le pagine in ordine di visione reale (Playwright), annotando dove un primo visitatore capisce/non capisce/abbandonerebbe.
  4. Restituire l'output nel formato fissato da `references/formato-report.md` (se il task è un audit/report) — oppure, se il task è scrivere copy nuovo, il testo proposto con una riga di motivazione per ogni scelta non ovvia.
- Nota esplicita: la skill **non modifica file di codice di default** — produce testo/report; l'eventuale applicazione al codice è un passo separato e va richiesta esplicitamente.

### `references/voce-affittochiaro.md`

Adattamento di `affittochiaro_copy_v2.md` in forma di regole operative (✅ usa sempre / ❌ evita sempre, come nel doc originale) più il riassunto della value proposition (Curriculum dell'Inquilino, 2 settimane vs 2-3 mesi, niente commissioni) da usare come contesto per giudicare se un testo è coerente col brand, non solo grammaticalmente corretto. Includerà anche il "test dei 3 secondi" come criterio di valutazione per qualunque sezione above-the-fold.

### `references/persona-checklist.md`

Guida per incarnare un visitatore italiano generico che cerca casa in affitto, arrivato sul sito per la prima volta (es. da una ricerca Google o da un annuncio condiviso). Per ogni sezione vista durante lo scroll, la checklist chiede di rispondere a:
- Cosa penso che questo sito faccia, in questo punto preciso?
- C'è qualcosa che non capisco o che mi fa esitare?
- Cosa mi aspetto di poter fare subito, e il bottone/link più vicino me lo permette?
- Mi sembra rivolto a me (linguaggio, tono) o generico/aziendale?

### `references/formato-report.md`

Struttura fissa per i report prodotti dalla skill, riusabile in audit futuri:
1. **Cosa ho capito atterrando per la prima volta** — narrazione in ordine di scroll, con screenshot quando rilevante.
2. **Dove mi sono bloccato / cosa non è chiaro** — punti specifici, con riferimento a sezione/pagina.
3. **Scostamenti dalle regole di voce** — citazione del testo attuale, regola violata (da `voce-affittochiaro.md`), correzione proposta.
4. **Cosa scrivere** — proposte di copy puntuali (headline, subheadline, micro-copy, CTA) pronte da valutare, organizzate per pagina/sezione.

## Prossimo passo (dopo l'approvazione del piano)

Con la skill creata, applicarla concretamente:
1. Avviare il dev server (`npm run dev`).
2. Con Playwright, percorrere la homepage (e 1-2 pagine collegate rilevanti, es. Come Funziona / Annunci) come farebbe un primo visitatore: screenshot per ogni sezione nell'ordine di scroll.
3. Applicare `persona-checklist.md` sezione per sezione.
4. Confrontare il copy reale con `voce-affittochiaro.md`.
5. Restituire il report secondo `formato-report.md`.

## Fuori scope

- Nessuna modifica al codice/copy live in questa sessione.
- Nessun sub-agente `.claude/agents/` separato.
- Nessuna verifica SEO/accessibilità aggiuntiva (già coperta da un audit precedente) — qui il focus è solo chiarezza e voce del copy.
