import React from 'react';
import { ButtonLink } from '../ui/Button';

export function EmptyState({
  title,
  body,
  ctaLabel,
  ctaHref,
  mark = 'K'






}: {title: string;body: string;ctaLabel?: string;ctaHref?: string;mark?: string;}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-line-soft bg-surface px-6 py-16 text-center">
      <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-full border border-line bg-surface-raised">
        <span aria-hidden="true" className="font-display text-3xl font-black text-wine-bright">
          {mark}
        </span>
        <span className="absolute -bottom-1 h-[2px] w-10 bg-gold/70" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-bold text-cream">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">{body}</p>
      {ctaLabel && ctaHref &&
      <ButtonLink to={ctaHref} className="mt-6">
          {ctaLabel}
        </ButtonLink>
      }
    </div>);

}