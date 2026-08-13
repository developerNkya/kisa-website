import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { freeStories } from '../../data/stories';
import { ButtonLink } from '../ui/Button';
import { FreeBadge } from '../ui/Badge';

export function FreeStarter() {
  return (
    <section className="py-14" aria-labelledby="free-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Hakuna malipo</p>
            <h2 id="free-heading" className="mt-1.5 font-display text-2xl font-black text-cream sm:text-[32px]">
              Anza Bure
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-mist">
              Soma hadithi hizi zote, au sehemu za kwanza za hadithi za Premium, bila kulipa kitu.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {freeStories.slice(0, 6).map((s) =>
          <article
            key={s.id}
            className="flex gap-4 rounded-card border border-line-soft bg-surface p-4 transition-colors duration-150 ease-kisa hover:border-mist/30">
            
              <Link to={`/hadithi/${s.slug}`} className="shrink-0">
                <img
                src={s.cover}
                alt={`Jalada la ${s.title}`}
                loading="lazy"
                className="h-[124px] w-[86px] rounded-lg object-cover" />
              
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <FreeBadge className="self-start" />
                <h3 className="mt-2 font-display text-base font-bold leading-tight text-cream">
                  <Link to={`/hadithi/${s.slug}`} className="hover:text-gold">
                    {s.title}
                  </Link>
                </h3>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-mist">{s.hook}</p>
                <Link
                to={`/soma/${s.slug}/1`}
                className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-gold transition-colors duration-150 ease-kisa hover:text-cream">
                
                  Anza kusoma
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          )}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-card border border-gold/25 bg-[#171112] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-xl font-bold text-cream sm:text-2xl">Umeipenda?</p>
            <p className="mt-1 text-sm text-mist">
              Fungua hadithi zote kwa <span className="font-semibold text-gold">TZS 2,000/mwezi</span>.
            </p>
          </div>
          <ButtonLink to="/premium" size="lg" className="w-full sm:w-auto">
            Jisajili sasa
          </ButtonLink>
        </div>
      </div>
    </section>);

}