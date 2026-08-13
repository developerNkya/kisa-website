import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from 'lucide-react';
import { getStory } from '../data/stories';
import { episodeBody, episodeTeaser } from '../data/readerText';
import { useKisa } from '../contexts/KisaContext';
import { ReaderControls } from '../components/reader/ReaderControls';
import { PremiumLock } from '../components/PremiumLock';
import { ErrorState } from '../components/states/ErrorState';
import { cn } from '../utils/cn';

export function Reader() {
  const { slug, episode } = useParams();
  const navigate = useNavigate();
  const story = getStory(slug);
  const { user, readerPrefs, setReaderPrefs, setProgress } = useKisa();
  const [scrollPercent, setScrollPercent] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef(0);

  const epNumber = Number(episode ?? 1);
  const ep = story?.episodes.find((e) => e.number === epNumber);
  const locked = Boolean(ep?.premium && !user?.premium);
  const nextEp = story?.episodes.find((e) => e.number === epNumber + 1);
  const nextLocked = Boolean(nextEp?.premium && !user?.premium);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight + 200;
      const pct = Math.max(0, Math.min(100, window.scrollY / Math.max(total, 1) * 100));
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
    if (!story) return;
    return () => {
      setProgress(story.id, epNumber, Math.max(5, Math.round(percentRef.current)));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, epNumber]);

  const paragraphs = useMemo(
    () => locked ? episodeBody.slice(0, 3) : episodeBody,
    [locked]
  );

  if (!story || !ep) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <ErrorState
          title="Sehemu hii haipatikani"
          body="Sehemu unayotafuta haipo au bado haijatolewa. Angalia orodha ya sehemu za hadithi."
          ctaLabel="Rudi kwenye hadithi"
          ctaHref={slug ? `/hadithi/${slug}` : '/hadithi'} />
        
      </div>);

  }

  const light = readerPrefs.mode === 'light';

  return (
    <div className={cn('min-h-screen w-full', light ? 'bg-paper text-ink' : 'bg-ink text-cream')}>
      <header
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-md',
          light ? 'border-black/10 bg-paper/95' : 'border-line bg-ink/95'
        )}>
        
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link
            to={`/hadithi/${story.slug}`}
            aria-label="Rudi kwenye hadithi"
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full transition-colors duration-150 ease-kisa',
              light ? 'hover:bg-black/[0.06]' : 'hover:bg-surface-raised'
            )}>
            
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <Link to="/" className="font-display text-lg font-black tracking-[0.14em]">
            KISA
          </Link>
          <div className="mx-auto hidden min-w-0 text-center sm:block">
            <p className="truncate text-sm font-semibold">{story.title}</p>
            <p className={cn('text-[11px]', light ? 'text-ink/60' : 'text-mist')}>
              Sehemu ya {ep.number} — {ep.title}
            </p>
          </div>
          <span
            className={cn(
              'ml-auto shrink-0 text-xs font-semibold tabular-nums',
              light ? 'text-ink/60' : 'text-gold'
            )}>
            
            {Math.round(scrollPercent)}%
          </span>
        </div>
        <div className={cn('h-[3px] w-full', light ? 'bg-black/10' : 'bg-surface-high')}>
          <div
            className="h-full bg-wine-bright transition-[width] duration-150 ease-linear"
            style={{ width: `${scrollPercent}%` }} />
          
        </div>
      </header>

      <div ref={articleRef} className="px-5 pb-40 pt-12 sm:px-8 sm:pt-16">
        <article
          className={cn(
            'mx-auto',
            readerPrefs.width === 'narrow' ? 'max-w-read' : 'max-w-[46rem]'
          )}>
          
          <p className={cn('text-[11px] font-bold uppercase tracking-[0.2em]', light ? 'text-wine' : 'text-gold')}>
            {story.genres.join(' · ')}
          </p>
          <h1 className="mt-3 font-display text-[30px] font-black uppercase leading-[1.08] tracking-wide sm:text-[40px]">
            {story.title}
          </h1>
          <h2 className={cn('mt-3 font-display text-xl font-semibold', light ? 'text-ink/70' : 'text-mist')}>
            Sehemu ya {ep.number} — {ep.title}
          </h2>
          <p className={cn('mt-4 flex items-center gap-2 text-xs', light ? 'text-ink/50' : 'text-dust')}>
            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Dakika {ep.readingMinutes} za kusoma · {story.author}
          </p>

          <div
            className={cn('mt-10 h-px w-16', light ? 'bg-ink/20' : 'bg-gold/50')}
            aria-hidden="true" />
          

          <div
            className="mt-10 font-read"
            style={{ fontSize: `${readerPrefs.fontSize}px`, lineHeight: 1.9 }}>
            
            {paragraphs.map((p, i) =>
            <p
              key={i}
              className={cn(
                'mb-7',
                light ? 'text-ink/90' : 'text-cream/90',
                i === 0 && 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[56px] first-letter:font-black first-letter:leading-[0.85]'
              )}>
              
                {p}
              </p>
            )}
          </div>

          {locked || nextLocked ?
          <PremiumLock
            teaser={locked ? 'Sehemu hii ni ya Premium.' : episodeTeaser}
            storyTitle={story.title} /> :


          <nav className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {epNumber > 1 ?
            <Link
              to={`/soma/${story.slug}/${epNumber - 1}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors duration-150 ease-kisa',
                light ? 'border-black/10 hover:bg-black/[0.05]' : 'border-line hover:border-mist/50'
              )}>
              
                  <ArrowLeftIcon className="h-4 w-4" />
                  Sehemu ya {epNumber - 1}
                </Link> :

            <span />
            }
              {nextEp &&
            <Link
              to={`/soma/${story.slug}/${epNumber + 1}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-wine px-6 py-3 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
              
                  Sehemu ya {epNumber + 1}: {nextEp.title}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
            }
            </nav>
          }
        </article>
      </div>

      <ReaderControls
        prefs={readerPrefs}
        setPrefs={setReaderPrefs}
        storyId={story.id}
        storyTitle={story.title}
        shareUrl={`https://kisa.co.tz/soma/${story.slug}/${ep.number}`}
        episodeLabel={`Sehemu ya ${ep.number}`}
        prevDisabled={epNumber <= 1}
        nextDisabled={!nextEp}
        onPrev={() => navigate(`/soma/${story.slug}/${epNumber - 1}`)}
        onNext={() => nextEp && navigate(`/soma/${story.slug}/${epNumber + 1}`)} />
      
    </div>);

}