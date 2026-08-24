import React, { useState } from 'react';
import { BookOpen, Lock, X, Check, Smartphone, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';

interface SubscriptionExpiredModalProps {
  storyId?: string;
  storyTitle?: string;
  storyCover?: string;
  price?: number;
  onSubscribe?: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SubscriptionExpiredModal({
  storyId,
  storyTitle = 'Hadithi Hii',
  storyCover,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors rounded-full z-10"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-8 pb-4 px-4 sm:px-6 text-center border-b bg-gray-50/80 border-gray-100">
          {/* Story Cover Image - Responsive */}
          {storyCover ? (
            <div className="mx-auto w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden shadow-md border border-gray-200 mb-3">
              <img 
                src={storyCover} 
                alt={`Jalada la ${storyTitle}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-3 relative shadow-lg">
              <BookOpen className="w-8 h-8 text-gray-700" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center border-2 border-white">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}

          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Fungua Hadithi Hii
          </h2>
          <p className="font-display font-semibold text-base text-[#9B1B3B] mb-2 truncate max-w-[280px] mx-auto">
            {storyTitle}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[320px] mx-auto">
            Lipia mara moja tu kusoma sehemu zote za hadithi hii bila kikomo!
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-gray-50">
          <div className="rounded-xl border border-[#9B1B3B]/20 bg-[#9B1B3B]/5 p-3 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Bei ya Hadithi
              </p>
              <p className="font-display text-xl sm:text-2xl font-black text-gray-900">
                TZS {price.toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-[#9B1B3B]/10 text-[#9B1B3B] text-xs font-semibold px-3 py-1 self-start sm:self-center">
              Malipo ya Mara Moja
            </span>
          </div>

          <ul className="flex flex-col gap-2 mb-4 text-xs text-gray-700">
            <li className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#9B1B3B]/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-[#9B1B3B]" />
              </div>
              <span>Sehemu zote zilizobaki za hadithi hii</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#9B1B3B]/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-[#9B1B3B]" />
              </div>
              <span>Hakuna ada ya kila mwezi — inabaki yako milele</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#9B1B3B]/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-[#9B1B3B]" />
              </div>
              <span>Malipo ya haraka kwa M-Pesa, Tigo, Airtel, HaloPesa</span>
            </li>
          </ul>

          <form onSubmit={handlePay} className="flex flex-col gap-3">
            <div>
              <label htmlFor="modal-phone" className="block text-xs font-medium text-gray-600 mb-1">
                Namba ya Simu ya Malipo
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="modal-phone"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#9B1B3B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#9B1B3B] hover:bg-[#C42B53] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-[#9B1B3B]/20 disabled:opacity-50 text-sm sm:text-base"
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
              className="w-full text-gray-400 hover:text-gray-700 text-xs font-medium py-1.5 transition-colors"
            >
              Funga na urudi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}