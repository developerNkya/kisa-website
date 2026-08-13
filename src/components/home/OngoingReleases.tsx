import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, RadioIcon } from 'lucide-react';
import { ongoingReleases } from '../../data/stories';

export function OngoingReleases() {
  return (
    <section className="py-10" aria-labelledby="ongoing-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="rounded-card border border-line-soft bg-surface p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <RadioIcon className="h-4 w-4 text-wine-bright" aria-hidden="true" />
            <h2
              id="ongoing-heading"
              className="font-display text-xl font-bold text-cream sm:text-2xl">
              
              Inaendelea
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-mist">
            Hadithi zinazotoa sehemu mpya kila wiki. Rudi ujue kinachoendelea.
          </p>

          <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {ongoingReleases.map(({ story, episode, emoji }) =>
            <li key={story.id}>
                <Link
                to={`/hadithi/${story.slug}`}
                className="group flex items-center gap-3 border-b border-line-soft py-3.5 transition-colors duration-150 ease-kisa">
                
                  <span aria-hidden="true" className="text-lg">
                    {emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-cream transition-colors duration-150 ease-kisa group-hover:text-gold">
                      {story.title}
                    </span>
                    <span className="text-xs text-mist">Sehemu ya {episode} imetoka</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-dust transition-transform duration-150 ease-kisa group-hover:translate-x-0.5 group-hover:text-gold" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}