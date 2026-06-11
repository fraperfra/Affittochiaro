import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const TENANT_TOUR_KEY = 'affittochiaro_tenant_tour_done';

interface TourStep {
  target: string;
  title: string;
  text: string;
}

const STEPS: TourStep[] = [
  {
    target: 'profile',
    title: 'Completa il tuo profilo',
    text: 'Aggiungi occupazione, reddito e una breve presentazione. Un profilo completo riceve molte più proposte da proprietari e agenzie.',
  },
  {
    target: 'video',
    title: 'Aggiungi la video presentazione',
    text: 'Dalla pagina "Il Mio Profilo" puoi registrare una breve video presentazione: i profili con video ricevono il 78% di risposte in più.',
  },
  {
    target: 'search',
    title: 'Cerca e candidati',
    text: 'Sfoglia migliaia di annunci e candidati con un click: il proprietario riceve subito il tuo profilo completo, senza documenti da inviare.',
  },
  {
    target: 'views',
    title: 'Vieni trovato',
    text: 'Il tuo profilo è visibile a proprietari e agenzie verificate: qui vedi quante volte è stato visualizzato. Più è completo, più vieni contattato.',
  },
];

const PAD = 8;
const TOOLTIP_W = 320;

interface TenantTourProps {
  onClose: () => void;
}

export default function TenantTour({ onClose }: TenantTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [tipH, setTipH] = useState(230);
  const tipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tipRef.current) setTipH(tipRef.current.offsetHeight);
  }, [step, rect]);

  useEffect(() => {
    const el = document.querySelector(`[data-tour="${STEPS[step].target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const update = () => setRect(el.getBoundingClientRect());
    const timer = setTimeout(update, 400);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [step]);

  const finish = () => {
    localStorage.setItem(TENANT_TOUR_KEY, '1');
    onClose();
  };

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const tooltipW = Math.min(TOOLTIP_W, vw - 24);

  let tooltipStyle: React.CSSProperties = { left: 12, bottom: 100 };
  if (rect) {
    const left = Math.min(Math.max(rect.left, 12), vw - tooltipW - 12);
    const below = rect.bottom + PAD + 12;
    const above = rect.top - PAD - 12 - tipH;
    const top = below + tipH + 12 < vh ? below : above >= 12 ? above : Math.max(12, vh - tipH - 12);
    tooltipStyle = { left, top };
  }

  return (
    <div className="fixed inset-0 z-[130]">
      {!rect && <div className="absolute inset-0 bg-black/55" />}

      {rect && (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          }}
        />
      )}

      <div
        ref={tipRef}
        className="fixed bg-white rounded-2xl shadow-xl p-5 z-[140]"
        style={{ ...tooltipStyle, width: tooltipW }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {step + 1} di {STEPS.length}
          </span>
          <button onClick={finish} className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1" aria-label="Chiudi tutorial">
            <X size={18} />
          </button>
        </div>
        <h3 className="font-bold text-gray-900 mb-1.5">{current.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{current.text}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium"
          >
            Salta
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={15} />
                Indietro
              </button>
            )}
            <button
              onClick={() => (isLast ? finish() : setStep(step + 1))}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
            >
              {isLast ? 'Fine' : 'Avanti'}
              {isLast ? <Check size={15} /> : <ArrowRight size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
