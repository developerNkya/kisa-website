import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ClockIcon, LockIcon } from 'lucide-react';
import { Story } from '../types';
import { useAuth } from '../lib/AuthContext';
import { swahiliDate } from '../utils/format';
import { cn } from '../utils/cn';

export function EpisodeList({ story, initialCount = 8 }: { story: Story; initialCount?: number }) {
  const { isPremium } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? story.episodes : story.episodes.slice(0, initialCount);
  const canRead = (epNumber: number, premium: boolean) => epNumber <= 3 || !premium || isPremium;

  return (
    <section aria-labelledby="episodes-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="episodes-heading" className="font-display text-2xl font-bold text-cream">
          Sehemu
        </h2>
        <p className="text-sm text-mist">
          {story.episodes.length} zote · {story.status}
        </p>
      </div>

      <ol className="mt-5 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {visible.map((ep) => {
          const unlocked = canRead(ep.number, ep.premium);
          return (
            <li key={ep.id}>
              <div
                className={cn(
                  'flex items-center gap-4 px-4 py-4 transition-colors duration-150 ease-kisa hover:bg-surface-raised sm:px-5'
                )}
              >
                <span
                  className={cn(
                    'w-8 shrink-0 font-display text-lg font-bold tabular-nums',
                    unlocked ? 'text-gold' : 'text-dust'
                  )}
                >
                  {String(ep.number).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cream">{ep.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-mist">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" aria-hidden="true" />
                      Dakika {ep.readingMinutes} za kusoma
                    </span>
                    <span className="text-dust">{swahiliDate(ep.publishedAt)}</span>
                  </p>
                </div>

                {unlocked ? (
                  <Link
                    to={`/soma/${story.slug}/${ep.number}`}
                    className="shrink-0 rounded-full border border-line bg-surface-high px-4 py-2 text-[13px] font-semibold text-cream transition-colors duration-150 ease-kisa hover:border-gold/50 hover:text-gold"
                  >
                    Soma
                  </Link>
                ) : (
                  <Link
                    to="/premium"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[13px] font-semibold text-gold transition-colors duration-150 ease-kisa hover:bg-gold/20"
                  >
                    <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Premium
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {story.episodes.length > initialCount && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors duration-150 ease-kisa hover:text-cream"
        >
          {expanded ? 'Onyesha chache' : `Onyesha sehemu zote ${story.episodes.length}`}
          <ChevronDownIcon
            className={cn('h-4 w-4 transition-transform duration-200 ease-kisa', expanded && 'rotate-180')}
          />
        </button>
      )}
    </section>
  );
}