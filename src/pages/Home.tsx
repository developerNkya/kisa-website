import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ContinueReading } from '../components/home/ContinueReading';
import { useAuth } from '../lib/AuthContext';
import { ArrowRightIcon, Loader2, Eye } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catsRes, storiesRes] = await Promise.all([
          supabase.from('categories').select('id, name, slug').order('name'),
          supabase
            .from('stories')
            .select('id, slug, title, cover_url, hook, price, total_reads, category_id, authors(name)')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(200),
        ]);

        const stories: any[] = storiesRes.data || [];
        const categories: any[] = catsRes.data || [];

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
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B1B3B]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 space-y-12">
      {/* Continue reading — only if logged in */}
      {user && <ContinueReading />}

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
  subtitle?: string;
  stories: StoryCard[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <section className="space-y-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 text-sm font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors shrink-0 group"
        >
          <span>{viewAllLabel}</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Horizontal scrolling card row */}
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 scroll-smooth">
        {stories.map((story) => (
          <StoryThumb key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}

/* ── Story thumbnail card ─────────────────────────────────────────────────── */
function StoryThumb({ story }: { story: StoryCard }) {
  return (
    <Link
      to={`/hadithi/${story.slug}`}
      className="group flex w-[140px] shrink-0 flex-col sm:w-[160px]"
    >
      {/* Cover */}
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
              {story.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Views badge */}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          <Eye className="w-3 h-3 text-gray-300" />
          {compact(story.total_reads || 0)}
        </span>
      </div>

      {/* Text */}
      <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 group-hover:text-[#9B1B3B] transition-colors duration-200">
        {story.title}
      </p>
      {story.authors?.name && (
        <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
          {story.authors.name}
        </p>
      )}
    </Link>
  );
}