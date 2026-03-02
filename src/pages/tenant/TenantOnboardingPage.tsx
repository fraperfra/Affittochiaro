import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Home, Store, GraduationCap, Briefcase, UserCircle, MoreHorizontal, Search, Smartphone, Users } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuthStore } from '../../store';
import { OnboardingCard, Button } from '../../components/ui';

type StepType = 1 | 2 | 3;

export default function TenantOnboardingPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [step, setStep] = useState<StepType>(1);

    // State for selections
    const [lookingFor, setLookingFor] = useState<string[]>([]);
    const [workStatus, setWorkStatus] = useState<string[]>([]);
    const [heardAboutUs, setHeardAboutUs] = useState<string[]>([]);

    const toggleSelection = (state: string[], setter: (val: string[]) => void, value: string, singleChoice = false) => {
        if (singleChoice) {
            setter([value]);
            return;
        }

        if (state.includes(value)) {
            setter(state.filter(item => item !== value));
        } else {
            setter([...state, value]);
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep((step + 1) as StepType);
        } else {
            // Navigate to dashboard after completing onboarding
            navigate(ROUTES.TENANT_DASHBOARD);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as StepType);
        }
    };

    const isNextDisabled = () => {
        if (step === 1 && lookingFor.length === 0) return true;
        if (step === 2 && workStatus.length === 0) return true;
        if (step === 3 && heardAboutUs.length === 0) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="w-20">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    ) : (
                        <span className="text-sm font-medium text-gray-400">Step {step} di 3</span>
                    )}
                </div>

                <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-8" />

                <div className="w-20 text-right">
                    {step > 1 && (
                        <span className="text-sm font-medium text-gray-400">Step {step} di 3</span>
                    )}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1">
                <div
                    className="bg-primary-500 h-1 transition-all duration-300 ease-in-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-32 animate-fade-in">
                <div className="w-full max-w-3xl">
                    {step === 1 && (
                        <div className="space-y-10 animate-slide-up">
                            <div className="text-center">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                                    Cosa stai cercando?
                                </h1>
                                <p className="text-lg text-gray-500 font-medium tracking-wide">
                                    Scegli le opzioni che ti interessano
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <OnboardingCard
                                    icon={<BedDouble size={36} strokeWidth={1.5} />}
                                    title="Stanza singola"
                                    selected={lookingFor.includes('Stanza singola')}
                                    onClick={() => toggleSelection(lookingFor, setLookingFor, 'Stanza singola')}
                                />
                                <OnboardingCard
                                    icon={<Home size={36} strokeWidth={1.5} />}
                                    title="Intero appartamento"
                                    selected={lookingFor.includes('Intero appartamento')}
                                    onClick={() => toggleSelection(lookingFor, setLookingFor, 'Intero appartamento')}
                                />
                                <OnboardingCard
                                    icon={<BedDouble size={36} strokeWidth={1.5} />}
                                    title="Posto letto"
                                    selected={lookingFor.includes('Posto letto')}
                                    onClick={() => toggleSelection(lookingFor, setLookingFor, 'Posto letto')}
                                />
                                <OnboardingCard
                                    icon={<Store size={36} strokeWidth={1.5} />}
                                    title="Locale Commerciale"
                                    selected={lookingFor.includes('Locale Commerciale')}
                                    onClick={() => toggleSelection(lookingFor, setLookingFor, 'Locale Commerciale')}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-slide-up">
                            <div className="text-center">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                                    Qual è la tua situazione lavorativa?
                                </h1>
                                <p className="text-lg text-gray-500 font-medium tracking-wide">
                                    Scegli le opzioni che ti rappresentano
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <OnboardingCard
                                    icon={<GraduationCap size={36} strokeWidth={1.5} />}
                                    title="Studente"
                                    selected={workStatus.includes('Studente')}
                                    onClick={() => toggleSelection(workStatus, setWorkStatus, 'Studente')}
                                />
                                <OnboardingCard
                                    icon={<Briefcase size={36} strokeWidth={1.5} />}
                                    title="Lavoratore dipendente"
                                    selected={workStatus.includes('Lavoratore dipendente')}
                                    onClick={() => toggleSelection(workStatus, setWorkStatus, 'Lavoratore dipendente')}
                                />
                                <OnboardingCard
                                    icon={<UserCircle size={36} strokeWidth={1.5} />}
                                    title="Libero professionista"
                                    selected={workStatus.includes('Libero professionista')}
                                    onClick={() => toggleSelection(workStatus, setWorkStatus, 'Libero professionista')}
                                />
                                <OnboardingCard
                                    icon={<MoreHorizontal size={36} strokeWidth={1.5} />}
                                    title="Altro"
                                    selected={workStatus.includes('Altro')}
                                    onClick={() => toggleSelection(workStatus, setWorkStatus, 'Altro')}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10 animate-slide-up">
                            <div className="text-center">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                                    Come hai conosciuto AffittoChiaro?
                                </h1>
                                <p className="text-lg text-gray-500 font-medium tracking-wide">
                                    Scegli l'opzione che corrisponde (puoi selezionarne più di una)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <OnboardingCard
                                    icon={<Search size={36} strokeWidth={1.5} />}
                                    title="Google"
                                    selected={heardAboutUs.includes('Google')}
                                    onClick={() => toggleSelection(heardAboutUs, setHeardAboutUs, 'Google')}
                                />
                                <OnboardingCard
                                    icon={<Smartphone size={36} strokeWidth={1.5} />}
                                    title="Social Media"
                                    selected={heardAboutUs.includes('Social Media')}
                                    onClick={() => toggleSelection(heardAboutUs, setHeardAboutUs, 'Social Media')}
                                />
                                <OnboardingCard
                                    icon={<Users size={36} strokeWidth={1.5} />}
                                    title="Passaparola"
                                    selected={heardAboutUs.includes('Passaparola')}
                                    onClick={() => toggleSelection(heardAboutUs, setHeardAboutUs, 'Passaparola')}
                                />
                                <OnboardingCard
                                    icon={<MoreHorizontal size={36} strokeWidth={1.5} />}
                                    title="Altro"
                                    selected={heardAboutUs.includes('Altro')}
                                    onClick={() => toggleSelection(heardAboutUs, setHeardAboutUs, 'Altro')}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Continue Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent flex justify-center pb-8 border-t border-gray-100">
                <Button
                    className="w-full max-w-md py-4 text-lg rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                >
                    {step === 3 ? 'Inizia a usare AffittoChiaro' : 'Continua'}
                </Button>
            </div>
        </div>
    );
}
