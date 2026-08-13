import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useKisa } from '../../contexts/KisaContext';
import { stories, trendingStories } from '../../data/stories';
import { ProgressBar } from '../ui/ProgressBar';
import { StoryRail } from '../StoryRail';

export function ContinueReading() {
  const { user, progress } = useKisa();

  if (!user || progress.length === 0) {
    return (
      <StoryRail
        title="Zinazopendwa sasa"
        blurb="Anza na hadithi ambazo watu wanazizungumza wiki hii."
        stories={trendingStories.slice(0, 6)}
        href="/zinazopendwa" />);


  }

  const items = progress.
  map((p) => ({ progress: p, story: stories.find((s) => s.id === p.storyId) })).
  filter((i) => i.story);

  return (
    <section className="py-10" aria-labelledby="continue-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2 id="continue-heading" className="font-display text-2xl font-bold text-cream sm:text-[28px]">
          Endelea Kusoma
        </h2>
        <p className="mt-1.5 text-sm text-mist">Ulipoishia mara ya mwisho.</p>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {items.map(({ story, progress: p }) =>
          <article
            key={p.storyId}
            className="group flex gap-4 rounded-card border border-line-soft bg-surface p-3 transition-colors duration-150 ease-kisa hover:border-mist/30">
            
              <Link to={`/hadithi/${story!.slug}`} className="shrink-0">
                <img
                src={story!.cover}
                alt={`Jalada la ${story!.title}`}
                loading="lazy"
                className="h-[112px] w-[78px] rounded-lg object-cover" />
              
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-display text-base font-bold text-cream">
                  <Link to={`/hadithi/${story!.slug}`} className="hover:text-gold">
                    {story!.title}
                  </Link>
                </h3>
                <p className="mt-0.5 text-xs text-mist">
                  Sehemu ya {p.episodeNumber} · {story!.genres[0]}
                </p>

                <div className="mt-auto">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-mist">
                    <span>{p.percent}%</span>
                    <span className="text-dust">{p.lastReadAt}</span>
                  </div>
                  <ProgressBar percent={p.percent} label={`Maendeleo ya ${story!.title}`} />
                  <Link
                  to={`/soma/${story!.slug}/${p.episodeNumber}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold transition-colors duration-150 ease-kisa hover:text-cream">
                  
                    Endelea kusoma
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}