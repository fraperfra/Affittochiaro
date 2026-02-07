import { useState, useMemo } from 'react';
import {
  Calculator, Receipt, Building2, TrendingUp, Landmark, Scale, Users,
  FileText, Home, PiggyBank, Banknote, MapPin, Ruler, Percent,
  ChevronDown, ChevronUp, Search, RotateCcw,
} from 'lucide-react';
import { Card, Badge } from '../../components/ui';

// ─── Helpers ────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n: number) => n.toLocaleString('it-IT', { maximumFractionDigits: 0 });
const eur = (n: number) => `€ ${fmt(n)}`;
const pct = (n: number) => `${fmt(n)}%`;

function NumInput({ label, value, onChange, suffix, min, max, step, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; min?: number; max?: number; step?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted block mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          className="input text-sm pr-10"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min} max={max} step={step || 1}
          placeholder={placeholder}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted block mb-1">{label}</label>
      <select className="input text-sm" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ResultRow({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${sub ? 'pl-4 text-text-muted' : ''} ${highlight ? 'border-t border-border pt-2 mt-1' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-semibold text-text-primary' : ''}`}>{label}</span>
      <span className={`text-sm font-mono ${highlight ? 'font-bold text-primary-600 text-base' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

// ─── Calculator definitions ────────────────────────────────
interface CalcDef {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  color: string;
  component: React.FC;
}

// 1) Imposte Acquisto
function CalcImposteAcquisto() {
  const [prezzoVendita, setPrezzoVendita] = useState('200000');
  const [renditaCatastale, setRenditaCatastale] = useState('800');
  const [tipo, setTipo] = useState<'prima' | 'seconda'>('prima');
  const [venditore, setVenditore] = useState<'privato' | 'impresa'>('privato');

  const results = useMemo(() => {
    const prezzo = parseFloat(prezzoVendita) || 0;
    const rendita = parseFloat(renditaCatastale) || 0;
    const moltiplicatore = tipo === 'prima' ? 115.5 : 126;
    const valCatastale = rendita * moltiplicatore;
    const base = venditore === 'privato' ? valCatastale : prezzo;

    if (venditore === 'privato') {
      const aliquotaRegistro = tipo === 'prima' ? 0.02 : 0.09;
      const registro = Math.max(base * aliquotaRegistro, 1000);
      const ipotecaria = 50;
      const catastale = 50;
      return { base, registro, ipotecaria, catastale, iva: 0, totale: registro + ipotecaria + catastale, valCatastale };
    } else {
      const aliquotaIva = tipo === 'prima' ? 0.04 : 0.10;
      const iva = prezzo * aliquotaIva;
      const registro = 200;
      const ipotecaria = 200;
      const catastale = 200;
      return { base: prezzo, registro, ipotecaria, catastale, iva, totale: registro + ipotecaria + catastale + iva, valCatastale };
    }
  }, [prezzoVendita, renditaCatastale, tipo, venditore]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Prezzo vendita" value={prezzoVendita} onChange={setPrezzoVendita} suffix="€" />
        <NumInput label="Rendita catastale" value={renditaCatastale} onChange={setRenditaCatastale} suffix="€" />
        <SelectInput label="Tipologia" value={tipo} onChange={v => setTipo(v as 'prima' | 'seconda')} options={[
          { value: 'prima', label: 'Prima Casa' }, { value: 'seconda', label: 'Seconda Casa' },
        ]} />
        <SelectInput label="Venditore" value={venditore} onChange={v => setVenditore(v as 'privato' | 'impresa')} options={[
          { value: 'privato', label: 'Privato' }, { value: 'impresa', label: 'Impresa (con IVA)' },
        ]} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Valore catastale" value={eur(results.valCatastale)} />
        <ResultRow label="Base imponibile" value={eur(results.base)} />
        <ResultRow label="Imposta di registro" value={eur(results.registro)} sub />
        <ResultRow label="Imposta ipotecaria" value={eur(results.ipotecaria)} sub />
        <ResultRow label="Imposta catastale" value={eur(results.catastale)} sub />
        {results.iva > 0 && <ResultRow label="IVA" value={eur(results.iva)} sub />}
        <ResultRow label="Totale imposte" value={eur(results.totale)} highlight />
      </div>
    </div>
  );
}

// 2) Conto Economico
function CalcContoEconomico() {
  const [prezzoAcquisto, setPrezzoAcquisto] = useState('180000');
  const [costiRistrutturazione, setCostiRistrutturazione] = useState('20000');
  const [costiNotaio, setCostiNotaio] = useState('3000');
  const [imposteAcquisto, setImposteAcquisto] = useState('4000');
  const [provvigioneAcquisto, setProvvigioneAcquisto] = useState('5400');
  const [prezzoVendita, setPrezzoVendita] = useState('260000');
  const [provvigioneVendita, setProvvigioneVendita] = useState('7800');

  const results = useMemo(() => {
    const acq = parseFloat(prezzoAcquisto) || 0;
    const ristr = parseFloat(costiRistrutturazione) || 0;
    const not = parseFloat(costiNotaio) || 0;
    const imp = parseFloat(imposteAcquisto) || 0;
    const provAcq = parseFloat(provvigioneAcquisto) || 0;
    const vendita = parseFloat(prezzoVendita) || 0;
    const provVen = parseFloat(provvigioneVendita) || 0;
    const totaleCosti = acq + ristr + not + imp + provAcq + provVen;
    const utile = vendita - totaleCosti;
    const margine = vendita > 0 ? (utile / vendita) * 100 : 0;
    return { totaleCosti, utile, margine, vendita };
  }, [prezzoAcquisto, costiRistrutturazione, costiNotaio, imposteAcquisto, provvigioneAcquisto, prezzoVendita, provvigioneVendita]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Prezzo acquisto" value={prezzoAcquisto} onChange={setPrezzoAcquisto} suffix="€" />
        <NumInput label="Costi ristrutturazione" value={costiRistrutturazione} onChange={setCostiRistrutturazione} suffix="€" />
        <NumInput label="Costi notaio" value={costiNotaio} onChange={setCostiNotaio} suffix="€" />
        <NumInput label="Imposte acquisto" value={imposteAcquisto} onChange={setImposteAcquisto} suffix="€" />
        <NumInput label="Provvigione acquisto" value={provvigioneAcquisto} onChange={setProvvigioneAcquisto} suffix="€" />
        <NumInput label="Prezzo vendita" value={prezzoVendita} onChange={setPrezzoVendita} suffix="€" />
        <NumInput label="Provvigione vendita" value={provvigioneVendita} onChange={setProvvigioneVendita} suffix="€" />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Ricavo vendita" value={eur(results.vendita)} />
        <ResultRow label="Totale costi" value={eur(results.totaleCosti)} />
        <ResultRow label="Utile netto" value={eur(results.utile)} highlight />
        <ResultRow label="Margine" value={pct(results.margine)} highlight />
      </div>
    </div>
  );
}

// 3) Nuda Proprietà
function CalcNudaProprieta() {
  const [valoreImmobile, setValoreImmobile] = useState('300000');
  const [etaUsufruttuario, setEtaUsufruttuario] = useState('70');
  const [tassoLegale, setTassoLegale] = useState('2.5');

  // Coefficienti DM (semplificati per fascia d'età)
  const results = useMemo(() => {
    const valore = parseFloat(valoreImmobile) || 0;
    const eta = parseInt(etaUsufruttuario) || 0;
    const tasso = parseFloat(tassoLegale) || 2.5;

    // Coefficienti usufruttuario vitalizio (tabella DM aggiornata - semplificata)
    let coefficiente: number;
    if (eta <= 20) coefficiente = 0.95;
    else if (eta <= 30) coefficiente = 0.90;
    else if (eta <= 40) coefficiente = 0.85;
    else if (eta <= 45) coefficiente = 0.80;
    else if (eta <= 50) coefficiente = 0.75;
    else if (eta <= 55) coefficiente = 0.70;
    else if (eta <= 60) coefficiente = 0.625;
    else if (eta <= 65) coefficiente = 0.55;
    else if (eta <= 70) coefficiente = 0.475;
    else if (eta <= 75) coefficiente = 0.40;
    else if (eta <= 80) coefficiente = 0.325;
    else if (eta <= 85) coefficiente = 0.25;
    else if (eta <= 90) coefficiente = 0.175;
    else coefficiente = 0.10;

    const valoreUsufrutto = valore * coefficiente * (tasso / 100);
    const valoreNudaProprieta = valore - valoreUsufrutto;
    const percentualeNP = (valoreNudaProprieta / valore) * 100;

    return { valoreUsufrutto, valoreNudaProprieta, percentualeNP, coefficiente };
  }, [valoreImmobile, etaUsufruttuario, tassoLegale]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Valore piena proprieta" value={valoreImmobile} onChange={setValoreImmobile} suffix="€" />
        <NumInput label="Eta usufruttuario" value={etaUsufruttuario} onChange={setEtaUsufruttuario} suffix="anni" min={0} max={100} />
        <NumInput label="Tasso legale" value={tassoLegale} onChange={setTassoLegale} suffix="%" step={0.1} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Coefficiente" value={fmt(results.coefficiente)} />
        <ResultRow label="Valore usufrutto" value={eur(results.valoreUsufrutto)} />
        <ResultRow label="Valore nuda proprieta" value={eur(results.valoreNudaProprieta)} highlight />
        <ResultRow label="% sul valore pieno" value={pct(results.percentualeNP)} />
      </div>
    </div>
  );
}

// 4) Capitalizzazione Redditi
function CalcCapitalizzazione() {
  const [redditoAnnuo, setRedditoAnnuo] = useState('12000');
  const [tasso, setTasso] = useState('5');

  const results = useMemo(() => {
    const reddito = parseFloat(redditoAnnuo) || 0;
    const t = parseFloat(tasso) || 1;
    const valore = reddito / (t / 100);
    const moltiplicatore = 100 / t;
    return { valore, moltiplicatore };
  }, [redditoAnnuo, tasso]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Reddito annuo netto" value={redditoAnnuo} onChange={setRedditoAnnuo} suffix="€" />
        <NumInput label="Tasso di capitalizzazione" value={tasso} onChange={setTasso} suffix="%" step={0.1} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Moltiplicatore" value={`${fmt(results.moltiplicatore)}x`} />
        <ResultRow label="Valore stimato immobile" value={eur(results.valore)} highlight />
      </div>
    </div>
  );
}

// 5) Valore Catastale
function CalcValoreCatastale() {
  const [renditaCatastale, setRenditaCatastale] = useState('800');
  const [tipologia, setTipologia] = useState('prima_casa');

  const coefficienti: Record<string, { label: string; coeff: number }> = {
    prima_casa: { label: 'Prima Casa', coeff: 115.5 },
    altri_fabbricati: { label: 'Fabbricati (A, B, C)', coeff: 126 },
    uffici_a10: { label: 'Uffici (A/10)', coeff: 63 },
    negozi_c1: { label: 'Negozi (C/1)', coeff: 42.84 },
    terreni: { label: 'Terreni agricoli', coeff: 112.5 },
  };

  const results = useMemo(() => {
    const rendita = parseFloat(renditaCatastale) || 0;
    const rivalutata = rendita * 1.05;
    const coeff = coefficienti[tipologia]?.coeff || 126;
    const valCatastale = rivalutata * coeff;
    return { rivalutata, coeff, valCatastale };
  }, [renditaCatastale, tipologia]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Rendita catastale" value={renditaCatastale} onChange={setRenditaCatastale} suffix="€" />
        <SelectInput label="Tipologia immobile" value={tipologia} onChange={setTipologia}
          options={Object.entries(coefficienti).map(([k, v]) => ({ value: k, label: v.label }))}
        />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Rendita rivalutata (5%)" value={eur(results.rivalutata)} />
        <ResultRow label="Coefficiente" value={fmt(results.coeff)} />
        <ResultRow label="Valore catastale" value={eur(results.valCatastale)} highlight />
      </div>
    </div>
  );
}

// 6) Imposte Plusvalenza
function CalcPlusvalenza() {
  const [prezzoAcquisto, setPrezzoAcquisto] = useState('150000');
  const [prezzoVendita, setPrezzoVendita] = useState('220000');
  const [costiDocumentati, setCostiDocumentati] = useState('15000');
  const [aliquotaIrpef, setAliquotaIrpef] = useState('35');

  const results = useMemo(() => {
    const acq = parseFloat(prezzoAcquisto) || 0;
    const ven = parseFloat(prezzoVendita) || 0;
    const costi = parseFloat(costiDocumentati) || 0;
    const irpefRate = parseFloat(aliquotaIrpef) || 0;
    const plusvalenza = Math.max(ven - acq - costi, 0);
    const impostaSostitutiva = plusvalenza * 0.26;
    const impostaIrpef = plusvalenza * (irpefRate / 100);
    const risparmio = Math.abs(impostaIrpef - impostaSostitutiva);
    const conveniente = impostaSostitutiva <= impostaIrpef ? 'sostitutiva' : 'irpef';
    return { plusvalenza, impostaSostitutiva, impostaIrpef, risparmio, conveniente };
  }, [prezzoAcquisto, prezzoVendita, costiDocumentati, aliquotaIrpef]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Prezzo acquisto" value={prezzoAcquisto} onChange={setPrezzoAcquisto} suffix="€" />
        <NumInput label="Prezzo vendita" value={prezzoVendita} onChange={setPrezzoVendita} suffix="€" />
        <NumInput label="Costi documentati" value={costiDocumentati} onChange={setCostiDocumentati} suffix="€" />
        <NumInput label="Aliquota IRPEF marginale" value={aliquotaIrpef} onChange={setAliquotaIrpef} suffix="%" />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Plusvalenza" value={eur(results.plusvalenza)} />
        <ResultRow label="Imposta sostitutiva (26%)" value={eur(results.impostaSostitutiva)} />
        <ResultRow label={`IRPEF (${aliquotaIrpef}%)`} value={eur(results.impostaIrpef)} />
        <ResultRow label="Piu conveniente" value={results.conveniente === 'sostitutiva' ? 'Sostitutiva 26%' : 'IRPEF ordinaria'} highlight />
        <ResultRow label="Risparmio" value={eur(results.risparmio)} />
      </div>
    </div>
  );
}

// 7) Quote Ereditarie
function CalcQuoteEreditarie() {
  const [valoreAsse, setValoreAsse] = useState('500000');
  const [coniuge, setConiuge] = useState('si');
  const [numFigli, setNumFigli] = useState('2');
  const [genitori, setGenitori] = useState('no');

  const results = useMemo(() => {
    const valore = parseFloat(valoreAsse) || 0;
    const hasConiuge = coniuge === 'si';
    const figli = parseInt(numFigli) || 0;
    const hasGenitori = genitori === 'si';

    const quote: { soggetto: string; quota: number; valore: number }[] = [];

    if (hasConiuge && figli === 0 && !hasGenitori) {
      // Solo coniuge: 1/1 legittima (minimo 1/2 + uso abitazione)
      quote.push({ soggetto: 'Coniuge', quota: 1, valore });
    } else if (hasConiuge && figli === 1) {
      quote.push({ soggetto: 'Coniuge', quota: 1 / 3, valore: valore / 3 });
      quote.push({ soggetto: 'Figlio', quota: 1 / 3, valore: valore / 3 });
      quote.push({ soggetto: 'Disponibile', quota: 1 / 3, valore: valore / 3 });
    } else if (hasConiuge && figli >= 2) {
      quote.push({ soggetto: 'Coniuge', quota: 1 / 4, valore: valore / 4 });
      const quotaFigli = 1 / 2;
      const perFiglio = quotaFigli / figli;
      for (let i = 1; i <= figli; i++) {
        quote.push({ soggetto: `Figlio ${i}`, quota: perFiglio, valore: valore * perFiglio });
      }
      quote.push({ soggetto: 'Disponibile', quota: 1 / 4, valore: valore / 4 });
    } else if (!hasConiuge && figli === 1) {
      quote.push({ soggetto: 'Figlio', quota: 1 / 2, valore: valore / 2 });
      quote.push({ soggetto: 'Disponibile', quota: 1 / 2, valore: valore / 2 });
    } else if (!hasConiuge && figli >= 2) {
      const perFiglio = (2 / 3) / figli;
      for (let i = 1; i <= figli; i++) {
        quote.push({ soggetto: `Figlio ${i}`, quota: perFiglio, valore: valore * perFiglio });
      }
      quote.push({ soggetto: 'Disponibile', quota: 1 / 3, valore: valore / 3 });
    } else if (hasConiuge && figli === 0 && hasGenitori) {
      quote.push({ soggetto: 'Coniuge', quota: 1 / 2, valore: valore / 2 });
      quote.push({ soggetto: 'Genitori', quota: 1 / 4, valore: valore / 4 });
      quote.push({ soggetto: 'Disponibile', quota: 1 / 4, valore: valore / 4 });
    } else if (!hasConiuge && figli === 0 && hasGenitori) {
      quote.push({ soggetto: 'Genitori', quota: 1 / 3, valore: valore / 3 });
      quote.push({ soggetto: 'Disponibile', quota: 2 / 3, valore: (valore * 2) / 3 });
    } else {
      quote.push({ soggetto: 'Disponibile', quota: 1, valore });
    }

    return quote;
  }, [valoreAsse, coniuge, numFigli, genitori]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Valore asse ereditario" value={valoreAsse} onChange={setValoreAsse} suffix="€" />
        <SelectInput label="Coniuge superstite" value={coniuge} onChange={setConiuge} options={[
          { value: 'si', label: 'Si' }, { value: 'no', label: 'No' },
        ]} />
        <NumInput label="Numero figli" value={numFigli} onChange={setNumFigli} min={0} max={10} />
        <SelectInput label="Genitori/Ascendenti viventi" value={genitori} onChange={setGenitori} options={[
          { value: 'no', label: 'No' }, { value: 'si', label: 'Si' },
        ]} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Quote legittime (Codice Civile)</h4>
        {results.map((q, i) => (
          <ResultRow
            key={i}
            label={`${q.soggetto} (${(q.quota * 100).toFixed(1)}%)`}
            value={eur(q.valore)}
            highlight={q.soggetto === 'Disponibile'}
          />
        ))}
      </div>
    </div>
  );
}

// 8) Cedolare Secca
function CalcCedolareSecca() {
  const [canoneAnnuo, setCanoneAnnuo] = useState('9600');
  const [aliquotaIrpef, setAliquotaIrpef] = useState('35');
  const [addRegionale, setAddRegionale] = useState('1.73');
  const [addComunale, setAddComunale] = useState('0.8');

  const results = useMemo(() => {
    const canone = parseFloat(canoneAnnuo) || 0;
    const irpefRate = parseFloat(aliquotaIrpef) || 0;
    const regRate = parseFloat(addRegionale) || 0;
    const comRate = parseFloat(addComunale) || 0;

    // Regime ordinario: deduzione forfettaria 5% + IRPEF + addizionali
    const baseOrdinaria = canone * 0.95;
    const irpef = baseOrdinaria * (irpefRate / 100);
    const addReg = baseOrdinaria * (regRate / 100);
    const addCom = baseOrdinaria * (comRate / 100);
    const totaleOrdinario = irpef + addReg + addCom;
    const nettoOrdinario = canone - totaleOrdinario;

    // Cedolare secca 21%
    const cedolare21 = canone * 0.21;
    const netto21 = canone - cedolare21;

    // Cedolare secca 10% (concordato)
    const cedolare10 = canone * 0.10;
    const netto10 = canone - cedolare10;

    return { totaleOrdinario, nettoOrdinario, cedolare21, netto21, cedolare10, netto10, canone };
  }, [canoneAnnuo, aliquotaIrpef, addRegionale, addComunale]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Canone annuo" value={canoneAnnuo} onChange={setCanoneAnnuo} suffix="€" />
        <NumInput label="Aliquota IRPEF marginale" value={aliquotaIrpef} onChange={setAliquotaIrpef} suffix="%" />
        <NumInput label="Addizionale regionale" value={addRegionale} onChange={setAddRegionale} suffix="%" step={0.01} />
        <NumInput label="Addizionale comunale" value={addComunale} onChange={setAddComunale} suffix="%" step={0.01} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Confronto regimi fiscali</h4>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mt-2 mb-1">Regime Ordinario</p>
        <ResultRow label="Imposte totali" value={eur(results.totaleOrdinario)} sub />
        <ResultRow label="Netto annuo" value={eur(results.nettoOrdinario)} />
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mt-3 mb-1">Cedolare Secca 21%</p>
        <ResultRow label="Imposta" value={eur(results.cedolare21)} sub />
        <ResultRow label="Netto annuo" value={eur(results.netto21)} />
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mt-3 mb-1">Cedolare Secca 10% (Concordato)</p>
        <ResultRow label="Imposta" value={eur(results.cedolare10)} sub />
        <ResultRow label="Netto annuo" value={eur(results.netto10)} highlight />
        <div className="mt-3 pt-2 border-t border-border">
          <ResultRow label="Risparmio max vs ordinario" value={eur(results.totaleOrdinario - results.cedolare10)} highlight />
        </div>
      </div>
    </div>
  );
}

// 9) Canone Concordato
function CalcCanoneConcordato() {
  const [superficieUtile, setSuperficieUtile] = useState('70');
  const [zona, setZona] = useState('B');
  const [stato, setStato] = useState('buono');
  const [anno, setAnno] = useState('1990');
  const [arredato, setArredato] = useState('no');

  const results = useMemo(() => {
    const mq = parseFloat(superficieUtile) || 0;
    const annoCostr = parseInt(anno) || 1990;
    const eta = 2025 - annoCostr;

    // Valori base €/mq/mese per zona (indicativi medi nazionali)
    const valoriZona: Record<string, { min: number; max: number }> = {
      A: { min: 6.5, max: 11.0 },
      B: { min: 5.0, max: 8.5 },
      C: { min: 3.5, max: 6.0 },
      D: { min: 2.5, max: 4.5 },
    };

    const base = valoriZona[zona] || valoriZona.B;

    // Correttivi
    let correttivo = 1;
    if (stato === 'ottimo') correttivo += 0.10;
    else if (stato === 'buono') correttivo += 0;
    else if (stato === 'discreto') correttivo -= 0.05;
    else if (stato === 'mediocre') correttivo -= 0.15;

    // Vetusta
    if (eta > 40) correttivo -= 0.10;
    else if (eta > 20) correttivo -= 0.05;
    else if (eta < 5) correttivo += 0.05;

    // Arredamento
    if (arredato === 'si') correttivo += 0.15;

    const canoneMinMq = base.min * correttivo;
    const canoneMaxMq = base.max * correttivo;
    const canoneMin = mq * canoneMinMq;
    const canoneMax = mq * canoneMaxMq;
    const canoneMedio = (canoneMin + canoneMax) / 2;

    return { canoneMinMq, canoneMaxMq, canoneMin, canoneMax, canoneMedio, correttivo };
  }, [superficieUtile, zona, stato, anno, arredato]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Superficie utile" value={superficieUtile} onChange={setSuperficieUtile} suffix="m²" />
        <SelectInput label="Zona OMI" value={zona} onChange={setZona} options={[
          { value: 'A', label: 'Zona A - Centrale/pregio' },
          { value: 'B', label: 'Zona B - Semicentrale' },
          { value: 'C', label: 'Zona C - Periferica' },
          { value: 'D', label: 'Zona D - Suburbana' },
        ]} />
        <SelectInput label="Stato immobile" value={stato} onChange={setStato} options={[
          { value: 'ottimo', label: 'Ottimo/Ristrutturato' },
          { value: 'buono', label: 'Buono' },
          { value: 'discreto', label: 'Discreto' },
          { value: 'mediocre', label: 'Mediocre' },
        ]} />
        <NumInput label="Anno costruzione" value={anno} onChange={setAnno} min={1900} max={2025} />
        <SelectInput label="Arredato" value={arredato} onChange={setArredato} options={[
          { value: 'no', label: 'No' }, { value: 'si', label: 'Si' },
        ]} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Correttivo applicato" value={`${(results.correttivo * 100).toFixed(0)}%`} />
        <ResultRow label="Range €/m²/mese" value={`${fmt(results.canoneMinMq)} - ${fmt(results.canoneMaxMq)}`} />
        <ResultRow label="Canone minimo" value={`${eur(results.canoneMin)}/mese`} />
        <ResultRow label="Canone massimo" value={`${eur(results.canoneMax)}/mese`} />
        <ResultRow label="Canone medio stimato" value={`${eur(results.canoneMedio)}/mese`} highlight />
        <ResultRow label="Annuo stimato" value={eur(results.canoneMedio * 12)} />
      </div>
    </div>
  );
}

// 10) ROI Immobiliare
function CalcROI() {
  const [costoAcquisto, setCostoAcquisto] = useState('200000');
  const [costiAccessori, setCostiAccessori] = useState('15000');
  const [canoneAnnuo, setCanoneAnnuo] = useState('9600');
  const [costiAnnui, setCostiAnnui] = useState('1800');
  const [sfitto, setSfitto] = useState('5');
  const [rivalutazione, setRivalutazione] = useState('2');

  const results = useMemo(() => {
    const acquisto = parseFloat(costoAcquisto) || 0;
    const accessori = parseFloat(costiAccessori) || 0;
    const canone = parseFloat(canoneAnnuo) || 0;
    const costi = parseFloat(costiAnnui) || 0;
    const sfittoPct = parseFloat(sfitto) || 0;
    const rivalPct = parseFloat(rivalutazione) || 0;

    const investimento = acquisto + accessori;
    const redditoEffettivo = canone * (1 - sfittoPct / 100);
    const redditoNetto = redditoEffettivo - costi;
    const rendimentoLordo = investimento > 0 ? (canone / investimento) * 100 : 0;
    const rendimentoNetto = investimento > 0 ? (redditoNetto / investimento) * 100 : 0;
    const cashOnCash = investimento > 0 ? (redditoNetto / investimento) * 100 : 0;
    const rendimentoTotale = rendimentoNetto + rivalPct;
    const payback = redditoNetto > 0 ? investimento / redditoNetto : 0;

    return { investimento, redditoNetto, rendimentoLordo, rendimentoNetto, cashOnCash, rendimentoTotale, payback };
  }, [costoAcquisto, costiAccessori, canoneAnnuo, costiAnnui, sfitto, rivalutazione]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Costo acquisto" value={costoAcquisto} onChange={setCostoAcquisto} suffix="€" />
        <NumInput label="Costi accessori (imposte, notaio)" value={costiAccessori} onChange={setCostiAccessori} suffix="€" />
        <NumInput label="Canone annuo lordo" value={canoneAnnuo} onChange={setCanoneAnnuo} suffix="€" />
        <NumInput label="Costi annui (IMU, condominio, manutenzione)" value={costiAnnui} onChange={setCostiAnnui} suffix="€" />
        <NumInput label="Sfitto stimato" value={sfitto} onChange={setSfitto} suffix="%" />
        <NumInput label="Rivalutazione annua stimata" value={rivalutazione} onChange={setRivalutazione} suffix="%" step={0.5} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Investimento totale" value={eur(results.investimento)} />
        <ResultRow label="Reddito netto annuo" value={eur(results.redditoNetto)} />
        <ResultRow label="Rendimento lordo" value={pct(results.rendimentoLordo)} />
        <ResultRow label="Rendimento netto" value={pct(results.rendimentoNetto)} />
        <ResultRow label="Rendimento totale (+ rivalutaz.)" value={pct(results.rendimentoTotale)} highlight />
        <ResultRow label="Payback period" value={results.payback > 0 ? `${fmt(results.payback)} anni` : '-'} />
      </div>
    </div>
  );
}

// 11) Mutuo
function CalcMutuo() {
  const [importo, setImporto] = useState('160000');
  const [tasso, setTasso] = useState('3.5');
  const [durata, setDurata] = useState('25');

  const results = useMemo(() => {
    const C = parseFloat(importo) || 0;
    const r = (parseFloat(tasso) || 0) / 100 / 12;
    const n = (parseInt(durata) || 0) * 12;
    if (C <= 0 || r <= 0 || n <= 0) return { rata: 0, totale: 0, interessi: 0 };
    const rata = C * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totale = rata * n;
    const interessi = totale - C;
    return { rata, totale, interessi };
  }, [importo, tasso, durata]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Importo mutuo" value={importo} onChange={setImporto} suffix="€" />
        <NumInput label="Tasso annuo (TAN)" value={tasso} onChange={setTasso} suffix="%" step={0.1} />
        <NumInput label="Durata" value={durata} onChange={setDurata} suffix="anni" min={5} max={40} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Rata mensile" value={eur(results.rata)} highlight />
        <ResultRow label="Totale restituito" value={eur(results.totale)} />
        <ResultRow label="Totale interessi" value={eur(results.interessi)} />
        <ResultRow label="Costo interessi %" value={results.totale > 0 ? pct((results.interessi / (parseFloat(importo) || 1)) * 100) : '-'} />
      </div>
    </div>
  );
}

// 12) IMU
function CalcIMU() {
  const [renditaCatastale, setRenditaCatastale] = useState('800');
  const [aliquota, setAliquota] = useState('10.6');
  const [tipologia, setTipologia] = useState<'seconda' | 'pertinenza' | 'commerciale'>('seconda');
  const [quotaPossesso, setQuotaPossesso] = useState('100');
  const [mesiPossesso, setMesiPossesso] = useState('12');

  const results = useMemo(() => {
    const rendita = parseFloat(renditaCatastale) || 0;
    const aliq = parseFloat(aliquota) || 0;
    const quota = (parseFloat(quotaPossesso) || 100) / 100;
    const mesi = parseInt(mesiPossesso) || 12;

    const rivalutata = rendita * 1.05;
    const baseImponibile = rivalutata * 160; // categoria A (escluso A/10)
    const imuAnnua = baseImponibile * (aliq / 1000);
    const imuDovuta = imuAnnua * quota * (mesi / 12);

    return { rivalutata, baseImponibile, imuAnnua, imuDovuta };
  }, [renditaCatastale, aliquota, quotaPossesso, mesiPossesso]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Rendita catastale" value={renditaCatastale} onChange={setRenditaCatastale} suffix="€" />
        <NumInput label="Aliquota comunale" value={aliquota} onChange={setAliquota} suffix="‰" step={0.1} />
        <NumInput label="Quota possesso" value={quotaPossesso} onChange={setQuotaPossesso} suffix="%" min={1} max={100} />
        <NumInput label="Mesi di possesso" value={mesiPossesso} onChange={setMesiPossesso} min={1} max={12} />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Rendita rivalutata (5%)" value={eur(results.rivalutata)} />
        <ResultRow label="Base imponibile" value={eur(results.baseImponibile)} />
        <ResultRow label="IMU annua lorda" value={eur(results.imuAnnua)} />
        <ResultRow label="IMU dovuta" value={eur(results.imuDovuta)} highlight />
        <ResultRow label="Acconto (16 giugno)" value={eur(results.imuDovuta / 2)} sub />
        <ResultRow label="Saldo (16 dicembre)" value={eur(results.imuDovuta / 2)} sub />
      </div>
    </div>
  );
}

// 13) Superficie Commerciale
function CalcSuperficieCommerciale() {
  const [supUtile, setSupUtile] = useState('80');
  const [balconi, setBalconi] = useState('6');
  const [terrazzi, setTerrazzi] = useState('0');
  const [cantina, setCantina] = useState('8');
  const [soffitta, setSoffitta] = useState('0');
  const [giardino, setGiardino] = useState('0');
  const [garage, setGarage] = useState('15');

  const results = useMemo(() => {
    const utile = parseFloat(supUtile) || 0;
    const bal = (parseFloat(balconi) || 0) * 0.30;     // 30%
    const ter = (parseFloat(terrazzi) || 0) * 0.25;    // 25%
    const cant = (parseFloat(cantina) || 0) * 0.25;    // 25%
    const soff = (parseFloat(soffitta) || 0) * 0.20;   // 20%
    const giard = (parseFloat(giardino) || 0) * 0.10;  // 10%
    const gar = (parseFloat(garage) || 0) * 0.50;      // 50%

    const totPonderata = bal + ter + cant + soff + giard + gar;
    const supCommerciale = utile + totPonderata;

    return { utile, totPonderata, supCommerciale, bal, ter, cant, soff, giard, gar };
  }, [supUtile, balconi, terrazzi, cantina, soffitta, giardino, garage]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <NumInput label="Superficie utile calpestabile" value={supUtile} onChange={setSupUtile} suffix="m²" />
        <NumInput label="Balconi / logge" value={balconi} onChange={setBalconi} suffix="m² (30%)" />
        <NumInput label="Terrazzi scoperti" value={terrazzi} onChange={setTerrazzi} suffix="m² (25%)" />
        <NumInput label="Cantina / solaio" value={cantina} onChange={setCantina} suffix="m² (25%)" />
        <NumInput label="Soffitta" value={soffitta} onChange={setSoffitta} suffix="m² (20%)" />
        <NumInput label="Giardino / cortile" value={giardino} onChange={setGiardino} suffix="m² (10%)" />
        <NumInput label="Garage / box" value={garage} onChange={setGarage} suffix="m² (50%)" />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Superficie utile" value={`${fmt(results.utile)} m²`} />
        {results.bal > 0 && <ResultRow label="Balconi ponderati" value={`${fmt(results.bal)} m²`} sub />}
        {results.ter > 0 && <ResultRow label="Terrazzi ponderati" value={`${fmt(results.ter)} m²`} sub />}
        {results.cant > 0 && <ResultRow label="Cantina ponderata" value={`${fmt(results.cant)} m²`} sub />}
        {results.soff > 0 && <ResultRow label="Soffitta ponderata" value={`${fmt(results.soff)} m²`} sub />}
        {results.giard > 0 && <ResultRow label="Giardino ponderato" value={`${fmt(results.giard)} m²`} sub />}
        {results.gar > 0 && <ResultRow label="Garage ponderato" value={`${fmt(results.gar)} m²`} sub />}
        <ResultRow label="Totale accessori ponderati" value={`${fmt(results.totPonderata)} m²`} />
        <ResultRow label="Superficie commerciale" value={`${fmt(results.supCommerciale)} m²`} highlight />
      </div>
    </div>
  );
}

// 14) Provvigione Agenzia
function CalcProvvigione() {
  const [prezzo, setPrezzo] = useState('250000');
  const [percentuale, setPercentuale] = useState('3');
  const [ivaApplicabile, setIvaApplicabile] = useState('22');
  const [tipo, setTipo] = useState<'vendita' | 'affitto'>('vendita');
  const [canone, setCanone] = useState('1000');
  const [mensilitaProvvigione, setMensilitaProvvigione] = useState('1');

  const results = useMemo(() => {
    const pct = parseFloat(percentuale) || 0;
    const iva = parseFloat(ivaApplicabile) || 0;

    if (tipo === 'vendita') {
      const p = parseFloat(prezzo) || 0;
      const provvigione = p * (pct / 100);
      const ivaImporto = provvigione * (iva / 100);
      const totale = provvigione + ivaImporto;
      return { provvigione, ivaImporto, totale };
    } else {
      const c = parseFloat(canone) || 0;
      const mens = parseFloat(mensilitaProvvigione) || 1;
      const provvigione = c * mens;
      const ivaImporto = provvigione * (iva / 100);
      const totale = provvigione + ivaImporto;
      return { provvigione, ivaImporto, totale };
    }
  }, [prezzo, percentuale, ivaApplicabile, tipo, canone, mensilitaProvvigione]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <SelectInput label="Tipo operazione" value={tipo} onChange={v => setTipo(v as 'vendita' | 'affitto')} options={[
          { value: 'vendita', label: 'Vendita' }, { value: 'affitto', label: 'Affitto' },
        ]} />
        {tipo === 'vendita' ? (
          <>
            <NumInput label="Prezzo vendita" value={prezzo} onChange={setPrezzo} suffix="€" />
            <NumInput label="Percentuale provvigione" value={percentuale} onChange={setPercentuale} suffix="%" step={0.5} />
          </>
        ) : (
          <>
            <NumInput label="Canone mensile" value={canone} onChange={setCanone} suffix="€" />
            <NumInput label="Mensilita di provvigione" value={mensilitaProvvigione} onChange={setMensilitaProvvigione} min={0.5} max={3} step={0.5} />
          </>
        )}
        <NumInput label="IVA" value={ivaApplicabile} onChange={setIvaApplicabile} suffix="%" />
      </div>
      <div className="bg-background-secondary rounded-xl p-4 space-y-1">
        <h4 className="font-semibold text-sm mb-2">Risultato</h4>
        <ResultRow label="Provvigione netta" value={eur(results.provvigione)} />
        <ResultRow label="IVA" value={eur(results.ivaImporto)} sub />
        <ResultRow label="Totale con IVA" value={eur(results.totale)} highlight />
      </div>
    </div>
  );
}

// ─── Calculator registry ────────────────────────────────────
const CALCULATORS: CalcDef[] = [
  { id: 'imposte_acquisto', title: 'Imposte Acquisto', description: 'Registro, ipotecaria, catastale per prima e seconda casa', icon: Receipt, color: 'bg-blue-50 text-blue-600', component: CalcImposteAcquisto },
  { id: 'conto_economico', title: 'Conto Economico', description: 'Ricavi, costi e utile netto di un\'operazione immobiliare', icon: TrendingUp, color: 'bg-green-50 text-green-600', component: CalcContoEconomico },
  { id: 'nuda_proprieta', title: 'Nuda Proprieta', description: 'Valore nuda proprieta in base a eta usufruttuario', icon: Building2, color: 'bg-purple-50 text-purple-600', component: CalcNudaProprieta },
  { id: 'capitalizzazione', title: 'Capitalizzazione Redditi', description: 'Stima valore immobile da reddito annuo e tasso', icon: Landmark, color: 'bg-amber-50 text-amber-600', component: CalcCapitalizzazione },
  { id: 'valore_catastale', title: 'Valore Catastale', description: 'Calcolo da rendita catastale e coefficienti per tipologia', icon: FileText, color: 'bg-teal-50 text-teal-600', component: CalcValoreCatastale },
  { id: 'plusvalenza', title: 'Imposte Plusvalenza', description: 'Confronto tassazione ordinaria vs sostitutiva 26%', icon: Scale, color: 'bg-red-50 text-red-600', component: CalcPlusvalenza },
  { id: 'quote_ereditarie', title: 'Quote Ereditarie', description: 'Ripartizione per coniuge, figli e ascendenti', icon: Users, color: 'bg-indigo-50 text-indigo-600', component: CalcQuoteEreditarie },
  { id: 'cedolare_secca', title: 'Cedolare Secca', description: 'Confronto regime ordinario vs 21% vs 10% concordato', icon: Percent, color: 'bg-orange-50 text-orange-600', component: CalcCedolareSecca },
  { id: 'canone_concordato', title: 'Canone Concordato', description: 'Stima canone con zona OMI, superficie, stato e dotazioni', icon: Home, color: 'bg-cyan-50 text-cyan-600', component: CalcCanoneConcordato },
  { id: 'roi', title: 'ROI Immobiliare', description: 'Rendimento annuo, cash-on-cash e payback period', icon: PiggyBank, color: 'bg-emerald-50 text-emerald-600', component: CalcROI },
  { id: 'mutuo', title: 'Simulatore Mutuo', description: 'Rata mensile, interessi totali e piano di ammortamento', icon: Banknote, color: 'bg-violet-50 text-violet-600', component: CalcMutuo },
  { id: 'imu', title: 'Calcolo IMU', description: 'Imposta con aliquota comunale, quote e scadenze', icon: MapPin, color: 'bg-rose-50 text-rose-600', component: CalcIMU },
  { id: 'superficie', title: 'Superficie Commerciale', description: 'Ponderazione balconi, terrazzi, cantine e giardini', icon: Ruler, color: 'bg-sky-50 text-sky-600', component: CalcSuperficieCommerciale },
  { id: 'provvigione', title: 'Provvigione Agenzia', description: 'Calcolo provvigione con IVA su vendita o affitto', icon: Calculator, color: 'bg-fuchsia-50 text-fuchsia-600', component: CalcProvvigione },
];

// ─── Main Page ──────────────────────────────────────────────
export default function AgencyCalculatorsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return CALCULATORS;
    const q = searchQuery.toLowerCase();
    return CALCULATORS.filter(c =>
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Cerca calcolatore..."
          className="input pl-9 text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Calculators */}
      <div className="space-y-3">
        {filtered.map(calc => {
          const Icon = calc.icon;
          const isOpen = openId === calc.id;
          const Comp = calc.component;

          return (
            <div key={calc.id} className="bg-white rounded-xl shadow-card overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggle(calc.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-background-secondary/50 transition-colors text-left"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${calc.color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary">{calc.title}</h3>
                  <p className="text-sm text-text-muted truncate">{calc.description}</p>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-text-muted flex-shrink-0" />
                )}
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border pt-4">
                  <Comp />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-card text-center">
          <Calculator size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary mb-1">Nessun calcolatore trovato</h3>
          <p className="text-sm text-text-muted">Prova con un'altra ricerca</p>
        </div>
      )}
    </div>
  );
}
