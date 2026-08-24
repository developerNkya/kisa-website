import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StoryGrid } from '../components/StoryGrid';
import { StoryGridSkeleton } from '../components/states/LoadingSkeleton';
import { EmptyState } from '../components/states/EmptyState';
import { supabase } from '../lib/supabase';
import { genres } from '../data/stories';
import { cn } from '../utils/cn';

const sorts = ['Zinazopendwa', 'Mpya', 'Zinazoendelea', 'Zilizokamilika'] as const;
type Sort = (typeof sorts)[number];
type Genre = typeof genres[number];

export function Stories() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<Genre>(
    categoryParam && genres.includes(categoryParam as Genre) 
      ? (categoryParam as Genre) 
      : 'Zote'
  );
  const [sort, setSort] = useState<Sort>('Zinazopendwa');
  const [loading, setLoading] = useState(true);
  const [allStories, setAllStories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('stories')
          .select('*, authors(*)')
          .eq('status', 'published');
          
        if (data) {
          const formatted = data.map((s: any) => ({
            ...s,
            cover: s.cover_url,
            author: s.authors?.name || s.author,
            episodes: Array(s.total_episodes || 1).fill({}),
            genres: s.tags || [], // ✅ Use tags as genres
          }));
          
          console.log('📊 Stories with tags:', formatted.map((s: any) => ({
            title: s.title,
            tags: s.tags,
            genres: s.genres
          })));
          
          setAllStories(formatted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  // Update genre when URL param changes
  useEffect(() => {
    if (categoryParam && genres.includes(categoryParam as Genre)) {
      setGenre(categoryParam as Genre);
    } else if (!categoryParam) {
      setGenre('Zote');
    }
  }, [categoryParam]);

  const results = useMemo(() => {
    let list = allStories;
    
    // ✅ Filter by tags
    if (genre !== 'Zote') {
      list = list.filter((s) => {
        const tags = s.tags || [];
        return tags.includes(genre);
      });
    }
    
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          (s.title || '').toLowerCase().includes(q) ||
          (s.author || '').toLowerCase().includes(q) ||
          (s.tags || []).join(' ').toLowerCase().includes(q)
      );
    }
    
    if (sort === 'Zinazoendelea') list = list.filter((s) => s.story_status === 'Inaendelea');
    if (sort === 'Zilizokamilika') list = list.filter((s) => s.story_status === 'Imekamilika');
    
    const sorted = [...list];
    if (sort === 'Mpya') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      sorted.sort((a, b) => (b.total_reads || 0) - (a.total_reads || 0));
    }
    
    return sorted;
  }, [query, genre, sort, allStories]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
        <header>
          <h1 className="font-display text-3xl font-black text-gray-900 sm:text-[44px]">
            📚 Hadithi
          </h1>
          <p className="mt-2 text-base text-gray-500">Chagua hadithi yako. Soma hadi mwisho.</p>
          {categoryParam && genres.includes(categoryParam as Genre) && (
            <p className="mt-1 text-sm text-[#9B1B3B] font-medium">
              🏷️ Unatazama: {categoryParam}
            </p>
          )}
        </header>

        <div className="mt-7 max-w-xl">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {/* Genres - Horizontal Scroll */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                aria-pressed={genre === g}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-150',
                  genre === g
                    ? 'border-[#9B1B3B] bg-[#9B1B3B] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
                )}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <span className="text-xs uppercase tracking-[0.14em] text-gray-400">Panga:</span>
            <div className="no-scrollbar flex gap-1 overflow-x-auto">
              {sorts.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  aria-pressed={sort === s}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                    sort === s 
                      ? 'bg-[#9B1B3B]/10 text-[#9B1B3B]' 
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="ml-auto hidden shrink-0 text-xs text-gray-400 sm:block">
              {results.length} hadithi
            </span>
          </div>
        </div>

        <div className="mt-9">
          {loading ? (
            <StoryGridSkeleton />
          ) : results.length === 0 ? (
            <div className="py-20">
              <EmptyState
                title="Hakuna hadithi iliyopatikana"
                body="Jaribu neno lingine, au ondoa vichujio ili kuona hadithi zote za KISA."
                ctaLabel="Ona hadithi zote"
                ctaHref="/hadithi"
              />
            </div>
          ) : (
            <StoryGrid stories={results} />
          )}
        </div>
      </div>
    </div>
  );
}