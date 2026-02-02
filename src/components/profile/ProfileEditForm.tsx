/**
 * ProfileEditForm Component
 * Form per modificare i dati del profilo inquilino
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Briefcase, MapPin, Euro, Calendar, Building2, Save, Loader2 } from 'lucide-react';
import { EmploymentType } from '@/types/tenant';
import { ITALIAN_CITIES, OCCUPATIONS } from '@/utils/constants';

// Schema di validazione
const profileSchema = z.object({
  firstName: z.string().min(2, 'Nome troppo corto').max(50, 'Nome troppo lungo'),
  lastName: z.string().min(2, 'Cognome troppo corto').max(50, 'Cognome troppo lungo'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  employmentType: z.string().optional(),
  employer: z.string().optional(),
  annualIncome: z.number().min(0).optional(),
  currentCity: z.string().optional(),
  bio: z.string().max(500, 'Bio troppo lunga').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'permanent', label: 'Contratto Indeterminato' },
  { value: 'fixed_term', label: 'Contratto Determinato' },
  { value: 'freelance', label: 'Libero Professionista' },
  { value: 'internship', label: 'Stage/Tirocinio' },
  { value: 'student', label: 'Studente' },
  { value: 'retired', label: 'Pensionato' },
  { value: 'unemployed', label: 'In cerca di occupazione' },
];

export function ProfileEditForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      occupation: '',
      employmentType: '',
      employer: '',
      annualIncome: undefined,
      currentCity: '',
      bio: '',
      ...initialData,
    },
  });

  const bioValue = watch('bio') || '';

  const onFormSubmit = async (data: ProfileFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Dati Personali */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-action-green" />
          Dati Personali
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              {...register('firstName')}
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent`}
              placeholder="Il tuo nome"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cognome *
            </label>
            <input
              {...register('lastName')}
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent`}
              placeholder="Il tuo cognome"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('phone')}
                type="tel"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent"
                placeholder="+39 333 1234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data di Nascita
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('dateOfBirth')}
                type="date"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Città Attuale
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                {...register('currentCity')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent appearance-none bg-white"
              >
                <option value="">Seleziona città</option>
                {ITALIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dati Lavorativi */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-action-green" />
          Situazione Lavorativa
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupazione
            </label>
            <select
              {...register('occupation')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent appearance-none bg-white"
            >
              <option value="">Seleziona occupazione</option>
              {OCCUPATIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo di Contratto
            </label>
            <select
              {...register('employmentType')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent appearance-none bg-white"
            >
              <option value="">Seleziona tipo</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datore di Lavoro
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('employer')}
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent"
                placeholder="Nome azienda"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reddito Annuale (€)
            </label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('annualIncome', { valueAsNumber: true })}
                type="number"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent"
                placeholder="Es: 35000"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">📝</span>
          La Tua Presentazione
        </h3>
        <textarea
          {...register('bio')}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-action-green focus:border-transparent resize-none`}
          placeholder="Racconta di te, del tuo lavoro, dei tuoi hobby e perché sei l'inquilino ideale..."
        />
        <div className="flex justify-between mt-1">
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
          <p className={`text-sm ml-auto ${bioValue.length > 450 ? 'text-yellow-600' : 'text-gray-400'}`}>
            {bioValue.length}/500
          </p>
        </div>
      </div>

      {/* Azioni */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annulla
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvataggio...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salva Modifiche
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfileEditForm;
