import React, { useEffect, useState } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../utils/cn';

export function BookmarkButton({
  storyId,
  storyTitle,
  variant = 'button',
  className,
}: {
  storyId: string;
  storyTitle: string;
  variant?: 'button' | 'icon';
  className?: string;
}) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('story_id', storyId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, storyId]);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Ingia kwanza ili kuhifadhi hadithi'); return; }

    if (saved) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('story_id', storyId);
      setSaved(false);
      toast.message('Imeondolewa', { description: `${storyTitle} imeondolewa kwenye Zilizohifadhiwa.` });
    } else {
      await (supabase.from('bookmarks') as any).insert({ user_id: user.id, story_id: storyId });
      setSaved(true);
      toast.success('Imehifadhiwa', { description: `${storyTitle} imeongezwa kwenye Zilizohifadhiwa.` });
    }
  };

  if (variant === 'icon') {
    return (
      <button onClick={onClick} aria-label={saved ? `Ondoa ${storyTitle}` : `Hifadhi ${storyTitle}`} aria-pressed={saved} className={cn('grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm transition-colors duration-150 ease-kisa', saved ? 'border-gold/60 bg-ink/70 text-gold' : 'border-line bg-ink/60 text-cream hover:border-mist/60', className)}>
        <BookmarkIcon className={cn('h-4 w-4', saved && 'fill-current')} />
      </button>
    );
  }

  return (
    <button onClick={onClick} aria-pressed={saved} className={cn('inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors duration-150 ease-kisa', saved ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface-high text-cream hover:border-mist/50', className)}>
      <BookmarkIcon className={cn('h-4 w-4', saved && 'fill-current')} />
      {saved ? 'Imehifadhiwa' : 'Hifadhi'}
    </button>
  );
}