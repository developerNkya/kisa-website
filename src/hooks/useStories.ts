import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useStories(filters?: { categorySlug?: string; search?: string; featured?: boolean }) {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        let query = supabase
          .from('stories')
          .select(`
            *,
            authors (id, name, avatar_url),
            categories (id, name, slug)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (filters?.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }
        if (filters?.featured !== undefined) {
          query = query.eq('is_featured', filters.featured);
        }

        const { data, error: err } = await query;
        
        if (err) throw err;
        
        let finalData = data || [];
        if (filters?.categorySlug) {
           finalData = finalData.filter((s: any) => s.categories?.slug === filters.categorySlug);
        }
        
        setStories(finalData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStories();
  }, [filters?.categorySlug, filters?.search, filters?.featured]);

  return { stories, loading, error };
}

export function useStory(slug: string) {
  const [story, setStory] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStory() {
      if (!slug) return;
      try {
        setLoading(true);
        const { data: storyData, error: storyErr } = await supabase
          .from('stories')
          .select('*, authors (id, name, avatar_url), categories (id, name, slug)')
          .eq('slug', slug)
          .single();

        if (storyErr) throw storyErr;
        setStory(storyData);

        if (storyData) {
          const { data: epData, error: epErr } = await supabase
            .from('episodes')
            .select('*')
            .eq('story_id', storyData.id)
            .order('episode_number', { ascending: true });

          if (epErr) throw epErr;
          setEpisodes(epData || []);

          void supabase.rpc('kisa_increment_story_reads', { p_story_id: storyData.id });
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStory();
  }, [slug]);

  return { story, episodes, loading, error };
}
