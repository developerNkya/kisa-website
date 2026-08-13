import React from 'react';
import { CheckIcon } from 'lucide-react';
import { ButtonLink } from './ui/Button';
import { premiumBenefits } from '../data/notifications';
import { cn } from '../utils/cn';

export function SubscriptionCard({
  headline = 'Fungua ulimwengu wa KISA',
  ctaLabel = 'Jisajili kwa TZS 2,000',
  ctaHref = '/malipo',
  note = 'Lipa kwa M-Pesa, Airtel Money, Mixx by Yas au HaloPesa. Sitisha wakati wowote.',
  className






}: {headline?: string;ctaLabel?: string;ctaHref?: string;note?: string;className?: string;}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-gold/25 bg-[#171112] p-6 sm:p-8',
        className
      )}>
      
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gold/60" />
      
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">KISA Premium</p>
      <h2 className="mt-2 font-display text-2xl font-black leading-tight text-cream sm:text-3xl">
        {headline}
      </h2>

      <div className="mt-5 flex items-end gap-2">
        <span className="font-display text-4xl font-black text-cream sm:text-5xl">TZS 2,000</span>
        <span className="pb-1.5 text-sm text-mist">/ mwezi</span>
      </div>

      <ul className="mt-6 space-y-3">
        {premiumBenefits.map((b) =>
        <li key={b} className="flex items-start gap-2.5 text-[15px] text-cream">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            {b}
          </li>
        )}
      </ul>

      <ButtonLink to={ctaHref} size="lg" className="mt-7 w-full">
        {ctaLabel}
      </ButtonLink>
      <p className="mt-3 text-center text-xs leading-relaxed text-dust">{note}</p>
    </div>);

}