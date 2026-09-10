import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ContinueReading } from '../components/home/ContinueReading';
import { useAuth } from '../lib/AuthContext';
import { ArrowRightIcon, Loader2, Eye, ShoppingBag, BookOpen } from 'lucide-react';
import { compact } from '../utils/format';

interface StoryCard {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  hook: string | null;
  authors?: { name: string };
  price?: number;
  total_reads?: number;
}

interface CategoryShelf {
  id: string;
  name: string;
  slug: string;
  stories: StoryCard[];
}

export function Home() {
  const { user } = useAuth();
  const [shelves, setShelves] = useState<CategoryShelf[]>([]);
  const [trending, setTrending] = useState<StoryCard[]>([]);
  const [purchasedStories, setPurchasedStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const catsRes = await supabase.from('categories').select('id, name, slug').order('name');
        const storiesRes = await supabase
          .from('stories')
          .select('id, slug, title, cover_url, hook, price, total_reads, category_id, authors(name)')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(200);

        const purchasesRes = user 
          ? await supabase
              .from('story_purchases')
              .select('*, stories(*, authors(name))')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
          : null;
        const stories: any[] = storiesRes.data || [];
        const categories: any[] = catsRes.data || [];

        if (purchasesRes?.data) {
          const list = purchasesRes.data
            .filter((p: any) => p.stories)
            .map((p: any) => ({
              ...p.stories,
              cover_url: p.stories.cover_url || '/covers/default.jpg',
            }));
          setPurchasedStories(list);
        }

        // Build shelves grouped by category
        const built: CategoryShelf[] = categories
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            stories: stories
              .filter((s) => s.category_id === cat.id)
              .slice(0, 10),
          }))
          .filter((shelf) => shelf.stories.length > 0);

        setShelves(built);

        // Trending = top by reads
        const top = [...stories]
          .sort((a, b) => (b.total_reads || 0) - (a.total_reads || 0))
          .slice(0, 10);
        setTrending(top);
      } catch (e) {
        console.error('Home load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B1B3B]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 space-y-10">
      {/* Logged in User Section — Hadithi Zangu */}
      {user && (
        <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
                <ShoppingBag className="w-6 h-6 text-[#9B1B3B]" />
                Hadithi Zangu ({purchasedStories.length})
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Hadithi zote ulizofungua. Bofya hadithi yoyote uendelee kusoma sehemu zote.
              </p>
            </div>
          </div>

          {purchasedStories.length > 0 ? (
            <div className="no-scrollbar kisa-rail flex gap-4 overflow-x-auto pb-4 pt-1">
              {purchasedStories.map((story) => (
                <div key={story.id} className="w-[140px] shrink-0 sm:w-[170px]">
                  <Link
                    to={`/hadithi/${story.slug}`}
                    className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
                      {story.cover_url ? (
                        <img
                          src={story.cover_url}
                          alt={story.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#9B1B3B]/10">
                          <span className="font-display text-3xl font-black text-[#9B1B3B]/40">
                            {story.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Purchase badge */}
                      <div className="absolute top-2 left-2 rounded-md bg-emerald-600/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        Imelipiwa ✓
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h3 className="line-clamp-1 font-display text-xs font-bold text-gray-900 group-hover:text-[#9B1B3B] sm:text-sm">
                        {story.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                        {story.authors?.name || 'KISA Author'}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-gray-200/80 p-6 text-center">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-gray-900 text-sm">Bado huna hadithi uliyolipia.</p>
              <p className="text-xs text-gray-500 mt-1">
                Lipa kupitia link ya malipo uliyopewa au chagua hadithi hapa chini uanze kusoma.
              </p>
            </div>
          )}

          {/* Continue reading strip */}
          <ContinueReading />
        </section>
      )}

      {/* Trending shelf */}
      {trending.length > 0 && (
        <Shelf
          title="🔥 Zinazosomwa Sana"
          subtitle="Hadithi zinazovuma kwa sasa"
          stories={trending}
          viewAllHref="/hadithi"
          viewAllLabel="Ona Zote"
        />
      )}

      {/* Category shelves */}
      {shelves.map((shelf) => (
        <Shelf
          key={shelf.id}
          title={shelf.name}
          subtitle={`Hadithi za ${shelf.name}`}
          stories={shelf.stories}
          viewAllHref={`/hadithi?category=${encodeURIComponent(shelf.name)}`}
          viewAllLabel="Ona Zote"
        />
      ))}

      {shelves.length === 0 && !loading && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg font-semibold">Hakuna hadithi kwa sasa.</p>
          <p className="mt-2 text-sm">Tafadhali angalia tena baadaye.</p>
        </div>
      )}
    </div>
  );
}

/* ── Story shelf row ──────────────────────────────────────────────────────── */
function Shelf({
  title,
  subtitle,
  stories,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  subtitle: string;
  stories: StoryCard[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="font-display text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
            {title}
          </h2>
          <p className="text-xs text-gray-500 sm:text-sm">{subtitle}</p>
        </div>
        <Link
          to={viewAllHref}
          className="group inline-flex items-center gap-1 text-xs font-bold text-[#9B1B3B] transition-colors hover:text-[#C42B53] sm:text-sm"
        >
          {viewAllLabel}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="no-scrollbar kisa-rail flex gap-4 overflow-x-auto pb-4 pt-1">
        {stories.map((story) => (
          <div key={story.id} className="w-[140px] shrink-0 sm:w-[170px]">
            <Link
              to={`/hadithi/${story.slug}`}
              className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
                {story.cover_url ? (
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <span className="font-display text-2xl font-black text-gray-300">
                      {story.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Views count badge */}
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-300" />
                  {compact(story.total_reads || 0)}
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-1 font-display text-xs font-bold text-gray-900 group-hover:text-[#9B1B3B] sm:text-sm">
                  {story.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                  {story.authors?.name || 'KISA Author'}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}