import React from 'react';
import { StoryGrid } from '../components/StoryGrid';
import { StoryHero } from '../components/StoryHero';
import { stories, trendingStories } from '../data/stories';

export function Trending() {
  const rest = stories.filter((s) => !trendingStories.includes(s)).sort((a, b) => b.reads - a.reads);

  return (
    <>
      <StoryHero story={trendingStories[0]} compact />
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 lg:px-10">
        <header>
          <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">
            Zinazopendwa Tanzania
          </h1>
          <p className="mt-2 max-w-xl text-sm text-mist">
            Hadithi zenye wasomaji wengi wiki hii, kwa mujibu wa sehemu zilizosomwa.
          </p>
        </header>
        <div className="mt-9">
          <StoryGrid stories={trendingStories} />
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold text-cream">Pia zinapendwa</h2>
        <div className="mt-6">
          <StoryGrid stories={rest} />
        </div>
      </div>
    </>);

}