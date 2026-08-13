import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { PremiumBadge } from '../components/ui/Badge';
import { premiumBenefits, paymentMethods } from '../data/notifications';
import { originals, stories } from '../data/stories';

const faqs = [
{
  q: 'Naweza kusitisha wakati wowote?',
  a: 'Ndiyo. Usajili ni wa mwezi mmoja. Hauendelei kujilipa mwenyewe kama hutaki.'
},
{
  q: 'Nalipa vipi?',
  a: 'Kwa M-Pesa, Airtel Money, Mixx by Yas, HaloPesa au kadi ya benki. Malipo yanachukua sekunde chache.'
},
{
  q: 'Naweza kusoma kwa simu?',
  a: 'Ndiyo. KISA imeundwa kwanza kwa simu, na hutumia data kidogo.'
}];


export function Subscribe() {
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
            <ul className="space-y-3.5">
              {premiumBenefits.map((b) =>
              <li key={b} className="flex items-start gap-3 text-[15px] text-cream">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15">
                    <CheckIcon className="h-3 w-3 text-gold" aria-hidden="true" />
                  </span>
                  {b}
                </li>
              )}
            </ul>

            <ButtonLink to="/malipo" size="lg" className="mt-7 w-full">
              Jisajili kwa TZS 2,000
            </ButtonLink>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-dust">Njia za malipo</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {paymentMethods.map((m) =>
                <span
                  key={m.id}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-mist">
                  
                    {m.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section
            aria-labelledby="originals-preview"
            className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-6">
            
            <h2 id="originals-preview" className="font-display text-lg font-bold text-cream">
              Unafungua pia KISA Originals
            </h2>
            <ul className="mt-4 space-y-3">
              {originals.map((s) =>
              <li key={s.id}>
                  <Link to={`/hadithi/${s.slug}`} className="group flex items-center gap-3">
                    <img src={s.cover} alt="" aria-hidden="true" className="h-16 w-11 rounded object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-cream group-hover:text-gold">
                        {s.title}
                      </span>
                      <span className="text-xs text-mist">
                        {s.genres.join(' · ')} · {s.episodes.length} Sehemu
                      </span>
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </section>

          <section aria-labelledby="faq-heading" className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-6">
            <h2 id="faq-heading" className="font-display text-lg font-bold text-cream">
              Maswali ya kawaida
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((f) =>
              <div key={f.q}>
                  <dt className="text-sm font-semibold text-cream">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-mist">{f.a}</dd>
                </div>
              )}
            </dl>
          </section>

          <p className="text-center text-sm text-mist">
            Wasomaji {stories.length * 320}+ wanasoma KISA kila siku.
          </p>
        </div>
      </div>
    </div>);

}