import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StoryHero } from '../components/StoryHero';
import { StoryRail } from '../components/StoryRail';
import { ContinueReading } from '../components/home/ContinueReading';
import { OngoingReleases } from '../components/home/OngoingReleases';
import { OriginalsSpotlight } from '../components/home/OriginalsSpotlight';
import { FreeStarter } from '../components/home/FreeStarter';
import { categoryMeta } from '../data/stories'; // keeping metadata for categories

export function Home() {
  const [featuredStory, setFeaturedStory] = useState<any>(null);
  const [newStories, setNewStories] = useState<any[]>([]);
  const [trendingStories, setTrendingStories] = useState<any[]>([]);
  const [allStories, setAllStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: stories } = await supabase
          .from('stories')
          .select('*, authors(*)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (stories) {
          const formatted = stories.map((s: any) => ({
            ...s,
            cover: s.cover_url, // map to component props
            episodes: Array(s.total_episodes || 5).fill({}), // Mock for component if needed
          }));
          
          setAllStories(formatted);
          
          // Featured
          const featured = formatted.find((s: any) => s.is_featured);
          setFeaturedStory(featured || formatted[0]);
          
          // New
          setNewStories(formatted.slice(0, 12));
          
          // Trending (Sort by reads or a mock trending if reads aren't available)
          const trending = [...formatted].sort((a, b) => (b.reads || 0) - (a.reads || 0)).slice(0, 10);
          setTrendingStories(trending);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-mist">Inapakia...</div>;

  const byGenre = (genre: string) => allStories.filter((s: any) => (s.genres || []).includes(genre)).slice(0, 8);

  return (
    <>
      {featuredStory && <StoryHero />}
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
          blurb={categoryMeta.Mapenzi.blurb}
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