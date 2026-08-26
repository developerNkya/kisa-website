import React from "react";
import { CheckCircle, Smartphone, Key, Clock, X } from "lucide-react";
import { cn } from "../utils/cn";

interface SubscriptionPaymentModalProps {
  phone: string;
  amount: number;
  paymentMethod: "mobile" | "card";
  onFinish: () => void;
}

export function SubscriptionPaymentModal({
  phone,
  amount,
  paymentMethod,
  onFinish,
}: SubscriptionPaymentModalProps) {
  const isHalotel = phone.startsWith("071");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-surface border border-wine/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <button
          onClick={onFinish}
          className="absolute top-4 right-4 p-2 text-mist hover:text-cream transition-colors rounded-full hover:bg-surface-raised"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-line">
          <h2 className="font-display text-2xl font-bold text-cream mb-2">
            Kamilisha Malipo
          </h2>
          <p className="text-mist">
            Tuma TZS {amount.toLocaleString()} kupitia namba{" "}
            <span className="font-medium text-cream">{phone}</span>
          </p>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center text-wine border border-wine/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-cream mb-1">
                Hatua ya 1: Angalia simu yako
              </h3>
              <p className="text-sm text-mist">
                Utapokea ujumbe wa kufanya malipo kwenye simu yako.
              </p>
              {isHalotel && (
                <p className="text-xs text-gold mt-1">
                  Kumbuka: Kwa mtandao wa Halotel, huenda ukahitaji kupiga
                  *150*88#
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center text-wine border border-wine/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-cream mb-1">
                Hatua ya 2: Weka PIN yako
              </h3>
              <p className="text-sm text-mist">
                Weka namba yako ya siri kuthibitisha malipo haya.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center text-wine border border-wine/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-cream mb-1">
                Hatua ya 3: Subiri uthibitisho
              </h3>
              <p className="text-sm text-mist">
                Baada ya malipo , utaweza kusoma sehemu zote za hadithi hii.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-raised border-t border-line mt-auto">
          <button
            onClick={onFinish}
            className="w-full flex items-center justify-center gap-2 bg-wine hover:bg-wine-bright text-cream font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Nimemaliza malipo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
