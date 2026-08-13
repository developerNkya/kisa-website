import React from 'react';
import { cn } from '../../utils/cn';

export function ProgressBar({
  percent,
  className,
  tone = 'wine',
  label





}: {percent: number;className?: string;tone?: 'wine' | 'gold';label?: string;}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-high', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Maendeleo ya kusoma'}>
      
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300 ease-kisa',
          tone === 'wine' ? 'bg-wine-bright' : 'bg-gold'
        )}
        style={{ width: `${clamped}%` }} />
      
    </div>);

}