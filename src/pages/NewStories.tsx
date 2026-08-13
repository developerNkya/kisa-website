import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { StoryGrid } from '../components/StoryGrid';
import { NewBadge } from '../components/ui/Badge';
import { newStories, ongoingReleases, stories } from '../data/stories';
import { swahiliDate } from '../utils/format';

export function NewStories() {
  const recent = [...stories].sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">Hadithi Mpya</h1>
        <p className="mt-2 text-base text-mist">
          Zilizotolewa hivi karibuni, na sehemu mpya zilizotoka wiki hii.
        </p>
      </header>

      <section className="mt-10" aria-labelledby="fresh-episodes">
        <h2 id="fresh-episodes" className="font-display text-xl font-bold text-cream">
          Sehemu mpya zilizotoka
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ongoingReleases.map(({ story, episode }) =>
          <li key={story.id}>
              <Link
              to={`/soma/${story.slug}/${episode}`}
              className="group flex items-center gap-4 rounded-card border border-line-soft bg-surface p-3.5 transition-colors duration-150 ease-kisa hover:border-mist/30">
              
                <img
                src={story.cover}
                alt=""
                aria-hidden="true"
                className="h-16 w-11 rounded object-cover" />
              
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-cream group-hover:text-gold">
                    {story.title}
                  </span>
                  <span className="text-xs text-mist">Sehemu ya {episode} · {story.genres[0]}</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-dust group-hover:text-gold" />
              </Link>
            </li>
          )}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="new-stories-heading">
        <div className="flex items-center gap-3">
          <h2 id="new-stories-heading" className="font-display text-xl font-bold text-cream">
            Hadithi mpya kabisa
          </h2>
          <NewBadge />
        </div>
        <ul className="mt-4 space-y-2 text-sm text-mist">
          {newStories.map((s) =>
          <li key={s.id}>
              <span className="font-medium text-cream">{s.title}</span> · imetolewa{' '}
              {swahiliDate(s.releasedAt)}
            </li>
          )}
        </ul>
        <div className="mt-7">
          <StoryGrid stories={recent} />
        </div>
      </section>
    </div>);

}