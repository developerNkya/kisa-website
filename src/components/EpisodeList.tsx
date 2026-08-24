import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ClockIcon, LockIcon, UnlockIcon, CheckCircleIcon } from 'lucide-react';
import { Story } from '../types';
import { useAuth } from '../lib/AuthContext';
import { swahiliDate } from '../utils/format';
import { cn } from '../utils/cn';
import { track } from '../lib/pixel'; // ✅ Add this import

interface EpisodeListProps {
  story: Story;
  initialCount?: number;
  onEpisodeClick?: (episodeNumber: number) => void;
}

export function EpisodeList({ story, initialCount = 8, onEpisodeClick }: EpisodeListProps) {
  const { hasPurchasedStory } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? story.episodes : story.episodes.slice(0, initialCount);

  const isPaidStory = (story.price ?? 1000) > 0;
  const isPurchased = hasPurchasedStory(story.id);

  // 🔍 Smart access check
  const canAccessEpisode = (episode: any) => {
    // 1️⃣ PRIMARY RULE: Check episode's is_free field
    if (episode.is_free === true) return true;
    
    // 2️⃣ If story is free (price = 0), all episodes are free
    if (!isPaidStory) return true;
    
    // 3️⃣ If user purchased, all episodes are accessible
    if (isPurchased) return true;
    
    // 4️⃣ Everything else is locked
    return false;
  };

  const handleEpisodeClick = (episode: any) => {
    const accessible = canAccessEpisode(episode);
    
    if (accessible) {
      // ✅ Track free episode click
      track.startReading({
        id: story.id,
        title: story.title,
        episodeNumber: episode.number,
      });
      
      // If click handler provided, use it
      if (onEpisodeClick) {
        onEpisodeClick(episode.number);
      } else {
        // Default behavior - navigate to reader
        window.location.href = `/soma/${story.slug}/${episode.number}`;
      }
    } else {
      // ✅ Track locked episode click
      track.lockedEpisodeClick({
        id: story.id,
        title: story.title,
        episodeNumber: episode.number,
      });
      
      // Locked - trigger payment modal via parent
      if (onEpisodeClick) {
        onEpisodeClick(episode.number);
      }
    }
  };

  // Get episode status label
  const getEpisodeStatus = (episode: any) => {
    const accessible = canAccessEpisode(episode);
    
    if (!accessible) {
      return { label: 'Premium', icon: <LockIcon className="h-3 w-3" />, className: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
    
    if (episode.is_free === true) {
      return { label: 'Bure', icon: <UnlockIcon className="h-3 w-3" />, className: 'bg-green-100 text-green-700 border-green-200' };
    }
    
    if (episode.number <= 3 && isPaidStory) {
      return { label: 'Bure (Sampuli)', icon: <UnlockIcon className="h-3 w-3" />, className: 'bg-green-100 text-green-700 border-green-200' };
    }
    
    if (isPurchased) {
      return { label: 'Imefunguliwa', icon: <CheckCircleIcon className="h-3 w-3" />, className: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    
    return { label: 'Soma', icon: null, className: '' };
  };

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

      <ol className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-150 bg-gray-50/50">
        {visible.map((ep) => {
          const accessible = canAccessEpisode(ep);
          const status = getEpisodeStatus(ep);
          
          return (
            <li key={ep.id}>
              <div
                onClick={() => handleEpisodeClick(ep)}
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 cursor-pointer',
                  accessible ? 'hover:bg-gray-100/60' : 'hover:bg-gray-100/30'
                )}
              >
                <span
                  className={cn(
                    'w-8 shrink-0 font-display text-lg font-bold tabular-nums',
                    accessible ? 'text-[#9B1B3B]' : 'text-gray-400'
                  )}
                >
                  {String(ep.number).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <p className={cn(
                    'truncate text-sm font-semibold',
                    accessible ? 'text-gray-900' : 'text-gray-400'
                  )}>
                    {ep.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
                      Dakika {ep.readingMinutes} za kusoma
                    </span>
                    {/* <span>{swahiliDate(ep.publishedAt)}</span> */}
                  </p>
                </div>

                {/* Status Badge or Action Button */}
                <div className="shrink-0">
                  {accessible ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#9B1B3B]/40 hover:text-[#9B1B3B] transition-colors">
                      Soma
                    </span>
                  ) : (
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold',
                      status.className
                    )}>
                      {status.icon}
                      Nunua
                    </span>
                  )}
                </div>
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