import React from 'react';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { useKisa } from '../contexts/KisaContext';
import { stories } from '../data/stories';

export function Saved() {
  const { saved } = useKisa();
  const list = stories.filter((s) => saved.includes(s.id));

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">Zilizohifadhiwa</h1>
        <p className="mt-2 text-base text-mist">
          {list.length > 0 ?
          `Hadithi ${list.length} zinakusubiri.` :
          'Hifadhi hadithi ili uzisome baadaye.'}
        </p>
      </header>

      <div className="mt-9">
        {list.length === 0 ?
        <EmptyState
          title="Bado hujahifadhi hadithi yoyote."
          body="Gusa alama ya kuhifadhi kwenye hadithi yoyote, na itaonekana hapa tayari kwa kusoma baadaye."
          ctaLabel="Gundua Hadithi"
          ctaHref="/hadithi" /> :


        <StoryGrid stories={list} />
        }
      </div>
    </div>);

}