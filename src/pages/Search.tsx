import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, TagIcon, UserIcon } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/states/EmptyState';
import { SearchResultsSkeleton } from '../components/states/LoadingSkeleton';
import { genres } from '../data/stories';
import { suggestedSearches } from '../data/notifications';
import { supabase } from '../lib/supabase';
import { cn } from '../utils/cn';

type Tab = 'Hadithi' | 'Waandishi' | 'Makundi';
const tabs: Tab[] = ['Hadithi', 'Waandishi', 'Makundi'];

export function Search() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('Hadithi');
  const [searching, setSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [storyHits, setStoryHits] = useState<any[]>([]);
  const [authorHits, setAuthorHits] = useState<any[]>([]);
  const [genreHits, setGenreHits] = useState<string[]>([]);
  const [popularStories, setPopularStories] = useState<any[]>([]);

  // Debounce the query
  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  // Initial load of popular stories
  useEffect(() => {
    async function loadPopular() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('status', 'published')
        .order('total_reads', { ascending: false })
        .limit(5);
      if (data) setPopularStories(data);
    }
    loadPopular();
  }, []);

  // Perform search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setStoryHits([]);
      setAuthorHits([]);
      setGenreHits([]);
      setSearching(false);
      return;
    }
    
    async function performSearch() {
      setSearching(true);
      
      try {
        // Search stories: ilike title or description
        const { data: sData } = await supabase
          .from('stories')
          .select('*, authors(*)')
          .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .eq('status', 'published')
          .limit(20);
          
        if (sData) {
          setStoryHits(sData.map((s: any) => ({
            ...s,
            cover: s.cover_url,
            episodes: Array(s.total_episodes || 1).fill({})
          })));
        }

        // Search authors
        const { data: aData } = await supabase
          .from('authors')
          .select('*')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(10);
          
        if (aData) setAuthorHits(aData);
        
        // Search genres locally since they are static
        const gHits = genres.filter(g => g.toLowerCase().includes(debouncedQuery) && g !== 'Zote');
        setGenreHits(gHits);
        
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }
    
    performSearch();
  }, [debouncedQuery]);

  const counts = {
    Hadithi: storyHits.length,
    Waandishi: authorHits.length,
    Makundi: genreHits.length,
  };
  const total = counts.Hadithi + counts.Waandishi + counts.Makundi;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 bg-white text-gray-900 min-h-screen">
      <h1 className="font-display text-3xl font-black text-gray-900 sm:text-[40px]">Tafuta</h1>
      <p className="mt-2 text-sm text-gray-500">Hadithi, waandishi na makundi ya KISA.</p>

      <div className="mt-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Tafuta hadithi..." size="lg" autoFocus />
      </div>

      {!debouncedQuery ? (
        <section className="mt-9" aria-labelledby="suggested-heading">
          <h2 id="suggested-heading" className="text-xs uppercase tracking-[0.16em] text-gray-400 font-semibold">
            Yanayotafutwa sasa
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 ease-kisa hover:bg-gray-100 hover:text-gray-900"
              >
                {s}
              </button>
            ))}
          </div>

          <h2 className="mt-10 text-xs uppercase tracking-[0.16em] text-gray-400 font-semibold">Hadithi maarufu</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {popularStories.map((s, i) => (
              <li key={s.id}>
                <Link to={`/hadithi/${s.slug}`} className="flex items-center gap-4 py-3.5 group">
                  <span className="w-5 font-display text-lg font-black text-gray-300 group-hover:text-gray-400">{i + 1}</span>
                  <img src={s.cover_url} alt="" aria-hidden="true" className="h-14 w-10 rounded border border-gray-100 object-cover shadow-sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-gray-800 group-hover:text-[#9B1B3B] transition-colors">{s.title}</span>
                    <span className="text-xs text-gray-400">{(s.genres || []).join(' · ')}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : searching ? (
        <div className="mt-9">
          <SearchResultsSkeleton />
        </div>
      ) : total === 0 ? (
        <div className="mt-9">
          <EmptyState
            title={`Hakuna kitu kwa “${debouncedQuery}”`}
            body="Hatukupata hadithi, mwandishi au kundi linalolingana. Jaribu neno fupi zaidi kama “mapenzi” au “siri”."
            ctaLabel="Ona hadithi zote"
            ctaHref="/hadithi"
          />
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-1 border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={cn(
                  'relative px-4 py-3 text-sm font-semibold transition-colors duration-150 ease-kisa',
                  tab === t ? 'text-[#9B1B3B]' : 'text-gray-500 hover:text-gray-800'
                )}
              >
                {t} <span className="text-gray-400 font-normal">({counts[t]})</span>
                {tab === t && <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#9B1B3B]" />}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === 'Hadithi' && (
              <ul className="divide-y divide-gray-100">
                {storyHits.map((s) => (
                  <li key={s.id}>
                    <Link to={`/hadithi/${s.slug}`} className="flex gap-4 py-4 group">
                      <img
                        src={s.cover}
                        alt=""
                        aria-hidden="true"
                        className="h-24 w-16 shrink-0 rounded-lg border border-gray-100 object-cover shadow-sm"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-display text-base font-bold text-gray-800 group-hover:text-[#9B1B3B] transition-colors">{s.title}</span>
                        </span>
                        <span className="mt-1 block text-xs text-gray-400">
                          {(s.genres || []).join(' · ')} · {s.episodes.length} Sehemu
                        </span>
                        <span className="mt-1.5 line-clamp-2 block text-[13px] leading-relaxed text-gray-500">
                          {s.hook || s.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'Waandishi' && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {authorHits.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-card border border-gray-100 bg-gray-50 p-4"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#9B1B3B] font-display font-bold text-white">
                      {a.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold text-gray-800">{a.name}</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <UserIcon className="h-3 w-3" aria-hidden="true" />
                        {a.city || 'Tanzania'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'Makundi' && (
              <ul className="flex flex-wrap gap-2">
                {genreHits.map((g) => (
                  <li key={g}>
                    <Link
                      to={`/makundi/${g}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      <TagIcon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                      {g}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <p className="mt-12 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-6">
        <BookOpenIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Tafuta kwenye mtandao mzima wa KISA
      </p>
    </div>
  );
}