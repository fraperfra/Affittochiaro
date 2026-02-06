/**
 * TenantProfilePage
 * Pagina profilo inquilino con gestione documenti, video, foto e modifica dati
 */

import { useState, useCallback } from 'react';
import { useAuthStore } from '../../store';
import { TenantUser, DocumentType } from '../../types';
import { formatCurrency, formatDate, formatInitials } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter } from '../../components/ui';
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

export default function TenantProfilePage() {
  const { user, setUser } = useAuthStore();
  const tenantUser = user as TenantUser;

  // Stati locali
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [incomeVisible, setIncomeVisible] = useState(tenantUser?.profile?.incomeVisible ?? true);
  const [bio, setBio] = useState(
    tenantUser?.profile?.bio || "Ciao! Sono Mario, lavoro come Software Developer a Milano. Cerco un appartamento accogliente dove sentirmi a casa. Sono una persona ordinata, rispettosa e puntuale con i pagamenti."
  );

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top section with avatar and info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <AvatarUploader
                currentAvatar={avatarUrl}
                onUpload={handleAvatarUpload}
                isUploading={isUploadingAvatar}
                size="lg"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {tenantUser?.profile?.firstName || 'Mario'} {tenantUser?.profile?.lastName || 'Rossi'}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      32 anni
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {tenantUser?.profile?.occupation || 'Software Developer'}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {tenantUser?.profile?.city || 'Milano'}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                    {tenantUser?.profile?.isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={14} />
                        Verificato
                      </span>
                    )}
                    {hasVideo && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <Video size={14} />
                        Video
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      ⭐ 4.8
                    </span>
                  </div>
                </div>

                {/* Edit button - desktop */}
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm"
                >
                  <Settings size={16} />
                  Modifica
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
          <div className="p-4 sm:p-6 text-center hover:bg-white transition-colors cursor-default">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users size={18} className="text-action-green" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">127</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">Visualizzazioni</p>
          </div>
          <div className="p-4 sm:p-6 text-center hover:bg-white transition-colors cursor-default">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Send size={18} className="text-blue-500" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">8</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">Candidature</p>
          </div>
          <div className="p-4 sm:p-6 text-center hover:bg-white transition-colors cursor-default">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FileText size={18} className="text-purple-500" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{documents.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">Documenti</p>
          </div>
        </div>

        {/* Edit button - mobile */}
        <div className="p-4 border-t border-gray-100 sm:hidden">
          <button
            onClick={() => setEditProfileOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-action-green hover:bg-brand-green rounded-xl transition-all duration-200"
          >
            <Edit2 size={16} />
            Modifica Profilo
          </button>
        </div>
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

          {/* References */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <CardTitle>Referenze</CardTitle>
              </div>
            </CardHeader>
            <div className="text-center py-6">
              <p className="text-text-muted mb-4">
                Nessuna referenza ancora
              </p>
              <Button variant="outline" size="sm">
                Richiedi Referenza
              </Button>
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
    </div>
  );
}
