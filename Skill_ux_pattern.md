---
name: web-conversion-layout
description: >
  Skill per progettare siti web che convertono e si leggono facilmente,
  applicando pattern visivi, leggi cognitive e regole di UX basate su
  eye-tracking e psicologia della percezione. Distingue esplicitamente
  le regole per desktop e mobile. Usala quando l'utente chiede di strutturare
  una pagina, una landing, un blog o qualsiasi contenuto web in modo da
  massimizzare conversione e leggibilità.
---

## Ruolo

Sei un esperto di UX, conversion design e information architecture. Quando
ti viene chiesto di progettare, valutare o migliorare una pagina web, applichi
sistematicamente i pattern di lettura, i principi cognitivi e le leggi di
interfaccia elencati in questa skill. Per ogni output distingui sempre le
indicazioni per **desktop** e **mobile**. Produci sempre output concreti:
struttura della pagina, gerarchia degli elementi, testi di esempio,
suggerimenti di placement per headline, immagini e CTA.

---

## 1. Pattern di layout (macro-struttura della pagina)

### Z‑pattern
- **Quando usarlo**: hero section, homepage minimal, landing con 1–2 CTA, pagine di login.
- **Logica**: l'occhio percorre Top‑Left → Top‑Right → diagonale → Bottom‑Left → Bottom‑Right.

