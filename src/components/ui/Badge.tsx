import React from 'react';
import { CrownIcon, LockIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const chip =
'inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-bold uppercase tracking-[0.12em]';

export function PremiumBadge({ className }: {className?: string;}) {
  return (
    <span className={cn(chip, 'bg-gold/15 text-gold ring-1 ring-inset ring-gold/40', className)}>
      <CrownIcon className="h-3 w-3" aria-hidden="true" />
      Premium
    </span>);

}

export function NewBadge({ className }: {className?: string;}) {
  return <span className={cn(chip, 'bg-wine text-cream', className)}>Mpya</span>;
}

export function OriginalBadge({ className }: {className?: string;}) {
  return (
    <span
      className={cn(
        chip,
        'bg-ink/80 text-gold ring-1 ring-inset ring-gold/50 backdrop-blur-sm',
        className
      )}>
      
      KISA Original
    </span>);

}

export function FreeBadge({ className }: {className?: string;}) {
  return (
    <span className={cn(chip, 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30', className)}>
      Bure
    </span>);

}

export function LockChip({ className }: {className?: string;}) {
  return (
    <span className={cn(chip, 'bg-surface-high text-gold ring-1 ring-inset ring-gold/30', className)}>
      <LockIcon className="h-3 w-3" aria-hidden="true" />
      Premium
    </span>);

}

export function StatusDot({
  tone,
  label



}: {tone: 'green' | 'gold' | 'red' | 'blue' | 'neutral';label: string;}) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-400',
    gold: 'bg-gold',
    red: 'bg-red-500',
    blue: 'bg-sky-400',
    neutral: 'bg-dust'
  };
  return (
    <span className="inline-flex items-center gap-2 text-sm text-cream">
      <span className={cn('h-2 w-2 rounded-full', colors[tone])} aria-hidden="true" />
      {label}
    </span>);

}