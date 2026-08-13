import React from 'react';
import { Story } from '../types';
import { StoryCard } from './StoryCard';
import { cn } from '../utils/cn';

export function StoryGrid({
  stories,
  showDescription = true,
  className




}: {stories: Story[];showDescription?: boolean;className?: string;}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className
      )}>
      
      {stories.map((story) =>
      <StoryCard key={story.id} story={story} showDescription={showDescription} />
      )}
    </div>);

}