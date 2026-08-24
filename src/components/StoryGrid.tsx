import React from 'react';
import { Story } from '../types';
import { StoryCard } from './StoryCard';
import { cn } from '../utils/cn';

export function StoryGrid({
  stories,
  showDescription = true,
  className,
}: {
  stories: Story[];
  showDescription?: boolean;
  className?: string;
}) {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} showDescription={showDescription} />
      ))}
    </div>
  );
}