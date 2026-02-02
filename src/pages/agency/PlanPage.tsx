import { useState } from 'react';
import { Check, Star, Zap, CreditCard, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store';
import { AgencyUser } from '../../types';
import { AGENCY_PLANS } from '../../types/agency';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter } from '../../components/ui';
import toast from 'react-hot-toast';

export default function PlanPage() {
  const { user } = useAuthStore();
  const agencyUser = user as AgencyUser;
  const currentPlan = agencyUser?.agency?.plan || 'free';
  const credits = agencyUser?.agency?.credits || 0;

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    toast.success(`Piano aggiornato a ${selectedPlan}!`);
    setShowUpgradeModal(false);
  };

  const creditPackages = [
    { credits: 10, price: 15, perCredit: 1.5 },
    { credits: 25, price: 30, perCredit: 1.2, popular: true },
    { credits: 50, price: 50, perCredit: 1.0 },
    { credits: 100, price: 80, perCredit: 0.8, bestValue: true },
  ];

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <Card className="bg-gradient-to-r from-teal-600 to-primary-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">Il tuo piano attuale</p>
            <h2 className="text-2xl font-bold capitalize">{currentPlan}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>{credits} crediti disponibili</span>
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
        <span className={billingPeriod === 'monthly' ? 'font-medium' : 'text-text-muted'}>
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
        <span className={billingPeriod === 'yearly' ? 'font-medium' : 'text-text-muted'}>
          Annuale
          <Badge variant="success" className="ml-2">-20%</Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AGENCY_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const price = billingPeriod === 'monthly' ? plan.price : plan.priceYearly / 12;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular ? 'ring-2 ring-primary-500' : ''
              } ${isCurrent ? 'bg-primary-50' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" className="flex items-center gap-1">
                    <Star size={12} /> Piu Popolare
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                <div className="mt-4">
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

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-muted mb-3 text-center">
                  {plan.creditsPerMonth} crediti/mese
                </p>
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Piano Attuale
                  </Button>
                ) : (
                  <Button
                    variant={plan.isPopular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Buy Credits Modal */}
      <Modal
        isOpen={showBuyCreditsModal}
        onClose={() => setShowBuyCreditsModal(false)}
        title="Acquista Crediti"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Seleziona un pacchetto di crediti. I crediti non scadono mai.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {creditPackages.map((pkg) => (
              <button
                key={pkg.credits}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  pkg.popular
                    ? 'border-primary-500 bg-primary-50'
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
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowBuyCreditsModal(false)}>
            Annulla
          </Button>
          <Button onClick={() => {
            toast.success('Crediti acquistati con successo!');
            setShowBuyCreditsModal(false);
          }}>
            Procedi al Pagamento
          </Button>
        </ModalFooter>
      </Modal>

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Conferma Upgrade"
        size="sm"
      >
        <p className="text-text-secondary">
          Stai per passare al piano <strong className="capitalize">{selectedPlan}</strong>.
          La modifica sara effettiva immediatamente.
        </p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
            Annulla
          </Button>
          <Button onClick={confirmUpgrade}>
            Conferma Upgrade
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
