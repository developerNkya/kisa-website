import React, { useState } from 'react';
import { CheckIcon, CopyIcon, FacebookIcon, InstagramIcon, MessageCircleIcon, Share2Icon } from 'lucide-react';
import { Modal } from './ui/Modal';
import { cn } from '../utils/cn';

interface ShareButtonProps {
  storyTitle: string;
  episodeLabel?: string;
  teaser: string;
  url: string;
  className?: string;
  variant?: 'button' | 'icon';
}

export function ShareButton({
  storyTitle,
  episodeLabel,
  teaser,
  url,
  className,
  variant = 'button'
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {

      /* clipboard unavailable */}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const channels = [
  { name: 'WhatsApp', icon: MessageCircleIcon, tint: 'text-emerald-300' },
  { name: 'Facebook', icon: FacebookIcon, tint: 'text-sky-300' },
  { name: 'Instagram', icon: InstagramIcon, tint: 'text-pink-300' }];


  return (
    <>
      {variant === 'icon' ?
      <button
        onClick={() => setOpen(true)}
        aria-label="Sambaza hadithi"
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full border border-line bg-ink/60 text-cream backdrop-blur-sm transition-colors duration-150 ease-kisa hover:border-mist/60',
          className
        )}>
        
          <Share2Icon className="h-4 w-4" />
        </button> :

      <button
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-surface-high px-6 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:border-mist/50',
          className
        )}>
        
          <Share2Icon className="h-4 w-4" />
          Sambaza
        </button>
      }

      <Modal open={open} onClose={() => setOpen(false)} title="Sambaza hadithi">
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="border-b border-line-soft px-4 py-3">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-wine-bright">KISA</span>
          </div>
          <div className="px-4 py-4">
            <p className="font-display text-base font-bold text-cream">
              {storyTitle}
              {episodeLabel ? ` — ${episodeLabel}` : ''}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-mist">{teaser}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-gold">Soma kwenye KISA</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {channels.map((c) =>
          <button
            key={c.name}
            className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface px-2 py-3 text-xs font-medium text-cream transition-colors duration-150 ease-kisa hover:border-mist/50">
            
              <c.icon className={cn('h-5 w-5', c.tint)} />
              {c.name}
            </button>
          )}
        </div>

        <button
          onClick={copy}
          className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors duration-150 ease-kisa hover:border-mist/50">
          
          <span className="truncate text-xs text-mist">{url}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            {copied ? 'Imenakiliwa' : 'Copy link'}
          </span>
        </button>
      </Modal>
    </>);

}