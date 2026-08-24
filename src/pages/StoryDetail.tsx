import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, StarIcon } from 'lucide-react';
import { EpisodeList } from '../components/EpisodeList';
import { StoryRail } from '../components/StoryRail';
import { ButtonLink } from '../components/ui/Button';
import { ErrorState } from '../components/states/ErrorState';
import { CommentsSection } from '../components/CommentsSection';
import { RatingWidget } from '../components/RatingWidget';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { readingLabel, totalMinutes } from '../utils/format';

export function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasPurchasedStory } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const isPurchased = hasPurchasedStory(story.id);
  const storyPrice = story.price ?? 1000;
  const isPaidStory = storyPrice > 0;

  const minutes = totalMinutes(episodes.map((e) => e.reading_minutes || 5));
  const tags = story.tags || [];

  const storyObj = {
    ...story,
    episodes: episodes.map(e => ({
      ...e,
      number: e.episode_number,
      readingMinutes: e.reading_minutes || 5,
      publishedAt: e.published_at || e.created_at,
      premium: isPaidStory && !isPurchased && e.episode_number > 3
    }))
  };

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

            {story.hook && (
              <p className="mt-4 font-display text-base italic text-gray-600 max-w-xl">
                “{story.hook}”
              </p>
            )}

            {/* Micro Stats */}
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

            {/* Prominent Soma button */}
            <div className="mt-6 flex justify-center md:justify-start">
              <ButtonLink
                to={`/soma/${story.slug}/1`}
                size="lg"
                className="px-10 py-3 bg-[#9B1B3B] hover:bg-[#C42B53] text-white rounded-full font-bold shadow-sm"
              >
                Soma
              </ButtonLink>
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

          {/* Chapter Episodes List */}
          <EpisodeList story={storyObj} />
          
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
    </article>
  );
}