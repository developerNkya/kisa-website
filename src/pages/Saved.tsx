import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, Eye, Trash2Icon, BookmarkIcon } from 'lucide-react';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { compact } from '../utils/format';
import { cn } from '../utils/cn';

interface BookmarkedStory {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  avg_rating: number;
  total_reads: number;
  tags: string[];
  status: string;
  price: number;
  episodes?: any[];
  authors?: { name: string } | null;
  categories?: { name: string } | null;
  bookmarked_at?: string;
}

export function Saved() {
  const { user } = useAuth();
  const [stories, setStories] = useState<BookmarkedStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { 
      setLoading(false); 
      return; 
    }
    
    async function loadBookmarks() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select(`
            story_id,
            created_at,
            stories(
              id, 
              slug, 
              title, 
              cover_url, 
              avg_rating, 
              total_reads, 
              tags, 
              status, 
              price,
              episodes(count),
              authors(name),
              categories(name)
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const list = (data ?? [])
          .map((b: any) => ({
            ...b.stories,
            episodes: b.stories?.episodes || [],
            bookmarked_at: b.created_at
          }))
          .filter(Boolean);
        
        setStories(list);
      } catch (err) {
        console.error('Error loading bookmarks:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadBookmarks();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 bg-white min-h-screen">
        <EmptyState 
          title="Ingia kwanza" 
          body="Ingia ili kuona hadithi ulizohifadhi." 
          ctaLabel="Ingia" 
          ctaHref="/ingia" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-[28px]">
              📚 Zilizohifadhiwa
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {loading 
                ? 'Inapakia...' 
                : stories.length > 0 
                  ? `Hadithi ${stories.length} zinakusubiri.` 
                  : 'Hifadhi hadithi ili uzisome baadaye.'}
            </p>
          </div>
          {stories.length > 0 && (
            <Link
              to="/hadithi"
              className="text-sm font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors flex items-center gap-1"
            >
              zote
              <span className="text-lg">→</span>
            </Link>
          )}
        </header>

        {loading ? (
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-[140px] shrink-0 animate-pulse">
                <div className="aspect-[2/3] w-full rounded-xl bg-gray-200"></div>
                <div className="mt-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mt-1 h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="Bado hujahifadhi hadithi yoyote."
              body="Gusa alama ya kuhifadhi kwenye hadithi yoyote, na itaonekana hapa tayari kwa kusoma baadaye."
              ctaLabel="Gundua Hadithi"
              ctaHref="/hadithi"
            />
          </div>
        ) : (
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            {stories.map((story) => {
              const episodeCount = story.episodes?.length || 0;
              
              return (
                <div
                  key={story.id}
                  className="group relative w-[140px] shrink-0 sm:w-[160px]"
                >
                  <Link to={`/hadithi/${story.slug}`}>
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      {story.cover_url ? (
                        <img
                          src={story.cover_url}
                          alt={`Jalada la ${story.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#9B1B3B]/10 to-[#C9A24A]/10">
                          <span className="font-display text-3xl font-black text-[#9B1B3B]/30">
                            {story.title?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}

                      {/* Bottom overlay with metadata - Episodes & Views */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5">
                        <div className="flex items-center justify-between text-[10px] font-medium text-white/90">
                          <span className="inline-flex items-center gap-1">
                            <BookOpenIcon className="h-3 w-3 text-[#C9A24A]" aria-hidden="true" />
                            {episodeCount} Sehemu
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3 w-3 text-gray-300" aria-hidden="true" />
                            {compact(story.total_reads || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 group-hover:text-[#9B1B3B] transition-colors duration-200">
                      {story.title}
                    </p>
                    {story.authors?.name && (
                      <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
                        {story.authors.name}
                      </p>
                    )}
                  </Link>

                  {/* Remove Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle remove bookmark
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Ondoa kwenye zilizohifadhiwa"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}