import React from 'react';
import { ButtonLink } from '../components/ui/Button';
import { StoryRail } from '../components/StoryRail';
import { trendingStories } from '../data/stories';

export function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pt-20 pb-6 text-center sm:px-6">
        <p className="font-display text-[80px] font-black leading-none text-wine sm:text-[120px]">404</p>
        <h1 className="mt-4 font-display text-2xl font-black text-cream sm:text-4xl">
          Umefika sehemu ambayo haipo.
        </h1>
        <p className="mt-3 text-base text-mist">Lakini bado kuna hadithi nyingi za kusoma.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg">
            Rudi Mwanzo
          </ButtonLink>
          <ButtonLink to="/hadithi" variant="secondary" size="lg">
            Ona hadithi zote
          </ButtonLink>
        </div>
      </div>
      <StoryRail title="Anza na hizi" stories={trendingStories.slice(0, 6)} href="/zinazopendwa" />
    </>);

}