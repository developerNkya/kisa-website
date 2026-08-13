import React from 'react';
import { cn } from '../../utils/cn';

function Shimmer({ className }: {className?: string;}) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-surface-raised', className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>);

}

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Shimmer className="aspect-[2/3] w-full rounded-card" />
      <Shimmer className="mt-3 h-4 w-4/5" />
      <Shimmer className="mt-2 h-3 w-1/2" />
    </div>);

}

export function StoryGridSkeleton({ count = 10 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) =>
      <StoryCardSkeleton key={i} />
      )}
    </div>);

}

export function StoryDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-10">
      <Shimmer className="aspect-[2/3] w-full rounded-card" />
      <div className="space-y-4">
        <Shimmer className="h-10 w-2/3" />
        <Shimmer className="h-4 w-1/3" />
        <Shimmer className="h-20 w-full" />
        <div className="flex gap-3">
          <Shimmer className="h-12 w-40 rounded-full" />
          <Shimmer className="h-12 w-32 rounded-full" />
        </div>
        <div className="space-y-2 pt-4">
          {Array.from({ length: 5 }).map((_, i) =>
          <Shimmer key={i} className="h-16 w-full rounded-xl" />
          )}
        </div>
      </div>
    </div>);

}

export function ReaderSkeleton() {
  return (
    <div className="mx-auto max-w-read px-5 py-16">
      <Shimmer className="h-3 w-24" />
      <Shimmer className="mt-4 h-9 w-3/4" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 9 }).map((_, i) =>
        <Shimmer key={i} className={cn('h-4', i % 3 === 2 ? 'w-2/3' : 'w-full')} />
        )}
      </div>
    </div>);

}

export function TableSkeleton({ rows = 6, cols = 6 }: {rows?: number;cols?: number;}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) =>
      <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((_, c) =>
        <Shimmer key={c} className="h-9" />
        )}
        </div>
      )}
    </div>);

}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) =>
        <Shimmer key={i} className="h-28 rounded-card" />
        )}
      </div>
      <StoryGridSkeleton count={5} />
    </div>);

}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) =>
      <div key={i} className="flex gap-4">
          <Shimmer className="h-24 w-16 rounded-lg" />
          <div className="flex-1 space-y-2 py-1">
            <Shimmer className="h-4 w-1/2" />
            <Shimmer className="h-3 w-1/4" />
            <Shimmer className="h-3 w-3/4" />
          </div>
        </div>
      )}
    </div>);

}