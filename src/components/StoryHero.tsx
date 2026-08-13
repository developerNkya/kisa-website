import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, ClockIcon, PlayIcon, StarIcon } from 'lucide-react';
import { Story } from '../types';
import { ButtonLink } from './ui/Button';
import { FreeBadge, OriginalBadge, PremiumBadge } from './ui/Badge';
import { BookmarkButton } from './BookmarkButton';
import { readingLabel, totalMinutes } from '../utils/format';

export function StoryHero({ story, compact = false }: {story: Story;compact?: boolean;}) {
  const minutes = totalMinutes(story.episodes.map((e) => e.readingMinutes));

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      aria-labelledby={`hero-${story.slug}`}>
      
      <div className="absolute inset-0">
        <img
          src={story.cover}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[50%_28%]" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      </div>

      <div
        className={`relative mx-auto flex max-w-[1400px] flex-col justify-end px-4 sm:px-6 lg:px-10 ${
        compact ? 'min-h-[52vh] py-14' : 'min-h-[78vh] py-16 lg:min-h-[86vh]'}`
        }>
        
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl">
          
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {story.isOriginal && <OriginalBadge />}
            {story.premium ? <PremiumBadge /> : <FreeBadge />}
            <span className="text-xs font-medium text-mist">{story.genres.join(' · ')}</span>
          </div>

          <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {story.title}
          </p>

          <h1
            id={`hero-${story.slug}`}
            className="font-display text-[32px] font-black leading-[1.05] text-cream sm:text-5xl lg:text-[58px]">
            
            {story.hook}
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base">
            {story.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/85">
            <span className="inline-flex items-center gap-1.5">
              <BookOpenIcon className="h-4 w-4 text-gold" aria-hidden="true" />
              {story.episodes.length} Sehemu
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-gold" aria-hidden="true" />
              {readingLabel(minutes)} za kusoma
            </span>
            <span className="inline-flex items-center gap-1.5">
              <StarIcon className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
              {story.rating}
            </span>
            <span className="text-mist">{story.status}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to={`/soma/${story.slug}/1`} size="lg">
              <PlayIcon className="h-4 w-4 fill-current" />
              Soma sasa
            </ButtonLink>
            <ButtonLink to={`/hadithi/${story.slug}`} variant="secondary" size="lg">
              Anza Sehemu ya 1
            </ButtonLink>
            <BookmarkButton storyId={story.id} storyTitle={story.title} />
          </div>
        </motion.div>
      </div>
    </section>);

}