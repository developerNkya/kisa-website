import React from 'react';
import { StoryHero } from '../components/StoryHero';
import { StoryRail } from '../components/StoryRail';
import { ContinueReading } from '../components/home/ContinueReading';
import { OngoingReleases } from '../components/home/OngoingReleases';
import { OriginalsSpotlight } from '../components/home/OriginalsSpotlight';
import { FreeStarter } from '../components/home/FreeStarter';
import {
  categoryMeta,
  featuredStory,
  newStories,
  stories,
  trendingStories } from
'../data/stories';

const byIds = (ids: string[]) => ids.map((id) => stories.find((s) => s.id === id)!).filter(Boolean);

export function Home() {
  return (
    <>
      <StoryHero story={featuredStory} />
      <ContinueReading />
      <StoryRail
        title="Zinazopendwa Tanzania"
        blurb="Hadithi ambazo wasomaji hawaziachi."
        stories={trendingStories}
        href="/zinazopendwa" />
      
      <OngoingReleases />
      <StoryRail
        title="Hadithi Mpya"
        eyebrow="Zimetoka wiki hii"
        stories={[...newStories, ...trendingStories.slice(0, 3)]}
        href="/mpya" />
      
      <StoryRail
        title="Mapenzi ❤️"
        blurb={categoryMeta.Mapenzi.blurb}
        stories={byIds(categoryMeta.Mapenzi.storyIds)}
        href="/makundi/Mapenzi" />
      
      <StoryRail
        title="Siri & Suspense"
        blurb="Zisome mchana. Au usiku, kama unaweza."
        stories={byIds([...categoryMeta.Siri.storyIds, 'ujumbe-wa-usiku'])}
        href="/makundi/Siri"
        tone="dark" />
      
      <StoryRail
        title="Drama"
        blurb="Familia, uhaini, siri na maamuzi magumu."
        stories={byIds(categoryMeta.Drama.storyIds)}
        href="/makundi/Drama" />
      
      <OriginalsSpotlight />
      <FreeStarter />
    </>);

}