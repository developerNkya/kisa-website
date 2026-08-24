import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, LockIcon, UnlockIcon } from 'lucide-react';
import { useKisa } from '../contexts/KisaContext';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { ReaderControls } from '../components/reader/ReaderControls';
import { ErrorState } from '../components/states/ErrorState';
import { SubscriptionExpiredModal } from '../components/SubscriptionExpiredModal';
import { YouTubeEmbed } from '../components/reader/YouTubeEmbed';
import { CommentsSection } from '../components/CommentsSection';
import { RatingWidget } from '../components/RatingWidget';
import { cn } from '../utils/cn';
import { track } from '../lib/pixel'; // ✅ Add this import

export function Reader() {
  const { slug, episode } = useParams();
  const navigate = useNavigate();
  const { readerPrefs, setReaderPrefs } = useKisa();
  const { user, hasPurchasedStory } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [ep, setEp] = useState<any>(null);
  const [allEpisodes, setAllEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [nextEpExists, setNextEpExists] = useState(false);
  
  const articleRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef(0);
  const epNumber = Number(episode ?? 1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const { data: storyData, error: storyErr } = await supabase
          .from('stories')
          .select('*, authors(*)')
          .eq('slug', slug)
          .single();

        if (storyErr || !storyData) throw new Error('Hadithi haikupatikana.');
        setStory(storyData);

        // Fetch all episodes for chapter navigation
        const { data: epsList } = await supabase
          .from('episodes')
          .select('episode_number, title, is_free')
          .eq('story_id', storyData.id)
          .order('episode_number', { ascending: true });
        if (epsList) setAllEpisodes(epsList);

        const { data: epData, error: epErr } = await supabase
          .from('episodes')
          .select('*')
          .eq('story_id', storyData.id)
          .eq('episode_number', epNumber)
          .single();

        if (epErr || !epData) throw new Error('Sehemu hii haipatikani.');
        setEp(epData);

        // Check for next episode
        const { data: nextData } = await supabase
          .from('episodes')
          .select('id')
          .eq('story_id', storyData.id)
          .eq('episode_number', epNumber + 1)
          .maybeSingle();
        
        setNextEpExists(!!nextData);

        // 🔍 Smart paywall logic
        const isPaidStory = (storyData.price ?? 1000) > 0;
        const isPurchased = hasPurchasedStory(storyData.id);
        const isEpisodeFree = epData.is_free === true;
        
        // Check if user can access this episode
        const isUnlocked = isEpisodeFree || !isPaidStory || isPurchased;
        setShowPaywall(!isUnlocked);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, epNumber, hasPurchasedStory]);

  // ✅ Track when user starts reading an episode
  useEffect(() => {
    if (ep && story && !showPaywall) {
      track.startReading({
        id: story.id,
        title: story.title,
        episodeNumber: ep.episode_number,
      });
    }
  }, [ep, story, showPaywall]);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight + 200;
      const pct = Math.max(0, Math.min(100, (window.scrollY / Math.max(total, 1)) * 100));
      percentRef.current = pct;
      setScrollPercent(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug, episode]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug, episode]);

  useEffect(() => {
    if (!story || !ep || !user) return;
    return () => {
      const pct = Math.max(5, Math.round(percentRef.current));
      supabase.from('reading_progress').upsert({
        user_id: user.id,
        story_id: story.id,
        episode_id: ep.id,
        episode_number: ep.episode_number,
        percent: pct,
      }, { onConflict: 'user_id,story_id' }).then(() => {});
    };
  }, [story?.id, epNumber, user]);

  const paragraphs = useMemo(() => {
    if (!ep?.content) return [];
    const split = ep.content.split('\n').filter((p: string) => p.trim());
    return showPaywall ? split.slice(0, 3) : split;
  }, [ep?.content, showPaywall]);

  // 🔍 Smart check if episode is locked
  const isEpisodeLocked = (episodeNum: number) => {
    // Find the episode
    const episode = allEpisodes.find(e => e.episode_number === episodeNum);
    
    // 1️⃣ PRIMARY RULE: Check episode's is_free field (Database source of truth)
    if (episode?.is_free === true) return false;
    
    // 2️⃣ If story is free (price = 0), all episodes are free
    const isPaidStory = (story?.price ?? 1000) > 0;
    if (!isPaidStory) return false;
    
    // 3️⃣ If user purchased, all episodes are accessible
    if (hasPurchasedStory(story?.id)) return false;
    
    // 4️⃣ Everything else is locked
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-white">
        Inapakia...
      </div>
    );
  }

  if (error || !story || !ep) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 bg-white">
        <ErrorState
          title="Sehemu hii haipatikani"
          body={error || "Sehemu unayotafuta haipo au bado haijatolewa."}
          ctaLabel="Rudi kwenye hadithi"
          ctaHref={slug ? `/hadithi/${slug}` : '/hadithi'}
        />
      </div>
    );
  }

  const light = readerPrefs.mode === 'light';
  const isPaidStory = (story?.price ?? 1000) > 0;
  const isPurchased = hasPurchasedStory(story?.id);
  const isFreeStory = story?.price === 0;

  /* ── Chapter navigation component (reused at top & bottom) ──────────────── */
  const ChapterNav = ({ position }: { position: 'top' | 'bottom' }) => {
    // Check if a specific episode is locked (premium)
    const isEpisodeLocked = (episodeNum: number) => {
      // Find the episode
      const episode = allEpisodes.find(e => e.episode_number === episodeNum);
      
      // 1️⃣ PRIMARY RULE: Check episode's is_free field
      if (episode?.is_free === true) return false;
      
      // 2️⃣ If story is free, all episodes are free
      const isPaidStory = (story?.price ?? 1000) > 0;
      if (!isPaidStory) return false;
      
      // 3️⃣ User has purchased the story
      if (hasPurchasedStory(story?.id)) return false;
      
      return true; // Locked
    };

    // Get visible page numbers (show current, 2 before, 2 after)
    const getVisiblePages = () => {
      const total = allEpisodes.length;
      const current = epNumber;
      let start = Math.max(1, current - 2);
      let end = Math.min(total, current + 2);
      
      // Adjust if at beginning
      if (current <= 3) {
        end = Math.min(5, total);
      }
      // Adjust if at end
      if (current >= total - 2) {
        start = Math.max(1, total - 4);
      }
      
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    const visiblePages = getVisiblePages();
    const totalPages = allEpisodes.length;

    // Handle click on episode - show payment modal for locked episodes
    const handleEpisodeClick = (pageNum: number) => {
      if (isEpisodeLocked(pageNum)) {
        // ✅ Track locked episode click
        track.lockedEpisodeClick({
          id: story.id,
          title: story.title,
          episodeNumber: pageNum,
        });
        // Show payment modal instead of navigating
        setShowPaywall(true);
        return;
      }
      navigate(`/soma/${story.slug}/${pageNum}`);
    };

    // If only one episode, show simple navigation
    if (totalPages <= 1) {
      return null;
    }

    return (
      <nav
        className={cn(
          'flex flex-col gap-3 py-4',
          position === 'top' ? 'mt-6 border-y' : 'mt-14 border-t pt-6',
          light ? 'border-gray-100' : 'border-white/10'
        )}
        aria-label={`Urambazaji wa sehemu — ${position}`}
      >
        {/* Chapters Title */}
        <div className="text-center">
          <h3 className={cn(
            'font-display text-sm font-bold uppercase tracking-wider',
            light ? 'text-gray-900' : 'text-[#F6F0E8]'
          )}>
            Chapters
          </h3>
        </div>

        {/* Page Numbers */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {/* First page with ellipsis */}
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => handleEpisodeClick(1)}
                className={cn(
                  'min-w-[36px] rounded-md border px-2 py-1.5 text-sm font-medium transition-colors',
                  light
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-white/20 bg-transparent text-white/80 hover:bg-white/10'
                )}
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span className={cn('px-1 text-sm', light ? 'text-gray-400' : 'text-white/40')}>…</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {visiblePages.map((pageNum) => {
            const isLocked = isEpisodeLocked(pageNum);
            const isActive = pageNum === epNumber;
            
            return (
              <button
                key={pageNum}
                onClick={() => handleEpisodeClick(pageNum)}
                className={cn(
                  'min-w-[36px] rounded-md border px-2 py-1.5 text-sm font-medium transition-colors relative cursor-pointer',
                  isActive
                    ? light
                      ? 'border-[#9B1B3B] bg-[#9B1B3B] text-white hover:bg-[#C42B53]'
                      : 'border-[#C9A24A] bg-[#C9A24A] text-[#0E0C0D] hover:bg-[#D4B05A]'
                    : isLocked
                      ? light
                        ? 'border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-200'
                        : 'border-white/10 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                      : light
                        ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        : 'border-white/20 bg-transparent text-white/80 hover:bg-white/10'
                )}
                title={isLocked ? "Bonyeza kununua hadithi" : `Sehemu ya ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Last page with ellipsis */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className={cn('px-1 text-sm', light ? 'text-gray-400' : 'text-white/40')}>…</span>
              )}
              <button
                onClick={() => handleEpisodeClick(totalPages)}
                className={cn(
                  'min-w-[36px] rounded-md border px-2 py-1.5 text-sm font-medium transition-colors',
                  light
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-white/20 bg-transparent text-white/80 hover:bg-white/10'
                )}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      </nav>
    );
  };

  return (
    <div className={cn('min-h-screen w-full', light ? 'bg-white text-gray-900' : 'bg-[#0E0C0D] text-[#F6F0E8]')}>
      {/* Sticky progress header */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-md',
          light ? 'border-gray-100 bg-white/95' : 'border-white/10 bg-[#0E0C0D]/95'
        )}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link
            to={`/hadithi/${story.slug}`}
            aria-label="Rudi kwenye hadithi"
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full transition-colors duration-150',
              light ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            )}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <Link to="/" className={cn('font-display text-lg font-black tracking-[0.14em]', light ? 'text-[#9B1B3B]' : 'text-[#F6F0E8]')}>
            KISA
          </Link>
          <div className="mx-auto hidden min-w-0 text-center sm:block">
            <p className="truncate text-sm font-semibold">{story.title}</p>
            <p className={cn('text-[11px]', light ? 'text-gray-500' : 'text-gray-400')}>
              Sehemu ya {ep.episode_number} — {ep.title}
            </p>
          </div>
          <span
            className={cn(
              'ml-auto shrink-0 text-xs font-semibold tabular-nums',
              light ? 'text-gray-500' : 'text-[#C9A24A]'
            )}
          >
            {Math.round(scrollPercent)}%
          </span>
        </div>
        {/* Progress bar */}
        <div className={cn('h-[3px] w-full', light ? 'bg-gray-100' : 'bg-white/10')}>
          <div
            className="h-full bg-[#9B1B3B] transition-[width] duration-150 ease-linear"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
      </header>

      <div ref={articleRef} className="px-5 pb-40 pt-10 sm:px-8 sm:pt-14">
        <article
          className={cn(
            'mx-auto',
            readerPrefs.width === 'narrow' ? 'max-w-read' : 'max-w-[46rem]'
          )}
        >
          {/* Tags */}
          <p className={cn('text-[11px] font-bold uppercase tracking-[0.2em]', light ? 'text-[#9B1B3B]' : 'text-[#C9A24A]')}>
            {(story.tags || []).join(' · ')}
          </p>

          {/* Story title */}
          <h1 className="mt-3 font-display text-[28px] font-black uppercase leading-[1.08] tracking-wide sm:text-[36px]">
            {story.title}
          </h1>

          {/* Episode subtitle */}
          <h2 className={cn('mt-2 font-display text-lg font-semibold', light ? 'text-gray-600' : 'text-gray-300')}>
            Sehemu ya {ep.episode_number} — {ep.title}
          </h2>

          {/* Premium/Free indicator */}
          <div className="mt-2 flex items-center gap-2">
            {isFreeStory ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">
                <UnlockIcon className="h-3 w-3" />
                Bure
              </span>
            ) : isPaidStory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#9B1B3B]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#9B1B3B]">
                <LockIcon className="h-3 w-3" />
                {isPurchased ? 'Imelipiwa' : 'Haijalipiwa'}
              </span>
            )}
            {ep.is_free === true && !isFreeStory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">
                <UnlockIcon className="h-3 w-3" />
                Sehemu Bure
              </span>
            )}
          </div>

          {/* Meta */}
          <p className={cn('mt-3 flex items-center gap-2 text-xs', light ? 'text-gray-400' : 'text-gray-500')}>
            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Dakika {ep.reading_minutes || 5} za kusoma · {story.authors?.name || story.author}
          </p>

          {/* ── TOP Chapter Navigation ── */}
          <ChapterNav position="top" />

          {/* Divider */}
          <div
            className={cn('mt-8 mb-8 h-px w-16', light ? 'bg-gray-200' : 'bg-[#C9A24A]/40')}
            aria-hidden="true"
          />

          {/* YouTube embed if episode has video */}
          {ep.youtube_video_id && (
            <div className="mb-10">
              <YouTubeEmbed videoId={ep.youtube_video_id} />
            </div>
          )}

          {/* Story body text */}
          <div
            className="mt-10 font-read reader-body"
            style={{ fontSize: `${readerPrefs.fontSize}px`, lineHeight: 1.9 }}
          >
            {paragraphs.map((p: string, i: number) => (
              <p
                key={i}
                className={cn(
                  'mb-7',
                  light ? 'text-gray-800' : 'text-[#F6F0E8]/90',
                  i === 0 && 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[56px] first-letter:font-black first-letter:leading-[0.85]'
                )}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Paywall or bottom navigation */}
          {showPaywall ? (
            <div className="mt-10">
              <SubscriptionExpiredModal
                storyId={story.id}
                storyTitle={story.title}
                storyCover={story.cover_url}
                price={story.price || 1000}
                onClose={() => setShowPaywall(false)}
                onSuccess={() => setShowPaywall(false)}
              />
            </div>
          ) : (
            <>
              {/* ── BOTTOM Chapter Navigation ── */}
              <ChapterNav position="bottom" />

              <div className={cn('mt-16 border-t pt-8', light ? 'border-gray-100' : 'border-white/10')}>
                <RatingWidget episodeId={ep.id} storyId={story.id} />
              </div>
              <div className="mt-8">
                <CommentsSection episodeId={ep.id} />
              </div>
            </>
          )}
        </article>
      </div>

      <ReaderControls
        prefs={readerPrefs}
        setPrefs={setReaderPrefs}
        storyId={story.id}
        storyTitle={story.title}
        shareUrl={`https://kisa.co.tz/soma/${story.slug}/${ep.episode_number}`}
        episodeLabel={`Sehemu ya ${ep.episode_number}`}
        prevDisabled={epNumber <= 1 || isEpisodeLocked(epNumber - 1)}
        nextDisabled={!nextEpExists || isEpisodeLocked(epNumber + 1)}
        onPrev={() => {
          const prevEp = epNumber - 1;
          if (!isEpisodeLocked(prevEp)) {
            navigate(`/soma/${story.slug}/${prevEp}`);
          }
        }}
        onNext={() => {
          const nextEp = epNumber + 1;
          if (nextEpExists && !isEpisodeLocked(nextEp)) {
            navigate(`/soma/${story.slug}/${nextEp}`);
          }
        }}
      />
    </div>
  );
}