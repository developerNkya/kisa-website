import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ClockIcon } from 'lucide-react';
import { Story } from '../types';
import { NewBadge, OriginalBadge, PremiumBadge } from './ui/Badge';
import { BookmarkButton } from './BookmarkButton';
import { cn } from '../utils/cn';
import { readingLabel, totalMinutes } from '../utils/format';

interface StoryCardProps {
  story: Story;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export function StoryCard({ story, size = 'md', showDescription = false, className }: StoryCardProps) {
  const episodes = story.episodes || [];
  const minutes = totalMinutes(episodes.map((e) => e.readingMinutes || 5));

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <Link
        to={`/hadithi/${story.slug}`}
        className="relative block overflow-hidden rounded-card border border-line-soft bg-surface"
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={story.cover}
            alt={`Jalada la hadithi ${story.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 ease-kisa group-hover:scale-[1.04]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-90" />

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {story.isNew && <NewBadge />}
          {story.isOriginal && <OriginalBadge />}
          {story.premium && !story.isOriginal && <PremiumBadge />}
        </div>

        <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-150 ease-kisa group-hover:opacity-100 focus-within:opacity-100">
          <BookmarkButton storyId={story.id} storyTitle={story.title} variant="icon" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-cream/80">
            <span className="inline-flex items-center gap-1">
              <BookOpenIcon className="h-3 w-3 text-gold" aria-hidden="true" />
              {episodes.length} Sehemu
            </span>
            <span aria-hidden="true" className="text-dust">·</span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3 w-3" aria-hidden="true" />
              {readingLabel(minutes)}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <h3
          className={cn(
            'font-display font-bold leading-tight text-cream',
            size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-base'
          )}
        >
          <Link to={`/hadithi/${story.slug}`} className="transition-colors duration-150 ease-kisa hover:text-gold">
            {story.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-mist">{(story.genres || []).join(' · ')}</p>
        {showDescription && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-dust">{story.hook}</p>
        )}
        <div className="mt-auto" />
      </div>
    </article>
  );
}