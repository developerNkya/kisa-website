import React, { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { StoryGrid } from '../components/StoryGrid';
import { StoryGridSkeleton } from '../components/states/LoadingSkeleton';
import { EmptyState } from '../components/states/EmptyState';
import { genres, stories } from '../data/stories';
import { cn } from '../utils/cn';
import { Story } from '../types';

const sorts = ['Zinazopendwa', 'Mpya', 'Zinazoendelea', 'Zilizokamilika'] as const;
type Sort = (typeof sorts)[number];

export function Stories() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string>('Zote');
  const [sort, setSort] = useState<Sort>('Zinazopendwa');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    let list: Story[] = stories;
    if (genre !== 'Zote') list = list.filter((s) => s.genres.includes(genre as Story['genres'][number]));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.genres.join(' ').toLowerCase().includes(q)
      );
    }
    if (sort === 'Zinazoendelea') list = list.filter((s) => s.status === 'Inaendelea');
    if (sort === 'Zilizokamilika') list = list.filter((s) => s.status === 'Imekamilika');
    const sorted = [...list];
    if (sort === 'Mpya') sorted.sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));else
    sorted.sort((a, b) => b.reads - a.reads);
    return sorted;
  }, [query, genre, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">Hadithi</h1>
        <p className="mt-2 text-base text-mist">Chagua hadithi yako. Soma hadi mwisho.</p>
      </header>

      <div className="mt-7 max-w-xl">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {genres.map((g) =>
          <button
            key={g}
            onClick={() => setGenre(g)}
            aria-pressed={genre === g}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ease-kisa',
              genre === g ?
              'border-wine bg-wine text-cream' :
              'border-line bg-surface text-mist hover:border-mist/40 hover:text-cream'
            )}>
            
              {g}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-line-soft pt-4">
          <span className="text-xs uppercase tracking-[0.14em] text-dust">Panga:</span>
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {sorts.map((s) =>
            <button
              key={s}
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-kisa',
                sort === s ? 'bg-surface-high text-gold' : 'text-mist hover:text-cream'
              )}>
              
                {s}
              </button>
            )}
          </div>
          <span className="ml-auto hidden shrink-0 text-xs text-dust sm:block">
            {results.length} hadithi
          </span>
        </div>
      </div>

      <div className="mt-9">
        {loading ?
        <StoryGridSkeleton /> :
        results.length === 0 ?
        <EmptyState
          title="Hakuna hadithi iliyopatikana"
          body="Jaribu neno lingine, au ondoa vichujio ili kuona hadithi zote za KISA."
          ctaLabel="Ona hadithi zote"
          ctaHref="/hadithi" /> :


        <StoryGrid stories={results} />
        }
      </div>
    </div>);

}