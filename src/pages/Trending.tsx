import React, { useEffect, useState } from 'react';
import { StoryGrid } from '../components/StoryGrid';
import { supabase } from '../lib/supabase';

export function Trending() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('stories')
      .select('*, authors(name), categories(name, slug)')
      .eq('status', 'published')
      .order('total_reads', { ascending: false })
      .limit(24)
      .then(({ data }) => {
        setStories(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header>
        <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">Zinazopendwa Tanzania</h1>
        <p className="mt-2 max-w-xl text-sm text-mist">
          Hadithi zenye wasomaji wengi wiki hii, kwa mujibu wa sehemu zilizosomwa.
        </p>
      </header>
      <div className="mt-9">
        {loading ? <p className="text-mist">Inapakia...</p> : <StoryGrid stories={stories} />}
      </div>
    </div>
  );
}