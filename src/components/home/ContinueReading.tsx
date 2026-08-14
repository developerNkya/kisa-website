import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { ProgressBar } from '../ui/ProgressBar';

export function ContinueReading() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadProgress() {
      const { data } = await supabase
        .from('reading_progress')
        .select(`
          percent,
          episode_id,
          updated_at,
          stories (id, slug, title, cover_url, tags),
          episodes (episode_number, title)
        `)
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (data) {
        setItems(data.filter((d: any) => d.stories && d.episodes));
      }
    }
    loadProgress();
  }, [user]);

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <section className="py-10" aria-labelledby="continue-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2 id="continue-heading" className="font-display text-2xl font-bold text-cream sm:text-[28px]">
          Endelea Kusoma
        </h2>
        <p className="mt-1.5 text-sm text-mist">Ulipoishia mara ya mwisho.</p>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {items.map((item, idx) => {
            const story = item.stories;
            const episode = item.episodes;
            return (
              <article
                key={idx}
                className="group flex gap-4 rounded-card border border-line-soft bg-surface p-3 transition-colors duration-150 ease-kisa hover:border-mist/30"
              >
                <Link to={`/hadithi/${story.slug}`} className="shrink-0">
                  <img
                    src={story.cover_url || ''}
                    alt={`Jalada la ${story.title}`}
                    loading="lazy"
                    className="h-[112px] w-[78px] rounded-lg object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate font-display text-base font-bold text-cream">
                    <Link to={`/hadithi/${story.slug}`} className="hover:text-gold">
                      {story.title}
                    </Link>
                  </h3>
                  <p className="mt-0.5 text-xs text-mist">
                    Sehemu ya {episode.episode_number}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-mist">
                      <span>{item.percent}%</span>
                    </div>
                    <ProgressBar percent={item.percent} label={`Maendeleo ya ${story.title}`} />
                    <Link
                      to={`/soma/${story.slug}/${episode.episode_number}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold transition-colors duration-150 ease-kisa hover:text-cream"
                    >
                      Endelea kusoma
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}