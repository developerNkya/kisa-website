import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { categoryMeta, stories } from '../data/stories';

export function Categories() {
  const entries = Object.entries(categoryMeta);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">Makundi</h1>
        <p className="mt-2 text-base text-mist">
          Chagua hisia unayoitaka leo — mapenzi, siri, drama au safari.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, meta]) => {
          const cover = stories.find((s) => s.id === meta.storyIds[0])?.cover;
          return (
            <Link
              key={key}
              to={`/makundi/${key}`}
              className="group relative overflow-hidden rounded-card border border-line-soft">
              
              <img
                src={cover}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-300 ease-kisa group-hover:scale-[1.04]" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-xl font-bold text-cream">{meta.title}</h2>
                <p className="mt-1 line-clamp-2 text-[13px] text-mist">{meta.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                  {meta.storyIds.length} hadithi
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>);

        })}
      </div>
    </div>);

}