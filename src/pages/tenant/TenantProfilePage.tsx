/**
 * TenantProfilePage — profilo inquilino con form obbligatorio inline e hobby
 */

import { useState } from 'react';
import { useAuthStore } from '../../store';
import { TenantUser } from '../../types';
import { Card, CardHeader, CardTitle, Button } from '../../components/ui';
import {
  MapPin,
  Euro,
  Home,
  PawPrint,
  Settings,
  Sparkles,
  Loader2,
  Pencil,
  Users,
  Banknote,
  FileText,
  BedDouble,
  ChevronRight,
  User,
  Target,
  Video,
  ClipboardList,
  Music,
  BookOpen,
  Activity,
  Bike,
  Gamepad2,
  Palette,
  Leaf,
  Plane,
  Camera,
  Film,
  Waves,
  Drama,
  Wine,
  Mountain,
  PenLine,
  Dumbbell,
  Brain,
  Scissors,
  Zap,
  Tent,
  Mic,
  Mic2,
  Hammer,
} from 'lucide-react';
import { ITALIAN_CITIES, OCCUPATIONS, CONTRACT_TYPES } from '../../utils/constants';
import { VideoRecorder, VideoUploader, VideoPlayer, VideoPlaceholder } from '../../components/video';
import { ProfileEditModal, ProfileFormData } from '../../components/profile';
import { mockVideoApi, mockProfileApi } from '../../services/mock/mockTenantService';
import { generateTenantPitch } from '../../../services/aiService';
import toast from 'react-hot-toast';

type VideoMode = 'view' | 'record' | 'upload';

// ─── Dati statici ────────────────────────────────────────────────────────────

const HOBBIES: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'musica', label: 'Musica', icon: <Music size={14} /> },
  { id: 'lettura', label: 'Lettura', icon: <BookOpen size={14} /> },
  { id: 'cucina', label: 'Cucina', icon: <Sparkles size={14} /> },
  { id: 'jogging', label: 'Jogging', icon: <Activity size={14} /> },
  { id: 'ciclismo', label: 'Ciclismo', icon: <Bike size={14} /> },
  { id: 'videogiochi', label: 'Videogiochi', icon: <Gamepad2 size={14} /> },
  { id: 'arte', label: 'Arte', icon: <Palette size={14} /> },
  { id: 'yoga', label: 'Yoga', icon: <Leaf size={14} /> },
  { id: 'viaggi', label: 'Viaggi', icon: <Plane size={14} /> },
  { id: 'fotografia', label: 'Fotografia', icon: <Camera size={14} /> },
  { id: 'giardinaggio', label: 'Giardinaggio', icon: <Leaf size={14} /> },
  { id: 'animali', label: 'Animali', icon: <PawPrint size={14} /> },
  { id: 'cinema', label: 'Cinema', icon: <Film size={14} /> },
  { id: 'calcio', label: 'Calcio', icon: <Activity size={14} /> },
  { id: 'tennis', label: 'Tennis', icon: <Activity size={14} /> },
  { id: 'nuoto', label: 'Nuoto', icon: <Waves size={14} /> },
  { id: 'teatro', label: 'Teatro', icon: <Drama size={14} /> },
  { id: 'vino', label: 'Vino & Cibo', icon: <Wine size={14} /> },
  { id: 'arrampicata', label: 'Arrampicata', icon: <Mountain size={14} /> },
  { id: 'danza', label: 'Danza', icon: <Music size={14} /> },
  { id: 'scrittura', label: 'Scrittura', icon: <PenLine size={14} /> },
  { id: 'palestra', label: 'Palestra', icon: <Dumbbell size={14} /> },
  { id: 'escursionismo', label: 'Escursionismo', icon: <Mountain size={14} /> },
  { id: 'meditazione', label: 'Meditazione', icon: <Brain size={14} /> },
  { id: 'cucito', label: 'Cucito', icon: <Scissors size={14} /> },
  { id: 'skateboard', label: 'Skateboard', icon: <Zap size={14} /> },
  { id: 'surf', label: 'Sport Acquatici', icon: <Waves size={14} /> },
  { id: 'campeggio', label: 'Campeggio', icon: <Tent size={14} /> },
  { id: 'karaoke', label: 'Karaoke', icon: <Mic size={14} /> },
  { id: 'scacchi', label: 'Scacchi', icon: <Target size={14} /> },
  { id: 'podcast', label: 'Podcast', icon: <Mic2 size={14} /> },
  { id: 'bricolage', label: 'Bricolage', icon: <Hammer size={14} /> },
];

