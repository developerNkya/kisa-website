import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  LockIcon,
  UnlockIcon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { EpisodeList } from "../components/EpisodeList";
import { StoryRail } from "../components/StoryRail";
import { ButtonLink } from "../components/ui/Button";
import { ErrorState } from "../components/states/ErrorState";
import { CommentsSection } from "../components/CommentsSection";
import { RatingWidget } from "../components/RatingWidget";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { readingLabel, totalMinutes, compact } from "../utils/format";
import { SubscriptionExpiredModal } from "../components/SubscriptionExpiredModal";
import { track } from "../lib/pixel";
import { useTrackView } from "../hooks/useTrackView";

export function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasPurchasedStory, pendingPayment, clearPendingPayment } = useAuth();
  const [searchParams] = useSearchParams();

  const [story, setStory] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [similarStories, setSimilarStories] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  // ✅ Check for auto-pay flag and pending payment
  useEffect(() => {
    const autoPay = searchParams.get('autoPay') === 'true';
    
    if (autoPay && pendingPayment && story) {
      // ✅ Check if the pending payment is for this story
      if (pendingPayment.storyId === story.id) {
        // ✅ Auto-open payment modal
        setShowPaywallModal(true);
        // ✅ Clear the pending payment after showing modal
        clearPendingPayment();
        // ✅ Remove the autoPay param from URL without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        toast.info('Karibu tena! Malipo yako yanasubiri.');
      }
    }
  }, [pendingPayment, story, searchParams, clearPendingPayment]);

  // ✅ Track story view using the new hook
  const viewCount = useTrackView(story?.id, "view");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data: storyData } = await supabase
          .from("stories")
          .select("*, authors(*), categories(*)")
          .eq("slug", slug)
          .single();

        if (storyData) {
          setStory(storyData);

          const { data: epData } = await supabase
            .from("episodes")
            .select("*")
            .eq("story_id", storyData.id)
            .order("episode_number", { ascending: true });

          if (epData) setEpisodes(epData);

          if (user) {
            // ✅ Fetch reading progress with episode details
            const { data: progData } = await supabase
              .from("reading_progress")
              .select(
                `
                *,
                episodes (episode_number, title)
              `,
              )
              .eq("user_id", user.id)
              .eq("story_id", storyData.id)
              .maybeSingle();

            if (progData) {
              // ✅ Ensure episode_number is available
              const progressWithEpisode = {
                ...progData,
                episode_number:
                  progData.episodes?.episode_number ||
                  progData.episode_number ||
                  1,
              };
              setProgress(progressWithEpisode);
            }
          }

          // Related stories based on category (only used for StoryRail - keeping for now but not used)
          if (storyData.category_id) {
            const { data: relData } = await supabase
              .from("stories")
              .select("*, authors(*)")
              .eq("category_id", storyData.category_id)
              .neq("id", storyData.id)
              .limit(6);
            if (relData) setRelated(relData);
          }

          // Load similar stories (new horizontal scroll section)
          const { data: similarData } = await supabase
            .from("stories")
            .select(
              "id, slug, title, cover_url, hook, price, total_reads, authors(name)",
            )
            .eq("status", "published")
            .eq("category_id", storyData.category_id)
            .neq("id", storyData.id)
            .order("total_reads", { ascending: false })
            .limit(10);

          if (similarData) setSimilarStories(similarData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, user]);

  // ✅ Track story view when story loads (Meta Pixel)
  useEffect(() => {
    if (story) {
      track.viewContent({
        id: story.id,
        title: story.title,
        price: story.price || 1000,
        category: story.categories?.name,
      });
    }
  }, [story]);

  // 🔍 Smart access check - checks episode is_free, story price, and purchase status
  const canAccessEpisode = (episodeNumber: number) => {
    // Find the episode
    const episode = episodes.find((e) => e.episode_number === episodeNumber);

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
      // ✅ Get the episode number from progress (with fallback)
      const currentEpisode = progress.episode_number || 1;
      const nextEp = currentEpisode + 1;

      // If next episode is locked, find the last unlocked episode
      if (!canAccessEpisode(nextEp)) {
        // Find the highest unlocked episode they've read
        for (let i = episodes.length - 1; i >= 0; i--) {
          const ep = episodes[i];
          if (
            ep.episode_number <= currentEpisode &&
            canAccessEpisode(ep.episode_number)
          ) {
            return ep.episode_number;
          }
        }
      }
      return nextEp <= episodes.length ? nextEp : currentEpisode;
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
  const hasFreeEpisodes = episodes.some((e) =>
    canAccessEpisode(e.episode_number),
  );
  const allEpisodesLocked = !hasFreeEpisodes;

  const minutes = totalMinutes(episodes.map((e) => e.reading_minutes || 5));
  const tags = story?.tags || [];

  // Handle episode click from EpisodeList
  const handleEpisodeClick = (episodeNumber: number) => {
    if (canAccessEpisode(episodeNumber)) {
      // Navigate to reader
      window.location.href = `/soma/${story.slug}/${episodeNumber}`;
    } else {
      // ✅ Track locked episode click
      track.lockedEpisodeClick({
        id: story.id,
        title: story.title,
        episodeNumber: episodeNumber,
      });

      // Show payment modal
      setSelectedEpisode(episodeNumber);
      setShowPaywallModal(true);
    }
  };

  // Enhanced story object with premium info
  const storyObj = {
    ...story,
    episodes: episodes.map((e) => ({
      ...e,
      number: e.episode_number,
      readingMinutes: e.reading_minutes || 5,
      publishedAt: e.published_at || e.created_at,
      premium:
        isPaidStory && !isPurchased && !e.is_free && e.episode_number > 3,
      locked: !canAccessEpisode(e.episode_number),
      accessible: canAccessEpisode(e.episode_number),
      onClick: () => handleEpisodeClick(e.episode_number),
    })),
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
          <Link to="/" className="hover:text-gray-950">
            Mwanzo
          </Link>
          <span className="px-1.5">/</span>
          <Link to="/hadithi" className="hover:text-gray-950">
            Hadithi
          </Link>
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
              {story.categories?.name || "Hadithi"}
            </p>

            <h1 className="mt-2 font-display text-2xl font-black leading-tight text-gray-900 sm:text-4xl">
              {story.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Mwandishi:{" "}
              <span className="font-semibold text-gray-800">
                {story.authors?.name || "Mwandishi wa KISA"}
              </span>
            </p>

            {/* Premium/Free badge with price integrated */}
            {isFreeStory ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                <UnlockIcon className="h-3 w-3" />
                Bure
              </div>
            ) : (
              isPaidStory && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#9B1B3B]/10 px-3 py-1 text-xs font-semibold text-[#9B1B3B]">
                  <LockIcon className="h-3 w-3" />
                  {isPurchased
                    ? "Imelipiwa"
                    : `Haijalipiwa · TSh ${storyPrice.toLocaleString()}`}
                </div>
              )
            )}

            {story.hook && (
              <p className="mt-4 font-display text-base italic text-gray-600 max-w-xl">
                “{story.hook}”
              </p>
            )}

            {/* Micro Stats */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <StarIcon className="h-3.5 w-3.5 fill-[#C9A24A] text-[#C9A24A]" />
                {story.avg_rating || "5.0"}
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
                <ButtonLink
                  to={`/hadithi/${story.slug}/nunua`}
                  size="lg"
                  className="px-10 py-3 bg-[#9B1B3B] hover:bg-[#C42B53] text-white rounded-full font-bold shadow-sm"
                >
                  Nunua Hadithi
                </ButtonLink>
              ) : (
                <ButtonLink
                  to={`/soma/${story.slug}/${startEpisode}`}
                  size="lg"
                  className="px-10 py-3 bg-[#9B1B3B] hover:bg-[#C42B53] text-white rounded-full font-bold shadow-sm"
                >
                  {progress ? "Endelea Kusoma" : "Soma"}
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
            <h2
              id="about-heading"
              className="font-display text-xl font-bold text-gray-900"
            >
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

          {/* Chapter Episodes List */}
          <EpisodeList story={storyObj} onEpisodeClick={handleEpisodeClick} />

          {/* Ratings & Comments */}
          <div className="grid gap-10 pt-4 border-t border-gray-100 md:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
                Tathmini Hadithi
              </h3>
              <RatingWidget storyId={story.id} />
            </div>
            <div>
              <CommentsSection storyId={story.id} />
            </div>
          </div>

          {/* Similar Stories Section - Moved to bottom */}
          {similarStories.length > 0 && (
            <section className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  📚 Hadithi Nyinginezo
                </h3>
                <Link
                  to={`/makundi/${story.categories?.slug || ""}`}
                  className="text-sm font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors flex items-center gap-1"
                >
                  Ona Zote
                  <span className="text-lg">→</span>
                </Link>
              </div>

              {/* Horizontal Scroll */}
              <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 scroll-smooth">
                {similarStories.map((story) => (
                  <SimilarStoryCard key={story.id} story={story} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* REMOVED: Duplicate StoryRail section */}
      {/* {related.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-10">
          <StoryRail title="Hadithi zinazofanana" stories={related.map(s => ({...s, cover: s.cover_url}))} href="/hadithi" />
        </div>
      )} */}

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
            window.location.reload();
          }}
        />
      )}
    </article>
  );
}

/* ── Similar Story Card ────────────────────────────────────────────────────── */
function SimilarStoryCard({ story }: { story: any }) {
  const { hasPurchasedStory } = useAuth();
  const isPurchased = hasPurchasedStory(story.id);
  const isPaid = (story.price ?? 1000) > 0;

  return (
    <Link
      to={`/hadithi/${story.slug}`}
      className="group flex w-[130px] shrink-0 flex-col sm:w-[150px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={`Jalada la ${story.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#9B1B3B]/10 to-[#C9A24A]/10">
            <span className="font-display text-3xl font-black text-[#9B1B3B]/30">
              {story.title?.charAt(0) || "?"}
            </span>
          </div>
        )}

        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          <Eye className="w-3 h-3 text-gray-300" />
          {compact(story.total_reads || 0)}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 group-hover:text-[#9B1B3B] transition-colors duration-200">
        {story.title}
      </p>
      {story.authors?.name && (
        <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">
          {story.authors.name}
        </p>
      )}
    </Link>
  );
}