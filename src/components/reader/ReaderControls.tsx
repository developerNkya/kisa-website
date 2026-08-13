import React from 'react';
import {
  AArrowDownIcon,
  AArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  StretchHorizontalIcon,
  SunIcon } from
'lucide-react';
import { ReaderPrefs } from '../../contexts/KisaContext';
import { BookmarkButton } from '../BookmarkButton';
import { ShareButton } from '../ShareButton';
import { cn } from '../../utils/cn';

interface ReaderControlsProps {
  prefs: ReaderPrefs;
  setPrefs: React.Dispatch<React.SetStateAction<ReaderPrefs>>;
  storyId: string;
  storyTitle: string;
  shareUrl: string;
  episodeLabel: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

export function ReaderControls({
  prefs,
  setPrefs,
  storyId,
  storyTitle,
  shareUrl,
  episodeLabel,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled
}: ReaderControlsProps) {
  const light = prefs.mode === 'light';

  const iconBtn = cn(
    'grid h-10 w-10 place-items-center rounded-full border transition-colors duration-150 ease-kisa disabled:opacity-40 disabled:pointer-events-none',
    light ?
    'border-black/10 bg-black/[0.04] text-ink hover:bg-black/[0.08]' :
    'border-line bg-surface-raised text-cream hover:border-mist/50'
  );

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md',
        light ? 'border-black/10 bg-paper/95' : 'border-line bg-ink/95'
      )}>
      
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2.5 sm:px-6">
        <button onClick={onPrev} disabled={prevDisabled} className={iconBtn} aria-label="Sehemu iliyopita">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.max(16, p.fontSize - 1) }))}
            className={iconBtn}
            aria-label="Punguza ukubwa wa maandishi">
            
            <AArrowDownIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPrefs((p) => ({ ...p, fontSize: Math.min(26, p.fontSize + 1) }))}
            className={iconBtn}
            aria-label="Ongeza ukubwa wa maandishi">
            
            <AArrowUpIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
            setPrefs((p) => ({ ...p, width: p.width === 'narrow' ? 'wide' : 'narrow' }))
            }
            className={cn(iconBtn, 'hidden sm:grid')}
            aria-label="Badilisha upana wa kusoma"
            aria-pressed={prefs.width === 'wide'}>
            
            <StretchHorizontalIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPrefs((p) => ({ ...p, mode: p.mode === 'dark' ? 'light' : 'dark' }))}
            className={iconBtn}
            aria-label={light ? 'Hali ya usiku' : 'Hali ya mchana'}>
            
            {light ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <BookmarkButton storyId={storyId} storyTitle={storyTitle} variant="icon" className="h-10 w-10" />
          <ShareButton
            storyTitle={storyTitle}
            episodeLabel={episodeLabel}
            teaser="Amina aligundua ukweli ambao hakutarajia..."
            url={shareUrl}
            variant="icon"
            className="h-10 w-10" />
          
          <button onClick={onNext} disabled={nextDisabled} className={iconBtn} aria-label="Sehemu inayofuata">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>);

}