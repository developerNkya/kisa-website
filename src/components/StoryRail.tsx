import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { Story } from '../types';
import { StoryCard } from './StoryCard';
import { cn } from '../utils/cn';

interface StoryRailProps {
  title: string;
  blurb?: string;
  stories: Story[];
  href?: string;
  linkLabel?: string;
  tone?: 'default' | 'dark' | 'gold';
  eyebrow?: string;
  className?: string;
}

export function StoryRail({
  title,
  blurb,
  stories,
  href,
  linkLabel = 'Ona zote',
  tone = 'default',
  eyebrow,
  className
}: StoryRailProps) {
  return (
    <section
      className={cn(
        'py-10',
        tone === 'dark' && 'border-y border-line-soft bg-[#0A0809]',
        tone === 'gold' && 'border-y border-gold/15 bg-[#141011]',
        className
      )}
      aria-labelledby={`rail-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            {eyebrow &&
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                {eyebrow}
              </p>
            }
            <h2
              id={`rail-${title.replace(/\s+/g, '-').toLowerCase()}`}
              className="font-display text-2xl font-bold text-cream sm:text-[28px]">
              
              {title}
            </h2>
            {blurb && <p className="mt-1.5 max-w-xl text-sm text-mist">{blurb}</p>}
          </div>
          {href &&
          <Link
            to={href}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-mist transition-colors duration-150 ease-kisa hover:text-gold sm:inline-flex">
            
              {linkLabel}
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          }
        </div>

        <div className="kisa-rail no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {stories.map((story) =>
          <StoryCard
            key={story.id}
            story={story}
            className="w-[44vw] shrink-0 sm:w-[210px] lg:w-[220px]" />

          )}
        </div>

        {href &&
        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold sm:hidden">
          
            {linkLabel}
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        }
      </div>
    </section>);

}