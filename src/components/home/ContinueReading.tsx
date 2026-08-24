import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

export function ContinueReading() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    async function loadProgress() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reading_progress')
          .select(`
            percent,
            episode_id,
            updated_at,
            stories (id, slug, title, cover_url, tags, price),
            episodes (episode_number, title)
          `)
          .eq('user_id', user?.id)
          .order('updated_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error loading reading progress:', error);
          return;
        }

        if (data) {
          setItems(data.filter((d: any) => d.stories && d.episodes));
        }
      } catch (err) {
        console.error('Error loading reading progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [user]);

  if (!user || items.length === 0) {
    return null;
  }

  const getStoryStatus = (price: number) => {
    if (price === 0) return { label: 'Bure', className: 'bg-green-500/20 text-green-600' };
    return { label: 'Premium', className: 'bg-amber-500/20 text-amber-600' };
  };

  if (loading) {
    return (
      <section className="py-8 bg-white" aria-labelledby="continue-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-4 h-[200px]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white" aria-labelledby="continue-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="continue-heading" className="font-display text-2xl font-bold text-gray-900 sm:text-[28px]">
              📖 Endelea Kusoma
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Ulipoishia mara ya mwisho. Endelea kutoka pale ulipoishia.
            </p>
          </div>
          {items.length > 4 && (
            <Link
              to="/akaunti/progress"
              className="text-sm font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors flex items-center gap-1 shrink-0"
            >
              Ona Zote
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((item, idx) => {
            const story = item.stories;
            const episode = item.episodes;
            const status = getStoryStatus(story?.price || 1000);
            const progressPercent = Math.min(Math.max(item.percent || 0, 0), 100);
            
            return (
              <article
                key={idx}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-[#9B1B3B]/20"
              >
                {/* Cover + Info Row */}
                <div className="flex gap-3">
                  {/* Cover Image */}
                  <Link to={`/hadithi/${story.slug}`} className="shrink-0">
                    {story.cover_url ? (
                      <img
                        src={story.cover_url}
                        alt={`Jalada la ${story.title}`}
                        loading="lazy"
                        className="h-[100px] w-[70px] rounded-lg object-cover border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                    ) : (
                      <div className="h-[100px] w-[70px] rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span className="text-xs font-bold text-gray-400">
                          {story.title?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </Link>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="truncate font-display text-sm font-bold text-gray-900 group-hover:text-[#9B1B3B] transition-colors">
                        <Link to={`/hadithi/${story.slug}`}>
                          {story.title}
                        </Link>
                      </h3>
                    </div>
                    
                    {/* Episode info */}
                    <p className="mt-0.5 text-xs text-gray-500">
                      Sehemu ya {episode.episode_number}
                      {episode.title && ` — ${episode.title}`}
                    </p>
                    
                    {/* Status badge */}
                    <div className="mt-1.5">
                      <span className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                        status.className
                      )}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Maendeleo</span>
                    <span className="font-semibold text-[#9B1B3B]">{progressPercent}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-1.5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#9B1B3B] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  
                  {/* Continue Button */}
                  <Link
                    to={`/soma/${story.slug}/${episode.episode_number}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#9B1B3B] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#C42B53]"
                  >
                    <BookOpenIcon className="h-3.5 w-3.5" />
                    Endelea kusoma
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}