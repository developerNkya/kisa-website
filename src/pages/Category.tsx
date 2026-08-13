import React from 'react';
import { useParams } from 'react-router-dom';
import { StoryHero } from '../components/StoryHero';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { categoryMeta, stories } from '../data/stories';
import { Story } from '../types';

export function Category() {
  const { name } = useParams();
  const meta = name ? categoryMeta[name] : undefined;

  if (!meta) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState
          title="Kundi hili halipo"
          body="Hakikisha jina la kundi. Unaweza kuona makundi yote yaliyopo kwenye ukurasa wa Makundi."
          ctaLabel="Ona makundi"
          ctaHref="/makundi" />
        
      </div>);

  }

  const all: Story[] = stories.filter((s) => s.genres.includes(name as Story['genres'][number]));
  const featured = stories.find((s) => s.id === meta.storyIds[0]) ?? all[0];
  const popular = [...all].sort((a, b) => b.reads - a.reads);
  const fresh = [...all].sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
  const ongoing = all.filter((s) => s.status === 'Inaendelea');
  const completed = all.filter((s) => s.status === 'Imekamilika');

  const sections = [
  { title: 'Zinazopendwa', items: popular },
  { title: 'Mpya', items: fresh },
  { title: 'Zinazoendelea', items: ongoing },
  { title: 'Zilizokamilika', items: completed }].
  filter((s) => s.items.length > 0);

  return (
    <>
      {featured && <StoryHero story={featured} compact />}
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 lg:px-10">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl font-black text-cream sm:text-[44px]">{meta.title}</h1>
          <p className="mt-2 text-base text-mist">{meta.blurb}</p>
        </header>

        <div className="mt-12 space-y-16">
          {sections.map((section) =>
          <section key={section.title} aria-labelledby={`cat-${section.title}`}>
              <h2 id={`cat-${section.title}`} className="font-display text-2xl font-bold text-cream">
                {section.title}
              </h2>
              <div className="mt-6">
                <StoryGrid stories={section.items} />
              </div>
            </section>
          )}
        </div>
      </div>
    </>);

}