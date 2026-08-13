import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { originals, stories } from '../../data/stories';
import { ButtonLink } from '../ui/Button';
import { OriginalBadge } from '../ui/Badge';

export function OriginalsSpotlight() {
  const lead = stories.find((s) => s.id === 'chumba-cha-404')!;
  const rest = originals.filter((s) => s.id !== lead.id);

  return (
    <section
      className="border-y border-gold/15 bg-[#100C0D] py-14"
      aria-labelledby="originals-heading">
      
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Kwa KISA tu</p>
            <h2
              id="originals-heading"
              className="mt-1.5 font-display text-2xl font-black text-cream sm:text-[32px]">
              
              KISA Originals
            </h2>
          </div>
          <Link
            to="/hadithi"
            className="hidden items-center gap-1 text-sm font-semibold text-mist transition-colors duration-150 ease-kisa hover:text-gold sm:inline-flex">
            
            Ona zote
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <article className="relative overflow-hidden rounded-2xl border border-gold/20">
            <img
              src={lead.cover}
              alt={`Jalada la ${lead.title}`}
              loading="lazy"
              className="h-[380px] w-full object-cover object-[50%_35%] sm:h-[460px]" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
              <OriginalBadge />
              <h3 className="mt-3 font-display text-3xl font-black uppercase tracking-wide text-cream sm:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-md font-display text-lg italic text-gold sm:text-xl">
                “{lead.hook}”
              </p>
              <p className="mt-3 max-w-md text-sm text-mist">
                {lead.genres.join(' · ')} · {lead.episodes.length} Sehemu
              </p>
              <ButtonLink to={`/soma/${lead.slug}/1`} size="lg" className="mt-6">
                Soma sasa
              </ButtonLink>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((s) =>
            <article
              key={s.id}
              className="group relative flex gap-4 overflow-hidden rounded-xl border border-line-soft bg-surface p-4">
              
                <img
                src={s.cover}
                alt={`Jalada la ${s.title}`}
                loading="lazy"
                className="h-[120px] w-[84px] shrink-0 rounded-lg object-cover" />
              
                <div className="min-w-0">
                  <OriginalBadge />
                  <h3 className="mt-2 font-display text-lg font-bold leading-tight text-cream">
                    <Link to={`/hadithi/${s.slug}`} className="hover:text-gold">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-mist">{s.hook}</p>
                  <p className="mt-2 text-xs text-dust">
                    {s.genres.join(' · ')} · {s.episodes.length} Sehemu
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>);

}