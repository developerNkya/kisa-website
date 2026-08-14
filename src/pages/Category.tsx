import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { supabase } from '../lib/supabase';

export function Category() {
  const { name } = useParams<{ name: string }>();
  const [stories, setStories] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; description: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    async function load() {
      setLoading(true);
      const { data: cat } = await supabase
        .from('categories')
        .select('name, description')
        .eq('slug', name!)
        .maybeSingle();
      setCategoryInfo(cat ?? null);

      const { data: storyData } = await supabase
        .from('stories')
        .select('*, authors(name), categories(name, slug)')
        .eq('status', 'published')
        .eq('categories.slug', name!)
        .order('total_reads', { ascending: false });
      setStories(storyData ?? []);
      setLoading(false);
    }
    load();
  }, [name]);

  if (!loading && !categoryInfo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState title="Kundi hili halipo" body="Hakikisha jina la kundi. Unaweza kuona makundi yote yaliyopo kwenye ukurasa wa Makundi." ctaLabel="Ona makundi" ctaHref="/makundi" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">
          {categoryInfo?.name ?? ''}
        </h1>
        {categoryInfo?.description && (
          <p className="mt-2 text-base text-mist">{categoryInfo.description}</p>
        )}
      </header>
      <div className="mt-9">
        {loading ? (
          <p className="text-mist">Inapakia...</p>
        ) : stories.length === 0 ? (
          <EmptyState title="Hakuna hadithi" body="Hakuna hadithi katika kundi hili bado." ctaLabel="Ona hadithi zote" ctaHref="/hadithi" />
        ) : (
          <StoryGrid stories={stories} />
        )}
      </div>
    </div>
  );
}