import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { ButtonLink, Button } from '../ui/Button';

export function ErrorState({
  title,
  body,
  ctaLabel,
  ctaHref,
  onRetry,
  retryLabel = 'Jaribu tena'







}: {title: string;body: string;ctaLabel?: string;ctaHref?: string;onRetry?: () => void;retryLabel?: string;}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start rounded-card border border-wine/40 bg-[#1B1113] px-6 py-8 sm:px-8">
      
      <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-wine/20 text-wine-bright">
        <AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-bold text-cream">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist">{body}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {ctaLabel && ctaHref && <ButtonLink to={ctaHref}>{ctaLabel}</ButtonLink>}
        {onRetry &&
        <Button variant="secondary" onClick={onRetry}>
            <RefreshCwIcon className="h-4 w-4" />
            {retryLabel}
          </Button>
        }
      </div>
    </div>);

}