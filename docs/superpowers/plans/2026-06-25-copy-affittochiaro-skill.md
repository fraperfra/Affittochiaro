# Skill copy-affittochiaro + report primo visitatore — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare la skill di progetto `copy-affittochiaro` (regole di voce + checklist persona + formato report) e usarla per simulare un primo visitatore sulla homepage Affittochiaro, producendo un report di chiarezza/copy — senza modificare codice.

**Architecture:** Skill Claude Code di progetto in `.claude/skills/copy-affittochiaro/`, `SKILL.md` snello + 3 file in `references/`. Applicazione pratica via Playwright contro il dev server locale, output un report markdown in `docs/copy-audit/`.

**Tech Stack:** Markdown (skill + report), Playwright MCP (browser), Vite dev server (`npm run dev`, porta 3000).

## Global Constraints

- Fonte di verità per le regole di voce: `affittochiaro_copy_v2.md` (Desktop, fuori dal repo) — copiare le regole verbatim, non riformularle.
- Nessuna modifica a file di codice/copy del sito in questo piano — solo creazione skill + report.
- Dopo ogni task (commit incluso): push su `main` (politica standing del progetto — il sito è live su Vercel, ma qui non ci sono build da deployare essendo solo file `docs/`/`.claude/`, il push serve solo a non lasciare lavoro non sincronizzato).
- Skill di progetto: vive dentro `Affittochiaro New/.claude/skills/copy-affittochiaro/`.

---

### Task 1: `references/voce-affittochiaro.md`

**Files:**
- Create: `.claude/skills/copy-affittochiaro/references/voce-affittochiaro.md`

**Interfaces:**
- Consumes: regole di stile da `affittochiaro_copy_v2.md` (sezione "REGOLE DI STILE PER IL COPY"), value proposition da sezione FAQ dello stesso doc.
- Produces: file `references/voce-affittochiaro.md`, richiamato da `SKILL.md` (Task 4) e usato nel report (Task 6).

- [ ] **Step 1: Creare il file con questo contenuto esatto**

```markdown
# Voce di Affittochiaro

## Value proposition (da tenere a mente per ogni giudizio di coerenza)
Affittochiaro ribalta il mercato degli affitti: l'inquilino crea un profilo verificato (il "Curriculum dell'Inquilino": identità, reddito, referenze, video di presentazione) e sono i proprietari/agenzie a contattarlo direttamente, non il contrario. Tempo medio per trovare casa: ~2 settimane, contro i 2-3 mesi del mercato tradizionale. Nessuna commissione sull'affitto per chi cerca casa.

## ✅ Usa sempre
- Seconda persona singolare diretta: "Trova la tua casa", "Il tuo profilo", "Sei nel posto giusto"
- Verbi d'azione: Cerca, Trova, Crea, Ricevi, Scopri, Inizia
- Benefici concreti con numeri: "in 2 settimane", "300% di risposte in più", "8 giorni invece di 45"
- Frasi brevi, una idea per frase
- Contrasto esplicito: "Prima / Dopo", "Tradizionale / Affittochiaro"

## ❌ Evita sempre
- "Gratis" → usa "senza costi", "incluso", o non dirlo
- "Registrati" come CTA principale → usa azioni specifiche: "Cerca casa ora", "Crea il tuo profilo"
- "La nostra piattaforma" / "il nostro servizio" → parla del beneficio per l'utente
- Frasi passive: "Gli annunci vengono aggiornati" → "Aggiorniamo gli annunci ogni ora"
- Aggettivi vuoti: innovativo, rivoluzionario, all-in-one, leader di settore
- Promesse non verificabili: "il migliore", "il più veloce"

## Test dei 3 secondi
Chi arriva su una pagina (soprattutto above the fold) deve capire immediatamente, senza scorrere:
1. Cosa fa il sito/questa sezione
2. Come lo fa di diverso
3. Cosa deve fare adesso

Se una di queste tre informazioni manca, la sezione (non solo il testo) va segnalata come problema.

## Come usare questo file
Per ogni testo analizzato: confrontalo riga per riga con le liste sopra. Per ogni violazione, cita il testo esatto, indica la regola violata, proponi una riformulazione che la rispetti senza perdere il significato originale.
```

