import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, Eye } from 'lucide-react';
import { Story } from '../types';
import { NewBadge, OriginalBadge } from './ui/Badge';
import { BookmarkButton } from './BookmarkButton';
import { cn } from '../utils/cn';
import { compact } from '../utils/format';

interface StoryCardProps {
  story: Story;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export function StoryCard({ story, size = 'md', showDescription = false, className }: StoryCardProps) {
  const episodes = story.episodes || [];
  // ✅ Use optional chaining and fallback
  const coverImage = story.cover_url || story.cover || '';
  const totalReads = story.total_reads || 0;

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <Link
        to={`/hadithi/${story.slug}`}
        className="relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Jalada la hadithi ${story.title}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#9B1B3B]/10 to-[#C9A24A]/10">
              <span className="font-display text-4xl font-black text-[#9B1B3B]/30">
                {story.title?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Badges - Only New and Original */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {story.isNew && <NewBadge />}
          {story.isOriginal && <OriginalBadge />}
        </div>

        {/* Bookmark Button */}
        <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
          <BookmarkButton storyId={story.id} storyTitle={story.title} variant="icon" />
        </div>

        {/* Bottom overlay with metadata - Episodes & Views */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-white/90">
            <span className="inline-flex items-center gap-1">
              <BookOpenIcon className="h-3 w-3 text-[#C9A24A]" aria-hidden="true" />
              {episodes.length} Sehemu
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-300" aria-hidden="true" />
              {compact(totalReads)}
            </span>
          </div>
        </div>
      </Link>

      {/* Text - White theme */}
      <div className="mt-2 flex flex-1 flex-col">
        <h3
          className={cn(
            'font-display font-bold leading-tight text-gray-900',
            size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-base'
          )}
        >
          <Link to={`/hadithi/${story.slug}`} className="transition-colors duration-200 hover:text-[#9B1B3B]">
            {story.title}
          </Link>
        </h3>
        
        <p className="mt-0.5 text-xs text-gray-500">{(story.genres || []).join(' · ')}</p>
        
        {showDescription && story.hook && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
            {story.hook}
          </p>
        )}
        
        <div className="mt-auto" />
      </div>
    </article>
  );
}