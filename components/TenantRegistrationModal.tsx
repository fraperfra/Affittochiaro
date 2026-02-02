import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Briefcase,
  Home,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  Euro,
  Calendar,
  MapPin,
  Heart,
  Star,
  Trophy,
  Target,
  Navigation,
  Loader2,
  Search,
} from 'lucide-react';

interface TenantRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: TenantRegistrationData) => void;
}

export interface TenantRegistrationData {
  // Step 1: Account
  email: string;
  password: string;
  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  // Step 3: Employment
  occupation: string;
  employmentType: string;
  companyName: string;
  monthlyIncome: string;
  employmentYears: string;
  // Step 4: Housing Preferences
  preferredCity: string;
  preferredZones: string;
  maxBudget: string;
  minRooms: string;
  moveInDate: string;
  stayDuration: string;
  // Step 5: Lifestyle
  hasPets: boolean;
  petDetails: string;
  isSmoker: boolean;
  hasChildren: boolean;
  childrenDetails: string;
  hobbies: string;
  // Step 6: Bio
  bio: string;
  whyChooseMe: string;
}

const STEPS = [
  { id: 1, title: 'Account', icon: Mail, color: 'from-blue-500 to-indigo-500' },
  { id: 2, title: 'Chi Sei', icon: User, color: 'from-purple-500 to-pink-500' },
  { id: 3, title: 'Lavoro', icon: Briefcase, color: 'from-amber-500 to-orange-500' },
  { id: 4, title: 'Casa Ideale', icon: Home, color: 'from-teal-500 to-cyan-500' },
  { id: 5, title: 'Stile di Vita', icon: Heart, color: 'from-rose-500 to-red-500' },
  { id: 6, title: 'Presentati', icon: FileText, color: 'from-green-500 to-emerald-500' },
  { id: 7, title: 'Completa', icon: Trophy, color: 'from-yellow-500 to-amber-500' },
];

const MOTIVATIONAL_MESSAGES = [
  { step: 1, message: "Iniziamo! Crea le tue credenziali di accesso", emoji: "🔐", tip: "Usa una password sicura" },
  { step: 2, message: "Ottimo! Facci conoscere te stesso", emoji: "👋", tip: "I proprietari amano sapere con chi hanno a che fare" },
  { step: 3, message: "Il lavoro conta! Mostra la tua stabilita", emoji: "💼", tip: "Un lavoro stabile aumenta le tue chance del 70%" },
  { step: 4, message: "Descrivi la casa dei tuoi sogni", emoji: "🏠", tip: "Piu dettagli = proposte piu mirate" },
  { step: 5, message: "Racconta il tuo stile di vita", emoji: "🌟", tip: "La trasparenza crea fiducia" },
  { step: 6, message: "Ultimo tocco! Una presentazione efficace", emoji: "✨", tip: "I profili con bio hanno 3x piu risposte" },
  { step: 7, message: "Fantastico! Il tuo CV e pronto!", emoji: "🎉", tip: "Ora le agenzie possono trovarti" },
];

const OCCUPATIONS = [
  'Impiegato/a',
  'Manager',
  'Dirigente',
  'Libero Professionista',
  'Imprenditore',
  'Commerciante',
  'Artigiano',
  'Insegnante',
  'Medico',
  'Infermiere/a',
  'Avvocato',
  'Commercialista',
  'Ingegnere',
  'Architetto',
  'Designer',
  'Sviluppatore Software',
  'Marketing Specialist',
  'Consulente',
  'Ricercatore',
  'Studente Universitario',
  'Dottorando',
  'Pensionato/a',
  'Altro',
];

const EMPLOYMENT_TYPES = [
  'Tempo indeterminato',
  'Tempo determinato',
  'Partita IVA',
  'Contratto di apprendistato',
  'Stage/Tirocinio retribuito',
  'Collaborazione occasionale',
  'Studente con borsa di studio',
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
  '€4.000 - €5.000',
  'Oltre €5.000',
];

const BUDGET_RANGES = [
  'Fino a €500',
  '€500 - €700',
  '€700 - €900',
  '€900 - €1.200',
  '€1.200 - €1.500',
  '€1.500 - €2.000',
  'Oltre €2.000',
];

