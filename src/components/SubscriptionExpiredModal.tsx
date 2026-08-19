import React, { useState } from 'react';
import { BookOpen, Lock, X, Check, Smartphone, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';

interface SubscriptionExpiredModalProps {
  storyId?: string;
  storyTitle?: string;
  price?: number;
  onSubscribe?: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SubscriptionExpiredModal({
  storyId,
  storyTitle = 'Hadithi Hii',
  price = 1000,
  onSubscribe,
  onClose,
  onSuccess,
}: SubscriptionExpiredModalProps) {
  const { user, profile, refreshPurchases } = useAuth();
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubscribe && !storyId) {
      onSubscribe();
      return;
    }

    if (!user) {
      toast.error('Tafadhali ingia kwanza ili kununua hadithi hii');
      window.location.href = `/ingia?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!phone.trim()) {
      toast.error('Weka namba ya simu');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/story/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          storyId,
          paymentMethod: 'mobile',
          customer: {
            fullName: profile?.full_name || 'Msomaji',
            phone: phone.trim(),
            email: user.email || 'reader@kisa.co.tz',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ombi la malipo halikufanikiwa');
      }

      setShowPaymentModal(true);
    } catch (err: any) {
      toast.error(err.message || 'Hitilafu wakati wa kuanzisha malipo');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishPayment = async () => {
    setShowPaymentModal(false);
    await refreshPurchases();
    if (onSuccess) onSuccess();
    else window.location.reload();
  };

  if (showPaymentModal) {
    return (
      <SubscriptionPaymentModal
        phone={phone}
        amount={price}
        paymentMethod="mobile"
        onFinish={handleFinishPayment}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-surface border border-wine/30 rounded-2xl shadow-2xl shadow-wine/10 overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-mist hover:text-cream transition-colors rounded-full hover:bg-surface-raised z-10"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-10 pb-6 px-6 text-center border-b border-line bg-gradient-to-b from-wine/10 to-transparent">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-surface-raised border border-wine/30 flex items-center justify-center mb-3 relative shadow-lg">
            <BookOpen className="w-7 h-7 text-cream" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-wine flex items-center justify-center border-2 border-surface">
              <Lock className="w-3.5 h-3.5 text-cream" />
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-cream mb-1">
            Fungua Hadithi Hii
          </h2>
          <p className="text-gold font-display font-semibold text-base mb-2">
            {storyTitle}
          </p>
          <p className="text-mist text-xs leading-relaxed max-w-[320px] mx-auto">
            Sehemu 3 za kwanza ni bure. Lipia mara moja tu kusoma sehemu zote zilizobaki za hadithi hii bila kikomo!
          </p>
        </div>

        <div className="p-6 bg-surface">
          <div className="rounded-xl border border-gold/25 bg-[#171112] p-4 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-mist font-semibold">Bei ya Hadithi</p>
              <p className="font-display text-2xl font-black text-cream">
                TZS {price.toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-gold/15 text-gold text-xs font-semibold px-3 py-1">
              Malipo ya Mara Moja
            </span>
          </div>

          <ul className="flex flex-col gap-2.5 mb-6 text-xs text-mist">
            <li className="flex items-center gap-2.5 text-cream">
              <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-gold" />
              </div>
              <span>Sehemu zote zilizobaki za hadithi hii</span>
            </li>
            <li className="flex items-center gap-2.5 text-cream">
              <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-gold" />
              </div>
              <span>Hakuna ada ya kila mwezi — inabaki yako milele</span>
            </li>
            <li className="flex items-center gap-2.5 text-cream">
              <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-gold" />
              </div>
              <span>Malipo ya haraka kwa M-Pesa, Tigo, Airtel, HaloPesa</span>
            </li>
          </ul>

          <form onSubmit={handlePay} className="flex flex-col gap-3">
            <div>
              <label htmlFor="modal-phone" className="block text-xs font-medium text-mist mb-1">
                Namba ya Simu ya Malipo
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                <input
                  id="modal-phone"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-surface-raised text-sm text-cream placeholder:text-dust focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-wine hover:bg-wine-bright text-cream font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-wine/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inatuma ombi...</span>
                </>
              ) : (
                <span>Lipa TZS {price.toLocaleString()} Sasa</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-mist hover:text-cream text-xs font-medium py-1.5 transition-colors"
            >
              Funga na urudi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