const PROPERTY_TYPES = [
  { value: 'stanza', label: 'Stanza' },
  { value: 'appartamento', label: 'Appartamento' },
  { value: 'villa', label: 'Villa' },
  { value: 'attico', label: 'Attico' },
  { value: 'casa_indipendente', label: 'Casa indipendente' },
  { value: 'bifamiliare', label: 'Bifamiliare' },
];

const FAMILY_UNITS = [
  { value: 'solo', label: 'Solo' },
  { value: 'coppia', label: 'Coppia' },
  { value: 'famiglia', label: 'Famiglia' },
  { value: 'coinquilini', label: 'Coinquilini' },
];

const AGE_RANGES = [
  '18-25', '26-30', '31-35', '36-40', '41-45',
  '46-50', '51-55', '56-60', '61-65', '66-70', '70+',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChipSelector({
  options, value, onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${value === opt.value
            ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldGroup({ label, required, hint, children, error }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; error?: boolean;
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${error ? 'text-red-600' : 'text-gray-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">Campo obbligatorio</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{children}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

/** Pill di riepilogo compatto */
function SummaryPill({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
      <Icon size={15} className="text-primary-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TenantProfilePage() {
  const { user, setUser } = useAuthStore();
  const tenantUser = user as TenantUser;
  const profile = tenantUser?.profile;

  // ── Profile form state
  const [form, setForm] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    searchCity: profile?.city || '',
    familyUnit: 'solo',
    familyCount: '2',
    occupation: profile?.occupation || '',
    incomeType: 'mensile' as 'mensile' | 'annuale',
    income: '',
    contractType: '',
    budget: '',
    propertyType: 'appartamento',
    rooms: '1',
    ageRange: '',
    furnished: 'indifferente',
    hasPets: 'no',
    bio: profile?.bio || '',
  });
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const upd = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // clear error highlight as soon as user types
    if (showErrors) setShowErrors(false);
  };

  /** true when showErrors is on and the field is empty */
  const fe = (key: keyof typeof form) => showErrors && !form[key].trim();

  const needsFamilyCount = form.familyUnit === 'famiglia' || form.familyUnit === 'coinquilini';

  // ── Hobbies
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isEditingHobbies, setIsEditingHobbies] = useState(true);
  const [isSavingHobbies, setIsSavingHobbies] = useState(false);

  const toggleHobby = (id: string) =>
    setSelectedHobbies(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );

  const handleSaveHobbies = async () => {
    setIsSavingHobbies(true);
    await new Promise(r => setTimeout(r, 500));
    setIsSavingHobbies(false);
    setIsEditingHobbies(false);
    toast.success('Interessi salvati!');
  };

  // ── Video state
  const [videoMode, setVideoMode] = useState<VideoMode>('view');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [hasVideo, setHasVideo] = useState(profile?.hasVideo || false);

  // ── Profile settings modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const hobbyLabels = selectedHobbies
        .map(id => HOBBIES.find(h => h.id === id)?.label)
        .filter(Boolean)
        .slice(0, 5)
        .join(', ') || 'vari interessi';

      const familyDesc =
        form.familyUnit === 'solo' ? 'da solo'
          : form.familyUnit === 'coppia' ? 'in coppia'
            : form.familyUnit === 'famiglia' ? `con la mia famiglia (${form.familyCount} persone)`
              : `con ${form.familyCount} coinquilini`;

      const reason = `cerco ${PROPERTY_TYPES.find(p => p.value === form.propertyType)?.label || 'casa'} a ${form.searchCity || 'una città italiana'}, trasferendomi ${familyDesc}`;

      const generated = await generateTenantPitch({
        name: `${form.firstName} ${form.lastName}`.trim() || 'Inquilino',
        job: form.occupation || 'lavoratore',
        reason,
        hobbies: hobbyLabels,
      });

      upd('bio', generated.slice(0, 500));
      toast.success('Descrizione generata!');
    } catch {
      toast.error('Errore nella generazione. Riprova.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleFormSave = async () => {
    const isValid = !!(form.firstName.trim() && form.lastName.trim() && form.phone.trim()
      && form.searchCity && form.occupation && form.ageRange);
    if (!isValid) {
      setShowErrors(true);
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    setShowErrors(false);
    setIsSavingForm(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      toast.success('Profilo aggiornato con successo!');
      setIsEditingProfile(false);
    } catch {
      toast.error('Errore nel salvataggio');
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleVideoComplete = async (file: File, duration: number) => {
    setIsUploadingVideo(true);
    try {
      const url = await mockVideoApi.uploadVideo(file);
      await mockVideoApi.confirmVideoUpload(url, duration);
      setVideoUrl(url); setVideoDuration(duration); setHasVideo(true); setVideoMode('view');
      toast.success('Video caricato con successo!');
    } catch (error: any) {
      toast.error(error.message || 'Errore caricamento video');
    } finally { setIsUploadingVideo(false); }
  };

  const handleVideoDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare il video?')) return;
    setIsDeletingVideo(true);
    try {
      await mockVideoApi.deleteVideo();
      setVideoUrl(null); setVideoDuration(0); setHasVideo(false);
      toast.success('Video eliminato');
    } catch (error: any) { toast.error(error.message || 'Errore'); }
    finally { setIsDeletingVideo(false); }
  };

  const handleProfileSave = async (data: ProfileFormData) => {
    setIsSavingProfile(true);
    try {
      await mockProfileApi.updateProfile(data);
      if (user) {
        setUser({
          ...user,
          profile: {
            ...(user as TenantUser).profile,
            firstName: data.firstName, lastName: data.lastName, phone: data.phone,
            bio: data.bio, occupation: data.occupation, employmentType: data.employmentType as any,
            employer: data.employer, annualIncome: data.annualIncome, city: data.currentCity,
            avatarUrl: data.avatarUrl || (user as TenantUser).profile.avatarUrl,
          },
        } as TenantUser);
      }
      setEditProfileOpen(false);
      toast.success('Profilo aggiornato!');
    } catch (error: any) { toast.error(error.message || 'Errore'); throw error; }
    finally { setIsSavingProfile(false); }
  };

  // ── Helpers per compact view ─────────────────────────────────────────────

  const familyLabel = (() => {
    const base = FAMILY_UNITS.find(f => f.value === form.familyUnit)?.label || '—';
    if (needsFamilyCount) return `${base} · ${form.familyCount} persone`;
    return base;
  })();

  const contractLabel = CONTRACT_TYPES.find(c => c.value === form.contractType)?.label || '—';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-text-primary">Il Mio Profilo</h1>
        <button
          onClick={() => setEditProfileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all hover:shadow-sm"
        >
          <Settings size={16} />
          Impostazioni
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left column (col-span-2) ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* PROFILE FORM / COMPACT VIEW */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-primary-500" />
                  <CardTitle>Informazioni Obbligatorie</CardTitle>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => { setIsEditingProfile(true); setShowErrors(false); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <Pencil size={13} />
                    Modifica
                  </button>
                )}
              </div>
            </CardHeader>

            {/* ── COMPACT SUMMARY ────────────────────────────────────── */}
            {!isEditingProfile ? (
              <div className="space-y-4">
                {/* Name / phone row */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {form.firstName.charAt(0)}{form.lastName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
                    <p className="text-sm text-gray-500">+39 {form.phone} · {form.ageRange} anni</p>
                  </div>
                </div>

                {/* Pills grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <SummaryPill icon={MapPin} label="Cerca a" value={form.searchCity || '—'} />
                  <SummaryPill icon={Home} label="Immobile" value={PROPERTY_TYPES.find(p => p.value === form.propertyType)?.label || '—'} />
                  <SummaryPill icon={BedDouble} label="Camere" value={`${form.rooms} ${form.rooms === '1' ? 'camera' : 'camere'}`} />
                  <SummaryPill icon={Euro} label="Budget" value={form.budget ? `€${form.budget}/mese` : '—'} />
                  <SummaryPill icon={Users} label="Con chi" value={familyLabel} />
                  <SummaryPill icon={PawPrint} label="Animali" value={form.hasPets === 'si' ? 'Sì' : 'No'} />
                  {form.income && (
                    <SummaryPill icon={Banknote} label="Reddito" value={`€${form.income} ${form.incomeType === 'mensile' ? '/mese' : '/anno'}`} />
                  )}
                  {form.contractType && (
                    <SummaryPill icon={FileText} label="Contratto" value={contractLabel} />
                  )}
                  <SummaryPill icon={ChevronRight} label="Arredato" value={form.furnished === 'si' ? 'Sì' : form.furnished === 'no' ? 'No' : 'Indifferente'} />
                </div>

                {/* Bio preview */}
                {form.bio && (
                  <div className="mt-1 bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Su di me</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{form.bio}</p>
                  </div>
                )}
              </div>

            ) : (

              /* ── EDIT FORM ──────────────────────────────────────────── */
              <div className="space-y-7">

                {/* ── 1. Dati personali */}
                <div>
                  <SectionTitle subtitle="Come ti chiamiamo e come ti contattano le agenzie">Le informazioni base</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldGroup label="Nome" required error={fe('firstName')}>
                      <input
                        className={`input w-full ${fe('firstName') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                        value={form.firstName}
                        onChange={e => upd('firstName', e.target.value)}
                        placeholder="Francesco"
                      />
                    </FieldGroup>
                    <FieldGroup label="Cognome" required error={fe('lastName')}>
                      <input
                        className={`input w-full ${fe('lastName') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                        value={form.lastName}
                        onChange={e => upd('lastName', e.target.value)}
                        placeholder="Coppola"
                      />
                    </FieldGroup>
                    <FieldGroup label="N° di cellulare" required error={fe('phone')}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">+39</span>
                        <input
                          className={`input w-full pl-11 ${fe('phone') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                          type="tel"
                          value={form.phone}
                          onChange={e => upd('phone', e.target.value)}
                          placeholder="333 123 4567"
                        />
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Età" required error={fe('ageRange')}>
                      <select
                        className={`input w-full ${fe('ageRange') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                        value={form.ageRange}
                        onChange={e => upd('ageRange', e.target.value)}
                      >
                        <option value="">Seleziona età</option>
                        {AGE_RANGES.map(a => <option key={a} value={a}>{a} anni</option>)}
                      </select>
                    </FieldGroup>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* ── 2. Dove e cosa cerchi */}
                <div>
                  <SectionTitle subtitle="Più sei preciso, più annunci pertinenti ricevi">Dove vuoi vivere?</SectionTitle>
                  <div className="space-y-4">

                    <FieldGroup label="Dove stai cercando" required error={fe('searchCity')}>
                      <select
                        className={`input w-full ${fe('searchCity') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                        value={form.searchCity}
                        onChange={e => upd('searchCity', e.target.value)}
                      >
                        <option value="">Seleziona città...</option>
                        {ITALIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </FieldGroup>

                    <FieldGroup label="Tipologia immobile" required>
                      <ChipSelector options={PROPERTY_TYPES} value={form.propertyType}
                        onChange={v => upd('propertyType', v)} />
                    </FieldGroup>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FieldGroup label="Budget massimo" required>
                        <div className="relative">
                          <Euro size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input className="input w-full pl-9 pr-14" type="number" min={0} step={50}
                            value={form.budget} onChange={e => upd('budget', e.target.value)} placeholder="1.200" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/mese</span>
                        </div>
                      </FieldGroup>
                      <FieldGroup label="Numero di camere" required>
                        <ChipSelector
                          options={[
                            { value: '1', label: '1' }, { value: '2', label: '2' },
                            { value: '3', label: '3' }, { value: '4+', label: '4+' },
                          ]}
                          value={form.rooms} onChange={v => upd('rooms', v)}
                        />
                      </FieldGroup>
                    </div>

                    <FieldGroup label="Arredato?" required>
                      <ChipSelector
                        options={[
                          { value: 'si', label: 'Sì' },
                          { value: 'no', label: 'No' },
                          { value: 'indifferente', label: 'Indifferente' },
                        ]}
                        value={form.furnished} onChange={v => upd('furnished', v)}
                      />
                    </FieldGroup>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* ── 3. Su di te */}
                <div>
                  <SectionTitle subtitle="Queste info aumentano la tua credibilità con i proprietari">Chi sei e come vivi</SectionTitle>
                  <div className="space-y-4">

                    <FieldGroup label="Occupazione" required error={fe('occupation')}>
                      <select
                        className={`input w-full ${fe('occupation') ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-300/30' : ''}`}
                        value={form.occupation}
                        onChange={e => upd('occupation', e.target.value)}
                      >
                        <option value="">Seleziona...</option>
                        {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FieldGroup>

                    {/* Nucleo familiare + count */}
                    <FieldGroup label="Nucleo familiare" required>
                      <ChipSelector options={FAMILY_UNITS} value={form.familyUnit}
                        onChange={v => upd('familyUnit', v)} />
                      {needsFamilyCount && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-gray-600">Numero di persone:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => upd('familyCount', String(Math.max(2, parseInt(form.familyCount) - 1)))}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors font-medium"
                            >−</button>
                            <span className="w-8 text-center font-semibold text-gray-900">{form.familyCount}</span>
                            <button
                              type="button"
                              onClick={() => upd('familyCount', String(Math.min(10, parseInt(form.familyCount) + 1)))}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors font-medium"
                            >+</button>
                          </div>
                        </div>
                      )}
                    </FieldGroup>

                    {/* Reddito */}
                    <FieldGroup label="Reddito" hint="Inserisci il tuo reddito per aumentare la fiducia dei proprietari">
                      <div className="flex items-stretch gap-2">
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0">
                          {(['mensile', 'annuale'] as const).map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => upd('incomeType', type)}
                              className={`px-3 py-2 text-xs font-semibold transition-colors ${form.incomeType === type
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                              {type === 'mensile' ? 'Mensile' : 'Annuo Lordo'}
                            </button>
                          ))}
                        </div>
                        <div className="relative flex-1">
                          <Euro size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            className="input w-full pl-9"
                            type="number"
                            min={0}
                            step={100}
                            value={form.income}
                            onChange={e => upd('income', e.target.value)}
                            placeholder={form.incomeType === 'mensile' ? '2.000' : '28.000'}
                          />
                        </div>
                      </div>
                    </FieldGroup>

                    {/* Tipologia contratto */}
                    <FieldGroup label="Tipologia contratto preferita">
                      <ChipSelector
                        options={CONTRACT_TYPES.map(c => ({ value: c.value, label: c.label }))}
                        value={form.contractType}
                        onChange={v => upd('contractType', v)}
                      />
                    </FieldGroup>

                    <div className="sm:col-span-2">
                      <FieldGroup label="Hai animali domestici?" required>
                        <ChipSelector
                          options={[{ value: 'si', label: 'Sì' }, { value: 'no', label: 'No' }]}
                          value={form.hasPets} onChange={v => upd('hasPets', v)}
                        />
                      </FieldGroup>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* ── 4. Presentazione (in fondo) */}
                <div>
                  <SectionTitle subtitle="Una presentazione autentica può fare la differenza sul proprietario">Presentati ai proprietari</SectionTitle>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                      Questa descrizione sarà visibile ai proprietari e può fare la differenza.
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerateBio}
                      disabled={isGeneratingBio}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                        bg-gradient-to-r from-violet-500 to-purple-600
                        hover:from-violet-600 hover:to-purple-700
                        shadow-sm hover:shadow-md hover:shadow-purple-200
                        transition-all duration-200 active:scale-[0.97]
                        disabled:opacity-60 disabled:cursor-not-allowed shrink-0
                      `}
                    >
                      {isGeneratingBio ? (
                        <><Loader2 size={14} className="animate-spin" />Generando...</>
                      ) : (
                        <><Sparkles size={14} />Genera con AI</>
                      )}
                    </button>
                  </div>

                  <textarea
                    className="input w-full min-h-[130px] resize-none"
                    value={form.bio}
                    onChange={e => { if (e.target.value.length <= 500) upd('bio', e.target.value); }}
                    placeholder={'Ciao! Sono un professionista affidabile e ordinato, cerco un appartamento dove sentirmi a casa...'}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">
                    Usati {form.bio.length} / 500 caratteri
                  </p>
                </div>

                {/* Save */}
                <div className="pt-1">
                  <Button onClick={handleFormSave} isLoading={isSavingForm} className="w-full sm:w-auto">
                    Salva modifiche
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* HOBBIES CARD */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-primary-500" />
                  <CardTitle>I Tuoi Interessi</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {selectedHobbies.length > 0 && (
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                      {selectedHobbies.length} selezionati
                    </span>
                  )}
                  {!isEditingHobbies && (
                    <button
                      onClick={() => setIsEditingHobbies(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                      Modifica
                    </button>
                  )}
                </div>
              </div>
              {isEditingHobbies && (
                <p className="text-sm text-gray-500 mt-1">
                  Seleziona i tuoi hobby — aiuta i proprietari a conoscerti meglio.
                </p>
              )}
            </CardHeader>

            {/* ── HOBBY COMPACT VIEW */}
            {!isEditingHobbies ? (
              selectedHobbies.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Nessun interesse selezionato.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedHobbies.map(id => {
                    const h = HOBBIES.find(x => x.id === id);
                    return h ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200"
                      >
                        {h.icon}
                        {h.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )

            ) : (

              /* ── HOBBY EDIT VIEW */
              <>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES.map(hobby => {
                    const active = selectedHobbies.includes(hobby.id);
                    return (
                      <button
                        key={hobby.id}
                        type="button"
                        onClick={() => toggleHobby(hobby.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${active
                          ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm scale-[1.02]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:text-primary-600'
                          }`}
                      >
                        {hobby.icon}
                        {hobby.label}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <Button
                    onClick={handleSaveHobbies}
                    isLoading={isSavingHobbies}
                    className="w-full sm:w-auto"
                  >
                    Salva interessi
                  </Button>
                </div>
              </>
            )}
          </Card>

        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Video Presentation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video size={20} className="text-primary-500" />
                <CardTitle>Video Presentazione</CardTitle>
              </div>
            </CardHeader>
            {videoMode === 'view' && (
              hasVideo && videoUrl
                ? <VideoPlayer src={videoUrl} duration={videoDuration} onDelete={handleVideoDelete} onRerecord={() => setVideoMode('record')} isDeleting={isDeletingVideo} />
                : <VideoPlaceholder onRecord={() => setVideoMode('record')} onUpload={() => setVideoMode('upload')} />
            )}
            {videoMode === 'record' && (
              <div className="py-4">
                <VideoRecorder maxDuration={60} onRecordingComplete={handleVideoComplete} onCancel={() => setVideoMode('view')} />
              </div>
            )}
            {videoMode === 'upload' && (
              <div className="py-4">
                <VideoUploader onUpload={handleVideoComplete} disabled={isUploadingVideo} onCancel={() => setVideoMode('view')} />
                <button onClick={() => setVideoMode('view')} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700">Annulla</button>
              </div>
            )}
          </Card>

          {/* Riepilogo ricerca */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-primary-500" />
                <CardTitle>Riepilogo Ricerca</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {form.searchCity && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm"><MapPin size={15} />Città</div>
                  <span className="text-sm font-medium">{form.searchCity}</span>
                </div>
              )}
              {form.budget && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm"><Euro size={15} />Budget max</div>
                  <span className="text-sm font-medium">€{form.budget}/mese</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm"><Home size={15} />Tipologia</div>
                <span className="text-sm font-medium">{PROPERTY_TYPES.find(p => p.value === form.propertyType)?.label || '—'}</span>
              </div>
              {form.income && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm"><Euro size={15} />Reddito</div>
                  <span className="text-sm font-medium">€{form.income} {form.incomeType === 'mensile' ? '/mese' : '/anno lordo'}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm"><PawPrint size={15} />Animali</div>
                <span className="text-sm font-medium">{form.hasPets === 'si' ? 'Sì' : 'No'}</span>
              </div>
              {selectedHobbies.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Interessi</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedHobbies.slice(0, 5).map(id => {
                      const h = HOBBIES.find(x => x.id === id);
                      return h ? (
                        <span key={id} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                          {h.icon} {h.label}
                        </span>
                      ) : null;
                    })}
                    {selectedHobbies.length > 5 && (
                      <span className="text-xs text-gray-400 self-center">+{selectedHobbies.length - 5}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}

      <ProfileEditModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onSubmit={handleProfileSave}
        initialData={{
          firstName: profile?.firstName || '', lastName: profile?.lastName || '',
          phone: profile?.phone || '', occupation: profile?.occupation || '',
          employmentType: profile?.employmentType || '', employer: profile?.employer || '',
          annualIncome: profile?.annualIncome, currentCity: profile?.city || '', bio: form.bio,
          avatarUrl: profile?.avatarUrl || '',
        }}
        isLoading={isSavingProfile}
      />
    </div>
  );
}
