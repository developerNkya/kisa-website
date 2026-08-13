import React from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export function StatsCard({
  label,
  value,
  delta,
  up = true,
  emphasis = false






}: {label: string;value: string;delta?: string;up?: boolean;emphasis?: boolean;}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        emphasis ? 'border-amber-500/30 bg-amber-500/[0.04]' : 'border-zinc-800 bg-[#131415]'
      )}>
      
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p
        className={cn(
          'mt-2 font-display font-bold tabular-nums text-zinc-50',
          emphasis ? 'text-[26px]' : 'text-2xl'
        )}>
        
        {value}
      </p>
      {delta &&
      <p
        className={cn(
          'mt-1.5 inline-flex items-center gap-1 text-xs font-medium',
          up ? 'text-emerald-400' : 'text-red-400'
        )}>
        
          {up ?
        <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

        <TrendingDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
        }
          {delta}
          <span className="text-zinc-500">vs mwezi uliopita</span>
        </p>
      }
    </div>);

}