import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, TagIcon, UserIcon } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/states/EmptyState';
import { SearchResultsSkeleton } from '../components/states/LoadingSkeleton';
import { PremiumBadge } from '../components/ui/Badge';
import { authors, genres, stories } from '../data/stories';
import { suggestedSearches } from '../data/notifications';
import { cn } from '../utils/cn';

type Tab = 'Hadithi' | 'Waandishi' | 'Makundi';
const tabs: Tab[] = ['Hadithi', 'Waandishi', 'Makundi'];

export function Search() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('Hadithi');
  const [searching, setSearching] = useState(false);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    if (!q) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = window.setTimeout(() => setSearching(false), 400);
    return () => window.clearTimeout(t);
  }, [q]);

  const storyHits = useMemo(
    () =>
    q ?
    stories.filter(
      (s) =>
      s.title.toLowerCase().includes(q) ||
      s.hook.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q) ||
      s.genres.join(' ').toLowerCase().includes(q) ||
      s.tags.join(' ').toLowerCase().includes(q)
    ) :
    [],
    [q]
  );
  const authorHits = useMemo(
    () => q ? authors.filter((a) => a.name.toLowerCase().includes(q)) : [],
    [q]
  );
  const genreHits = useMemo(
    () => q ? genres.filter((g) => g.toLowerCase().includes(q) && g !== 'Zote') : [],
    [q]
  );

  const counts: Record<Tab, number> = {
    Hadithi: storyHits.length,
    Waandishi: authorHits.length,
    Makundi: genreHits.length
  };
  const total = counts.Hadithi + counts.Waandishi + counts.Makundi;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">Tafuta</h1>
      <p className="mt-2 text-sm text-mist">Hadithi, waandishi na makundi ya KISA.</p>

      <div className="mt-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Tafuta hadithi..." size="lg" autoFocus />
      </div>

      {!q ?
      <section className="mt-9" aria-labelledby="suggested-heading">
          <h2 id="suggested-heading" className="text-xs uppercase tracking-[0.16em] text-dust">
            Yanayotafutwa sasa
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedSearches.map((s) =>
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-cream transition-colors duration-150 ease-kisa hover:border-gold/50 hover:text-gold">
            
                {s}
              </button>
          )}
          </div>

          <h2 className="mt-10 text-xs uppercase tracking-[0.16em] text-dust">Hadithi maarufu</h2>
          <ul className="mt-4 divide-y divide-line-soft">
            {stories.slice(0, 5).map((s, i) =>
          <li key={s.id}>
                <Link to={`/hadithi/${s.slug}`} className="flex items-center gap-4 py-3.5">
                  <span className="w-5 font-display text-lg font-black text-dust">{i + 1}</span>
                  <img src={s.cover} alt="" aria-hidden="true" className="h-14 w-10 rounded object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-cream">{s.title}</span>
                    <span className="text-xs text-mist">{s.genres.join(' · ')}</span>
                  </span>
                </Link>
              </li>
          )}
          </ul>
        </section> :
      searching ?
      <div className="mt-9">
          <SearchResultsSkeleton />
        </div> :
      total === 0 ?
      <div className="mt-9">
          <EmptyState
          title={`Hakuna kitu kwa “${query}”`}
          body="Hatukupata hadithi, mwandishi au kundi linalolingana. Jaribu neno fupi zaidi kama “mapenzi” au “siri”."
          ctaLabel="Ona hadithi zote"
          ctaHref="/hadithi" />
        
        </div> :

      <div className="mt-8">
          <div className="flex gap-1 border-b border-line-soft">
            {tabs.map((t) =>
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              'relative px-4 py-3 text-sm font-semibold transition-colors duration-150 ease-kisa',
              tab === t ? 'text-cream' : 'text-mist hover:text-cream'
            )}>
            
                {t} <span className="text-dust">({counts[t]})</span>
                {tab === t && <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-wine-bright" />}
              </button>
          )}
          </div>

          <div className="mt-6">
            {tab === 'Hadithi' &&
          <ul className="divide-y divide-line-soft">
                {storyHits.map((s) =>
            <li key={s.id}>
                    <Link to={`/hadithi/${s.slug}`} className="flex gap-4 py-4">
                      <img
                  src={s.cover}
                  alt=""
                  aria-hidden="true"
                  className="h-24 w-16 shrink-0 rounded-lg object-cover" />
                
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-display text-base font-bold text-cream">{s.title}</span>
                          {s.premium && <PremiumBadge />}
                        </span>
                        <span className="mt-1 block text-xs text-mist">
                          {s.genres.join(' · ')} · {s.episodes.length} Sehemu
                        </span>
                        <span className="mt-1.5 line-clamp-2 block text-[13px] leading-relaxed text-dust">
                          {s.hook}
                        </span>
                      </span>
                    </Link>
                  </li>
            )}
              </ul>
          }

            {tab === 'Waandishi' &&
          <ul className="grid gap-3 sm:grid-cols-2">
                {authorHits.map((a) =>
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-card border border-line-soft bg-surface p-4">
              
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-wine font-display font-bold text-cream">
                      {a.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold text-cream">{a.name}</span>
                      <span className="flex items-center gap-1.5 text-xs text-mist">
                        <UserIcon className="h-3 w-3" aria-hidden="true" />
                        {a.city} · {a.stories} hadithi
                      </span>
                    </span>
                  </li>
            )}
              </ul>
          }

            {tab === 'Makundi' &&
          <ul className="flex flex-wrap gap-2">
                {genreHits.map((g) =>
            <li key={g}>
                    <Link
                to={`/makundi/${g}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-cream transition-colors duration-150 ease-kisa hover:border-gold/50 hover:text-gold">
                
                      <TagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {g}
                    </Link>
                  </li>
            )}
              </ul>
          }
          </div>
        </div>
      }

      <p className="mt-12 flex items-center gap-2 text-xs text-dust">
        <BookOpenIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Hadithi {stories.length} · Waandishi {authors.length} · Makundi {genres.length - 1}
      </p>
    </div>);

}