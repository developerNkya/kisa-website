import React from 'react';
import { BookOpen, Lock, X, Check } from 'lucide-react';

interface SubscriptionExpiredModalProps {
  onSubscribe: () => void;
  onClose: () => void;
}

export function SubscriptionExpiredModal({ onSubscribe, onClose }: SubscriptionExpiredModalProps) {
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

        <div className="relative pt-12 pb-8 px-6 text-center border-b border-line bg-gradient-to-b from-wine/10 to-transparent">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-raised border border-wine/30 flex items-center justify-center mb-4 relative shadow-lg">
            <BookOpen className="w-8 h-8 text-cream" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-wine flex items-center justify-center border-2 border-surface">
              <Lock className="w-4 h-4 text-cream" />
            </div>
          </div>
          
          <h2 className="font-display text-2xl font-bold text-cream mb-3">
            Endelea Kusoma Premium
          </h2>
          <p className="text-mist text-sm leading-relaxed max-w-[280px] mx-auto">
            Sehemu hii inahitaji usajili wa KISA Premium. Soma hadithi zote bila kikwacho kwa Shilingi 2,000 kwa mwezi.
          </p>
        </div>

        <div className="p-6 bg-surface">
          <ul className="flex flex-col gap-3 mb-8">
            {[
              'Sehemu zote bila kikwacho',
              'Hadithi mpya kila wiki',
              'Tazama video za hadithi'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-cream">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <button
              onClick={onSubscribe}
              className="w-full bg-wine hover:bg-wine-bright text-cream font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-wine/20"
            >
              Jisajili Sasa — TZS 2,000/mwezi
            </button>
            <button
              onClick={onClose}
              className="w-full text-mist hover:text-cream text-sm font-medium py-2 transition-colors"
            >
              Sehemu 3 za kwanza ni za bure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