const STAY_DURATIONS = [
  'Meno di 6 mesi',
  '6 mesi - 1 anno',
  '1 - 2 anni',
  '2 - 3 anni',
  'Oltre 3 anni',
  'Lungo termine (5+ anni)',
];

const ITALIAN_CITIES = [
  // Major cities
  'Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Firenze', 'Genova', 'Venezia',
  'Verona', 'Padova', 'Trieste', 'Brescia', 'Parma', 'Modena', 'Bari', 'Palermo',
  'Catania', 'Cagliari', 'Perugia', 'Trento', 'Bergamo', 'Monza', 'Como', 'Varese',
  'Lecco', 'Pavia', 'Cremona', 'Mantova', 'Lodi', 'Sondrio',
  // Lombardia
  'Busto Arsizio', 'Gallarate', 'Legnano', 'Saronno', 'Cinisello Balsamo', 'Sesto San Giovanni',
  'Rho', 'Cologno Monzese', 'Desio', 'Seregno', 'Cantù', 'Erba', 'Merate',
  // Piemonte
  'Novara', 'Alessandria', 'Asti', 'Cuneo', 'Biella', 'Vercelli', 'Verbania', 'Alba',
  'Casale Monferrato', 'Ivrea', 'Moncalieri', 'Rivoli', 'Collegno', 'Nichelino',
  // Veneto
  'Vicenza', 'Treviso', 'Rovigo', 'Belluno', 'Mestre', 'Chioggia', 'San Donà di Piave',
  'Conegliano', 'Bassano del Grappa', 'Castelfranco Veneto', 'Cittadella',
  // Emilia-Romagna
  'Reggio Emilia', 'Ravenna', 'Rimini', 'Ferrara', 'Forlì', 'Cesena', 'Piacenza', 'Imola',
  'Carpi', 'Sassuolo', 'Faenza', 'Lugo', 'Cento',
  // Toscana
  'Prato', 'Livorno', 'Pisa', 'Arezzo', 'Lucca', 'Pistoia', 'Siena', 'Grosseto', 'Massa',
  'Carrara', 'Viareggio', 'Empoli', 'Montecatini Terme', 'San Gimignano',
  // Lazio
  'Latina', 'Frosinone', 'Viterbo', 'Rieti', 'Civitavecchia', 'Fiumicino', 'Guidonia',
  'Tivoli', 'Velletri', 'Anzio', 'Nettuno', 'Aprilia', 'Pomezia',
  // Campania
  'Salerno', 'Caserta', 'Avellino', 'Benevento', 'Torre del Greco', 'Giugliano in Campania',
  'Castellammare di Stabia', 'Afragola', 'Portici', 'Ercolano', 'Pozzuoli', 'Sorrento', 'Amalfi',
  // Puglia
  'Lecce', 'Taranto', 'Foggia', 'Brindisi', 'Andria', 'Barletta', 'Trani', 'Altamura',
  'Molfetta', 'Monopoli', 'Ostuni', 'Gallipoli', 'Otranto',
  // Sicilia
  'Messina', 'Siracusa', 'Ragusa', 'Trapani', 'Agrigento', 'Caltanissetta', 'Enna',
  'Marsala', 'Gela', 'Modica', 'Vittoria', 'Taormina', 'Cefalù', 'Favignana',
  // Sardegna
  'Sassari', 'Nuoro', 'Oristano', 'Olbia', 'Alghero', 'Tempio Pausania', 'La Maddalena',
  'Porto Torres', 'Carbonia', 'Iglesias', 'Quartu Sant\'Elena', 'Selargius',
  // Other regions
  'Ancona', 'Pesaro', 'Urbino', 'Fano', 'Macerata', 'Ascoli Piceno', 'San Benedetto del Tronto',
  'L\'Aquila', 'Pescara', 'Chieti', 'Teramo', 'Campobasso', 'Isernia', 'Termoli',
  'Potenza', 'Matera', 'Catanzaro', 'Cosenza', 'Reggio Calabria', 'Crotone', 'Vibo Valentia',
  'Aosta', 'Bolzano', 'Merano', 'Bressanone', 'Brunico', 'Rovereto', 'Riva del Garda',
  'Pordenone', 'Udine', 'Gorizia', 'Monfalcone', 'Aquileia', 'Cividale del Friuli',
  'Savona', 'La Spezia', 'Imperia', 'Sanremo', 'Rapallo', 'Chiavari', 'Portofino',
  'Ventimiglia', 'Albenga', 'Finale Ligure', 'Sestri Levante',
];

