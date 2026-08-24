import React, { useState } from 'react';
import { BookOpen, Lock, X, Check, Smartphone, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';
import { track } from '../lib/pixel'; // ✅ Add this import

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

    // ✅ Track payment initiation
    if (storyId) {
      track.initiateCheckout({
        id: storyId,
        title: storyTitle,
        price: price,
      });
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
    
    // ✅ Track successful purchase
    if (storyId) {
      track.purchase({
        id: storyId,
        title: storyTitle,
        price: price,
      });
    }
    
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
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors rounded-full z-20"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row md:items-stretch overflow-y-auto">
          {/* Left Column - Cover Image - Sticky on mobile */}
          <div className="md:w-2/5 lg:w-2/5 relative bg-gray-100 flex-shrink-0 md:sticky md:top-0">
            {storyCover ? (
              <img 
                src={storyCover} 
                alt={`Jalada la ${storyTitle}`}
                className="w-full h-56 md:h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-56 md:h-full flex items-center justify-center bg-gradient-to-br from-[#9B1B3B]/10 to-[#C9A24A]/10">
                <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
              </div>
            )}
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
              <p className="text-white font-display text-base md:text-lg font-bold italic">
                “{storyTitle}”
              </p>
              <p className="text-white/80 text-xs md:text-sm mt-0.5 md:mt-1">
                Lipia mara moja, soma milele.
              </p>
            </div>
          </div>

          {/* Right Column - Content - Scrollable */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header - hidden on desktop, shown on mobile */}
            <div className="md:hidden pt-4 pb-2 px-4 text-center border-b border-gray-100 bg-white sticky top-0 z-10">
              <h2 className="font-display text-xl font-bold text-gray-900">
                Fungua Hadithi Hii
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Lipia mara moja tu kusoma sehemu zote
              </p>
            </div>

            {/* Desktop header (hidden on mobile) */}
            <div className="hidden md:block pt-8 pb-4 px-6 border-b border-gray-100">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                Fungua Hadithi Hii
              </h2>
              <p className="text-sm text-gray-500">
                Lipia mara moja tu kusoma sehemu zote za hadithi hii bila kikomo!
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 flex-1">
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
      </div>
    </div>
  );
}