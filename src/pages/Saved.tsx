import React, { useEffect, useState } from 'react';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

interface BookmarkedStory {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  avg_rating: number;
  total_reads: number;
  tags: string[];
  status: string;
  authors?: { name: string } | null;
  categories?: { name: string } | null;
}

export function Saved() {
  const { user } = useAuth();
  const [stories, setStories] = useState<BookmarkedStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('bookmarks')
      .select('story_id, stories(id, slug, title, cover_url, avg_rating, total_reads, tags, status, authors(name), categories(name))')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const list = (data ?? []).map((b: any) => b.stories).filter(Boolean);
        setStories(list);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState title="Ingia kwanza" body="Ingia ili kuona hadithi ulizohifadhi." ctaLabel="Ingia" ctaHref="/ingia" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">Zilizohifadhiwa</h1>
        <p className="mt-2 text-base text-mist">
          {loading ? 'Inapakia...' : stories.length > 0 ? `Hadithi ${stories.length} zinakusubiri.` : 'Hifadhi hadithi ili uzisome baadaye.'}
        </p>
      </header>

      <div className="mt-9">
        {!loading && stories.length === 0 ? (
          <EmptyState
            title="Bado hujahifadhi hadithi yoyote."
            body="Gusa alama ya kuhifadhi kwenye hadithi yoyote, na itaonekana hapa tayari kwa kusoma baadaye."
            ctaLabel="Gundua Hadithi"
            ctaHref="/hadithi"
          />
        ) : (
          <StoryGrid stories={stories as any} />
        )}
      </div>
    </div>
  );
}