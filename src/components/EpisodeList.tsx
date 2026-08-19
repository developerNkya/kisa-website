import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ClockIcon, LockIcon } from 'lucide-react';
import { Story } from '../types';
import { useAuth } from '../lib/AuthContext';
import { swahiliDate } from '../utils/format';
import { cn } from '../utils/cn';

export function EpisodeList({ story, initialCount = 8 }: { story: Story; initialCount?: number }) {
  const { hasPurchasedStory } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? story.episodes : story.episodes.slice(0, initialCount);

  const isPaidStory = (story.price ?? 1000) > 0;
  const isPurchased = hasPurchasedStory(story.id);

  // Episode is unlocked if: free episode (1–3), story has no price, or user purchased the story
  const canRead = (epNumber: number) => epNumber <= 3 || !isPaidStory || isPurchased;

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

      {isPaidStory && !isPurchased && (
        <p className="mt-2 text-xs text-gold/80">
          🔓 Sehemu 1–3 ni bure. Sehemu 4 na zaidi zinahitaji ununuzi wa TZS {(story.price || 1000).toLocaleString()}.
        </p>
      )}

      <ol className="mt-5 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
        {visible.map((ep) => {
          const unlocked = canRead(ep.number);
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
                  <p className={cn('truncate font-semibold', unlocked ? 'text-cream' : 'text-mist/70')}>{ep.title}</p>
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
                    {ep.number <= 3 ? 'Soma (Bure)' : 'Soma'}
                  </Link>
                ) : (
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[13px] font-semibold text-gold/70"
                  >
                    <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Nunua
                  </span>
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