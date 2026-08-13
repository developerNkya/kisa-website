import React from 'react';
import { CheckIcon, LockIcon } from 'lucide-react';
import { ButtonLink } from './ui/Button';
import { premiumBenefits } from '../data/notifications';

export function PremiumLock({
  teaser,
  storyTitle



}: {teaser: string;storyTitle: string;}) {
  return (
    <section
      aria-labelledby="paywall-heading"
      className="relative mt-14 overflow-hidden rounded-2xl border border-gold/25 bg-[#181112] px-5 py-8 sm:px-10 sm:py-10">
      
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <LockIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
          Umefika mwisho wa sehemu hii
        </p>
        <h2 id="paywall-heading" className="mt-3 font-display text-2xl font-black leading-tight text-cream sm:text-3xl">
          {teaser}
        </h2>
        <p className="mt-3 text-sm text-mist">
          Endelea na {storyTitle} na hadithi zote za Premium kwa bei ya chai moja.
        </p>

        <div className="mt-7 flex items-end justify-center gap-2">
          <span className="font-display text-4xl font-black text-cream">TZS 2,000</span>
          <span className="pb-1.5 text-sm text-mist">/ mwezi</span>
        </div>

        <ul className="mx-auto mt-6 grid max-w-md gap-2.5 text-left sm:grid-cols-2">
          {premiumBenefits.slice(0, 4).map((b) =>
          <li key={b} className="flex items-start gap-2 text-sm text-cream">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {b}
            </li>
          )}
        </ul>

        <ButtonLink to="/premium" size="lg" className="mt-8 w-full sm:w-auto sm:px-10">
          Jisajili sasa
        </ButtonLink>
        <p className="mt-3 text-xs text-dust">Usajili wako unaanza mara moja baada ya malipo.</p>
      </div>
    </section>);

}