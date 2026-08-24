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
    <section aria-labelledby="episodes-heading" className="bg-white">
      <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-3">
        <h2 id="episodes-heading" className="font-display text-xl font-bold text-gray-900">
          Sehemu
        </h2>
        <p className="text-xs text-gray-500">
          {story.episodes.length} zote · {story.status}
        </p>
      </div>

      {/* {isPaidStory && !isPurchased && (
        <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3.5 py-2">
          🔒 Sehemu 1–3 ni bure. Sehemu ya 4 na zaidi zinahitaji ununuzi wa TZS {(story.price || 1000).toLocaleString()}.
        </p>
      )} */}

      <ol className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-150 bg-gray-50/50">
        {visible.map((ep) => {
          const unlocked = canRead(ep.number);
          return (
            <li key={ep.id}>
              <div
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-gray-100/60 sm:px-5'
                )}
              >
                <span
                  className={cn(
                    'w-8 shrink-0 font-display text-lg font-bold tabular-nums',
                    unlocked ? 'text-[#9B1B3B]' : 'text-gray-400'
                  )}
                >
                  {String(ep.number).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm font-semibold', unlocked ? 'text-gray-900' : 'text-gray-400')}>{ep.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
                      Dakika {ep.readingMinutes} za kusoma
                    </span>
                    <span>{swahiliDate(ep.publishedAt)}</span>
                  </p>
                </div>

                {unlocked ? (
                  <Link
                    to={`/soma/${story.slug}/${ep.number}`}
                    className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#9B1B3B]/40 hover:text-[#9B1B3B] transition-colors"
                  >
                    {ep.number <= 3 ? 'Soma' : 'Soma'}
                  </Link>
                ) : (
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700"
                  >
                    <LockIcon className="h-3 w-3" aria-hidden="true" />
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
          className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-[#9B1B3B] hover:text-[#C42B53] transition-colors"
        >
          {expanded ? 'Onyesha chache' : `Onyesha sehemu zote ${story.episodes.length}`}
          <ChevronDownIcon
            className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      )}
    </section>
  );
}