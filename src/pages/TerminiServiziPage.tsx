import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function TerminiServiziPage() {
  return (
    <>
      <PageMeta
        title="Termini di Servizio"
        description="Termini e condizioni di utilizzo della piattaforma AffittoChiaro. Leggi le regole che regolano il rapporto tra AffittoChiaro e i suoi utenti."
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Termini di Servizio' },
          ]}
        />

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Termini di Servizio
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Ultimo aggiornamento: 1 gennaio 2026
        </p>

        <div className="prose-affitto space-y-8 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">1. Accettazione dei termini</h2>
            <p>
              Utilizzando la piattaforma AffittoChiaro (il "Servizio"), l'utente accetta integralmente
              i presenti Termini di Servizio. Se non si accettano i presenti termini, non è consentito
              l'utilizzo del Servizio. AffittoChiaro si riserva il diritto di aggiornare i termini
              in qualsiasi momento, con comunicazione agli utenti registrati.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">2. Descrizione del servizio</h2>
            <p>
              AffittoChiaro è una piattaforma digitale che facilita l'incontro tra inquilini in cerca
              di un'abitazione e agenzie immobiliari partner. Il Servizio consente agli inquilini di
              creare un profilo verificato e candidarsi agli annunci pubblicati dalle agenzie.
              AffittoChiaro non è parte dei contratti di locazione stipulati tra le parti.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">3. Registrazione e account</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>La registrazione richiede dati veritieri e aggiornati. Informazioni false possono comportare la sospensione dell'account.</li>
              <li>L'utente è responsabile della riservatezza delle proprie credenziali di accesso.</li>
              <li>Un account è ad uso personale e non può essere trasferito a terzi.</li>
              <li>AffittoChiaro si riserva di sospendere o chiudere account che violino i presenti termini.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">4. Condotte vietate</h2>
            <p className="mb-3">È vietato utilizzare il Servizio per:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Pubblicare informazioni false, ingannevoli o fraudolente</li>
              <li>Impersonare altri utenti o agenzie</li>
              <li>Raccogliere dati di altri utenti senza consenso</li>
              <li>Inviare comunicazioni commerciali non richieste (spam)</li>
              <li>Tentare di accedere a sistemi o dati non autorizzati</li>
              <li>Qualsiasi attività che violi la normativa italiana ed europea</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">5. Responsabilità degli utenti</h2>
            <p>
              L'utente è l'unico responsabile dei contenuti che pubblica sulla piattaforma (bio,
              documenti, messaggi). AffittoChiaro non verifica la veridicità di tutti i contenuti
              pubblicati dagli utenti, ma si riserva il diritto di rimuovere contenuti inappropriati
              o in violazione dei presenti termini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">6. Limitazione di responsabilità</h2>
            <p>
              AffittoChiaro è un intermediario tecnologico e non è responsabile per:
            </p>
            <ul className="space-y-2 ml-4 list-disc mt-3">
              <li>Il contenuto degli annunci pubblicati dalle agenzie partner</li>
              <li>L'esito delle candidature o dei contratti di locazione</li>
              <li>Interruzioni del servizio per cause di forza maggiore o manutenzione tecnica</li>
              <li>Danni indiretti o consequenziali derivanti dall'utilizzo della piattaforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">7. Proprietà intellettuale</h2>
            <p>
              Tutti i contenuti della piattaforma (testi, grafica, logo, software) sono di proprietà
              di AffittoChiaro o dei rispettivi titolari. È vietata la riproduzione, distribuzione
              o utilizzo commerciale senza autorizzazione scritta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">8. Prezzi e pagamenti</h2>
            <p>
              La creazione di un profilo inquilino e la candidatura agli annunci sono gratuite.
              AffittoChiaro può offrire servizi premium a pagamento, i cui prezzi e condizioni
              saranno comunicati chiaramente prima dell'acquisto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">9. Legge applicabile e foro competente</h2>
            <p>
              I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia
              derivante dall'utilizzo del Servizio, il foro competente è quello di Milano, salvo
              diversa disposizione di legge a tutela del consumatore.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">10. Contatti</h2>
            <p>
              Per qualsiasi domanda relativa ai presenti Termini di Servizio, contattaci a:{' '}
              <span className="text-primary-600">legal@affittochiaro.it</span>
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
