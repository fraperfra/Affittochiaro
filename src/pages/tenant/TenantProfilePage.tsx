/**
 * TenantProfilePage
 * Pagina profilo inquilino con gestione documenti, video, foto e modifica dati
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore, useCVStore } from '../../store';
import { TenantUser, DocumentType } from '../../types';
import { formatCurrency, formatDate, formatInitials } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import {
  Edit2,
  Eye,
  EyeOff,
  Video,
  Upload,
  FileText,
  MapPin,
  Briefcase,
  Calendar,
  Euro,
  Home,
  PawPrint,
  Plus,
  X,
  Users,
  Send,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { CVRentalHistorySection, CVReferencesSection } from '../../components/cv';
import { ITALIAN_CITIES } from '../../utils/constants';

// Nuovi componenti
import { DocumentUploader, DocumentList } from '../../components/documents';
import { VideoRecorder, VideoUploader, VideoPlayer, VideoPlaceholder } from '../../components/video';
import { AvatarUploader, ProfileEditModal, ProfileFormData } from '../../components/profile';
import { useDocuments } from '../../hooks';
import { mockVideoApi, mockAvatarApi, mockProfileApi, USE_MOCK_API } from '../../services/mock/mockTenantService';
import { tenantsApi } from '../../services/api/tenants';
import toast from 'react-hot-toast';

type VideoMode = 'view' | 'record' | 'upload';

// Helper per label tipo contratto
const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  permanent: 'Contratto Indeterminato',
  fixed_term: 'Contratto Determinato',
  freelance: 'Libero Professionista',
  internship: 'Stage/Tirocinio',
  student: 'Studente',
  retired: 'Pensionato',
  unemployed: 'In cerca di occupazione',
};

function getEmploymentTypeLabel(type?: string): string {
  if (!type) return 'Non specificato';
  return EMPLOYMENT_TYPE_LABELS[type] || type;
}

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

const EMPTY_RENTAL: RentalFormData = {
  address: '', city: '', province: '', startDate: '', endDate: '',
  isCurrent: false, monthlyRent: '', landlordName: '', landlordContact: '', reasonForLeaving: '',
};

const EMPTY_REFERENCE: ReferenceFormData = {
  landlordName: '', landlordEmail: '', propertyAddress: '',
};

export default function TenantProfilePage() {
  const { user, setUser } = useAuthStore();
  const tenantUser = user as TenantUser;

  // CV Store
  const {
    cv, isLoading: isCVLoading, isSaving: isCVSaving, error: cvError,
    loadCV, addRentalEntry, addReference, clearError: clearCVError,
  } = useCVStore();

  const tenantId = tenantUser?.id || '';

  useEffect(() => {
    if (tenantId) loadCV(tenantId);
  }, [tenantId, loadCV]);

  useEffect(() => {
    if (cvError) { toast.error(cvError); clearCVError(); }
  }, [cvError, clearCVError]);

  // Stati locali
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [incomeVisible, setIncomeVisible] = useState(tenantUser?.profile?.incomeVisible ?? true);
  const [bio, setBio] = useState(
    tenantUser?.profile?.bio || "Ciao! Sono Mario, lavoro come Software Developer a Milano. Cerco un appartamento accogliente dove sentirmi a casa. Sono una persona ordinata, rispettosa e puntuale con i pagamenti."
  );

  // Form modals - Rental History & References
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalForm, setRentalForm] = useState<RentalFormData>(EMPTY_RENTAL);
  const [showReferenceForm, setShowReferenceForm] = useState(false);
  const [referenceForm, setReferenceForm] = useState<ReferenceFormData>(EMPTY_REFERENCE);

  // Dati profilo
  const profile = tenantUser?.profile;

  // Stati documenti
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const {
    documents,
    isLoading: isLoadingDocs,
    error: docsError,
    uploadStatus,
    uploadProgress,
    uploadError,
    uploadDocument,
    deleteDocument,
    cancelUpload,
    deletingId,
  } = useDocuments();

  // Stati video
  const [videoMode, setVideoMode] = useState<VideoMode>('view');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [hasVideo, setHasVideo] = useState(tenantUser?.profile?.hasVideo || false);

  // Stati avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    tenantUser?.profile?.avatarUrl || null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Stati profilo
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Handler upload documento
  const handleDocumentUpload = async (file: File, type: DocumentType) => {
    try {
      await uploadDocument(file, type);
      setShowDocumentUpload(false);
      toast.success('Documento caricato con successo!');
    } catch (error: any) {
      toast.error(error.message || 'Errore durante il caricamento');
    }
  };

  // Handler elimina documento
  const handleDocumentDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo documento?')) {
      try {
        await deleteDocument(id);
        toast.success('Documento eliminato');
      } catch (error: any) {
        toast.error(error.message || 'Errore durante l\'eliminazione');
      }
    }
  };

  // Handler video registrato/caricato
  const handleVideoComplete = async (file: File, duration: number) => {
    setIsUploadingVideo(true);
    try {
      let url: string;

      if (USE_MOCK_API) {
        url = await mockVideoApi.uploadVideo(file);
        await mockVideoApi.confirmVideoUpload(url, duration);
      } else {
        // Ottieni presigned URL
        const { uploadUrl, videoUrl: finalUrl } = await tenantsApi.getVideoUploadUrl();
        // Upload diretto a S3
        await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        // Conferma upload
        await tenantsApi.confirmVideoUpload(finalUrl, duration);
        url = finalUrl;
      }

      setVideoUrl(url);
      setVideoDuration(duration);
      setHasVideo(true);
      setVideoMode('view');
      toast.success('Video caricato con successo!');
    } catch (error: any) {
      toast.error(error.message || 'Errore durante il caricamento del video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Handler elimina video
  const handleVideoDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare il video?')) return;

    setIsDeletingVideo(true);
    try {
      if (USE_MOCK_API) {
        await mockVideoApi.deleteVideo();
      } else {
        await tenantsApi.deleteVideo();
      }

      setVideoUrl(null);
      setVideoDuration(0);
      setHasVideo(false);
      toast.success('Video eliminato');
    } catch (error: any) {
      toast.error(error.message || 'Errore durante l\'eliminazione');
    } finally {
      setIsDeletingVideo(false);
    }
  };

  // Handler upload avatar
  const handleAvatarUpload = async (file: File | Blob) => {
    setIsUploadingAvatar(true);
    try {
      let url: string;

      if (USE_MOCK_API) {
        url = await mockAvatarApi.uploadAvatar(file);
      } else {
        // TODO: Implementare upload avatar reale
        url = URL.createObjectURL(file);
      }

      setAvatarUrl(url);
      toast.success('Foto profilo aggiornata!');
    } catch (error: any) {
      toast.error(error.message || 'Errore durante il caricamento');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handler salva profilo
  const handleProfileSave = async (data: ProfileFormData) => {
    setIsSavingProfile(true);
    try {
      if (USE_MOCK_API) {
        await mockProfileApi.updateProfile(data);
      } else {
        await tenantsApi.updateProfile(data);
      }

      // Aggiorna bio locale
      setBio(data.bio || bio);

      // Aggiorna lo store direttamente senza reload
      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...(user as TenantUser).profile,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            bio: data.bio,
            occupation: data.occupation,
            employmentType: data.employmentType as any,
            employer: data.employer,
            annualIncome: data.annualIncome,
            city: data.currentCity,
          },
        } as TenantUser;
        setUser(updatedUser);
      }

      setEditProfileOpen(false);
      toast.success('Profilo aggiornato con successo!');
    } catch (error: any) {
      toast.error(error.message || 'Errore durante il salvataggio');
      throw error;
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Rental form handler
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

  // Reference form handler
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Il Mio Profilo</h1>
        <button
          onClick={() => setEditProfileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm"
        >
          <Settings size={16} />
          Modifica
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <CardTitle>La Mia Storia</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditBioOpen(true)}>
                  <Edit2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <p className="text-text-secondary leading-relaxed">{bio}</p>
          </Card>

          {/* Employment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💼</span>
                  <CardTitle>Situazione Lavorativa</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditProfileOpen(true)}>
                  <Edit2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Briefcase size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Occupazione</p>
                  <p className="font-medium">{profile?.occupation || 'Non specificato'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FileText size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Tipo Contratto</p>
                  <p className="font-medium">{getEmploymentTypeLabel(profile?.employmentType)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Euro size={20} className="text-primary-600" />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm text-text-muted">Reddito Annuale</p>
                    <p className="font-medium">
                      {incomeVisible && profile?.annualIncome
                        ? formatCurrency(profile.annualIncome)
                        : profile?.annualIncome ? '••••••' : 'Non specificato'}
                    </p>
                  </div>
                  {profile?.annualIncome && (
                    <button
                      onClick={() => setIncomeVisible(!incomeVisible)}
                      className="p-1 rounded hover:bg-background-secondary"
                    >
                      {incomeVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Disponibilità</p>
                  <p className="font-medium">
                    {profile?.availableFrom
                      ? formatDate(new Date(profile.availableFrom))
                      : 'Immediata'}
                  </p>
                </div>
              </div>
              {profile?.employer && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Briefcase size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Datore di Lavoro</p>
                    <p className="font-medium">{profile.employer}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Rental History (from CV store) */}
          {cv && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <CVRentalHistorySection
                entries={cv.rentalHistory}
                editable={true}
                onAdd={() => setShowRentalForm(true)}
              />
            </div>
          )}

          {/* References (from CV store) */}
          {cv && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <CVReferencesSection
                references={cv.references}
                editable={true}
                onAdd={() => setShowReferenceForm(true)}
              />
            </div>
          )}

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <CardTitle>Documenti Caricati</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload size={16} />}
                  onClick={() => setShowDocumentUpload(true)}
                >
                  Carica Nuovo
                </Button>
              </div>
            </CardHeader>

            {/* Document Upload Area */}
            {showDocumentUpload && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Carica documento</h4>
                  <button
                    onClick={() => setShowDocumentUpload(false)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                <DocumentUploader
                  onUpload={handleDocumentUpload}
                  uploadStatus={uploadStatus}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  onCancel={cancelUpload}
                />
              </div>
            )}

            {/* Document List */}
            <DocumentList
              documents={documents}
              isLoading={isLoadingDocs}
              error={docsError}
              onDelete={handleDocumentDelete}
              onAddNew={() => setShowDocumentUpload(true)}
              deletingId={deletingId}
            />
          </Card>
        </div>

        <div className="space-y-6">
          {/* Video Presentation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎥</span>
                <CardTitle>Video Presentazione</CardTitle>
              </div>
            </CardHeader>

            {/* Video View Mode */}
            {videoMode === 'view' && (
              <>
                {hasVideo && videoUrl ? (
                  <VideoPlayer
                    src={videoUrl}
                    duration={videoDuration}
                    onDelete={handleVideoDelete}
                    onRerecord={() => setVideoMode('record')}
                    isDeleting={isDeletingVideo}
                  />
                ) : (
                  <VideoPlaceholder
                    onRecord={() => setVideoMode('record')}
                    onUpload={() => setVideoMode('upload')}
                  />
                )}
              </>
            )}

            {/* Video Record Mode */}
            {videoMode === 'record' && (
              <div className="py-4">
                <VideoRecorder
                  maxDuration={60}
                  onRecordingComplete={handleVideoComplete}
                  onCancel={() => setVideoMode('view')}
                />
              </div>
            )}

            {/* Video Upload Mode */}
            {videoMode === 'upload' && (
              <div className="py-4">
                <VideoUploader
                  onUpload={handleVideoComplete}
                  disabled={isUploadingVideo}
                  onCancel={() => setVideoMode('view')}
                />
                <button
                  onClick={() => setVideoMode('view')}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Annulla
                </button>
              </div>
            )}
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <CardTitle>Preferenze di Ricerca</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Euro size={16} />
                  <span>Budget Massimo</span>
                </div>
                <span className="font-medium">{formatCurrency(1200)}/mese</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Home size={16} />
                  <span>Locali</span>
                </div>
                <span className="font-medium">2-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={16} />
                  <span>Citta</span>
                </div>
                <span className="font-medium">Milano</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <PawPrint size={16} />
                  <span>Animali</span>
                </div>
                <span className="font-medium">No</span>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Edit Bio Modal */}
      <Modal
        isOpen={editBioOpen}
        onClose={() => setEditBioOpen(false)}
        title="Modifica La Tua Storia"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Racconta di te, del tuo lavoro, hobby, perche sei l'inquilino ideale...
          </p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input min-h-[150px] resize-none"
            maxLength={500}
            placeholder="Scrivi qualcosa su di te..."
          />
          <p className="text-sm text-text-muted text-right">{bio.length}/500</p>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setEditBioOpen(false)}>
            Annulla
          </Button>
          <Button onClick={() => setEditBioOpen(false)}>
            Salva
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onSubmit={handleProfileSave}
        initialData={{
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          phone: profile?.phone || '',
          occupation: profile?.occupation || '',
          employmentType: profile?.employmentType || '',
          employer: profile?.employer || '',
          annualIncome: profile?.annualIncome,
          currentCity: profile?.city || '',
          bio: bio,
        }}
        isLoading={isSavingProfile}
      />

      {/* Rental History Form Modal */}
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
            label="Affitto mensile (&euro;) *"
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
          <Button onClick={handleAddRental} isLoading={isCVSaving}>Aggiungi</Button>
        </ModalFooter>
      </Modal>

      {/* Reference Form Modal */}
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
          <Button onClick={handleAddReference} isLoading={isCVSaving}>Invia Richiesta</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
