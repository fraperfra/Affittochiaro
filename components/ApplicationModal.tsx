import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Home, MessageSquare, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface ListingInfo {
  id: number;
  title: string;
  price: string;
  type: string;
  image: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingInfo | null;
  onSubmit: (data: ApplicationData) => void;
}

export interface ApplicationData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2: Employment
  occupation: string;
  employmentType: string;
  monthlyIncome: string;
  // Step 3: Housing Preferences
  moveInDate: string;
  stayDuration: string;
  hasPets: boolean;
  petDetails: string;
  isSmoker: boolean;
  // Step 4: Message
  message: string;
  // Listing info
  listingId: number;
  listingTitle: string;
}

const STEPS = [
  { id: 1, title: 'Dati Personali', icon: User, color: 'from-blue-500 to-cyan-500' },
  { id: 2, title: 'Lavoro', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
  { id: 3, title: 'Preferenze', icon: Home, color: 'from-orange-500 to-amber-500' },
  { id: 4, title: 'Presentati', icon: MessageSquare, color: 'from-teal-500 to-green-500' },
  { id: 5, title: 'Conferma', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
];

const MOTIVATIONAL_MESSAGES = [
  { step: 1, message: "Ottimo inizio! Facci sapere chi sei", emoji: "👋" },
  { step: 2, message: "Perfetto! Le agenzie apprezzano la trasparenza", emoji: "💼" },
  { step: 3, message: "Quasi fatto! Aiutaci a trovare la casa perfetta per te", emoji: "🏠" },
  { step: 4, message: "Ultimo passo! Una breve presentazione fa la differenza", emoji: "✨" },
  { step: 5, message: "Candidatura pronta! Controlla i tuoi dati", emoji: "🎉" },
];

const OCCUPATIONS = [
  'Impiegato/a',
  'Manager',
  'Libero Professionista',
  'Imprenditore',
  'Commerciante',
  'Insegnante',
  'Medico',
  'Infermiere/a',
  'Avvocato',
  'Ingegnere',
  'Architetto',
  'Designer',
  'Sviluppatore Software',
  'Studente',
  'Pensionato/a',
  'Altro',
];

const EMPLOYMENT_TYPES = [
  'Tempo indeterminato',
  'Tempo determinato',
  'Partita IVA',
  'Contratto di apprendistato',
  'Stage/Tirocinio',
  'Studente',
  'Pensionato',
  'Altro',
];

const INCOME_RANGES = [
  'Meno di €1.000',
  '€1.000 - €1.500',
  '€1.500 - €2.000',
  '€2.000 - €2.500',
  '€2.500 - €3.000',
  '€3.000 - €4.000',
  'Oltre €4.000',
  'Preferisco non specificare',
];

const STAY_DURATIONS = [
  '6 mesi - 1 anno',
  '1 - 2 anni',
  '2 - 3 anni',
  'Oltre 3 anni',
  'Non specificato',
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    employmentType: '',
    monthlyIncome: '',
    moveInDate: '',
    stayDuration: '',
    hasPets: false,
    petDetails: '',
    isSmoker: false,
    message: '',
    listingId: 0,
    listingTitle: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && listing) {
      setFormData(prev => ({
        ...prev,
        listingId: listing.id,
        listingTitle: listing.title,
      }));
      setCurrentStep(1);
      setIsSuccess(false);
      setErrors({});
    }
  }, [isOpen, listing]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const updateFormData = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome richiesto';
      if (!formData.lastName.trim()) newErrors.lastName = 'Cognome richiesto';
      if (!formData.email.trim()) {
        newErrors.email = 'Email richiesta';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email non valida';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefono richiesto';
      } else if (!/^[\d\s+()-]{8,}$/.test(formData.phone)) {
        newErrors.phone = 'Numero non valido';
      }
    }

    if (step === 2) {
      if (!formData.occupation) newErrors.occupation = 'Seleziona occupazione';
      if (!formData.employmentType) newErrors.employmentType = 'Seleziona tipo contratto';
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Seleziona fascia reddito';
    }

    if (step === 3) {
      if (!formData.moveInDate) newErrors.moveInDate = 'Seleziona data';
      if (!formData.stayDuration) newErrors.stayDuration = 'Seleziona durata';
      if (formData.hasPets && !formData.petDetails.trim()) {
        newErrors.petDetails = 'Specifica il tipo di animale';
      }
    }

    if (step === 4) {
      if (!formData.message.trim()) {
        newErrors.message = 'Scrivi una breve presentazione';
      } else if (formData.message.trim().length < 20) {
        newErrors.message = 'Scrivi almeno 20 caratteri';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection('next');
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit(formData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset after animation
      setTimeout(() => {
        setCurrentStep(1);
        setIsSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          occupation: '',
          employmentType: '',
          monthlyIncome: '',
          moveInDate: '',
          stayDuration: '',
          hasPets: false,
          petDetails: '',
          isSmoker: false,
          message: '',
          listingId: 0,
          listingTitle: '',
        });
      }, 300);
    }
  };

  if (!isOpen || !listing) return null;

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const currentMotivation = MOTIVATIONAL_MESSAGES.find(m => m.step === currentStep);

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Header with Listing Preview */}
        <div className="bg-gradient-to-r from-brand-green to-teal-600 p-6 pb-10 text-white">
          <div className="flex items-center gap-4">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Candidatura per</p>
              <h3 className="font-bold text-lg truncate">{listing.title}</h3>
              <p className="text-action-green font-bold">{listing.price}/mese</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="relative -mt-5 mx-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                      ${isCompleted ? 'bg-green-500 text-white scale-90' : ''}
                      ${isActive ? `bg-gradient-to-r ${step.color} text-white scale-110 shadow-lg` : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium transition-colors ${
                    isActive ? 'text-brand-green' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-green to-action-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Motivational Message */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="text-lg">{currentMotivation?.emoji}</span>
            <span className="font-medium">{currentMotivation?.message}</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[45vh]">
          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-brand-green mb-2">Candidatura Inviata!</h3>
              <p className="text-gray-600 mb-4">
                L'agenzia ricevera la tua candidatura e ti contattera presto.
              </p>
              <div className="bg-green-50 rounded-xl p-4 text-left max-w-sm mx-auto">
                <p className="text-sm text-green-700 flex items-start gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0" />
                  <span>Il tuo profilo inquilino e stato aggiornato con questi dati!</span>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-6 px-8 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <div className={`transition-all duration-300 ${
              direction === 'next' ? 'animate-slideLeft' : 'animate-slideRight'
            }`}>
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="Mario"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cognome *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        placeholder="Rossi"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="mario.rossi@email.com"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+39 333 1234567"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Employment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupazione *</label>
                    <select
                      value={formData.occupation}
                      onChange={(e) => updateFormData('occupation', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.occupation ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white`}
                    >
                      <option value="">Seleziona...</option>
                      {OCCUPATIONS.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo di Contratto *</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => updateFormData('employmentType', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.employmentType ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white`}
                    >
                      <option value="">Seleziona...</option>
                      {EMPLOYMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Reddito Mensile Netto *</label>
                    <select
                      value={formData.monthlyIncome}
                      onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.monthlyIncome ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white`}
                    >
                      <option value="">Seleziona...</option>
                      {INCOME_RANGES.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    {errors.monthlyIncome && <p className="text-red-500 text-xs mt-1">{errors.monthlyIncome}</p>}
                  </div>
                  <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <strong>Privacy garantita:</strong> questi dati sono visibili solo alle agenzie a cui ti candidi.
                  </p>
                </div>
              )}

              {/* Step 3: Housing Preferences */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Ingresso *</label>
                      <input
                        type="date"
                        value={formData.moveInDate}
                        min={today}
                        onChange={(e) => updateFormData('moveInDate', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.moveInDate ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                      />
                      {errors.moveInDate && <p className="text-red-500 text-xs mt-1">{errors.moveInDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Durata Prevista *</label>
                      <select
                        value={formData.stayDuration}
                        onChange={(e) => updateFormData('stayDuration', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.stayDuration ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white`}
                      >
                        <option value="">Seleziona...</option>
                        {STAY_DURATIONS.map(duration => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </select>
                      {errors.stayDuration && <p className="text-red-500 text-xs mt-1">{errors.stayDuration}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasPets}
                        onChange={(e) => updateFormData('hasPets', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Ho animali domestici</span>
                        <p className="text-xs text-gray-500">Gatti, cani o altri animali</p>
                      </div>
                      <span className="text-xl">🐾</span>
                    </label>

                    {formData.hasPets && (
                      <div className="ml-8 animate-fadeIn">
                        <input
                          type="text"
                          value={formData.petDetails}
                          onChange={(e) => updateFormData('petDetails', e.target.value)}
                          placeholder="Es: Un gatto di 3 anni"
                          className={`w-full px-4 py-3 rounded-xl border ${errors.petDetails ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                        />
                        {errors.petDetails && <p className="text-red-500 text-xs mt-1">{errors.petDetails}</p>}
                      </div>
                    )}

                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.isSmoker}
                        onChange={(e) => updateFormData('isSmoker', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Sono fumatore</span>
                        <p className="text-xs text-gray-500">Fumo sigarette o simili</p>
                      </div>
                      <span className="text-xl">🚬</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Message */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Presentati all'agenzia *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => updateFormData('message', e.target.value)}
                      placeholder="Ciao! Mi chiamo Mario e sono interessato a questo appartamento perche..."
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                      <p className={`text-xs ml-auto ${formData.message.length < 20 ? 'text-gray-400' : 'text-green-500'}`}>
                        {formData.message.length}/500
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-sm text-amber-700">
                      <strong>Suggerimento:</strong> Racconta brevemente chi sei, perche cerchi casa e cosa ti ha colpito di questo annuncio.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-brand-green flex items-center gap-2">
                      <User size={16} /> Dati Personali
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-500">Nome:</span> {formData.firstName} {formData.lastName}</p>
                      <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                      <p><span className="text-gray-500">Telefono:</span> {formData.phone}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-brand-green flex items-center gap-2">
                      <Briefcase size={16} /> Informazioni Lavorative
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-500">Occupazione:</span> {formData.occupation}</p>
                      <p><span className="text-gray-500">Contratto:</span> {formData.employmentType}</p>
                      <p><span className="text-gray-500">Reddito:</span> {formData.monthlyIncome}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-brand-green flex items-center gap-2">
                      <Home size={16} /> Preferenze
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-500">Ingresso:</span> {formData.moveInDate}</p>
                      <p><span className="text-gray-500">Durata:</span> {formData.stayDuration}</p>
                      <p><span className="text-gray-500">Animali:</span> {formData.hasPets ? formData.petDetails : 'No'}</p>
                      <p><span className="text-gray-500">Fumatore:</span> {formData.isSmoker ? 'Si' : 'No'}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-700 flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 shrink-0" />
                      <span>Inviando questa candidatura, i tuoi dati saranno condivisi con l'agenzia e aggiunti al tuo profilo inquilino.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        {!isSuccess && (
          <div className="p-6 pt-0 flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                Indietro
              </button>
            )}

            <button
              onClick={currentStep === 5 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Invio in corso...
                </>
              ) : currentStep === 5 ? (
                <>
                  Invia Candidatura
                  <CheckCircle size={18} />
                </>
              ) : (
                <>
                  Continua
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideLeft { animation: slideLeft 0.3s ease-out; }
        .animate-slideRight { animation: slideRight 0.3s ease-out; }
      `}</style>
    </div>
  );
};
