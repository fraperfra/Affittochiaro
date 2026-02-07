/**
 * TenantCVPreviewPage - Anteprima del CV come lo vede un'agenzia
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { useAuthStore, useCVStore } from '@/store';
import { TenantUser } from '@/types';
import { Button, Spinner } from '@/components/ui';
import {
  CVPersonalSection,
  CVEmploymentSection,
  CVRentalHistorySection,
  CVDocumentsSection,
  CVReferencesSection,
  CVGuarantorsSection,
  CVReliabilityScore,
} from '@/components/cv';

export default function TenantCVPreviewPage() {
  const { user } = useAuthStore();
  const { cv, settings, isLoading, loadCV } = useCVStore();

  const tenantUser = user as TenantUser;
  const tenantId = tenantUser?.id || '';

  useEffect(() => {
    if (tenantId && !cv) {
      loadCV(tenantId);
    }
  }, [tenantId, cv, loadCV]);

  if (isLoading || !cv) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/tenant/profile">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
            Torna al Profilo
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer size={16} />}
          onClick={() => window.print()}
        >
          Stampa
        </Button>
      </div>

      {/* Preview Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 print:hidden">
        <p className="text-sm text-yellow-800 text-center">
          Questa e' l'anteprima del tuo CV come lo vedra' un'agenzia o un proprietario
        </p>
      </div>

      {/* CV Preview Card */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden print:shadow-none">
        {/* Header del CV */}
        <div className="bg-gradient-to-r from-teal-700 to-primary-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {cv.personalInfo.avatarUrl ? (
                <img
                  src={cv.personalInfo.avatarUrl}
                  alt="Foto"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {cv.personalInfo.firstName?.[0]}{cv.personalInfo.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">
                  {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                </h1>
                <p className="text-white/80 text-sm mt-0.5">
                  {cv.employment.occupation || 'Inquilino'}
                  {cv.personalInfo.city && ` - ${cv.personalInfo.city}`}
                </p>
              </div>
            </div>
            <CVReliabilityScore score={cv.reliabilityScore} compact />
          </div>
        </div>

        {/* Sezioni CV */}
        <div className="p-6 space-y-8">
          {/* Info Personali */}
          <CVPersonalSection data={cv.personalInfo} isPreview />

          <hr className="border-gray-100" />

          {/* Lavoro */}
          <CVEmploymentSection
            data={cv.employment}
            showIncome={settings?.showIncome ?? true}
          />

          <hr className="border-gray-100" />

          {/* Storia Abitativa */}
          {(settings?.showRentalHistory ?? true) && cv.rentalHistory.length > 0 && (
            <>
              <CVRentalHistorySection entries={cv.rentalHistory} />
              <hr className="border-gray-100" />
            </>
          )}

          {/* Documenti */}
          {(settings?.showDocuments ?? true) && cv.documents.length > 0 && (
            <>
              <CVDocumentsSection documents={cv.documents} />
              <hr className="border-gray-100" />
            </>
          )}

          {/* Referenze */}
          {(settings?.showReferences ?? true) && cv.references.length > 0 && (
            <>
              <CVReferencesSection references={cv.references} />
              <hr className="border-gray-100" />
            </>
          )}

          {/* Garanti */}
          {cv.guarantors.length > 0 && (
            <CVGuarantorsSection guarantors={cv.guarantors} />
          )}
        </div>

        {/* Footer CV */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
            <ShieldCheck size={14} className="text-primary-500" />
            <span>CV generato su Affittochiaro - Ultimo aggiornamento: {new Date(cv.lastUpdated).toLocaleDateString('it-IT')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
