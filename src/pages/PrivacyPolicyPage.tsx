import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description="Informativa sul trattamento dei dati personali degli utenti di AffittoChiaro, ai sensi del Regolamento UE 2016/679 (GDPR)."
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Ultimo aggiornamento: 1 gennaio 2026
        </p>

        <div className="prose-affitto space-y-8 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">1. Titolare del trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati personali è <strong className="text-text-primary">AffittoChiaro S.r.l.</strong>,
              con sede legale in Italia (di seguito "AffittoChiaro", "noi" o "la Società").
              Per qualsiasi questione relativa alla privacy è possibile contattarci all'indirizzo
              email: <span className="text-primary-600">privacy@affittochiaro.it</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">2. Dati raccolti</h2>
            <p className="mb-3">
              AffittoChiaro raccoglie le seguenti categorie di dati personali:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li><strong className="text-text-primary">Dati di registrazione:</strong> nome, cognome, indirizzo email, numero di telefono, data di nascita.</li>
              <li><strong className="text-text-primary">Dati del profilo inquilino:</strong> informazioni lavorative, reddito, documenti d'identità, referenze da locatori precedenti.</li>
              <li><strong className="text-text-primary">Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, durata della sessione.</li>
              <li><strong className="text-text-primary">Dati delle candidature:</strong> annunci a cui l'utente si è candidato e relativo stato.</li>
              <li><strong className="text-text-primary">Comunicazioni:</strong> messaggi scambiati tramite la piattaforma con agenzie o proprietari.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">3. Finalità e base giuridica del trattamento</h2>
            <p className="mb-3">I dati vengono trattati per le seguenti finalità:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Esecuzione del contratto di servizio e gestione dell'account (art. 6(1)(b) GDPR)</li>
              <li>Adempimento di obblighi legali (art. 6(1)(c) GDPR)</li>
              <li>Legittimo interesse nella prevenzione delle frodi e sicurezza della piattaforma (art. 6(1)(f) GDPR)</li>
              <li>Consenso dell'utente per comunicazioni di marketing (art. 6(1)(a) GDPR)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">4. Conservazione dei dati</h2>
            <p>
              I dati personali vengono conservati per il tempo strettamente necessario alle finalità
              per cui sono stati raccolti. I dati dell'account vengono eliminati entro 30 giorni
              dalla richiesta di cancellazione da parte dell'utente, salvo obblighi di conservazione previsti dalla legge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">5. Condivisione dei dati</h2>
            <p className="mb-3">I dati possono essere condivisi con:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li><strong className="text-text-primary">Agenzie immobiliari partner:</strong> i dati del profilo inquilino vengono condivisi con le agenzie ai fini della candidatura, con il consenso dell'utente.</li>
              <li><strong className="text-text-primary">Fornitori di servizi tecnici:</strong> hosting, analisi, email marketing, nell'ambito di accordi di trattamento dati per conto.</li>
              <li><strong className="text-text-primary">Autorità pubbliche:</strong> quando richiesto dalla legge o da ordini giudiziari.</li>
            </ul>
            <p className="mt-3">Non vendiamo dati personali a terzi.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">6. Diritti dell'interessato</h2>
            <p className="mb-3">Ai sensi del GDPR, l'utente ha il diritto di:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Accedere ai propri dati personali</li>
              <li>Rettificare dati inesatti o incompleti</li>
              <li>Richiedere la cancellazione dei dati ("diritto all'oblio")</li>
              <li>Limitare o opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento (senza pregiudicare la liceità del trattamento precedente)</li>
            </ul>
            <p className="mt-3">
              Per esercitare i propri diritti, scrivere a: <span className="text-primary-600">privacy@affittochiaro.it</span>.
              In caso di reclamo è possibile rivolgersi al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">7. Cookie</h2>
            <p>
              Per informazioni dettagliate sull'utilizzo dei cookie, si rimanda alla nostra{' '}
              <a href="/cookie-policy" className="text-primary-600 hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">8. Modifiche alla presente informativa</h2>
            <p>
              AffittoChiaro si riserva il diritto di aggiornare questa informativa in qualsiasi momento.
              Le modifiche sostanziali saranno comunicate via email o tramite notifica in piattaforma.
              La data dell'ultimo aggiornamento è indicata in cima a questa pagina.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