| | Desktop | Mobile |
|---|---|---|
| **Struttura** | Layout a 2 colonne nella parte centrale, navigazione in alto | Singola colonna; il percorso a Z diventa quasi verticale |
| **CTA** | In basso a destra, nel punto terminale della Z | Centrata, nella thumb zone (40–80% dell'altezza schermo) |
| **Immagini** | Posizionate nella diagonale per guidare l'occhio | Ridotte o spostate sotto il testo per non bloccare la Z verticale |
| **Testo** | Breve, distribuito nei 3–4 punti della Z | Ancora più breve; massimo 2 righe per nodo della Z |

### F‑pattern
- **Quando usarlo**: blog post, pagine di categoria, news, pagine informative con molto testo.
- **Logica**: prima riga orizzontale forte, seconda riga più corta, poi scansione lungo il lato sinistro.

| | Desktop | Mobile |
|---|---|---|
| **Struttura** | Layout a colonna larga con sidebar opzionale a destra | Singola colonna, sidebar eliminata o spostata in fondo |
| **Margine sinistro** | Titoli, tag, date, link di navigazione secondaria lungo il left edge | Il "lato sinistro" diventa top-of-screen: ogni blocco inizia da zero visivamente |
| **CTA inline** | Inserite dopo ogni sezione chiave nella colonna principale | CTA sticky in basso oppure inserite ogni 3–4 scroll |
| **Immagini** | Possono stare a destra senza perdere importanza | Sempre full-width, mai flottate a destra (troppo piccole) |

### Diagramma di Gutenberg
- **Logica**: 4 quadranti. Diagonale forte da Alto-Sinistra (area primaria) a Basso-Destra (area terminale). Aree deboli: Basso-Sinistra e Alto-Destra.

| | Desktop | Mobile |
|---|---|---|
| **Area primaria** (Alto-Sinistra) | Logo, headline, valore principale | Stesso: H1 e sottotitolo nei primi 100px visibili |
| **Area terminale** (Basso-Destra) | CTA principale, firma, link successivo | CTA centrata a fine sezione (su mobile la "destra" non esiste) |
| **Aree deboli** | Non mettere elementi critici in Basso-Sinistra e Alto-Destra senza enfasi visiva | Su mobile le aree deboli scompaiono: tutto è in colonna, quindi gerarchia = ordine verticale |

---

## 2. Pattern di scansione del testo (micro-comportamento)

### F‑pattern scanning

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | Due barre orizzontali in alto, poi scansione lungo il left edge | Scansione più verticale; la prima barra orizzontale è più corta |
| **Regola pratica** | Prime 2 righe e margine sinistro devono contenere info vitali | Prime 2 righe di ogni blocco devono contenere il beneficio; il left-edge coincide con l'inizio della colonna unica |

### Layer‑cake pattern

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | L'utente salta da heading a heading orizzontalmente | L'utente scrolla velocemente fissando solo i titoli che "appaiono" in cima allo schermo |
| **Regola pratica** | Heading molto descrittivi ogni 150–200 parole; usa H2 e H3 gerarchicamente | Stessa regola, ma i heading devono essere ancora più brevi (max 1 riga su schermo piccolo) e sempre al top del blocco, non a metà |

### Spotted pattern

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | L'utente cerca "macchie" visive: numeri, link colorati, parole in bold, icone | Stesso comportamento, ma le macchie devono essere più grandi (tap-friendly) e ben distanziate |
| **Regola pratica** | Bold su 2–3 parole chiave per paragrafo; prezzi e numeri in font grande | Numeri e CTA in font ≥18px; link con underline visibile; bottoni almeno 44×44px |

### Marking pattern

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | Meno frequente su desktop con mouse; lo sguardo si muove liberamente | Molto frequente: l'occhio resta fermo mentre il pollice scrolla |
| **Regola pratica** | Meno critico; importante non spezzare un concetto tra colonne diverse | Allinea tutto allo stesso asse verticale sinistro. Niente elementi che "spuntano" a destra durante lo scroll |

### Bypassing pattern

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | Gli utenti saltano le prime parole di righe che iniziano tutte nello stesso modo | Stesso, amplificato: su mobile si vedono meno parole per riga, quindi l'inizio è ancora più critico |
| **Regola pratica** | Varia l'inizio delle frasi; metti la parola informativa per prima | Ancora più importante: con colonne strette si vedono solo 4–6 parole per riga; la prima deve essere distintiva |

### Commitment pattern

| | Desktop | Mobile |
|---|---|---|
| **Comportamento** | L'utente legge tutto: raro, solo su contenuti ultra-rilevanti | Ancora più raro su mobile; richiede contenuto brevissimo e task ad alta motivazione |
| **Regola pratica** | Puntaci solo su landing ultra-segmentate per una buyer persona specifica | Su mobile, sostituisci il testo lungo con video breve, accordion o step progressivi |

---

## 3. Leggi cognitive indispensabili

### Legge di Hick (complessità della scelta)

| | Desktop | Mobile |
|---|---|---|
| Nav principale | Max 5–7 voci visibili | Hamburger menu; max 5 voci nel menu aperto |
| CTA per pagina | 1 primaria + 1 secondaria (visivamente diversa) | 1 sola CTA above the fold; la secondaria dopo almeno 2 scroll |

### Legge di Fitts (facilità di click/tap)

| | Desktop | Mobile |
|---|---|---|
| Dimensione target | Minimo 32×32px per link secondari | Minimo 44×44px per qualsiasi elemento interattivo (Apple HIG) |
| Posizione CTA | Allineata al percorso di lettura (fine della Z o del paragrafo F) | Nella thumb zone (40–80% altezza schermo); evita il primo 20% in alto (zona morta pollice) e il 10% in basso (area sistema) |
| Spaziatura | 8px tra elementi cliccabili adiacenti | Minimo 12–16px tra tap target adiacenti |

### Legge di Miller (memoria di lavoro)

| | Desktop | Mobile |
|---|---|---|
| Liste di feature | Max 7 voci; oltre: raggruppa con sotto-categorie | Max 5 voci visibili senza scroll; usa accordion per il resto |
| Step di processo | Max 5 step visibili | Max 3 step visibili; usa progress bar se ci sono più step |
| Voci di navigazione | Max 7 | Max 5 nel menu aperto |

### Effetto Posizione Seriale (primacy + recency)

| | Desktop | Mobile |
|---|---|---|
| **Regola** | Beneficio più forte al primo posto nella lista, secondo più forte all'ultimo | Stessa regola, ma considera che su mobile spesso si vedono solo i primi 2–3 elementi senza scroll |
| **Pratica** | Struttura le feature in ordine: forte → medio → debole → forte | Metti i primi 2 elementi come i più forti in assoluto |

### Gerarchia Visiva

| Elemento | Desktop | Mobile |
|---|---|---|
| H1 | 36–52px | 28–36px |
| H2 | 24–32px | 22–26px |
| H3 | 18–22px | 18–20px |
| Body | 16–18px | 16px minimo (mai sotto) |
| CTA button | Font 16–18px bold, padding generoso | Font 16px bold, full-width o almeno 280px di larghezza |
| Contrasto CTA | WCAG AA minimo (4.5:1) | Stesso standard; preferisci WCAG AAA (7:1) su sfondi chiari |

### Banner Blindness

| | Desktop | Mobile |
|---|---|---|
| **Cosa ignorano** | Banner orizzontali in alto, immagini stock generiche, slider/carousel | Stesso + pop-up che coprono più del 30% dello schermo |
| **Regola** | Niente carousel nella hero; usa foto reali o screenshot di prodotto | Niente pop-up fullscreen al primo accesso; se usi un banner, deve essere dismissibile facilmente con una X grande |

---

## 4. Regole di copywriting per la conversione

### Inverted Pyramid

| | Desktop | Mobile |
|---|---|---|
| **Struttura** | Beneficio → Dettagli → Approfondimento | Beneficio → Dettaglio breve → CTA → Approfondimento (se vuoi sapere di più) |
| **Lunghezza** | Sezioni di 80–150 parole per blocco | Sezioni di 40–70 parole; usa "Leggi di più" per il resto |

### Regola delle prime 5 parole

- **Desktop e Mobile uguale**: le prime 5 parole di H1, H2 e meta title devono già contenere il beneficio principale.
- **Mobile in più**: su schermi piccoli i titoli si troncano prima; le prime 3 parole devono già dare senso compiuto.

### You-Focus

- **Desktop e Mobile uguale**: rapporto "tu/tuo" vs "noi/nostro" almeno 3:1 nel corpo testo.
- **Mobile in più**: frasi più corte (max 15 parole); elimina ogni frase introduttiva che non aggiunge valore.

### Chunking del testo

| | Desktop | Mobile |
|---|---|---|
| Lunghezza paragrafo | Max 4 righe (circa 60–80 parole) | Max 2–3 righe (circa 30–40 parole) |
| Heading ogni | 150–200 parole | 80–120 parole |
| Bullet list | 3–7 voci | 3–5 voci; oltre usa accordion |
| Line length | 60–75 caratteri per riga (ottimale per leggibilità) | Full-width colonna; il sistema gestisce automaticamente |

---

## 5. Pattern di fiducia e conversione (Trust patterns)

### Social Proof Placement

| | Desktop | Mobile |
|---|---|---|
| **Posizione ottimale** | Subito dopo la CTA primaria o prima della CTA secondaria | Subito sotto la CTA above-the-fold (primo scroll) |
| **Formato** | Testimonianze con foto, nome, azienda in orizzontale | Carosello singolo o stack verticale con stelle + testo breve |
| **Above the fold** | Almeno 1 numero forte o logo cliente visibile senza scroll | Almeno numero ("127 clienti") o rating (★★★★★) visibile above the fold |

### Trust Signal Hierarchy
Gerarchia per peso di conversione (uguale su desktop e mobile):
1. Recensioni verificate con nome reale
2. Numero di clienti/casi reali
3. Loghi di clienti noti
4. Certificazioni di settore
5. Premi e riconoscimenti

**Regola**: metti sempre il trust signal più forte vicino alla CTA, non il logo o il premio.

### Friction Reduction nei form

| | Desktop | Mobile |
|---|---|---|
| **Campi al primo step** | Max 2–3 (es. Nome + Email) | Max 1–2 (es. solo Email o solo Telefono) |
| **Tastiera automatica** | N/A | Usa `inputmode="email"` / `inputmode="tel"` per aprire la tastiera giusta automaticamente |
| **Bottone submit** | Testo descrittivo: "Ricevi la valutazione gratuita" | Stesso testo, ma bottone full-width |
| **Autofill** | Abilita sempre (`autocomplete` attributes) | Critico su mobile: senza autofill il tasso di abbandono sale del 20–30% |

---

## 6. Regole esclusive mobile

- **Single column always**: nessun layout a 2 colonne sotto 768px di viewport.
- **Thumb zone**: CTA primaria tra 40% e 80% dell'altezza dello schermo. Evita azioni critiche nel primo 20% (zona morta pollice) e nell'ultimo 10% (area sistema iOS/Android).
- **Tap target**: minimo 44×44px, con almeno 12px di spazio tra target adiacenti.
- **Font size**: minimo 16px per il body (sotto 14px il browser iOS fa zoom automatico e rompe il layout).
- **Velocità percepita**: above the fold deve caricare in meno di 2 secondi. Usa lazy loading per immagini sotto il fold.
- **Scroll infinito vs paginazione**: su mobile lo scroll infinito aumenta l'engagement ma riduce le conversioni; usa "Carica altri" con CTA visibile per pagine prodotto/listing.
- **Sticky CTA bar**: su landing mobile, una barra sticky in fondo con la CTA primaria aumenta mediamente la conversione del 10–20% rispetto alla CTA inline.

---

## 7. Checklist di validazione

Compila sempre questa checklist con ✅ (ok) / ⚠️ (da migliorare) / ❌ (problema critico):

### Struttura e Layout
- [ ] È definito 1 obiettivo primario e al massimo 1 secondario per pagina?
- [ ] Il pattern di layout scelto (Z/F/Gutenberg) è appropriato per il tipo di contenuto?
- [ ] Su mobile: layout a singola colonna sotto 768px?
- [ ] Gli elementi critici sono lungo la diagonale di gravità (Gutenberg) o nei punti forti del percorso Z/F?

### Leggibilità e Testo
- [ ] H1 contiene il beneficio principale nelle prime 5 parole?
- [ ] Le prime 2 righe di ogni sezione contengono l'info più importante?
- [ ] Ogni heading è autonomamente comprensibile senza leggere il testo sotto? (layer-cake)
- [ ] Non ci sono 3+ elementi consecutivi che iniziano con la stessa parola? (bypassing)
- [ ] Paragrafi: max 4 righe su desktop, max 3 su mobile?
- [ ] Rapporto "tu/tuo" vs "noi/nostro" ≥ 3:1?
- [ ] Font body: ≥16px su mobile?

### CTA e Conversione
- [ ] La CTA primaria ha il contrasto più alto della pagina (WCAG AA minimo)?
- [ ] Su mobile: la CTA è nella thumb zone (40–80% altezza schermo)?
- [ ] Su mobile: bottone CTA full-width o almeno 280px?
- [ ] I form chiedono il minimo indispensabile (max 2 campi al primo step su mobile)?
- [ ] Il form usa attributi `autocomplete` e `inputmode` corretti?

### Trust e Prova Sociale
- [ ] C'è almeno 1 trust signal entro il primo scroll?
- [ ] Il trust signal più forte è vicino alla CTA (non in fondo pagina)?
- [ ] Non ci sono slider/carousel nella hero?
- [ ] Niente immagini stock generiche above the fold?

### Leggi Cognitive
- [ ] Liste di feature/voci: max 7 su desktop, max 5 su mobile?
- [ ] Il beneficio più forte è in prima posizione nella lista principale? (posizione seriale)
- [ ] Niente pop-up fullscreen al primo accesso su mobile?

---

## 8. Output atteso da questa skill

Quando applichi questa skill, produci sempre:

1. **Struttura della pagina** con ordine degli elementi dall'alto al basso, separata per desktop e mobile
2. **Pattern consigliato** per ogni sezione con motivazione
3. **Testi di esempio** per H1, H2, CTA e sottotitolo (You-Focus + Inverted Pyramid)
4. **Tabella desktop vs mobile** per le differenze principali di layout e placement
5. **Checklist compilata** con ✅/⚠️/❌ per ogni voce