- [ ] **Step 2: Verificare la struttura del file**

Run: `grep -c "^##" ".claude/skills/copy-affittochiaro/references/voce-affittochiaro.md"`
Expected: `5` (le 5 sezioni: Value proposition, Usa sempre, Evita sempre, Test dei 3 secondi, Come usare questo file)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/copy-affittochiaro/references/voce-affittochiaro.md
git commit -m "feat: regole di voce Affittochiaro per skill copy-affittochiaro"
git push origin main
```

---

### Task 2: `references/persona-checklist.md`

**Files:**
- Create: `.claude/skills/copy-affittochiaro/references/persona-checklist.md`

**Interfaces:**
- Consumes: nessuna dipendenza da altri task.
- Produces: file `references/persona-checklist.md`, richiamato da `SKILL.md` (Task 4) e usato nel walkthrough (Task 5) e nel report (Task 6).

- [ ] **Step 1: Creare il file con questo contenuto esatto**

```markdown
# Checklist persona: primo visitatore

## La persona
Incarna un utente italiano che cerca casa in affitto, arrivato sul sito per la prima volta (da una ricerca Google tipo "case in affitto [città]" o da un annuncio condiviso). Ha già provato Immobiliare.it, Idealista o Subito. È stanco di scrivere lo stesso messaggio a decine di annunci senza risposta, ed è scettico verso "l'ennesimo portale".

## Come procedere
Percorri la pagina nell'ordine reale in cui un visitatore la vedrebbe scrollando (non l'ordine del codice). Per ogni sezione/blocco visibile in un singolo "stop" di scroll, rispondi a queste 4 domande prima di passare alla sezione successiva:

1. **Cosa penso che questo sito faccia, in questo punto preciso?** (Se la risposta cambia rispetto alla sezione precedente, segnalalo: vuol dire che il sito non sta costruendo un messaggio coerente.)
2. **C'è qualcosa che non capisco o che mi fa esitare?** (Termini tecnici non spiegati, promesse vaghe, numeri senza fonte, ambiguità su chi sono io rispetto al sito — inquilino, proprietario, agenzia.)
3. **Cosa mi aspetto di poter fare subito, e il bottone/link più vicino me lo permette?** (Se il CTA più vicino non corrisponde all'azione naturale a quel punto, segnalalo.)
4. **Mi sembra rivolto a me (linguaggio diretto, concreto) o generico/aziendale?**

## Segnali espliciti di abbandono da segnalare sempre
- Nessuna CTA visibile senza scrollare nella sezione hero
- Gergo tecnico o acronimi non spiegati alla prima occorrenza
- Promesse senza numero o fonte ("velocemente", "tanti annunci")
- Una sezione che ripete il messaggio della precedente senza aggiungere informazione nuova
- Più di un messaggio "chi sono io per questo sito" diverso nella stessa pagina (es. sembra rivolto a inquilini ma poi parla solo di agenzie)

## Output
Per ogni sezione, una riga sintetica con: nome sezione → cosa capisco → problema (se c'è) → severità (bloccante / fastidioso / minore).
```

- [ ] **Step 2: Verificare la struttura del file**

Run: `grep -c "^##" ".claude/skills/copy-affittochiaro/references/persona-checklist.md"`
Expected: `4` (La persona, Come procedere, Segnali espliciti di abbandono, Output)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/copy-affittochiaro/references/persona-checklist.md
git commit -m "feat: checklist persona primo visitatore per skill copy-affittochiaro"
git push origin main
```

---

### Task 3: `references/formato-report.md`

**Files:**
- Create: `.claude/skills/copy-affittochiaro/references/formato-report.md`

**Interfaces:**
- Consumes: nessuna dipendenza da altri task.
- Produces: file `references/formato-report.md`, richiamato da `SKILL.md` (Task 4) e usato per strutturare il report finale (Task 6).

- [ ] **Step 1: Creare il file con questo contenuto esatto**

```markdown
# Formato report di audit copy

Ogni report prodotto dalla skill segue questa struttura a 4 sezioni, in questo ordine:

## 1. Cosa ho capito atterrando per la prima volta
Narrazione in ordine di scroll/navigazione reale, sezione per sezione. Per ognuna: cosa comunica, se è coerente col messaggio delle sezioni precedenti, screenshot di riferimento se disponibile (path o descrizione).

## 2. Dove mi sono bloccato / cosa non è chiaro
Elenco puntuale, ogni punto con: sezione/pagina, cosa esattamente non è chiaro, perché (collegato alle 4 domande della persona-checklist), severità (bloccante / fastidioso / minore).

## 3. Scostamenti dalle regole di voce
Tabella o elenco con, per ogni scostamento: citazione esatta del testo attuale → regola violata (da voce-affittochiaro.md) → correzione proposta.

## 4. Cosa scrivere
Proposte di copy pronte da valutare (headline, subheadline, micro-copy, CTA), organizzate per pagina/sezione, ognuna con una riga di motivazione se la scelta non è ovvia. Sono proposte, non modifiche applicate al codice.

## Regole di stesura del report
- Linguaggio diretto, niente preamboli.
- Ogni affermazione di "non è chiaro" deve essere ancorata a un punto specifico (sezione, testo esatto), mai generica.
- Le sezioni 1 e 2 raccontano l'esperienza; le sezioni 3 e 4 sono azionabili.
```

- [ ] **Step 2: Verificare la struttura del file**

Run: `grep -c "^## " ".claude/skills/copy-affittochiaro/references/formato-report.md"`
Expected: `5` (1. Cosa ho capito, 2. Dove mi sono bloccato, 3. Scostamenti, 4. Cosa scrivere, Regole di stesura)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/copy-affittochiaro/references/formato-report.md
git commit -m "feat: formato report per skill copy-affittochiaro"
git push origin main
```

---

### Task 4: `SKILL.md`

**Files:**
- Create: `.claude/skills/copy-affittochiaro/SKILL.md`

**Interfaces:**
- Consumes: nomi e scopi dei 3 file in `references/` creati nei Task 1-3 (`voce-affittochiaro.md`, `persona-checklist.md`, `formato-report.md`).
- Produces: skill attivabile `copy-affittochiaro`, usata nei Task 5-6.

- [ ] **Step 1: Creare il file con questo contenuto esatto**

```markdown
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
```

- [ ] **Step 2: Verificare che i riferimenti citati esistano davvero**

Run: `grep -o 'references/[a-z-]*\.md' ".claude/skills/copy-affittochiaro/SKILL.md" | sort -u | while read f; do test -f ".claude/skills/copy-affittochiaro/$f" && echo "OK: $f" || echo "MANCANTE: $f"; done`
Expected: tre righe `OK: references/...md` (una per ciascun file citato), nessuna riga `MANCANTE`.

- [ ] **Step 3: Verificare il frontmatter**

Run: `head -4 ".claude/skills/copy-affittochiaro/SKILL.md"`
Expected:
```
---
name: copy-affittochiaro
description: Use when analyzing, writing, or reviewing copy, microcopy, CTAs, page titles, or meta descriptions for the Affittochiaro rental platform, or when simulating how a first-time visitor experiences the site. Encodes Affittochiaro's brand voice rules and a first-time-visitor persona checklist.
---
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/copy-affittochiaro/SKILL.md
git commit -m "feat: skill copy-affittochiaro (workflow + trigger)"
git push origin main
```

---

### Task 5: Walkthrough Playwright della homepage come primo visitatore

**Files:**
- Nessun file di progetto modificato. Output: screenshot salvati dal tool Playwright (path riportati nello step finale) e note di lavoro (in memoria di conversazione, non file) da riusare nel Task 6.

**Interfaces:**
- Consumes: skill `copy-affittochiaro` (Task 4), in particolare `references/persona-checklist.md` (Task 2).
- Produces: una sequenza di screenshot + osservazioni per sezione, usate come input diretto del Task 6 (nessuna interfaccia di codice: l'output è testo/immagini passati al task successivo nella stessa sessione).

- [ ] **Step 1: Avviare il dev server**

Run (background): `npm run dev`
Expected: log Vite con `Local: http://localhost:3000/`

- [ ] **Step 2: Navigare alla homepage con Playwright**

Aprire `http://localhost:3000/` nel browser Playwright, attendere il caricamento completo.
Expected: nessun errore in console bloccante (controllare con lo strumento "console messages" del browser Playwright).

- [ ] **Step 3: Percorrere la homepage sezione per sezione**

Per ciascuna sezione, nell'ordine reale di scroll (Hero → PartnersCarousel → Problems → Benefits → ComeFunziona → CityMap → Testimonials → FAQ → FinalCTA — ordine da `pages/HomePage.tsx`), scattare uno screenshot e applicare le 4 domande di `references/persona-checklist.md`.
Expected: uno screenshot per sezione (9 in totale) e una riga di osservazione per sezione, secondo il formato "Output" della checklist.

- [ ] **Step 4: Ripetere su 2 pagine collegate dal CTA principale**

Identificare il CTA più prominente della Hero (es. "Crea il tuo profilo" o equivalente) e la voce di navigazione principale "Come funziona" — navigare entrambe le pagine di destinazione e ripetere lo Step 3 (screenshot + 4 domande) per le loro sezioni principali.
Expected: screenshot + osservazioni anche per queste 2 pagine.

- [ ] **Step 5: Annotare i segnali di abbandono**

Rileggere tutte le osservazioni raccolte e segnalare esplicitamente ogni voce che corrisponde ai "Segnali espliciti di abbandono" di `references/persona-checklist.md`.
Expected: lista di segnali trovati (può essere vuota se nessuno è presente, ma va dichiarato esplicitamente).

Nessun commit in questo task (nessun file di progetto creato o modificato).

---

### Task 6: Report finale e consegna

**Files:**
- Create: `docs/copy-audit/2026-06-25-primo-visitatore-homepage.md`

**Interfaces:**
- Consumes: osservazioni e screenshot del Task 5, regole di `references/voce-affittochiaro.md` (Task 1), struttura di `references/formato-report.md` (Task 3).
- Produces: report finale, consegnato sia come file che come riepilogo in chat all'utente.

- [ ] **Step 1: Scrivere il report seguendo `references/formato-report.md`**

Compilare le 4 sezioni (Cosa ho capito, Dove mi sono bloccato, Scostamenti dalle regole di voce, Cosa scrivere) usando le osservazioni e gli screenshot del Task 5 e confrontando ogni testo rilevante con `references/voce-affittochiaro.md`. Ogni scostamento deve citare il testo esatto trovato nel codice (file:riga) e la regola violata.

- [ ] **Step 2: Verificare la struttura del report**

Run: `grep -c "^## " "docs/copy-audit/2026-06-25-primo-visitatore-homepage.md"`
Expected: `4` (le 4 sezioni del formato)

- [ ] **Step 3: Commit**

```bash
git add docs/copy-audit/2026-06-25-primo-visitatore-homepage.md
git commit -m "docs: report primo visitatore homepage (skill copy-affittochiaro)"
git push origin main
```

- [ ] **Step 4: Presentare il riepilogo in chat**

Riassumere in chat (max 1 paragrafo + punti elenco) i 2-3 problemi più bloccanti trovati e le 2-3 proposte di copy più ad alto impatto, rimandando al file per il resto. Nessuna modifica al codice viene applicata in questo task — solo la segnalazione.

---

## Note per l'esecuzione

- I Task 1-4 sono indipendenti tra loro nel contenuto ma vanno fatti in ordine (1→2→3→4) perché il Task 4 referenzia i nomi file dei Task 1-3 nella verifica del Suo Step 2.
- I Task 5-6 dipendono dal Task 4 completato (la skill deve esistere ed essere coerente prima di "applicarla").
- Se durante il Task 5 il dev server non parte sulla porta 3000 (es. porta occupata), leggere la porta effettiva dal log di Vite e usarla per la navigazione Playwright — non è un blocco del piano, solo un dettaglio di esecuzione.
