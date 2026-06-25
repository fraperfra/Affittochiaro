# Report: primo visitatore sulla homepage Affittochiaro

Simulazione fatta con browser reale (Playwright, dev server locale, viewport 1440×900) seguendo `references/persona-checklist.md` della skill `copy-affittochiaro`, confrontando il copy con `references/voce-affittochiaro.md`. Pagine percorse: homepage (tutte le sezioni, in ordine di scroll), `/come-funziona`, `/register` (destinazione del CTA principale).

## 1. Cosa ho capito atterrando per la prima volta

**Primo istante (0 secondi):** prima ancora di leggere qualunque cosa, un popup "Installa l'App" copre l'hero a schermo intero. Non ho ancora capito cosa fa il sito e mi viene già chiesto di installarlo.

**Dopo aver chiuso il popup — Hero:** capisco subito il "cosa": *"Trova casa in affitto in 2 Settimane."* Il sottotitolo aggiunge *"Crea il tuo profilo e ricevi proposte da privati e agenzie in meno di 48 ore"* — qui inizio a esitare (vedi sezione 2, primo numero diverso dal titolo). La card a destra ("Il portale di inquilini più grande in Italia", 31.295 inquilini, 4.9/5 Trustpilot) rinforza la fiducia con numeri concreti. Il widget di ricerca sotto ("Cosa stai cercando?") mi dice esattamente cosa fare. Fin qui il "test dei 3 secondi" funziona, a parte il numero ballerino.

**Partner ("Domeo, Holidu, Switcho"):** segnale di fiducia rapido, non genera dubbi.

**Problema ("Cercare casa in affitto è un incubo"):** tre card mi descrivono esattamente la mia frustrazione ("Il proprietario non sa chi sei", "Non hai strumenti per mostrarti", "Mesi di ricerca, zero risultati"). Coerente con l'hero, linguaggio diretto, mascotte illustrata gradevole.

**Soluzione ("Presenta te stesso come il candidato ideale"):** 4 card (Dati Verificati, Video Presentazione, Lavoro Trasparente, La Tua Storia) spiegano come si costruisce il profilo. Coerente con la promessa iniziale.

**Come funziona (sezione in home):** tab "Sono un inquilino"/"Sono un proprietario", 3 step con screenshot reali del prodotto (mockup dashboard). Buona scelta — non solo testo, vedo il prodotto.

