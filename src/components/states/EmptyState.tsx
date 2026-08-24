import React from 'react';
import { ButtonLink } from '../ui/Button';

export function EmptyState({
  title,
  body,
  ctaLabel,
  ctaHref,
  mark = 'K'
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  mark?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-full border border-gray-200 bg-gray-50">
        <span aria-hidden="true" className="font-display text-3xl font-black text-[#9B1B3B]">
          {mark}
        </span>
        <span className="absolute -bottom-1 h-[2px] w-10 bg-[#C9A24A]" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{body}</p>
      {ctaLabel && ctaHref && (
        <ButtonLink to={ctaHref} className="mt-6">
          {ctaLabel}
        </ButtonLink>
      )}
    </div>
  );
}