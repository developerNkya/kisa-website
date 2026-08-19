import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BellIcon, BookOpen, CheckCircle2, ClockIcon, ShoppingBag } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ButtonLink } from '../components/ui/Button';
import { StoryGrid } from '../components/StoryGrid';
import { EmptyState } from '../components/states/EmptyState';
import { notifications } from '../data/notifications';

export function Dashboard() {
  const { user, profile } = useAuth();
  
  const [continueItems, setContinueItems] = useState<any[]>([]);
  const [purchasedStories, setPurchasedStories] = useState<any[]>([]);
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [historyStories, setHistoryStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Fetch Purchased Stories
        const { data: purchasesData } = await supabase
          .from('story_purchases')
          .select('*, stories(*, authors(*), categories(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (purchasesData) {
          const list = purchasesData
            .filter((p: any) => p.stories)
            .map((p: any) => ({
              ...p.stories,
              cover: p.stories.cover_url || '/covers/default.jpg',
              genres: p.stories.categories?.name ? [p.stories.categories.name] : (p.stories.tags || ['Hadithi']),
            }));
          setPurchasedStories(list);
        }

        // 2. Fetch Reading Progress with stories
        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('*, stories(*)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (progressData) {
          setContinueItems(progressData.filter((p: any) => p.stories));
          
          const history = progressData.filter((p: any) => p.stories).map((p: any) => ({
            ...p.stories,
            cover: p.stories.cover_url
          }));
          setHistoryStories(history);
        }

        // 3. Fetch Saved (Bookmarks)
        const { data: savedData } = await supabase
          .from('bookmarks')
          .select('*, stories(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedData) {
          setSavedStories(savedData.filter((b: any) => b.stories).map((b: any) => ({
            ...b.stories,
            cover: b.stories.cover_url
          })));
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState
          title="Ingia kwenye akaunti yako"
          body="Ingia ili kuona hadithi zako ulizonunua na ulipoishia kusoma."
          ctaLabel="Ingia"
          ctaHref="/ingia"
        />
      </div>
    );
  }

  const fullName = profile?.full_name || user.email?.split('@')[0] || 'Msomaji';

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">
            Karibu, {fullName} 👋
          </h1>
          <p className="mt-2 text-sm text-mist">Hadithi zako, ulizonunua, na ulipoishia.</p>
        </div>
        <ButtonLink to="/hadithi" variant="secondary">
          Gundua hadithi mpya
        </ButtonLink>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-12">
          {/* Purchased Stories Section */}
          <section aria-labelledby="dash-purchases">
            <div className="flex items-center justify-between gap-4">
              <h2 id="dash-purchases" className="font-display text-xl font-bold text-cream flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                Hadithi Ulizonunua ({purchasedStories.length})
              </h2>
              {purchasedStories.length > 0 && (
                <span className="text-xs text-gold">Zimefunguliwa zote</span>
              )}
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="text-mist">Inapakia hadithi...</div>
              ) : purchasedStories.length === 0 ? (
                <div className="rounded-2xl border border-line-soft bg-surface p-6 text-center">
                  <BookOpen className="w-8 h-8 text-mist mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-cream text-base">Bado hujanunua hadithi yoyote.</p>
                  <p className="text-mist text-xs mt-1 max-w-sm mx-auto">
                    Kila hadithi unaweza kusoma sehemu 3 za kwanza bure, kisha ukanunua ili kufungua sehemu zote zilizobaki.
                  </p>
                  <ButtonLink to="/hadithi" className="mt-4" size="sm">
                    Gundua Hadithi
                  </ButtonLink>
                </div>
              ) : (
                <StoryGrid stories={purchasedStories} showDescription={false} />
              )}
            </div>
          </section>

          {/* Continue Reading Section */}
          <section aria-labelledby="dash-continue">
            <h2 id="dash-continue" className="font-display text-xl font-bold text-cream">
              Endelea Kusoma
            </h2>
            {loading ? (
              <div className="mt-4 text-mist">Inapakia...</div>
            ) : continueItems.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Hakuna hadithi uliyoanza"
                  body="Anza hadithi yoyote na tutakumbuka ulipoishia."
                  ctaLabel="Gundua Hadithi"
                  ctaHref="/hadithi"
                />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-surface">
                {continueItems.map((p) => (
                  <li key={p.story_id} className="flex items-center gap-4 p-4">
                    <img
                      src={p.stories.cover_url}
                      alt=""
                      aria-hidden="true"
                      className="h-[86px] w-[60px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-bold text-cream">{p.stories.title}</p>
                      <p className="mt-0.5 text-xs text-mist">
                        {p.percent}% Imesomwa
                      </p>
                      <div className="mt-2.5 max-w-xs">
                        <ProgressBar percent={p.percent} label={`Maendeleo ya ${p.stories.title}`} />
                      </div>
                    </div>
                    <Link
                      to={`/soma/${p.stories.slug}/1`}
                      className="shrink-0 rounded-full bg-wine px-5 py-2.5 text-[13px] font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright"
                    >
                      Endelea
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Bookmarks Section */}
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
              {loading ? (
                <div className="text-mist">Inapakia...</div>
              ) : savedStories.length === 0 ? (
                <EmptyState
                  title="Bado hujahifadhi hadithi yoyote."
                  body="Hifadhi hadithi unayoipenda ili uisome baadaye."
                  ctaLabel="Gundua Hadithi"
                  ctaHref="/hadithi"
                />
              ) : (
                <StoryGrid stories={savedStories.slice(0, 4)} showDescription={false} />
              )}
            </div>
          </section>

          {/* History Section */}
          <section aria-labelledby="dash-history">
            <h2 id="dash-history" className="font-display text-xl font-bold text-cream">
              Historia
            </h2>
            {loading ? (
              <div className="mt-4 text-mist">Inapakia...</div>
            ) : historyStories.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Historia yako ni tupu"
                  body="Hadithi ulizosoma zitaonekana hapa ili urudi kwa urahisi."
                  ctaLabel="Anza kusoma"
                  ctaHref="/hadithi"
                />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line-soft">
                {historyStories.map((s) => (
                  <li key={s.id}>
                    <Link to={`/hadithi/${s.slug}`} className="group flex items-center gap-4 py-3.5">
                      <img src={s.cover} alt="" aria-hidden="true" className="h-14 w-10 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-cream group-hover:text-gold">
                          {s.title}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-mist">
                          <ClockIcon className="h-3 w-3" aria-hidden="true" />
                          {(s.genres || []).join(' · ')}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-dust group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          {/* Summary Card */}
          <section
            aria-labelledby="dash-sub"
            className="rounded-card border border-gold/25 bg-[#171112] p-5"
          >
            <h2 id="dash-sub" className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
              Akaunti Yako ya KISA
            </h2>
            <p className="mt-2 font-display text-xl font-bold text-cream">{fullName}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {purchasedStories.length} Hadithi Ulizonunua
              </span>
            </div>
            <p className="mt-3 text-xs text-mist">
              Sehemu 3 za kwanza za kila hadithi ni bure. Hadithi unazonunua zinabaki zako milele.
            </p>
            <ButtonLink to="/hadithi" className="mt-5 w-full">
              Soma Hadithi
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
              {notifications.slice(0, 3).map((n) => (
                <li key={n.id} className="border-b border-line-soft pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-cream">{n.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-mist">{n.body}</p>
                  <Link to={n.href} className="mt-1.5 inline-block text-xs font-semibold text-gold hover:text-cream">
                    {n.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <Link
            to="/wasifu"
            className="flex items-center justify-between rounded-card border border-line-soft bg-surface px-5 py-4 transition-colors duration-150 ease-kisa hover:border-mist/30"
          >
            <span className="text-sm font-semibold text-cream">Mipangilio ya wasifu</span>
            <ArrowRightIcon className="h-4 w-4 text-dust" />
          </Link>
        </aside>
      </div>
    </div>
  );
}