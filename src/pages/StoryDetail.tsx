import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, StarIcon } from 'lucide-react';
import { EpisodeList } from '../components/EpisodeList';
import { StoryRail } from '../components/StoryRail';
import { ButtonLink } from '../components/ui/Button';
import { BookmarkButton } from '../components/BookmarkButton';
import { ShareButton } from '../components/ShareButton';
import { FreeBadge, OriginalBadge, PremiumBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ErrorState } from '../components/states/ErrorState';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { getStory, stories } from '../data/stories';
import { useKisa } from '../contexts/KisaContext';
import { readingLabel, swahiliDate, totalMinutes, compact } from '../utils/format';

export function StoryDetail() {
  const { slug } = useParams();
  const story = getStory(slug);
  const { user, progressFor } = useKisa();

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <ErrorState
          title="Hadithi hii haipatikani"
          body="Inawezekana hadithi imeondolewa au kiungo hakikuwa sahihi. Kuna hadithi nyingi nyingine zinazokusubiri."
          ctaLabel="Ona hadithi zote"
          ctaHref="/hadithi" />
        
      </div>);

  }

  const minutes = totalMinutes(story.episodes.map((e) => e.readingMinutes));
  const progress = progressFor(story.id);
  const related = stories.
  filter((s) => s.id !== story.id && s.genres.some((g) => story.genres.includes(g))).
  slice(0, 6);

  const info = [
  { label: 'Aina', value: story.genres.join(' · ') },
  { label: 'Mwandishi', value: story.author },
  { label: 'Sehemu', value: `${story.episodes.length}` },
  { label: 'Hali', value: story.status },
  { label: 'Imetolewa', value: swahiliDate(story.releasedAt) },
  { label: 'Wasomaji', value: compact(story.reads) }];


  return (
    <article>
      <div className="relative">
        <div className="absolute inset-0 h-[320px] overflow-hidden lg:h-[420px]">
          <img src={story.cover} alt="" aria-hidden="true" className="h-full w-full object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/40" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pt-20">
          <nav aria-label="Njia" className="mb-6 text-xs text-mist">
            <Link to="/" className="hover:text-cream">Mwanzo</Link>
            <span className="px-1.5 text-dust">/</span>
            <Link to="/hadithi" className="hover:text-cream">Hadithi</Link>
            <span className="px-1.5 text-dust">/</span>
            <span className="text-cream">{story.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
            <div className="mx-auto w-[190px] shrink-0 sm:w-[230px] lg:mx-0 lg:w-full">
              <img
                src={story.cover}
                alt={`Jalada la ${story.title}`}
                className="aspect-[2/3] w-full rounded-2xl border border-line object-cover shadow-2xl" />
              
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {story.isOriginal && <OriginalBadge />}
                {story.premium ? <PremiumBadge /> : <FreeBadge />}
                {story.isNew &&
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-wine-bright">
                    Mpya
                  </span>
                }
              </div>

              <h1 className="mt-3 font-display text-3xl font-black leading-[1.05] text-cream sm:text-5xl">
                {story.title}
              </h1>
              <p className="mt-3 font-display text-lg italic text-gold sm:text-xl">“{story.hook}”</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/85">
                <span>{story.genres.join(' · ')}</span>
                <span className="inline-flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                  {story.rating}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpenIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                  {story.episodes.length} Sehemu
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                  {readingLabel(minutes)}
                </span>
              </div>

              {progress &&
              <div className="mt-6 max-w-md rounded-xl border border-line-soft bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-mist">
                    <span>Sehemu ya {progress.episodeNumber} · {progress.percent}%</span>
                    <span className="text-dust">{progress.lastReadAt}</span>
                  </div>
                  <ProgressBar percent={progress.percent} label={`Maendeleo ya ${story.title}`} />
                </div>
              }

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  to={`/soma/${story.slug}/${progress?.episodeNumber ?? 1}`}
                  size="lg">
                  
                  {progress ? 'Endelea Kusoma' : 'Soma Sehemu ya 1'}
                </ButtonLink>
                <BookmarkButton storyId={story.id} storyTitle={story.title} />
                <ShareButton
                  storyTitle={story.title}
                  teaser={story.hook}
                  url={`https://kisa.co.tz/hadithi/${story.slug}`} />
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="font-display text-2xl font-bold text-cream">
                Kuhusu Hadithi
              </h2>
              <p className="mt-4 max-w-2xl font-read text-[17px] leading-[1.85] text-cream/85">
                {story.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {story.tags.map((t) =>
                <span
                  key={t}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-mist">
                  
                    {t}
                  </span>
                )}
              </div>
            </section>

            <EpisodeList story={story} />
          </div>

          <aside className="space-y-6">
            <section
              aria-labelledby="info-heading"
              className="rounded-card border border-line-soft bg-surface p-5">
              
              <h2 id="info-heading" className="font-display text-lg font-bold text-cream">
                Taarifa
              </h2>
              <dl className="mt-4 space-y-3">
                {info.map((row) =>
                <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-3 last:border-0 last:pb-0">
                    <dt className="text-xs uppercase tracking-[0.12em] text-dust">{row.label}</dt>
                    <dd className="text-right text-sm font-medium text-cream">{row.value}</dd>
                  </div>
                )}
              </dl>
            </section>

            {!user?.premium && <SubscriptionCard headline="Soma sehemu zote za hadithi hii" />}
          </aside>
        </div>
      </div>

      <StoryRail title="Hadithi zinazofanana" stories={related} href="/hadithi" />
    </article>);

}