**"AffittoChiaro è vicino a te":** mappa Italia + testimonianza. Qui la persona della testimonianza cambia (un'agenzia che parla di aver trovato un inquilino), mentre il resto della sezione parla a me, inquilino — vedi sezione 2.

**Stats + testimonianze:** 3 numeri (30.000+ profili, 4.9/5, 2 sett.) e 3 recensioni di inquilini reali con nome e città. Buon rinforzo, coerente con l'hero.

**FAQ ("Hai qualche dubbio?"):** risposte dettagliate, ma introducono un terzo numero di tempo diverso (24 ore, poi 48 ore in un'altra risposta) — vedi sezione 2.

**CTA finale + footer:** chiusura chiara ("Trova la casa dei tuoi sogni con Affittochiaro"), footer ordinato con link utili e newsletter.

**Cliccando "TROVA CASA" (il CTA più prominente nell'header):** mi aspetto di vedere annunci o una ricerca. Arrivo invece su un form "Crea il tuo Account" generico, senza alcun richiamo al motivo per cui sto compilando questi dati — vedi sezione 2.

**Visitando "/come-funziona" dal menu:** la pagina è quasi identica alla sezione "Come funziona" già vista in home (stesso titolo, stesso sottotitolo, stesso step 01 con lo stesso testo). Non ho imparato nulla di nuovo cliccando.

## 2. Dove mi sono bloccato / cosa non è chiaro

| # | Sezione/Pagina | Problema | Severità |
|---|---|---|---|
| 1 | Homepage, primo caricamento | Popup "Installa l'App" copre l'intero hero (titolo, sottotitolo, ricerca) prima che l'utente abbia letto una parola. Sulla mia prima visita reale, ha bloccato la visuale finché non ho cliccato "Forse più tardi". | **Bloccante** |
| 2 | Qualsiasi pagina, alla chiusura tab/refresh/digitazione URL | `components/ExitIntentPopup.tsx:17-24,38` registra un listener `beforeunload` che chiama `e.preventDefault()` per forzare il dialog nativo del browser ("Vuoi davvero uscire?") al primo tentativo di lasciare il sito — anche se non ho compilato nulla. L'ho incontrato io stesso 2 volte durante questa simulazione, su una homepage senza alcun form in corso di compilazione. È anche un bug: il guard "una volta per sessione" (`hasShown`) vive solo in uno state React, mai scritto su `sessionStorage` da `handleBeforeUnload` (solo `closePopup` lo fa) — quindi ad ogni reload/cambio URL diretto il trappolone si riarma. | **Bloccante** |
| 3 | Hero (sottotitolo) vs FAQ | Tre promesse di tempo diverse senza spiegazione di cosa misurano: H1 "2 Settimane" (`pages`/`components/Hero.tsx`), sottotitolo hero "meno di 48 ore" (`Hero.tsx:51`), FAQ "risponde in meno di 24 ore" (`FAQ.tsx:11`) e FAQ "risposta entro 48 ore" (`FAQ.tsx:19`). Sembrano riferirsi a momenti diversi (prima risposta vs casa trovata) ma nel testo non è mai detto esplicitamente — un primo visitatore le legge come numeri che si contraddicono. | **Fastidioso** |
| 4 | Header → CTA "TROVA CASA" | Il bottone più visibile del sito (`components/Header.tsx:87`) porta a `/register`, un form "Crea il tuo Account" generico — non a una ricerca annunci né a un richiamo della promessa ("profilo verificato", "proposte in 48 ore"). Chi clicca "TROVA CASA" aspettandosi di *vedere case* trova invece un form da compilare, senza nessun motivo ripetuto per cui ne vale la pena. | **Fastidioso** |
| 5 | `/come-funziona` | La pagina dedicata ripete quasi parola per parola la sezione "Come funziona Affittochiaro" già vista in homepage (stesso titolo, stesso sottotitolo, stesso step 01). Chi ci clicca dal menu aspettandosi più dettaglio non trova informazione nuova. | **Fastidioso** |
| 6 | "AffittoChiaro è vicino a te" (CityMap) | La sezione parla a un inquilino ("trovi sempre l'opportunità giusta nella tua zona") ma la testimonianza subito sotto è di un'agenzia che parla di aver trovato un inquilino in 3 giorni (`components/CityMap.tsx:46`). Per un attimo non capisco per chi è scritta questa parte. | **Minore** |
| 7 | Footer | Copyright "© 2025 Affittochiaro" (`components/Footer.tsx:140`) — oggi è il 2026: un dettaglio che, su un sito che chiede dati sensibili (reddito, documenti), trasmette "non aggiornato" a un visitatore scettico. | **Minore** |
| 8 | `/register` | "Hai gia un account?" senza accento su "già" (`src/pages/RegisterPage.tsx:250`). | **Minore** |

## 3. Scostamenti dalle regole di voce

| Testo attuale | Regola violata (`voce-affittochiaro.md`) | Correzione proposta |
|---|---|---|
| "Il portale di inquilini più grande in Italia" (`components/Hero.tsx:79`) | ❌ Evita sempre → "Promesse non verificabili: il migliore, il più veloce" | "Il portale con 31.295 inquilini verificati in tutta Italia" — il numero che già hai nella card sostituisce il superlativo non verificabile. |
| "Crea il tuo profilo e ricevi proposte da privati e agenzie in meno di 48 ore." + H1 "in 2 Settimane" (`Hero.tsx:46-51`) | ✅ Usa sempre → "Benefici concreti con numeri" presuppone numeri che si rinforzano, non numeri che competono tra loro senza spiegazione | Distinguere esplicitamente i due momenti: "Trova casa in affitto in 2 settimane. Crea il tuo profilo e ricevi le prime proposte in meno di 48 ore." — la seconda frase diventa il *primo passo* della prima, non un numero alternativo. |
| "Crei un profilo... può risponderti in meno di 24 ore" (`FAQ.tsx:11`) vs "riceve... risposta entro 48 ore" (`FAQ.tsx:19`) | Stessa regola: un solo numero per claim, usato in modo coerente in tutta la pagina | Uniformare su un solo numero per "tempo alla prima risposta" (scegliere 24h o 48h) e usarlo identico in hero, FAQ e stats. |
| Bottone header "TROVA CASA" → `/register` (form account generico) (`Header.tsx:87`) | ✅ Usa sempre → "Verbi d'azione" + test dei 3 secondi punto 3 ("cosa devo fare adesso" deve corrispondere a dove arrivo) | Se il CTA porta alla creazione profilo (non a una ricerca), l'etichetta dovrebbe dirlo: "Crea il tuo profilo" — coerente con il CTA già usato a fine sezione "Come funziona" in home, ed evita la sorpresa di arrivare su un form quando ci si aspettava una ricerca. |
| "AffittoChiaro" (`CityMap.tsx:36,46`, `Header.tsx:30,273`) vs "Affittochiaro" (logo, footer, resto del sito) | Non è una delle regole esplicite del doc v2, ma la consistenza del nome marchio è un prerequisito implicito di qualsiasi voce di brand coerente | Uniformare ovunque su "Affittochiaro" (minuscola la "c"), come nel logo e nel footer. |

## 4. Cosa scrivere

**Hero — sottotitolo** (per risolvere il punto 3 della tabella sopra):
> Trova casa in affitto in 2 Settimane.
> Crea il tuo profilo e ricevi le prime proposte da privati e agenzie in meno di 48 ore.

*(Motivazione: rende esplicito che "48 ore" è il primo passo dentro le "2 settimane", non un numero concorrente.)*

**Card hero, claim portale:**
> Il portale con 31.295 inquilini verificati in tutta Italia

*(Motivazione: stesso messaggio di leadership di mercato, ma con un numero verificabile invece di un superlativo assoluto.)*

**CTA header**, da "TROVA CASA" a:
> Crea il tuo profilo

*(Motivazione: l'etichetta deve corrispondere alla destinazione reale `/register`; "Annunci" in nav resta il posto giusto per chi vuole solo guardare case.)*

**Pagina `/register`, sopra il form** (oggi assente — aggiungere un richiamo):
> Il tuo profilo verificato, pronto in 5 minuti.
> Documenti, reddito e una breve presentazione: tutto quello che serve a un proprietario per scegliere te.

*(Motivazione: nel momento più critico — il form da compilare — non c'è oggi nessun rinforzo della promessa iniziale; chi arriva da un altro canale, non dalla home, non ha nemmeno letto la value proposition.)*

**CityMap, per separare meglio le due testimonianze per persona** (se in futuro si aggiungono più testimonianze in questa sezione):
> Box dedicato "Per chi cerca casa" con testimonianza di un inquilino, separato dal box "Per chi affitta" con la testimonianza dell'agenzia — invece di una sola testimonianza mista in una sezione rivolta solo all'inquilino.

*(Motivazione: oggi la sezione parla a un solo pubblico [chi cerca casa] ma mostra una prova sociale dell'altro pubblico [agenzia], creando un attimo di confusione su "per chi è questa pagina".)*
