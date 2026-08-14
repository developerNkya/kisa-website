import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StoryHero } from '../components/StoryHero';
import { StoryRail } from '../components/StoryRail';
import { ContinueReading } from '../components/home/ContinueReading';
import { OngoingReleases } from '../components/home/OngoingReleases';
import { OriginalsSpotlight } from '../components/home/OriginalsSpotlight';
import { FreeStarter } from '../components/home/FreeStarter';
import { categoryMeta, stories as fallbackStories, trendingStories as fallbackTrending, newStories as fallbackNew } from '../data/stories';

export function Home() {
  const [newStories, setNewStories] = useState<any[]>(fallbackNew);
  const [trendingStories, setTrendingStories] = useState<any[]>(fallbackTrending);
  const [allStories, setAllStories] = useState<any[]>(fallbackStories);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: dbStories, error } = await supabase
          .from('stories')
          .select('*, authors(*), categories(*)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (!error && dbStories && dbStories.length > 0) {
          const formatted = dbStories.map((s: any) => ({
            ...s,
            cover: s.cover_url || '/covers/default.jpg',
            genres: s.categories?.name ? [s.categories.name] : (s.tags || ['Hadithi']),
            episodes: Array(s.total_episodes || 5).fill({}),
          }));
          
          setAllStories(formatted);
          setNewStories(formatted.slice(0, 12));
          
          const trending = [...formatted].sort((a, b) => (b.total_reads || 0) - (a.total_reads || 0)).slice(0, 10);
          setTrendingStories(trending);
        }
      } catch (e) {
        console.error('Error fetching home stories:', e);
      }
    }
    loadData();
  }, []);

  const byGenre = (genre: string) => allStories.filter((s: any) => (s.genres || []).includes(genre)).slice(0, 8);

  return (
    <>
      {/* Top Slider Hero Images */}
      <StoryHero />
      
      <ContinueReading />
      
      {trendingStories.length > 0 && (
        <StoryRail
          title="Zinazopendwa Tanzania"
          blurb="Hadithi ambazo wasomaji hawaziachi."
          stories={trendingStories}
          href="/zinazopendwa"
        />
      )}
      
      <OngoingReleases />
      
      {newStories.length > 0 && (
        <StoryRail
          title="Hadithi Mpya"
          eyebrow="Zimetoka wiki hii"
          stories={newStories}
          href="/mpya"
        />
      )}
      
      {byGenre('Mapenzi').length > 0 && (
        <StoryRail
          title="Mapenzi ❤️"
          blurb={categoryMeta.Mapenzi?.blurb || 'Hadithi za mapenzi na hisia.'}
          stories={byGenre('Mapenzi')}
          href="/makundi/Mapenzi"
        />
      )}
      
      {byGenre('Siri').length > 0 && (
        <StoryRail
          title="Siri & Suspense"
          blurb="Zisome mchana. Au usiku, kama unaweza."
          stories={byGenre('Siri')}
          href="/makundi/Siri"
          tone="dark"
        />
      )}
      
      {byGenre('Drama').length > 0 && (
        <StoryRail
          title="Drama"
          blurb="Familia, uhaini, siri na maamuzi magumu."
          stories={byGenre('Drama')}
          href="/makundi/Drama"
        />
      )}
      
      <OriginalsSpotlight />
      <FreeStarter />
    </>
  );
}