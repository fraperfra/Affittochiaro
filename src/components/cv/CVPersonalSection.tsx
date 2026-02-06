/**
 * Sezione dati personali del CV
 */

import { CVPersonalInfo } from '@/types/cv';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface CVPersonalSectionProps {
  data: CVPersonalInfo;
  isPreview?: boolean;
}

export default function CVPersonalSection({ data, isPreview = false }: CVPersonalSectionProps) {
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateAge = (dob?: Date) => {
    if (!dob) return null;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(data.dateOfBirth);

  return (
    <div id="section-personal_info">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <User size={20} className="text-primary-500" />
        Dati personali
      </h3>

      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Nome completo</p>
            <p className="text-sm font-medium text-text-primary">
              {data.firstName} {data.lastName}
              {age && <span className="text-text-secondary font-normal ml-1">({age} anni)</span>}
            </p>
          </div>

          {!isPreview && data.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-text-primary">{data.email}</p>
              </div>
            </div>
          )}

          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Telefono</p>
                <p className="text-sm font-medium text-text-primary">{data.phone}</p>
              </div>
            </div>
          )}

          {data.city && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Residenza</p>
                <p className="text-sm font-medium text-text-primary">
                  {data.city}{data.province ? ` (${data.province})` : ''}
                </p>
              </div>
            </div>
          )}

          {data.dateOfBirth && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Data di nascita</p>
                <p className="text-sm font-medium text-text-primary">{formatDate(data.dateOfBirth)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Chi sono</p>
          <p className="text-sm text-text-primary leading-relaxed">{data.bio}</p>
        </div>
      )}
    </div>
  );
}
