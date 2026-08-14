import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { PremiumBadge } from '../components/ui/Badge';
import { useAuth } from '../lib/AuthContext';
import { 
  canInitiatePayment, 
  getDaysRemaining, 
  formatSubscriptionStatus 
} from '../lib/subscription';
import { SubscriptionPaymentModal } from '../components/SubscriptionPaymentModal';
import { premiumBenefits } from '../data/notifications';

const faqs = [
  {
    q: 'Naweza kusitisha wakati wowote?',
    a: 'Ndiyo. Usajili ni wa mwezi mmoja. Hauendelei kujilipa mwenyewe kama hutaki.'
  },
  {
    q: 'Nalipa vipi?',
    a: 'Kwa M-Pesa, Airtel Money, Tigo Pesa, au HaloPesa. Malipo yanachukua sekunde chache.'
  },
  {
    q: 'Naweza kusoma kwa simu?',
    a: 'Ndiyo. KISA imeundwa kwanza kwa simu, na hutumia data kidogo.'
  }
];

export function Subscribe() {
  const { user, profile, subscription, isPremium, refreshSubscription } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const isHalotel = phoneNumber.startsWith('062') || phoneNumber.startsWith('061') || phoneNumber.startsWith('+25562') || phoneNumber.startsWith('+25561');
  const showPaymentForm = !isPremium || canInitiatePayment(subscription);
  const daysRemaining = subscription ? getDaysRemaining(subscription.expiry_date) : 0;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Tafadhali weka namba ya simu');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/subscription/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: phoneNumber,
          email: profile?.email || user?.email,
          fullName: profile?.full_name || ''
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Tatizo limetokea wakati wa kuomba malipo');
      }
      
      setShowModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFinish = async () => {
    setShowModal(false);
    await refreshSubscription();
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-2xl text-center">
        <PremiumBadge className="mx-auto" />
        <h1 className="mt-4 font-display text-[34px] font-black leading-[1.05] text-cream sm:text-[52px]">
          Fungua ulimwengu wa KISA
        </h1>
        <p className="mt-4 text-base text-mist sm:text-lg">
          Hadithi zote, sehemu zote, mpya kila wiki. Kwa bei ya chai moja kwa mwezi.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-[#171112]">
          <div className="border-b border-gold/20 px-6 py-5 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">KISA Premium</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-[46px] font-black leading-none text-cream sm:text-6xl">
                TZS 2,000
              </span>
              <span className="pb-2 text-sm text-mist">/ mwezi</span>
            </div>
            <p className="mt-2 text-sm text-mist">Takribani TZS 67 kwa siku. Sitisha wakati wowote.</p>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <ul className="space-y-3.5 mb-8">
              {premiumBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-cream">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15">
                    <CheckIcon className="h-3 w-3 text-gold" aria-hidden="true" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {isPremium && !canInitiatePayment(subscription) ? (
              <div className="rounded-xl border border-gold/30 bg-gold/10 p-4 text-center">
                <p className="font-semibold text-gold">Umesajiliwa KISA Premium</p>
                <p className="text-sm text-cream mt-1">{formatSubscriptionStatus(subscription)}</p>
                <p className="text-xs text-mist mt-1">Siku {daysRemaining} zimebaki</p>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4 bg-surface p-4 rounded-xl border border-line">
                <h3 className="font-semibold text-cream">Lipia Usajili Wako</h3>
                
                {error && (
                  <div className="rounded-md bg-wine/20 p-3 text-sm text-wine-bright border border-wine/50">
                    {error}
                  </div>
                )}
                
                <Field
                  id="phone"
                  label="Namba ya Simu ya Malipo"
                  type="tel"
                  placeholder="Mf. 0712345678"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  required
                />
                
                {isHalotel && (
                  <div className="flex gap-2 rounded-md bg-yellow-900/30 p-3 text-xs text-yellow-500 border border-yellow-700/50">
                    <AlertTriangleIcon className="h-4 w-4 shrink-0" />
                    <p>Kwa watumiaji wa Halotel, tafadhali hakikisha simu yako ipo hewani kupokea ujumbe wa malipo.</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Inatuma maombi...' : 'Lipa TZS 2,000 via Snippe'}
                  </Button>
                </div>
                
                <div className="mt-2 text-center">
                  <span className="inline-block rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-mist opacity-50">
                    Malipo ya Kadi (Hivi karibuni)
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section
            aria-labelledby="originals-preview"
            className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-6"
          >
            <h2 id="originals-preview" className="font-display text-lg font-bold text-cream">
              Unafungua pia KISA Originals
            </h2>
            <p className="mt-3 text-sm text-mist">Hadithi zetu maalum, zilizoandikwa na waandishi wa KISA. Soma sehemu zote bila mwisho.</p>
          </section>

          <section aria-labelledby="faq-heading" className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-6">
            <h2 id="faq-heading" className="font-display text-lg font-bold text-cream">
              Maswali ya kawaida
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-semibold text-cream">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-mist">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
      
      {showModal && (
        <SubscriptionPaymentModal
          phone={phoneNumber}
          amount={2000}
          paymentMethod="mobile"
          onFinish={handlePaymentFinish}
        />
      )}
    </div>
  );
}