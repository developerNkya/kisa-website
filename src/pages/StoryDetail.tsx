import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, StarIcon, LockIcon, UnlockIcon } from 'lucide-react';
import { EpisodeList } from '../components/EpisodeList';
import { StoryRail } from '../components/StoryRail';
import { ButtonLink } from '../components/ui/Button';
import { ErrorState } from '../components/states/ErrorState';
import { CommentsSection } from '../components/CommentsSection';
import { RatingWidget } from '../components/RatingWidget';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { readingLabel, totalMinutes } from '../utils/format';
import { SubscriptionExpiredModal } from '../components/SubscriptionExpiredModal';

export function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasPurchasedStory } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data: storyData } = await supabase
          .from('stories')
          .select('*, authors(*), categories(*)')
          .eq('slug', slug)
          .single();
          
        if (storyData) {
          setStory(storyData);
          
          const { data: epData } = await supabase
            .from('episodes')
            .select('*')
            .eq('story_id', storyData.id)
            .order('episode_number', { ascending: true });
            
          if (epData) setEpisodes(epData);
          
          if (user) {
            const { data: progData } = await supabase
              .from('reading_progress')
              .select('*')
              .eq('user_id', user.id)
              .eq('story_id', storyData.id)
              .maybeSingle();
            if (progData) setProgress(progData);
          }
          
          // Related stories based on category
          if (storyData.category_id) {
            const { data: relData } = await supabase
              .from('stories')
              .select('*, authors(*)')
              .eq('category_id', storyData.category_id)
              .neq('id', storyData.id)
              .limit(6);
            if (relData) setRelated(relData);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, user]);

  // 🔍 Smart access check - checks episode is_free, story price, and purchase status
  const canAccessEpisode = (episodeNumber: number) => {
    // Find the episode
    const episode = episodes.find(e => e.episode_number === episodeNumber);
    
    // 1️⃣ PRIMARY RULE: Check episode's is_free field (Database source of truth)
    if (episode?.is_free === true) return true;
    
    // 2️⃣ If story is free (price = 0), all episodes are free
    const isPaidStory = (story?.price ?? 1000) > 0;
    if (!isPaidStory) return true;
    
    // 3️⃣ If user purchased, all episodes are accessible
    if (hasPurchasedStory(story?.id)) return true;
    
    // 4️⃣ Everything else is locked
    return false;
  };

  // Get the next unlocked episode for the "Continue Reading" button
  const getNextUnlockedEpisode = () => {
    if (!episodes.length) return 1;
    
    // Find first unlocked episode
    for (let i = 0; i < episodes.length; i++) {
      if (canAccessEpisode(episodes[i].episode_number)) {
        return episodes[i].episode_number;
      }
    }
    return 1; // Fallback
  };

  // Get the episode to start reading from (continue progress or first unlocked)
  const getStartEpisode = () => {
    // If user has progress, try to continue from there
    if (progress) {
      const nextEp = progress.episode_number + 1;
      // If next episode is locked, find the last unlocked episode
      if (!canAccessEpisode(nextEp)) {
        // Find the highest unlocked episode they've read
        for (let i = episodes.length - 1; i >= 0; i--) {
          const ep = episodes[i];
          if (ep.episode_number <= progress.episode_number && 
              canAccessEpisode(ep.episode_number)) {
            return ep.episode_number;
          }
        }
      }
      return nextEp <= episodes.length ? nextEp : progress.episode_number;
    }
    
    // No progress, start from first unlocked episode
    return getNextUnlockedEpisode();
  };

  const startEpisode = getStartEpisode();
  const isPurchased = hasPurchasedStory(story?.id);
  const storyPrice = story?.price ?? 1000;
  const isPaidStory = storyPrice > 0;
  const isFreeStory = storyPrice === 0;
  
  // Check if there are any free episodes
  const hasFreeEpisodes = episodes.some(e => canAccessEpisode(e.episode_number));
  const allEpisodesLocked = !hasFreeEpisodes;

  const minutes = totalMinutes(episodes.map((e) => e.reading_minutes || 5));
  const tags = story?.tags || [];

  // Handle episode click from EpisodeList
  const handleEpisodeClick = (episodeNumber: number) => {
    if (canAccessEpisode(episodeNumber)) {
      // Navigate to reader
      window.location.href = `/soma/${story.slug}/${episodeNumber}`;
    } else {
      // Show payment modal
      setSelectedEpisode(episodeNumber);
      setShowPaywallModal(true);
    }
  };

  // Enhanced story object with premium info
  const storyObj = {
    ...story,
    episodes: episodes.map(e => ({
      ...e,
      number: e.episode_number,
      readingMinutes: e.reading_minutes || 5,
      publishedAt: e.published_at || e.created_at,
      premium: isPaidStory && !isPurchased && !e.is_free && e.episode_number > 3,
      locked: !canAccessEpisode(e.episode_number),
      accessible: canAccessEpisode(e.episode_number),
      onClick: () => handleEpisodeClick(e.episode_number) // Pass click handler
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-white">
        Inapakia...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 bg-white">
        <ErrorState
          title="Hadithi hii haipatikani"
          body="Inawezekana hadithi imeondolewa au kiungo hakikuwa sahihi. Kuna hadithi nyingi nyingine zinazokusubiri."
          ctaLabel="Ona hadithi zote"
          ctaHref="/hadithi"
        />
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white text-gray-900 pb-24">
      {/* Top Banner Block */}
      <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-10">
        <nav aria-label="Njia" className="mb-6 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-950">Mwanzo</Link>
          <span className="px-1.5">/</span>
          <Link to="/hadithi" className="hover:text-gray-950">Hadithi</Link>
          <span className="px-1.5">/</span>
          <span className="text-gray-900 font-medium">{story.title}</span>
        </nav>

        {/* Story details layout */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 pb-10 border-b border-gray-100">
          {/* Cover Art */}
          <div className="w-[150px] shrink-0 sm:w-[180px] md:w-[210px] mx-auto md:mx-0">
            <img
              src={story.cover_url}
              alt={`Jalada la ${story.title}`}
              className="aspect-[2/3] w-full rounded-xl border border-gray-100 object-cover shadow-md"
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#9B1B3B]">
              {story.categories?.name || 'Hadithi'}
            </p>

            <h1 className="mt-2 font-display text-2xl font-black leading-tight text-gray-900 sm:text-4xl">
              {story.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Mwandishi: <span className="font-semibold text-gray-800">{story.authors?.name || 'Mwandishi wa KISA'}</span>
            </p>

            {/* Premium/Free badge with price integrated */}
            {isFreeStory ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                <UnlockIcon className="h-3 w-3" />
                Bure
              </div>
            ) : isPaidStory && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#9B1B3B]/10 px-3 py-1 text-xs font-semibold text-[#9B1B3B]">
                <LockIcon className="h-3 w-3" />
                {isPurchased ? 'Imelipiwa' : `Haijalipiwa · TSh ${storyPrice.toLocaleString()}`}
              </div>
            )}

            {story.hook && (
              <p className="mt-4 font-display text-base italic text-gray-600 max-w-xl">
                “{story.hook}”
              </p>
            )}

            {/* Micro Stats - removed price from here */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <StarIcon className="h-3.5 w-3.5 fill-[#C9A24A] text-[#C9A24A]" />
                {story.avg_rating || '5.0'}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <BookOpenIcon className="h-3.5 w-3.5 text-gray-400" />
                {episodes.length} Sehemu
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
                {readingLabel(minutes)}
              </span>
            </div>

            {/* Smart Read Button */}
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              {allEpisodesLocked ? (
                // If all episodes are locked, show purchase button
                <ButtonLink
                  to={`/hadithi/${story.slug}/nunua`}
                  size="lg"
                  className="px-10 py-3 bg-[#9B1B3B] hover:bg-[#C42B53] text-white rounded-full font-bold shadow-sm"
                >
                  Nunua Hadithi
                </ButtonLink>
              ) : (
                // Show continue/start reading button
                <ButtonLink
                  to={`/soma/${story.slug}/${startEpisode}`}
                  size="lg"
                  className="px-10 py-3 bg-[#9B1B3B] hover:bg-[#C42B53] text-white rounded-full font-bold shadow-sm"
                >
                  {progress ? 'Endelea Kusoma' : 'Soma'}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Episodes List */}
      <div className="mx-auto max-w-[1000px] px-4 pt-10 sm:px-6 lg:px-10">
        <div className="space-y-12">
          {/* Kuhusu Hadithi */}
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-display text-xl font-bold text-gray-900">
              Kuhusu Hadithi
            </h2>
            <p className="mt-3 max-w-3xl font-read text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {story.description}
            </p>
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Chapter Episodes List - Pass the enhanced story object */}
          <EpisodeList story={storyObj} onEpisodeClick={handleEpisodeClick} />
          
          {/* Ratings & Comments */}
          <div className="grid gap-10 pt-4 border-t border-gray-100 md:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Tathmini Hadithi</h3>
              <RatingWidget storyId={story.id} />
            </div>
            <div>
              <CommentsSection storyId={story.id} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-10">
          <StoryRail title="Hadithi zinazofanana" stories={related.map(s => ({...s, cover: s.cover_url}))} href="/hadithi" />
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywallModal && (
        <SubscriptionExpiredModal
          storyId={story.id}
          storyTitle={story.title}
          storyCover={story.cover_url}
          price={story.price || 1000}
          onClose={() => {
            setShowPaywallModal(false);
            setSelectedEpisode(null);
          }}
          onSuccess={() => {
            setShowPaywallModal(false);
            setSelectedEpisode(null);
            // Refresh the page to update access
            window.location.reload();
          }}
        />
      )}
    </article>
  );
}