const ROOMS_OPTIONS = [
  'Monolocale',
  'Bilocale (2 locali)',
  'Trilocale (3 locali)',
  'Quadrilocale (4 locali)',
  '5+ locali',
];

export const TenantRegistrationModal: React.FC<TenantRegistrationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Geolocation & City Search
  const [isLocating, setIsLocating] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TenantRegistrationData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    occupation: '',
    employmentType: '',
    companyName: '',
    monthlyIncome: '',
    employmentYears: '',
    preferredCity: '',
    preferredZones: '',
    maxBudget: '',
    minRooms: '',
    moveInDate: '',
    stayDuration: '',
    hasPets: false,
    petDetails: '',
    isSmoker: false,
    hasChildren: false,
    childrenDetails: '',
    hobbies: '',
    bio: '',
    whyChooseMe: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate profile completion percentage
  const calculateCompletion = (): number => {
    const fields = [
      { value: formData.email, weight: 10 },
      { value: formData.password, weight: 5 },
      { value: formData.firstName, weight: 10 },
      { value: formData.lastName, weight: 10 },
      { value: formData.phone, weight: 8 },
      { value: formData.birthDate, weight: 5 },
      { value: formData.occupation, weight: 10 },
      { value: formData.employmentType, weight: 8 },
      { value: formData.companyName, weight: 3 },
      { value: formData.monthlyIncome, weight: 10 },
      { value: formData.employmentYears, weight: 3 },
      { value: formData.preferredCity, weight: 5 },
      { value: formData.maxBudget, weight: 5 },
      { value: formData.minRooms, weight: 3 },
      { value: formData.moveInDate, weight: 3 },
      { value: formData.stayDuration, weight: 3 },
      { value: formData.bio, weight: 10 },
      { value: formData.whyChooseMe, weight: 5 },
    ];

    const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
    const completedWeight = fields.reduce((sum, f) => {
      if (typeof f.value === 'string' && f.value.trim()) return sum + f.weight;
      if (typeof f.value === 'boolean' && f.value) return sum + f.weight;
      return sum;
    }, 0);

    return Math.round((completedWeight / totalWeight) * 100);
  };

  const completion = calculateCompletion();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setCitySearchInput('');
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // Prevent body scroll
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

  const updateFormData = (field: keyof TenantRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // City search handler
  const handleCitySearch = (input: string) => {
    setCitySearchInput(input);
    if (input.length >= 2) {
      const filtered = ITALIAN_CITIES.filter(city =>
        city.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 8);
      setCitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Select city from suggestions
  const selectCity = (city: string) => {
    updateFormData('preferredCity', city);
    setCitySearchInput(city);
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  // Geolocation handler - uses reverse geocoding to get city name
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non e supportata dal tuo browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=it`
          );
          const data = await response.json();

          // Extract city/town from response
          const city = data.address?.city ||
                       data.address?.town ||
                       data.address?.village ||
                       data.address?.municipality ||
                       data.address?.county;

          if (city) {
            // Check if it matches one of our cities
            const matchedCity = ITALIAN_CITIES.find(c =>
              c.toLowerCase() === city.toLowerCase()
            );

            if (matchedCity) {
              selectCity(matchedCity);
            } else {
              // Add the detected city even if not in our list
              selectCity(city);
            }
          } else {
            alert('Non siamo riusciti a determinare la tua citta. Inseriscila manualmente.');
          }
        } catch {
          alert('Errore durante la geolocalizzazione. Inserisci la citta manualmente.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Hai negato il permesso alla geolocalizzazione.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('La tua posizione non e disponibile.');
            break;
          case error.TIMEOUT:
            alert('Richiesta di posizione scaduta.');
            break;
          default:
            alert('Errore sconosciuto durante la geolocalizzazione.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email richiesta';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email non valida';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password richiesta';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Minimo 8 caratteri';
      } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Serve una maiuscola e un numero';
      }
    }

    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome richiesto';
      if (!formData.lastName.trim()) newErrors.lastName = 'Cognome richiesto';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefono richiesto';
      } else if (!/^[\d\s+()-]{8,}$/.test(formData.phone)) {
        newErrors.phone = 'Numero non valido';
      }
    }

    if (step === 3) {
      if (!formData.occupation) newErrors.occupation = 'Seleziona occupazione';
      if (!formData.employmentType) newErrors.employmentType = 'Seleziona tipo contratto';
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Seleziona fascia reddito';
    }

    if (step === 4) {
      if (!formData.preferredCity) newErrors.preferredCity = 'Seleziona citta';
      if (!formData.maxBudget) newErrors.maxBudget = 'Seleziona budget';
    }

    // Step 5 is optional

    if (step === 6) {
      if (!formData.bio.trim()) {
        newErrors.bio = 'Scrivi una breve presentazione';
      } else if (formData.bio.trim().length < 50) {
        newErrors.bio = 'Scrivi almeno 50 caratteri';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection('next');
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create tenant account in localStorage
    const tenantAccount = {
      id: `tenant_${Date.now()}`,
      email: formData.email,
      password: formData.password, // In real app, this would be hashed
      role: 'tenant',
      createdAt: new Date().toISOString(),
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        birthDate: formData.birthDate,
        occupation: formData.occupation,
        employmentType: formData.employmentType,
        companyName: formData.companyName,
        monthlyIncome: formData.monthlyIncome,
        employmentYears: formData.employmentYears,
        preferences: {
          preferredCity: formData.preferredCity,
          preferredZones: formData.preferredZones,
          maxBudget: formData.maxBudget,
          minRooms: formData.minRooms,
          moveInDate: formData.moveInDate,
          stayDuration: formData.stayDuration,
        },
        lifestyle: {
          hasPets: formData.hasPets,
          petDetails: formData.petDetails,
          isSmoker: formData.isSmoker,
          hasChildren: formData.hasChildren,
          childrenDetails: formData.childrenDetails,
          hobbies: formData.hobbies,
        },
        bio: formData.bio,
        whyChooseMe: formData.whyChooseMe,
        completionPercentage: completion,
        isVerified: false,
        hasVideo: false,
      },
    };

    // Store in localStorage
    const existingTenants = JSON.parse(localStorage.getItem('affittochiaro_tenants') || '[]');
    localStorage.setItem('affittochiaro_tenants', JSON.stringify([...existingTenants, tenantAccount]));

    // Store current user session
    localStorage.setItem('affittochiaro_current_user', JSON.stringify(tenantAccount));

    setIsSubmitting(false);
    onComplete(formData);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const currentMotivation = MOTIVATIONAL_MESSAGES.find(m => m.step === currentStep);

  // Get today's date for min date on date inputs
  const today = new Date().toISOString().split('T')[0];
  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
  const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];

  // Get completion color
  const getCompletionColor = () => {
    if (completion >= 80) return 'text-green-500';
    if (completion >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getCompletionBg = () => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

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

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-green via-teal-600 to-action-green p-6 pb-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Crea il tuo CV Inquilino</h2>
              <p className="text-white/80 text-sm">Il tuo passaporto per trovare casa</p>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCompletionBg()} rounded-full transition-all duration-500`}
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${completion >= 50 ? 'text-white' : 'text-white/80'}`}>
              {completion}%
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            {completion < 50 && "Completa almeno il 50% per essere visibile alle agenzie"}
            {completion >= 50 && completion < 80 && "Ottimo! Aggiungi altri dettagli per aumentare le tue chance"}
            {completion >= 80 && "Eccellente! Il tuo profilo e molto completo"}
          </p>
        </div>

        {/* Progress Section */}
        <div className="relative -mt-6 mx-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-3 overflow-x-auto pb-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center min-w-[3rem]">
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500
                      ${isCompleted ? 'bg-green-500 text-white scale-90' : ''}
                      ${isActive ? `bg-gradient-to-r ${step.color} text-white scale-110 shadow-lg` : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? <CheckCircle size={18} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[9px] mt-1 font-medium transition-colors whitespace-nowrap ${
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
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">{currentMotivation?.emoji}</span>
              <div>
                <p className="font-medium text-gray-800">{currentMotivation?.message}</p>
                <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                  <Sparkles size={10} />
                  {currentMotivation?.tip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          <div className={`transition-all duration-300 ${
            direction === 'next' ? 'animate-slideLeft' : 'animate-slideRight'
          }`}>
            {/* Step 1: Account */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="la-tua@email.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder="Minimo 8 caratteri"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Almeno 8 caratteri, una maiuscola e un numero</p>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <strong>Queste saranno le tue credenziali di accesso.</strong> Potrai accedere alla tua dashboard inquilino e gestire il tuo profilo.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data di Nascita</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    max={maxBirthDateStr}
                    onChange={(e) => updateFormData('birthDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Employment */}
            {currentStep === 3 && (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Azienda/Datore di Lavoro</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Nome azienda (opzionale)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Anni di Esperienza</label>
                    <input
                      type="text"
                      value={formData.employmentYears}
                      onChange={(e) => updateFormData('employmentYears', e.target.value)}
                      placeholder="Es: 5 anni"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-xs text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} />
                    I dati economici sono visibili solo alle agenzie interessate al tuo profilo
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Housing Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {/* City Search with Geolocation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={14} className="inline mr-1" />
                    Citta/Paese di Ricerca *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1" ref={cityInputRef}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={citySearchInput || formData.preferredCity}
                        onChange={(e) => handleCitySearch(e.target.value)}
                        onFocus={() => citySearchInput.length >= 2 && setShowSuggestions(true)}
                        placeholder="Cerca citta o paese..."
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.preferredCity ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all`}
                      />
                      {/* Suggestions Dropdown */}
                      {showSuggestions && citySuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-48 overflow-y-auto">
                          {citySuggestions.map((city, idx) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => selectCity(city)}
                              className={`w-full text-left px-4 py-2.5 hover:bg-brand-green/10 transition-colors flex items-center gap-2 ${
                                idx === 0 ? 'rounded-t-xl' : ''
                              } ${idx === citySuggestions.length - 1 ? 'rounded-b-xl' : ''}`}
                            >
                              <MapPin size={14} className="text-gray-400" />
                              <span className="font-medium">{city}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleGeolocation}
                      disabled={isLocating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-green/10 text-brand-green rounded-xl hover:bg-brand-green/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                      title="Usa la mia posizione"
                    >
                      {isLocating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Navigation size={18} />
                      )}
                      <span className="hidden sm:inline text-sm font-medium">
                        {isLocating ? 'Localizzando...' : 'Usa GPS'}
                      </span>
                    </button>
                  </div>
                  {formData.preferredCity && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Selezionato: {formData.preferredCity}
                    </p>
                  )}
                  {errors.preferredCity && <p className="text-red-500 text-xs mt-1">{errors.preferredCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Massimo *</label>
                  <select
                    value={formData.maxBudget}
                    onChange={(e) => updateFormData('maxBudget', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.maxBudget ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white`}
                  >
                    <option value="">Seleziona...</option>
                    {BUDGET_RANGES.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {errors.maxBudget && <p className="text-red-500 text-xs mt-1">{errors.maxBudget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone/Quartieri Preferiti</label>
                  <input
                    type="text"
                    value={formData.preferredZones}
                    onChange={(e) => updateFormData('preferredZones', e.target.value)}
                    placeholder="Es: Centro, Navigli, Porta Romana..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Puoi indicare quartieri o zone specifiche della citta</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipologia Minima</label>
                    <select
                      value={formData.minRooms}
                      onChange={(e) => updateFormData('minRooms', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white"
                    >
                      <option value="">Seleziona...</option>
                      {ROOMS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Durata Prevista</label>
                    <select
                      value={formData.stayDuration}
                      onChange={(e) => updateFormData('stayDuration', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white"
                    >
                      <option value="">Seleziona...</option>
                      {STAY_DURATIONS.map(dur => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Ingresso Desiderata</label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    min={today}
                    onChange={(e) => updateFormData('moveInDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Lifestyle */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">Queste informazioni aiutano i proprietari a conoscerti meglio (tutte opzionali)</p>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasPets}
                    onChange={(e) => updateFormData('hasPets', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Ho animali domestici</span>
                  </div>
                  <span className="text-xl">🐾</span>
                </label>

                {formData.hasPets && (
                  <input
                    type="text"
                    value={formData.petDetails}
                    onChange={(e) => updateFormData('petDetails', e.target.value)}
                    placeholder="Descrivi il tuo animale (es: gatto di 3 anni, molto tranquillo)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all ml-8 -mt-2"
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
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
                  </div>
                  <span className="text-xl">🚬</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasChildren}
                    onChange={(e) => updateFormData('hasChildren', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Ho figli</span>
                  </div>
                  <span className="text-xl">👶</span>
                </label>

                {formData.hasChildren && (
                  <input
                    type="text"
                    value={formData.childrenDetails}
                    onChange={(e) => updateFormData('childrenDetails', e.target.value)}
                    placeholder="Quanti e di che eta? (es: 1 figlio di 5 anni)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all ml-8 -mt-2"
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hobby e Interessi</label>
                  <input
                    type="text"
                    value={formData.hobbies}
                    onChange={(e) => updateFormData('hobbies', e.target.value)}
                    placeholder="Es: lettura, cinema, sport, musica..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Bio */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    La tua presentazione *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    placeholder="Ciao! Mi chiamo Mario e sono un professionista nel settore IT. Cerco un appartamento tranquillo dove poter lavorare da remoto. Sono una persona ordinata, rispettosa e puntuale con i pagamenti..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.bio ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
                    <p className={`text-xs ml-auto ${formData.bio.length >= 50 ? 'text-green-500' : 'text-gray-400'}`}>
                      {formData.bio.length}/500
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Perche scegliere te? (Opzionale)
                  </label>
                  <textarea
                    value={formData.whyChooseMe}
                    onChange={(e) => updateFormData('whyChooseMe', e.target.value)}
                    placeholder="Sono il candidato ideale perche... (es: ho referenze, pago sempre puntuale, non ho mai avuto problemi con i proprietari precedenti...)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-700">
                    <strong>Suggerimento:</strong> I profili con una presentazione completa e personale ricevono 3 volte piu contatti dalle agenzie!
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Complete */}
            {currentStep === 7 && (
              <div className="space-y-6">
                {/* Profile Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                    completion >= 80 ? 'bg-green-100' : completion >= 50 ? 'bg-amber-100' : 'bg-red-100'
                  } mb-4`}>
                    <span className={`text-3xl font-bold ${getCompletionColor()}`}>{completion}%</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-green">
                    {completion >= 80 ? 'Profilo Eccellente!' : completion >= 50 ? 'Buon Inizio!' : 'Profilo Incompleto'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {completion >= 80
                      ? 'Il tuo CV e molto completo. Le agenzie ti noteranno!'
                      : completion >= 50
                        ? 'Puoi sempre migliorare il tuo profilo dalla dashboard'
                        : 'Completa piu campi per essere visibile alle agenzie'}
                  </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Nome</p>
                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium truncate">{formData.email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Occupazione</p>
                    <p className="font-medium">{formData.occupation || '-'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Citta</p>
                    <p className="font-medium">{formData.preferredCity || '-'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-medium">{formData.maxBudget || '-'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Reddito</p>
                    <p className="font-medium">{formData.monthlyIncome || '-'}</p>
                  </div>
                </div>

                {/* Completion Tips */}
                {completion < 100 && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700 font-medium mb-2">Per migliorare il tuo profilo:</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {!formData.birthDate && <li>• Aggiungi la data di nascita</li>}
                      {!formData.companyName && <li>• Specifica dove lavori</li>}
                      {!formData.preferredZones && <li>• Indica le zone preferite</li>}
                      {!formData.whyChooseMe && <li>• Scrivi perche scegliere te</li>}
                      {formData.bio.length < 100 && <li>• Espandi la tua presentazione</li>}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700 flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                    <span>Cliccando "Crea il mio CV" accetti i Termini di Servizio e la Privacy Policy. Potrai accedere con le credenziali create.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="p-6 pt-0 flex gap-3 border-t border-gray-100">
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
            onClick={currentStep === 7 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creazione in corso...
              </>
            ) : currentStep === 7 ? (
              <>
                Crea il mio CV
                <Trophy size={18} />
              </>
            ) : (
              <>
                Continua
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
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
