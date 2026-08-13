import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useKisa } from '../contexts/KisaContext';
import { cn } from '../utils/cn';

export function BookmarkButton({
  storyId,
  storyTitle,
  variant = 'button',
  className





}: {storyId: string;storyTitle: string;variant?: 'button' | 'icon';className?: string;}) {
  const { isSaved, toggleSaved } = useKisa();
  const saved = isSaved(storyId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSaved(storyId);
    toast[nowSaved ? 'success' : 'message'](
      nowSaved ? 'Imehifadhiwa' : 'Imeondolewa',
      { description: `${storyTitle} ${nowSaved ? 'imeongezwa kwenye Zilizohifadhiwa.' : 'imeondolewa kwenye Zilizohifadhiwa.'}` }
    );
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        aria-label={saved ? `Ondoa ${storyTitle}` : `Hifadhi ${storyTitle}`}
        aria-pressed={saved}
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm transition-colors duration-150 ease-kisa',
          saved ?
          'border-gold/60 bg-ink/70 text-gold' :
          'border-line bg-ink/60 text-cream hover:border-mist/60',
          className
        )}>
        
        <BookmarkIcon className={cn('h-4 w-4', saved && 'fill-current')} />
      </button>);

  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors duration-150 ease-kisa',
        saved ?
        'border-gold/60 bg-gold/10 text-gold' :
        'border-line bg-surface-high text-cream hover:border-mist/50',
        className
      )}>
      
      <BookmarkIcon className={cn('h-4 w-4', saved && 'fill-current')} />
      {saved ? 'Imehifadhiwa' : 'Hifadhi'}
    </button>);

}