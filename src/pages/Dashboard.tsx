import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BellIcon, ClockIcon } from 'lucide-react';
import { useKisa } from '../contexts/KisaContext';
import { stories } from '../data/stories';
import { notifications } from '../data/notifications';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ButtonLink } from '../components/ui/Button';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { StatusDot } from '../components/ui/Badge';

export function Dashboard() {
  const { user, progress, saved, history } = useKisa();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState
          title="Ingia kwenye akaunti yako"
          body="Ingia ili kuona hadithi zako, ulipoishia, na hali ya usajili wako."
          ctaLabel="Ingia"
          ctaHref="/ingia" />
        
      </div>);

  }

  const continueItems = progress.
  map((p) => ({ p, story: stories.find((s) => s.id === p.storyId)! })).
  filter((i) => i.story);
  const savedStories = stories.filter((s) => saved.includes(s.id));
  const historyStories = history.map((id) => stories.find((s) => s.id === id)!).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">
            Karibu, {user.name} 👋
          </h1>
          <p className="mt-2 text-sm text-mist">Hadithi zako, ulipoishia, na usajili wako.</p>
        </div>
        <ButtonLink to="/hadithi" variant="secondary">
          Gundua hadithi mpya
        </ButtonLink>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-12">
          <section aria-labelledby="dash-continue">
            <h2 id="dash-continue" className="font-display text-xl font-bold text-cream">
              Endelea Kusoma
            </h2>
            {continueItems.length === 0 ?
            <div className="mt-4">
                <EmptyState
                title="Hakuna hadithi uliyoanza"
                body="Anza hadithi yoyote na tutakumbuka ulipoishia."
                ctaLabel="Gundua Hadithi"
                ctaHref="/hadithi" />
              
              </div> :

            <ul className="mt-4 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
                {continueItems.map(({ p, story }) =>
              <li key={p.storyId} className="flex items-center gap-4 p-4">
                    <img
                  src={story.cover}
                  alt=""
                  aria-hidden="true"
                  className="h-[86px] w-[60px] shrink-0 rounded-lg object-cover" />
                
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-bold text-cream">{story.title}</p>
                      <p className="mt-0.5 text-xs text-mist">
                        Sehemu ya {p.episodeNumber} · {p.percent}%
                      </p>
                      <div className="mt-2.5 max-w-xs">
                        <ProgressBar percent={p.percent} label={`Maendeleo ya ${story.title}`} />
                      </div>
                    </div>
                    <Link
                  to={`/soma/${story.slug}/${p.episodeNumber}`}
                  className="shrink-0 rounded-full bg-wine px-5 py-2.5 text-[13px] font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
                  
                      Endelea
                    </Link>
                  </li>
              )}
              </ul>
            }
          </section>

          <section aria-labelledby="dash-saved">
            <div className="flex items-center justify-between gap-4">
              <h2 id="dash-saved" className="font-display text-xl font-bold text-cream">
                Zilizohifadhiwa
              </h2>
              <Link to="/zilizohifadhiwa" className="text-sm font-semibold text-gold hover:text-cream">
                Ona zote
              </Link>
            </div>
            <div className="mt-5">
              {savedStories.length === 0 ?
              <EmptyState
                title="Bado hujahifadhi hadithi yoyote."
                body="Hifadhi hadithi unayoipenda ili uisome baadaye."
                ctaLabel="Gundua Hadithi"
                ctaHref="/hadithi" /> :


              <StoryGrid stories={savedStories} showDescription={false} />
              }
            </div>
          </section>

          <section aria-labelledby="dash-history">
            <h2 id="dash-history" className="font-display text-xl font-bold text-cream">
              Historia
            </h2>
            {historyStories.length === 0 ?
            <div className="mt-4">
                <EmptyState
                title="Historia yako ni tupu"
                body="Hadithi ulizosoma zitaonekana hapa ili urudi kwa urahisi."
                ctaLabel="Anza kusoma"
                ctaHref="/hadithi" />
              
              </div> :

            <ul className="mt-4 divide-y divide-line-soft">
                {historyStories.map((s) =>
              <li key={s.id}>
                    <Link to={`/hadithi/${s.slug}`} className="group flex items-center gap-4 py-3.5">
                      <img src={s.cover} alt="" aria-hidden="true" className="h-14 w-10 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-cream group-hover:text-gold">
                          {s.title}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-mist">
                          <ClockIcon className="h-3 w-3" aria-hidden="true" />
                          {s.genres.join(' · ')}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-dust group-hover:text-gold" />
                    </Link>
                  </li>
              )}
              </ul>
            }
          </section>
        </div>

        <aside className="space-y-5">
          <section
            aria-labelledby="dash-sub"
            className="rounded-card border border-gold/25 bg-[#171112] p-5">
            
            <h2 id="dash-sub" className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
              Usajili wako
            </h2>
            <p className="mt-2 font-display text-xl font-bold text-cream">KISA Premium</p>
            <div className="mt-3">
              <StatusDot tone={user.premium ? 'green' : 'red'} label={user.premium ? 'Active' : 'Imeisha'} />
            </div>
            {user.premium ?
            <>
                <p className="mt-3 text-sm text-mist">Una siku {user.daysLeft} zilizobaki.</p>
                <div className="mt-3">
                  <ProgressBar percent={user.daysLeft / 30 * 100} tone="gold" label="Siku zilizobaki" />
                </div>
              </> :

            <p className="mt-3 text-sm text-mist">Usajili wako umeisha. Ongeza muda ili kuendelea.</p>
            }
            <ButtonLink to="/malipo" className="mt-5 w-full" variant={user.premium ? 'secondary' : 'primary'}>
              Ongeza muda
            </ButtonLink>
          </section>

          <section aria-labelledby="dash-notif" className="rounded-card border border-line-soft bg-surface p-5">
            <div className="flex items-center gap-2">
              <BellIcon className="h-4 w-4 text-gold" aria-hidden="true" />
              <h2 id="dash-notif" className="font-display text-base font-bold text-cream">
                Taarifa
              </h2>
            </div>
            <ul className="mt-4 space-y-4">
              {notifications.slice(0, 3).map((n) =>
              <li key={n.id} className="border-b border-line-soft pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-cream">{n.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-mist">{n.body}</p>
                  <Link to={n.href} className="mt-1.5 inline-block text-xs font-semibold text-gold hover:text-cream">
                    {n.cta}
                  </Link>
                </li>
              )}
            </ul>
          </section>

          <Link
            to="/wasifu"
            className="flex items-center justify-between rounded-card border border-line-soft bg-surface px-5 py-4 transition-colors duration-150 ease-kisa hover:border-mist/30">
            
            <span className="text-sm font-semibold text-cream">Mipangilio ya wasifu</span>
            <ArrowRightIcon className="h-4 w-4 text-dust" />
          </Link>
        </aside>
      </div>
    </div>);

}