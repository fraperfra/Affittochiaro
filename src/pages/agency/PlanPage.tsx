import { useState, useMemo } from 'react';
import { Check, Star, CreditCard, Crown, ArrowRight, ArrowDown, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '../../store';
import { AgencyUser, AgencyPlan } from '../../types';
import { AGENCY_PLANS, AgencyPlanDetails } from '../../types/agency';
import { formatCurrency } from '../../utils/formatters';
import { Card, Button, Badge, Modal, ModalFooter } from '../../components/ui';
import toast from 'react-hot-toast';

const PLAN_ORDER: AgencyPlan[] = ['free', 'base', 'professional', 'enterprise'];

const PLAN_ICONS: Record<AgencyPlan, typeof Crown> = {
  free: Shield,
  base: Zap,
  professional: Star,
  enterprise: Crown,
};

const creditPackages = [
  { credits: 10, price: 15, perCredit: 1.5 },
  { credits: 25, price: 30, perCredit: 1.2, popular: true },
  { credits: 50, price: 50, perCredit: 1.0 },
  { credits: 100, price: 80, perCredit: 0.8, bestValue: true },
];

export default function PlanPage() {
  const { user, setUser } = useAuthStore();
  const agencyUser = user as AgencyUser;
  const currentPlan = agencyUser?.agency?.plan || 'free';
  const credits = agencyUser?.agency?.credits || 0;

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<AgencyPlan | null>(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const currentPlanDetails = useMemo(
    () => AGENCY_PLANS.find(p => p.id === currentPlan)!,
    [currentPlan]
  );
  const selectedPlanDetails = useMemo(
    () => selectedPlanId ? AGENCY_PLANS.find(p => p.id === selectedPlanId) : null,
    [selectedPlanId]
  );

  const isUpgrade = selectedPlanId
    ? PLAN_ORDER.indexOf(selectedPlanId) > PLAN_ORDER.indexOf(currentPlan)
    : false;

  const handleSelectPlan = (planId: AgencyPlan) => {
    setSelectedPlanId(planId);
    setShowChangeModal(true);
  };

  const confirmPlanChange = () => {
    if (!selectedPlanDetails || !agencyUser) return;

    const updatedUser: AgencyUser = {
      ...agencyUser,
      agency: {
        ...agencyUser.agency,
        plan: selectedPlanDetails.id,
        credits: selectedPlanDetails.creditsPerMonth,
        creditsUsedThisMonth: 0,
        planStartDate: new Date(),
        planExpiresAt: new Date(Date.now() + (billingPeriod === 'yearly' ? 365 : 30) * 86400000),
      },
    };

    setUser(updatedUser);
    setShowChangeModal(false);
    setSelectedPlanId(null);

    toast.success(
      isUpgrade
        ? `Piano aggiornato a ${selectedPlanDetails.name}! ${selectedPlanDetails.creditsPerMonth} crediti disponibili.`
        : `Piano cambiato a ${selectedPlanDetails.name}.`
    );
  };

  const confirmBuyCredits = () => {
    const pkg = creditPackages.find(p => p.credits === selectedPackage);
    if (!pkg || !agencyUser) return;

    const updatedUser: AgencyUser = {
      ...agencyUser,
      agency: {
        ...agencyUser.agency,
        credits: agencyUser.agency.credits + pkg.credits,
      },
    };

    setUser(updatedUser);
    setShowBuyCreditsModal(false);
    setSelectedPackage(null);

    toast.success(`${pkg.credits} crediti aggiunti! Totale: ${updatedUser.agency.credits} crediti.`);
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <Card className="bg-gradient-to-r from-teal-600 to-primary-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">Il tuo piano attuale</p>
            <div className="flex items-center gap-2 mt-1">
              {(() => { const Icon = PLAN_ICONS[currentPlan]; return <Icon size={24} />; })()}
              <h2 className="text-2xl font-bold">{currentPlanDetails.name}</h2>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span className="font-medium">{credits} crediti disponibili</span>
              </div>
              <div className="text-white/70 text-sm">
                {currentPlanDetails.creditsPerMonth} crediti/mese
                {currentPlanDetails.maxListings === -1
                  ? ' · Annunci illimitati'
                  : ` · Max ${currentPlanDetails.maxListings} annunci`}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowBuyCreditsModal(true)}>
              Acquista Crediti
            </Button>
          </div>
        </div>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${billingPeriod === 'monthly' ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>
          Mensile
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-primary-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
              billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingPeriod === 'yearly' ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>
          Annuale
          <Badge variant="success" className="ml-2">-20%</Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AGENCY_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const planIdx = PLAN_ORDER.indexOf(plan.id);
          const currentIdx = PLAN_ORDER.indexOf(currentPlan);
          const isPlanUpgrade = planIdx > currentIdx;
          const isPlanDowngrade = planIdx < currentIdx;
          const price = billingPeriod === 'monthly' ? plan.price : plan.priceYearly / 12;
          const Icon = PLAN_ICONS[plan.id];

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.isPopular ? 'ring-2 ring-primary-500' : ''
              } ${isCurrent ? 'bg-primary-50 ring-2 ring-primary-400' : ''}`}
            >
              {plan.isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" className="flex items-center gap-1">
                    <Star size={12} /> Piu Popolare
                  </Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success" className="flex items-center gap-1">
                    <Check size={12} /> Piano Attivo
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-text-primary">
                    {formatCurrency(price, { showDecimals: false })}
                  </span>
                  <span className="text-text-muted">/mese</span>
                </div>
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <p className="text-sm text-text-muted mt-1">
                    {formatCurrency(plan.priceYearly)}/anno
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-muted mb-3 text-center">
                  {plan.creditsPerMonth} crediti/mese · {plan.maxListings === -1 ? 'Annunci illimitati' : `Max ${plan.maxListings} annunci`}
                </p>
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Piano Attuale
                  </Button>
                ) : isPlanUpgrade ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    rightIcon={<ArrowRight size={16} />}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Upgrade
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Downgrade
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Plan Change Confirmation Modal */}
      <Modal
        isOpen={showChangeModal}
        onClose={() => { setShowChangeModal(false); setSelectedPlanId(null); }}
        title={isUpgrade ? 'Conferma Upgrade' : 'Conferma Downgrade'}
        size="md"
      >
        {selectedPlanDetails && (
          <div className="space-y-5">
            {/* Plan comparison */}
            <div className="flex items-center gap-4 justify-center">
              <div className="text-center p-3 rounded-xl bg-background-secondary">
                <p className="text-xs text-text-muted mb-1">Attuale</p>
                <p className="font-bold text-text-primary">{currentPlanDetails.name}</p>
                <p className="text-sm text-text-muted">{currentPlanDetails.creditsPerMonth} crediti/mese</p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUpgrade ? 'bg-primary-100' : 'bg-amber-100'}`}>
                {isUpgrade ? <ArrowRight size={16} className="text-primary-600" /> : <ArrowDown size={16} className="text-amber-600" />}
              </div>
              <div className={`text-center p-3 rounded-xl ${isUpgrade ? 'bg-primary-50 ring-1 ring-primary-200' : 'bg-amber-50 ring-1 ring-amber-200'}`}>
                <p className="text-xs text-text-muted mb-1">Nuovo</p>
                <p className="font-bold text-text-primary">{selectedPlanDetails.name}</p>
                <p className="text-sm text-text-muted">{selectedPlanDetails.creditsPerMonth} crediti/mese</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-background-secondary rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Prezzo</span>
                <span className="font-semibold">
                  {formatCurrency(billingPeriod === 'monthly' ? selectedPlanDetails.price : selectedPlanDetails.priceYearly / 12)}/mese
                </span>
              </div>
              {billingPeriod === 'yearly' && selectedPlanDetails.price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Fatturato annualmente</span>
                  <span className="font-semibold">{formatCurrency(selectedPlanDetails.priceYearly)}/anno</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Crediti mensili</span>
                <span className="font-semibold">{selectedPlanDetails.creditsPerMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Annunci</span>
                <span className="font-semibold">{selectedPlanDetails.maxListings === -1 ? 'Illimitati' : `Max ${selectedPlanDetails.maxListings}`}</span>
              </div>
            </div>

            {/* Gained/lost features */}
            {isUpgrade && (
              <div>
                <p className="text-sm font-medium text-text-primary mb-2">Funzionalita aggiuntive:</p>
                <div className="space-y-1.5">
                  {selectedPlanDetails.features
                    .filter(f => !currentPlanDetails.features.includes(f))
                    .map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-primary-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary">{f}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {!isUpgrade && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700">
                  Con il downgrade perderai accesso ad alcune funzionalita e i crediti verranno reimpostati a {selectedPlanDetails.creditsPerMonth}/mese.
                </p>
              </div>
            )}

            <p className="text-xs text-text-muted text-center">
              La modifica sara effettiva immediatamente.
            </p>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowChangeModal(false); setSelectedPlanId(null); }}>
            Annulla
          </Button>
          <Button
            variant={isUpgrade ? 'primary' : 'outline'}
            onClick={confirmPlanChange}
          >
            {isUpgrade ? 'Conferma Upgrade' : 'Conferma Downgrade'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Buy Credits Modal */}
      <Modal
        isOpen={showBuyCreditsModal}
        onClose={() => { setShowBuyCreditsModal(false); setSelectedPackage(null); }}
        title="Acquista Crediti"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Seleziona un pacchetto di crediti. I crediti non scadono mai e si aggiungono a quelli del piano.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {creditPackages.map((pkg) => (
              <button
                key={pkg.credits}
                onClick={() => setSelectedPackage(pkg.credits)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPackage === pkg.credits
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : pkg.popular
                      ? 'border-primary-300 bg-primary-50/50 hover:border-primary-500'
                      : 'border-border hover:border-primary-300'
                }`}
              >
                {pkg.popular && (
                  <Badge variant="primary" className="absolute -top-2 right-4">
                    Popolare
                  </Badge>
                )}
                {pkg.bestValue && (
                  <Badge variant="success" className="absolute -top-2 right-4">
                    Miglior Valore
                  </Badge>
                )}
                <p className="text-2xl font-bold text-text-primary">{pkg.credits} crediti</p>
                <p className="text-lg font-semibold text-primary-600 mt-1">
                  {formatCurrency(pkg.price)}
                </p>
                <p className="text-sm text-text-muted">
                  {formatCurrency(pkg.perCredit, { showDecimals: true })} per credito
                </p>
              </button>
            ))}
          </div>
          {selectedPackage && (
            <div className="bg-primary-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Crediti dopo l'acquisto:
              </span>
              <span className="font-bold text-primary-600">
                {credits} + {selectedPackage} = {credits + selectedPackage} crediti
              </span>
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowBuyCreditsModal(false); setSelectedPackage(null); }}>
            Annulla
          </Button>
          <Button
            onClick={confirmBuyCredits}
            disabled={!selectedPackage}
          >
            Acquista {selectedPackage || ''} Crediti
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
