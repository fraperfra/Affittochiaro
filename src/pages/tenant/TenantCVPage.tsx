/**
 * TenantCVPage - Pagina Curriculum dell'Inquilino
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Share2,
  Eye,
  RefreshCw,
  Link2,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore, useCVStore } from '@/store';
import { TenantUser } from '@/types';
import { GuarantorType, GUARANTOR_TYPE_LABELS } from '@/types/cv';
import { DOCUMENT_TYPE_LABELS, DocumentType } from '@/types/tenant';
import { ITALIAN_CITIES } from '@/utils/constants';
import { Button, Spinner, Modal, ModalFooter, Input } from '@/components/ui';
import {
  CVCompletenessBar,
  CVPersonalSection,
  CVEmploymentSection,
  CVRentalHistorySection,
  CVDocumentsSection,
  CVReferencesSection,
  CVGuarantorsSection,
  CVReliabilityScore,
} from '@/components/cv';

// ============================================================
// Form state types
// ============================================================

interface RentalFormData {
  address: string;
  city: string;
  province: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  monthlyRent: string;
  landlordName: string;
  landlordContact: string;
  reasonForLeaving: string;
}

interface ReferenceFormData {
  landlordName: string;
  landlordEmail: string;
  propertyAddress: string;
}

interface GuarantorFormData {
  type: GuarantorType;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  occupation: string;
  annualIncome: string;
}

interface DocumentFormData {
  type: DocumentType;
  name: string;
}

const EMPTY_RENTAL: RentalFormData = {
  address: '', city: '', province: '', startDate: '', endDate: '',
  isCurrent: false, monthlyRent: '', landlordName: '', landlordContact: '', reasonForLeaving: '',
};

const EMPTY_REFERENCE: ReferenceFormData = {
  landlordName: '', landlordEmail: '', propertyAddress: '',
};

const EMPTY_GUARANTOR: GuarantorFormData = {
  type: 'personal', fullName: '', relationship: '', phone: '', email: '', occupation: '', annualIncome: '',
};

const EMPTY_DOCUMENT: DocumentFormData = {
  type: 'identity_card', name: '',
};

export default function TenantCVPage() {
  const { user } = useAuthStore();
  const {
    cv, settings, shareLink, isLoading, isSaving, error,
    loadCV, generateShareLink, revokeShareLink,
    addRentalEntry, addReference, addGuarantor,
    setActiveSection, clearError,
  } = useCVStore();

  const [linkCopied, setLinkCopied] = useState(false);

  // Form modals
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalForm, setRentalForm] = useState<RentalFormData>(EMPTY_RENTAL);

  const [showReferenceForm, setShowReferenceForm] = useState(false);
  const [referenceForm, setReferenceForm] = useState<ReferenceFormData>(EMPTY_REFERENCE);

  const [showGuarantorForm, setShowGuarantorForm] = useState(false);
  const [guarantorForm, setGuarantorForm] = useState<GuarantorFormData>(EMPTY_GUARANTOR);

  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [documentForm, setDocumentForm] = useState<DocumentFormData>(EMPTY_DOCUMENT);

  const tenantUser = user as TenantUser;
  const tenantId = tenantUser?.id || '';

  useEffect(() => {
    if (tenantId) loadCV(tenantId);
  }, [tenantId, loadCV]);

  useEffect(() => {
    if (error) { toast.error(error); clearError(); }
  }, [error, clearError]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShareLink = async () => {
    try { await generateShareLink(tenantId); toast.success('Link di condivisione generato!'); }
    catch { toast.error('Errore nella generazione del link'); }
  };

  const handleRevokeShare = async () => {
    try { await revokeShareLink(tenantId); toast.success('Link revocato'); }
    catch { toast.error('Errore nella revoca'); }
  };

  const handleCopyLink = async () => {
    if (shareLink?.url) {
      await navigator.clipboard.writeText(shareLink.url);
      setLinkCopied(true);
      toast.success('Link copiato!');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // ============================================================
  // Form Handlers
  // ============================================================

  const handleAddRental = async () => {
    if (!rentalForm.address || !rentalForm.city || !rentalForm.startDate || !rentalForm.monthlyRent) {
      toast.error('Compila i campi obbligatori'); return;
    }
    try {
      await addRentalEntry(tenantId, {
        address: rentalForm.address,
        city: rentalForm.city,
        province: rentalForm.province || undefined,
        startDate: new Date(rentalForm.startDate),
        endDate: rentalForm.endDate ? new Date(rentalForm.endDate) : undefined,
        isCurrent: rentalForm.isCurrent,
        monthlyRent: parseInt(rentalForm.monthlyRent),
        landlordName: rentalForm.landlordName || undefined,
        landlordContact: rentalForm.landlordContact || undefined,
        reasonForLeaving: rentalForm.reasonForLeaving || undefined,
        hasReference: false,
      });
      toast.success('Affitto aggiunto!');
      setShowRentalForm(false);
      setRentalForm(EMPTY_RENTAL);
    } catch {
      toast.error('Errore nel salvataggio');
    }
  };

  const handleAddReference = async () => {
    if (!referenceForm.landlordName || !referenceForm.landlordEmail) {
      toast.error('Inserisci nome e email del proprietario'); return;
    }
    try {
      await addReference(tenantId, {
        landlordName: referenceForm.landlordName,
        landlordEmail: referenceForm.landlordEmail,
        propertyAddress: referenceForm.propertyAddress || undefined,
        rating: 0,
      });
      toast.success('Richiesta referenza inviata!');
      setShowReferenceForm(false);
      setReferenceForm(EMPTY_REFERENCE);
    } catch {
      toast.error('Errore nel salvataggio');
    }
  };

  const handleAddGuarantor = async () => {
    if (!guarantorForm.fullName || !guarantorForm.relationship) {
      toast.error('Inserisci nome e relazione del garante'); return;
    }
    try {
      await addGuarantor(tenantId, {
        type: guarantorForm.type,
        fullName: guarantorForm.fullName,
        relationship: guarantorForm.relationship,
        phone: guarantorForm.phone || undefined,
        email: guarantorForm.email || undefined,
        occupation: guarantorForm.occupation || undefined,
        annualIncome: guarantorForm.annualIncome ? parseInt(guarantorForm.annualIncome) : undefined,
        documentUploaded: false,
      });
      toast.success('Garante aggiunto!');
      setShowGuarantorForm(false);
      setGuarantorForm(EMPTY_GUARANTOR);
    } catch {
      toast.error('Errore nel salvataggio');
    }
  };

  const handleAddDocument = () => {
    // Simulate document upload (mock)
    toast.success(`Documento "${DOCUMENT_TYPE_LABELS[documentForm.type]}" caricato!`);
    setShowDocumentForm(false);
    setDocumentForm(EMPTY_DOCUMENT);
  };

  // ============================================================
  // Render
  // ============================================================

  if (isLoading && !cv) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Impossibile caricare il CV</p>
        <Button onClick={() => loadCV(tenantId)} className="mt-4" variant="outline">
          <RefreshCw size={16} className="mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Il mio Curriculum</h1>
          <p className="text-text-secondary mt-1">
            Gestisci il tuo CV da inquilino per candidarti agli annunci
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/tenant/cv/preview">
            <Button variant="outline" size="sm" leftIcon={<Eye size={16} />}>Anteprima</Button>
          </Link>
          <Button
            variant="primary" size="sm" leftIcon={<Share2 size={16} />}
            onClick={shareLink ? handleCopyLink : handleShareLink}
            isLoading={isSaving}
          >
            {shareLink ? 'Copia link' : 'Condividi'}
          </Button>
        </div>
      </div>

      {/* Share Link Banner */}
      {shareLink && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 size={18} className="text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">CV condivisibile attivo</p>
              <p className="text-xs text-blue-600 font-mono mt-0.5 break-all">{shareLink.url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleCopyLink} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Copia link">
              {linkCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-blue-500" />}
            </button>
            <button onClick={handleRevokeShare} className="text-xs text-blue-500 hover:text-blue-700 underline">
              Revoca
            </button>
          </div>
        </div>
      )}

      {/* Completeness + Reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CVCompletenessBar completeness={cv.completeness} onSectionClick={handleSectionClick} />
        </div>
        <div>
          <CVReliabilityScore score={cv.reliabilityScore} />
        </div>
      </div>

      {/* CV Sections */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVPersonalSection data={cv.personalInfo} />
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVEmploymentSection data={cv.employment} showIncome={settings?.showIncome ?? true} />
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVRentalHistorySection
            entries={cv.rentalHistory}
            editable={true}
            onAdd={() => setShowRentalForm(true)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVDocumentsSection
            documents={cv.documents}
            editable={true}
            onUpload={() => setShowDocumentForm(true)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVReferencesSection
            references={cv.references}
            editable={true}
            onAdd={() => setShowReferenceForm(true)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <CVGuarantorsSection
            guarantors={cv.guarantors}
            editable={true}
            onAdd={() => setShowGuarantorForm(true)}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* RENTAL HISTORY FORM MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={showRentalForm}
        onClose={() => { setShowRentalForm(false); setRentalForm(EMPTY_RENTAL); }}
        title="Aggiungi Affitto Precedente"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Indirizzo *"
            value={rentalForm.address}
            onChange={(e) => setRentalForm({ ...rentalForm, address: e.target.value })}
            placeholder="Via Roma 10"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Citta *</label>
              <select className="input" value={rentalForm.city} onChange={(e) => setRentalForm({ ...rentalForm, city: e.target.value })}>
                <option value="">Seleziona...</option>
                {ITALIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input
              label="Provincia"
              value={rentalForm.province}
              onChange={(e) => setRentalForm({ ...rentalForm, province: e.target.value })}
              placeholder="MI"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data inizio *"
              type="date"
              value={rentalForm.startDate}
              onChange={(e) => setRentalForm({ ...rentalForm, startDate: e.target.value })}
            />
            <Input
              label="Data fine"
              type="date"
              value={rentalForm.endDate}
              onChange={(e) => setRentalForm({ ...rentalForm, endDate: e.target.value })}
              disabled={rentalForm.isCurrent}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rentalForm.isCurrent}
              onChange={(e) => setRentalForm({ ...rentalForm, isCurrent: e.target.checked, endDate: '' })}
              className="rounded border-border"
            />
            <span className="text-sm">Affitto attuale</span>
          </label>
          <Input
            label="Affitto mensile (€) *"
            type="number"
            value={rentalForm.monthlyRent}
            onChange={(e) => setRentalForm({ ...rentalForm, monthlyRent: e.target.value })}
            placeholder="800"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome proprietario"
              value={rentalForm.landlordName}
              onChange={(e) => setRentalForm({ ...rentalForm, landlordName: e.target.value })}
            />
            <Input
              label="Contatto proprietario"
              value={rentalForm.landlordContact}
              onChange={(e) => setRentalForm({ ...rentalForm, landlordContact: e.target.value })}
              placeholder="Email o telefono"
            />
          </div>
          {!rentalForm.isCurrent && (
            <Input
              label="Motivo fine contratto"
              value={rentalForm.reasonForLeaving}
              onChange={(e) => setRentalForm({ ...rentalForm, reasonForLeaving: e.target.value })}
              placeholder="es. Trasferimento per lavoro"
            />
          )}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowRentalForm(false); setRentalForm(EMPTY_RENTAL); }}>
            Annulla
          </Button>
          <Button onClick={handleAddRental} isLoading={isSaving}>Aggiungi</Button>
        </ModalFooter>
      </Modal>

      {/* ============================================================ */}
      {/* REFERENCE FORM MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={showReferenceForm}
        onClose={() => { setShowReferenceForm(false); setReferenceForm(EMPTY_REFERENCE); }}
        title="Richiedi Referenza"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Inserisci i dati del tuo precedente proprietario. Ricevera una email per lasciare una referenza sul tuo profilo.
          </p>
          <Input
            label="Nome proprietario *"
            value={referenceForm.landlordName}
            onChange={(e) => setReferenceForm({ ...referenceForm, landlordName: e.target.value })}
            placeholder="Mario Rossi"
          />
          <Input
            label="Email proprietario *"
            type="email"
            value={referenceForm.landlordEmail}
            onChange={(e) => setReferenceForm({ ...referenceForm, landlordEmail: e.target.value })}
            placeholder="proprietario@email.it"
          />
          <Input
            label="Indirizzo immobile"
            value={referenceForm.propertyAddress}
            onChange={(e) => setReferenceForm({ ...referenceForm, propertyAddress: e.target.value })}
            placeholder="Via dell'affitto precedente"
          />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowReferenceForm(false); setReferenceForm(EMPTY_REFERENCE); }}>
            Annulla
          </Button>
          <Button onClick={handleAddReference} isLoading={isSaving}>Invia Richiesta</Button>
        </ModalFooter>
      </Modal>

      {/* ============================================================ */}
      {/* GUARANTOR FORM MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={showGuarantorForm}
        onClose={() => { setShowGuarantorForm(false); setGuarantorForm(EMPTY_GUARANTOR); }}
        title="Aggiungi Garante"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Tipo garanzia *</label>
            <select
              className="input"
              value={guarantorForm.type}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, type: e.target.value as GuarantorType })}
            >
              {Object.entries(GUARANTOR_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome completo *"
              value={guarantorForm.fullName}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, fullName: e.target.value })}
              placeholder="Nome e cognome"
            />
            <Input
              label="Relazione *"
              value={guarantorForm.relationship}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, relationship: e.target.value })}
              placeholder="es. Genitore, Datore di lavoro"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefono"
              type="tel"
              value={guarantorForm.phone}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={guarantorForm.email}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Professione"
              value={guarantorForm.occupation}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, occupation: e.target.value })}
            />
            <Input
              label="Reddito annuale (€)"
              type="number"
              value={guarantorForm.annualIncome}
              onChange={(e) => setGuarantorForm({ ...guarantorForm, annualIncome: e.target.value })}
              placeholder="45000"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowGuarantorForm(false); setGuarantorForm(EMPTY_GUARANTOR); }}>
            Annulla
          </Button>
          <Button onClick={handleAddGuarantor} isLoading={isSaving}>Aggiungi Garante</Button>
        </ModalFooter>
      </Modal>

      {/* ============================================================ */}
      {/* DOCUMENT UPLOAD MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={showDocumentForm}
        onClose={() => { setShowDocumentForm(false); setDocumentForm(EMPTY_DOCUMENT); }}
        title="Carica Documento"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Tipo documento *</label>
            <select
              className="input"
              value={documentForm.type}
              onChange={(e) => setDocumentForm({ ...documentForm, type: e.target.value as DocumentType })}
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <p className="text-text-secondary text-sm mb-2">Trascina qui il file oppure</p>
            <Button variant="outline" size="sm" onClick={() => toast('Seleziona file dal dispositivo', { icon: '📁' })}>
              Sfoglia
            </Button>
            <p className="text-xs text-text-muted mt-2">PDF, JPG o PNG - Max 10MB</p>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowDocumentForm(false); setDocumentForm(EMPTY_DOCUMENT); }}>
            Annulla
          </Button>
          <Button onClick={handleAddDocument}>Carica</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
