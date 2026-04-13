import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function CookiePolicyPage() {
  return (
    <>
      <PageMeta
        title="Cookie Policy"
        description="Informativa sull'utilizzo dei cookie da parte di AffittoChiaro. Scopri come gestiamo i cookie e come puoi controllarli."
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cookie Policy' },
          ]}
        />

        <h1 className="font-bold text-text-primary mb-2">
          Cookie Policy
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Ultimo aggiornamento: 1 gennaio 2026
        </p>

        <div className="prose-affitto space-y-8 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo che vengono salvati sul dispositivo dell'utente
              quando visita un sito web. Vengono utilizzati per far funzionare il sito correttamente,
              migliorare l'esperienza utente, analizzare il traffico e personalizzare i contenuti.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">2. Tipologie di cookie utilizzati</h2>

            <div className="space-y-4">
              <div className="card bg-background-secondary">
                <h3 className="font-semibold text-text-primary mb-1">Cookie tecnici (necessari)</h3>
                <p className="text-sm">
                  Indispensabili per il funzionamento del sito. Includono i cookie di sessione
                  per mantenere l'utente autenticato e le preferenze di navigazione.
                  Non richiedono consenso ai sensi dell'art. 122 del Codice Privacy.
                </p>
              </div>

              <div className="card bg-background-secondary">
                <h3 className="font-semibold text-text-primary mb-1">Cookie analitici</h3>
                <p className="text-sm">
                  Raccolgono informazioni anonime sull'utilizzo del sito (pagine visitate,
                  tempo di permanenza, provenienza del traffico) tramite servizi come
                  Google Analytics. Consentono di migliorare le funzionalità del sito.
                  Richiedono il consenso dell'utente.
                </p>
              </div>

              <div className="card bg-background-secondary">
                <h3 className="font-semibold text-text-primary mb-1">Cookie di preferenza</h3>
                <p className="text-sm">
                  Memorizzano le preferenze dell'utente (lingua, zona di ricerca preferita,
                  tema visivo) per personalizzare l'esperienza di navigazione.
                </p>
              </div>

              <div className="card bg-background-secondary">
                <h3 className="font-semibold text-text-primary mb-1">Cookie di marketing</h3>
                <p className="text-sm">
                  Utilizzati per mostrare annunci pertinenti agli interessi dell'utente.
                  Possono essere impostati da partner pubblicitari terzi.
                  Richiedono il consenso esplicito dell'utente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">3. Cookie di terze parti</h2>
            <p className="mb-3">
              AffittoChiaro utilizza i seguenti servizi di terze parti che possono impostare cookie:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li><strong className="text-text-primary">Google Analytics:</strong> analisi del traffico e comportamento utenti</li>
              <li><strong className="text-text-primary">Hotjar:</strong> heatmap e registrazione sessioni (aggregato e anonimo)</li>
              <li><strong className="text-text-primary">Intercom:</strong> chat di supporto clienti</li>
              <li><strong className="text-text-primary">Meta Pixel:</strong> misurazione delle campagne pubblicitarie (solo se consenso marketing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">4. Gestione dei cookie</h2>
            <p className="mb-3">
              L'utente può gestire i cookie in qualsiasi momento attraverso:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Il banner di consenso mostrato al primo accesso al sito</li>
              <li>Le impostazioni del proprio browser (Chrome, Firefox, Safari, Edge)</li>
              <li>I link di opt-out forniti dai singoli fornitori terzi</li>
            </ul>
            <p className="mt-3">
              La disabilitazione dei cookie tecnici può compromettere alcune funzionalità del sito,
              incluso l'accesso all'account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">5. Durata dei cookie</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li><strong className="text-text-primary">Cookie di sessione:</strong> vengono eliminati alla chiusura del browser</li>
              <li><strong className="text-text-primary">Cookie persistenti:</strong> rimangono sul dispositivo per un periodo che va da 30 giorni a 2 anni, a seconda del tipo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">6. Contatti</h2>
            <p>
              Per qualsiasi domanda relativa all'utilizzo dei cookie, contattaci all'indirizzo:{' '}
              <span className="text-primary-600">privacy@affittochiaro.it</span>.
              Per informazioni sul trattamento dei dati personali in generale, consulta la nostra{' '}
              <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
